import * as XLSX from 'xlsx';
import util from './util';

const previewData = [{
    url: `http://10.40.3.98/h5/game_super_power/index.html`,
    fpath: 'E:/YSH5/乌木剑/H5Data',
    name: '火源',
    ip: '10.40.3.98',
    view: {
        width: 1136,
        height: 640
    }
}, {
    url: `http://10.40.3.98/h5/snow/index.html`,
    fpath: 'E:/YSH5/雪人/H5Data',
    name: '雪人',
    ip: '10.40.3.98',
    view: {
        width: 640,
        height: 1136
    }
}]

function getDataByIndex(index) {
    return previewData[index]
}

const _formatData = {}

function OnGetData() {
    let fullname = window.Application.ThisWorkbook.FullName
    if (_formatData[fullname]) {
        return _formatData[fullname]
    }
    let fname = fullname.replace(new RegExp('\\\\', 'g'), '/')

    for (let data of previewData) {
        if (data.url.indexOf(fname) == 0) {
            _formatData[fullname] = data
            return data
        }
    }
    return previewData[0]
}

function getURL() {
    return OnGetData().url
}

function getIp() {
    return OnGetData().ip
}

function getFPath() {
    return OnGetData().fpath
}

function getCfgKeyRowIndex() {
    return 4;
}

function getCfgTypeRowIndex() {
    return 3;
}

function onSheetChangeCells(cells) {
    return util.runGeneratorInFrames(preview.onChangeCells(cells))
}

function onSheetRefreshSelect() {
    return util.runGeneratorInFrames(preview.selectionRows())
}

function postMessageToGame(cfgType, vData) {
    let iframe = OnGetData().iframe
    if (!iframe || !iframe.contentWindow) return
    try {
        let message = {
            from: getExcelName(window.Application.ThisWorkbook.Name),
            type: cfgType,
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

    * selectionRows() {
        let rows = window.Application.Selection.Rows
        let cells = window.Application.Cells
        let cfgType = getExcelCfgType()
        let vData = []

        let type = cfgType.reduce((r, v) => {
            r.push(v.key)
            return r
        }, [])

        let keys = getExcelKeysByName(window.Application.ThisWorkbook.Name)

        for (let i = 1; i <= rows.Count; i++) {
            let item = rows.Item(i)
            if (item.Row <= getCfgKeyRowIndex()) continue
            let dataItem = {
                keys: [],
                val: []
            }
            for (let i = 0; i < cfgType.length; i++) {
                let cfg = cfgType[i]
                if (!cfg) continue
                yield dataItem.val.push(cells.Item(item.Row, i + 1).Value())
            }

            for (let key in keys) {
                let ktype = cfgType[key]
                yield dataItem.keys.push(cells.Item(item.Row, ktype.index).Value())
            }
            vData.push(dataItem)
        }
        postMessageToGame(type, vData)
    }

    * onChangeCells(changeCells) {
        let vData = []
        let cfgType = getExcelCfgType()
        let type = []

        let keys = getExcelKeysByName(window.Application.ThisWorkbook.Name)
        let cells = window.Application.Cells

        for (let i = 1; i <= changeCells.Count; i++) {
            let item = changeCells.Item(i)

            let dataItem = {
                keys: [],
                val: []
            }
            yield dataItem.val.push(item.Value())
            type.push(cfgType[item.Column - 1].key)
            vData.push(dataItem.val)

            for (let key in keys) {
                let ktype = cfgType[key]
                yield dataItem.keys.push(cells.Item(item.Row, ktype.index).Value())
            }
        }
        postMessageToGame(type, vData)
    }
}

const preview = new Preview()

export default {
    getURL,
    getIp,
    getTable,
    onSheetChangeCells,
    onSheetRefreshSelect,
    getExcelKeysByName,
    getExcelCfgType,
    OnGetData,
    getDataByIndex,
}