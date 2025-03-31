import * as XLSX from 'xlsx';
import util from './util';

import {
    GetProjectList,
    getCfgKeyRowIndex,
    getCfgTypeRowIndex,
} from '../../cfg'

function getDataByIndex(index) {
    return GetProjectList()[index]
}

function OnGetData() {
    let fullname = window.Application.ThisWorkbook.FullName
    let fname = fullname.replace(new RegExp('\\\\', 'g'), '/')

    for (let data of GetProjectList()) {
        if (!data.fpath) continue
        if (fname.indexOf(data.fpath) == 0) {
            return data
        }
    }
}

function getIp() {
    let item = OnGetData()
    if (item && item.url) {
        const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;
        const match = item.url.match(ipRegex);
        if (match && match.length) {
            return match[0]
        }
    }
}

function getFPath() {
    let item = OnGetData()
    if (item) {
        return item.fpath
    }
}

function onSheetChangeCells(cells) {
    if (OnGetData()) {
        return util.runGeneratorInFrames(preview.onRefreshCells(cells))
    } else {
        return Promise.reject('当前excel路径和配置路径对不上，刷新失败！')
    }
}

function onSheetRefreshSelect() {
    return onSheetChangeCells(window.Application.Selection)
}

function postMessageToGame(vData) {
    let item = OnGetData()
    let iframe = item && item.iframe
    if (!iframe || !iframe.contentWindow) return
    try {
        let message = {
            from: getExcelName(window.Application.ThisWorkbook.Name),
            type: getExcelCfgType().reduce((r, v) => {
                r.push(v.key)
                return r
            }, []),
            select: vData,
        }
        console.log('excel post message to game:', message)

        let sjson = JSON.stringify(message)
        iframe.contentWindow.postMessage(`${sjson}`, `http://${getIp()}`)
    } catch (error) {
        console.error(error)
    }
}

function getExcelName(name) {
    let table = getTable()

    let xlsname = name.split('.')[0]
    if (table[xlsname]) {
        return table[xlsname].tableName
    } else {
        return xlsname.replace('cfg_', '')
    }
}

function getExcelKeysByName(name) {
    let table = getTable()
    let xlsname = name.split('.')[0]

    if (table[xlsname] && table[xlsname].keyName) {
        return table[xlsname].keyName.split('#')
    }
    return ['id']
}

let tableJson

function getTable() {
    if (!tableJson) {
        tableJson = {}
        try {
            const workbook = XLSX.read(window.Application.FileSystem.ReadFileAsArrayBuffer(`${getFPath()}/tables.xls`), {
                type: 'binary'
            })
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, {
                header: 0
            });

            for (let item of json) {
                tableJson[item.name] = item
            }
        } catch (error) {
            console.error(error)
        }

    }
    return tableJson
}

let _config = {}

function getExcelCfgType() {
    let name = window.Application.ThisWorkbook.Name
    if (!_config[name]) {
        let cfg = []
        _config[name] = cfg

        let region = window.Application.Cells.CurrentRegion
        if (region) {
            let cols = region.Columns
            let nameRow = getCfgKeyRowIndex()
            let typeRow = getCfgTypeRowIndex()
            for (let i = 1; i <= cols.Count; i++) {
                let item = window.Application.Cells.Item(nameRow, i)
                if (item) {
                    let type = window.Application.Cells.Item(typeRow, i)
                    cfg[item.Value()] = cfg[i - 1] = {
                        key: item.Value(),
                        type: type ? type.Value() : 'any',
                        index: i
                    }
                }
            }
        }
    }
    return _config[name]
}

class Preview {
    constructor() {
        this._initListener()
    }

    _initListener() {
        window.Application.ApiEvent.AddApiEventListener('SheetChange', (app, cells) => {
            onSheetChangeCells(cells)
        })
    }

    * onRefreshCells(changeCells) {
        let vData = []
        let cfgType = getExcelCfgType()

        let keys = getExcelKeysByName(window.Application.ThisWorkbook.Name)
        let cells = window.Application.Cells

        let areas = changeCells.Areas

        let rowMap = []

        for (let i = 1; i <= areas.Count; i++) {
            let area = areas.Item(i)
            for (let j = 1; j <= area.Count; j++) {
                let item = area.Item(j)
                if (rowMap[item.Row]) continue
                rowMap[item.Row] = item
                let dataItem = {
                    keys: [],
                    val: []
                }
                for (let k = 0; k < cfgType.length; k++) {
                    let cfg = cfgType[k]
                    if (!cfg) continue
                    yield dataItem.val.push(cells.Item(item.Row, k + 1).Value())
                }
                for (let key in keys) {
                    let ktype = cfgType[keys[key]]
                    yield dataItem.keys.push(cells.Item(item.Row, ktype.index).Value())
                }
                vData.push(dataItem)
            }
        }
        postMessageToGame(vData)
    }
}

const preview = new Preview()

export default {
    getIp,
    getTable,
    onSheetChangeCells,
    onSheetRefreshSelect,
    getExcelKeysByName,
    getExcelCfgType,
    getDataByIndex,
}