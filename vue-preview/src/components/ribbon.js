import Util from './js/util.js'
import SystemDemo from './js/systemdemo.js'

function OnAddinLoad(ribbonUI) {
    if (typeof (window.Application.ribbonUI) != "object") {
        window.Application.ribbonUI = ribbonUI
    }

    if (typeof (window.Application.Enum) != "object") { // 如果没有内置枚举值
        window.Application.Enum = Util.WPS_Enum
    }
    //这几个导出函数是给外部业务系统调用的
    window.openOfficeFileFromSystemDemo = SystemDemo.openOfficeFileFromSystemDemo
    window.InvokeFromSystemDemo = SystemDemo.InvokeFromSystemDemo

    window.Application.PluginStorage.setItem("EnableFlag", false) //往PluginStorage中设置一个标记，用于控制两个按钮的置灰
    window.Application.PluginStorage.setItem("ApiEventFlag", false) //往PluginStorage中设置一个标记，用于控制ApiEvent的按钮label
    return true
}

function OnAction(control) {
    const eleId = control.Id
    switch (eleId) {
        case "btnShowHuoYuan": {
            let pid = window.Application.PluginStorage.getItem("preview_huoyuan")
            if (!pid) {
                let pane = window.Application.CreateTaskPane(Util.GetUrlPath() + Util.GetRouterHash() + "/huoyuan")
                pane.name = 'preview_huoyuan'
                window.Application.PluginStorage.setItem("preview_huoyuan", pane.ID)
                pane.Visible = true
            } else {
                let pane = window.Application.GetTaskPane(pid)
                pane.Visible = !pane.Visible
            }
            break
        }
        case "btnShowBaoXiang": {
            let pid = window.Application.PluginStorage.getItem("preview_baoxiang")
            if (!pid) {
                let pane = window.Application.CreateTaskPane(Util.GetUrlPath() + Util.GetRouterHash() + "/baoxiang")
                pane.name = 'preview_baoxiang'
                window.Application.PluginStorage.setItem("preview_baoxiang", pane.ID)
                pane.Visible = true
            } else {
                let pane = window.Application.GetTaskPane(pid)
                pane.Visible = !pane.Visible
            }
            break
        }
        case "btnShowXueRen": {
            let pid = window.Application.PluginStorage.getItem("preview_xueren")
            if (!pid) {
                let pane = window.Application.CreateTaskPane(Util.GetUrlPath() + Util.GetRouterHash() + "/xueren")
                pane.name = 'preview_xueren'
                window.Application.PluginStorage.setItem("preview_xueren", pane.ID)
                pane.Visible = true
            } else {
                let pane = window.Application.GetTaskPane(pid)
                pane.Visible = !pane.Visible
            }
            break
        }
        default:
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

function OnGetEnabled(control) {
    const eleId = control.Id
    switch (eleId) {
        default:
            break
    }
    return true
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
    GetImage,
    OnGetEnabled,
    GetLocalTempCfgJson,
    SetLocalTempCfg,
};