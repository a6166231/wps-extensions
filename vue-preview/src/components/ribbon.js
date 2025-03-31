import Util from './js/util.js'
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
    return true
}

function OnAction(control) {
    const eleId = control.Id
    const index = Number(eleId)
    console.log(eleId)
    switch (eleId) {
        case "btnShowCfgPanel":
            window.Application.ShowDialog(Util.GetUrlPath() + Util.GetRouterHash() + "/ProjectList", "项目配置管理", 1000, 600)
            break
        default:
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
    return true
}

function GetImage(control) {
    const eleId = control.Id
    switch (eleId) {
        case "btnShowCfgPanel":
            return "images/1.svg"
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
        default:
            if (!isNaN(index)) {
                let item = GetProjectList()[eleId]
                return item && item.name || "?"
            }
            break
    }
    return '?'
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
};