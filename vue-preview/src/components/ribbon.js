import Util from './js/util.js'
import {
    projectList
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
    switch (eleId) {
        default:
            if (!isNaN(index)) {
                let item = projectList[eleId]
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
                let item = projectList[eleId]
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
                let item = projectList[eleId]
                return item && item.name || "?"
            }
            break
    }
    return '?'
}

const cfgPath = window.Application.Env.GetTempPath() + "/wps-plugin-preview.json"

function GetLocalTempCfgJson() {
    if (window.Application.FileSystem.Exists(cfgPath)) {
        let str = window.Application.FileSystem.ReadFile(cfgPath)
        try {
            return JSON.parse(str)
        } catch (error) {
            return {}
        }
    } else {
        return {}
    }
}

function SetLocalTempCfg(data) {
    window.Application.FileSystem.WriteFile(cfgPath, JSON.stringify(data))
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