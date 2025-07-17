import Util from './util'

const TEMP_NAME = 'TemplateLink'

let scriptImport = function () {
    let cfg = GetTemplateLinkJson()
    let templateData = cfg[TEMP_NAME] || {};
    let abpath = Util.getActiveSheetPath()
    _dirtyImportMap[abpath] = true
    let project_data = templateData[abpath] || {};
    let spath = project_data.tpath || ''

    console.log('当前路径：', abpath)
    console.log('加载模板脚本：', spath)

    if (spath) {
        window.scriptMap = {}
        try {
            let dirfile = window.Application.FileSystem.readdirSync(spath)
            for (let fpath of dirfile) {
                if (fpath.endsWith('.js')) {
                    try {
                        let ff = window.Application.FileSystem.ReadFile(spath + '/' + fpath)
                        eval(ff)
                    } catch (error) {
                        console.log('加载js失败：', fpath, error)
                    }
                }
            }
        } catch (error) {
            console.warn('加载本地模板脚本失败：', error)
        }
        console.log(_scriptMap)
    }
}

var _dirtyImportMap = {}
let workBookScriptImport = function () {
    let abpath = Util.getActiveSheetPath()
    if (_dirtyImportMap[abpath]) return
    _dirtyImportMap[abpath] = true
    scriptImport()
}

var _scriptMap = {}
Object.defineProperty(window, 'scriptMap', {
    get: function () {
        let abpath = Util.getActiveSheetPath()
        if (!_scriptMap[abpath]) {
            _scriptMap[abpath] = {}
        }
        console.log('get script map: ', abpath, _scriptMap[abpath])
        return _scriptMap[abpath]
    },
    set: function (val) {
        let abpath = Util.getActiveSheetPath()
        if (!_scriptMap[abpath]) {
            _scriptMap[abpath] = {}
        }
        _scriptMap[abpath] = val
        console.log('set script map: ', abpath, _scriptMap[abpath])
    },
    enumerable: true,
    configurable: true
});

let triggerValByType = function (type, val) {
    if (!window.scriptMap[type]) {
        console.error('尚未初始化成功类型是：【' + type + '】的模板解析脚本')
        return
    }
    try {
        let info = window.scriptMap[type](val)
        if (!info) {
            console.error(`模板脚本【${type}】调用没有返回`)
            return
        }
        if (!info.format || typeof info.format != 'function') {
            console.error(`模板脚本【${type}】没有返回正确format回调`)
            return
        }

        if (!info.table) {
            console.error(`模板脚本【${type}】没有返回table表名字段`)
            return
        }
        return info
    } catch (error) {
        console.error(`模板脚本：【${type}】解析【${val}】失败： `, error)
        return
    }
}

var tablesCacheMap = []

let getTablesData = function (info) {
    if (!info) return
    if (!tablesCacheMap[info.table]) {
        console.log('init~~~~~~~~~~', info.table)
        let json = Util.tryReadEXCELJSON(window.Application.FileSystem.absolutePath(window.Application.ThisWorkbook.FullName) + '/' + info.table, {
            range: info.key_row - 1 || 0,
        })

        let data
        if (info.key) {
            data = json.reduce((r, v) => {
                r[v[info.key]] = v
                return r
            }, {})
        }
        tablesCacheMap[info.table] = data
    }
    return tablesCacheMap[info.table]
}

var jsonPath = window.Application.Env.GetTempPath() + "/wps-plugin-template-link.json"

function GetTemplateLinkJson() {
    return Util.GetLocalCfgJson(jsonPath) || {}
}

function SetTemplateLinkJson(data) {
    return Util.SetLocalCfgByStr(jsonPath, data)
}

function GetColSelectType(col) {
    let fullName = window.Application.ThisWorkbook.FullName;
    let cfg = GetTemplateLinkJson();
    let templateData = cfg[TEMP_NAME] || {};
    let project_data = templateData[Util.getActiveSheetPath()] || {};
    let excel_data = project_data[fullName] || {};
    return excel_data[col]
}

export default {
    scriptImport,
    triggerValByType,
    getTablesData,
    GetTemplateLinkJson,
    SetTemplateLinkJson,
    workBookScriptImport,
    GetColSelectType
}