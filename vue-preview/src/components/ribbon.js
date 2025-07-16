import Util from './js/util.js'
import TL from './js/templateLink.js'
import {
    GetProjectList
} from '../cfg.js'

function OnAddinLoad(ribbonUI) {
    if (typeof (window.Application.ribbonUI) != "object") {
        window.Application.ribbonUI = ribbonUI
    }

    if (typeof (window.Application.Enum) != "object") { // 如果没有内置枚举值
        window.Application.Enum = Util.WPS_Enum
    }

    window.Application.ApiEvent.AddApiEventListener('SheetSelectionChange', () => {
        if (!Util.templateLinkTag || Util.selectionItemDialogStatus) return
        let selects = window.Application.Selection.Cells
        if (selects.Count == 1 && selects.Text) {
            Util.ShowSelectionItemDialog()
        }
    })

    window.Application.ApiEvent.AddApiEventListener('WorkbookOpen', () => {
        TL.workBookScriptImport()
    })

    TLRefreshScriptImport()
    return true
}

function TLRefreshScriptImport() {
    TL.scriptImport()
}

function OnAction(control) {
    const eleId = control.Id
    const index = Number(eleId)
    switch (eleId) {
        case "template-lock": {
            Util.templateLinkTag = !Util.templateLinkTag;
            window.Application.ribbonUI.InvalidateControl('template-lock')
            break
        }
        case "template-link":
            window.Application.ShowDialog(Util.GetUrlPath() + Util.GetRouterHash() + "/TemplateLink", "项目配置管理", 1000, 600)
            break
        case "script-reimport":
            TLRefreshScriptImport()
            break
        case "btnShowCfgPanel":
            window.Application.ShowDialog(Util.GetUrlPath() + Util.GetRouterHash() + "/ProjectList", "项目配置管理", 1000, 600)
            break
        default: {
            if (!isNaN(index)) {
                let item = GetProjectList()[eleId]
                if (item) {
                    let _name = `preview_${index}`
                    let pid = window.Application.PluginStorage.getItem(_name)
                    if (!pid) {
                        let pane = window.Application.CreateTaskPane(Util.GetUrlPath() + Util.GetRouterHash() + "/" + _name)
                        pane.name = _name
                        window.Application.PluginStorage.setItem(_name, pane.ID)
                        pane.Visible = true
                    } else {
                        let pane = window.Application.GetTaskPane(pid)
                        pane.Visible = !pane.Visible
                    }
                }
            }
            break
        }
    }
    return true
}

function GetImage(control) {
    const eleId = control.Id
    switch (eleId) {
        case "template-lock":
            return "images/" + (Util.templateLinkTag ? "open" : "close") + '.svg'
        case "template-link":
        case "btnShowCfgPanel":
            return "images/1.svg"
            
        case "script-reimport":
            return "images/refresh.svg"
        default:
            break
    }
    return "images/newFromTemp.svg"
}

function OnGetVisible(control) {
    const eleId = control.Id
    const index = Number(eleId)
    switch (eleId) {
        default:
            if (!isNaN(index)) {
                let item = GetProjectList()[eleId]
                return Boolean(item)
            }
            break
    }
    return true
}

function onGetBtnLb(control) {
    const eleId = control.Id
    const index = Number(eleId)
    switch (eleId) {
        case "template-lock":
            return "模板开关"
        case "template-link":
            return "模板关联"
        case "script-reimport":
            return "脚本重载"
        default:
            if (!isNaN(index)) {
                let item = GetProjectList()[eleId]
                return item && item.name || "?"
            }
            break
    }
    return '?'
}
function OnGetEnabled() {
    // const eleId = control.Id
    // switch (eleId) {
    // }
    return true
}


const cfgPath = window.Application.Env.GetTempPath() + "/wps-plugin-preview.json"
function GetLocalTempCfgJson() {
    return Util.GetLocalCfgJson(cfgPath) || {}
}

function SetLocalTempCfg(data) {
    return Util.SetLocalCfgByStr(cfgPath, data)
}

//这些函数是给wps客户端调用的
export default {
    OnAddinLoad,
    OnAction,
    onGetBtnLb,
    GetImage,
    OnGetVisible,
    GetLocalTempCfgJson,
    SetLocalTempCfg,
    OnGetEnabled,
    TLRefreshScriptImport,
};