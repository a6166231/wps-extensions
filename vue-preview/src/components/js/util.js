import TL from "./templateLink.js";
import * as XLSX from 'xlsx';

//在后续的wps版本中，wps的所有枚举值都会通过wps.Enum对象来自动支持，现阶段先人工定义
var WPS_Enum = {
    msoCTPDockPositionLeft: 0,
    msoCTPDockPositionRight: 2
}

function GetUrlPath() {
    // 在本地网页的情况下获取路径
    if (window.location.protocol === 'file:') {
        const path = window.location.href;
        // 删除文件名以获取根路径
        return path.substring(0, path.lastIndexOf('/'));
    }

    // 在非本地网页的情况下获取根路径
    const {
        protocol,
        hostname,
        port
    } = window.location;
    const portPart = port ? `:${port}` : '';
    return `${protocol}//${hostname}${portPart}`;
}

function GetRouterHash() {
    if (window.location.protocol === 'file:') {
        return '';
    }

    return '/#'
}

function runGeneratorInFrames(generator, timestep = 16) {
    return new Promise((resolve, reject) => {
        let startTime = performance.now();

        function step() {
            let currentTime = performance.now();
            while (currentTime - startTime < timestep) {
                let result = generator.next();
                if (result.done) {
                    resolve(true)
                    return
                };
                currentTime = performance.now();
            }
            startTime = currentTime;
            requestAnimationFrame(step);
        }
        try {
            requestAnimationFrame(step);
        } catch (error) {
            console.error(error)
            reject(false)
        }
    })
}


function GetLocalCfgJson(ppath) {
    if (window.Application.FileSystem.Exists(ppath)) {
        let str = window.Application.FileSystem.ReadFile(ppath)
        try {
            return JSON.parse(str)
        } catch (error) {
            return
        }
    } else {
        return
    }
}

function SetLocalCfgByStr(ppath, data) {
    window.Application.FileSystem.WriteFile(ppath, JSON.stringify(data))
}

var templateLinkTag = false
var selectionItemDialogStatus = false

function ShowSelectionItemDialog() {
    let selects = window.Application.Selection.Cells
    let Target = selects
    if (selects.Count != 1 || !selects.Text) return

    let selectTemplate = TL.GetColSelectType(Target.Column)
    if (!selectTemplate) return

    let info = TL.triggerValByType(selectTemplate, Target.Text)
    if (!info) return

    const json = TL.getTablesData(info)
    let data = {
        s: info.format(json),
    }
    if (!data.s || data.s.length == 0) return

    window.Application.PluginStorage.setItem("template-link-key", JSON.stringify(data))

    let viewRange = window.Application.ActiveWindow.ActivePane.VisibleRange
    const windowLeft = (Target.Left - viewRange.Left + Target.Width + window.wps.Application.Left + 28) / 72 * 96
    const windowTop = (Target.Top - viewRange.Top + 128 + window.wps.Application.Top) / 72 * 96
    selectionItemDialogStatus = true

    window.wps.ShowDialogEx(GetUrlPath() + GetRouterHash() + "/" + 'template-item-preview', "",
        300 * window.devicePixelRatio,
        360 * window.devicePixelRatio,
        false, true, true, undefined, undefined, undefined, undefined,
        windowLeft, windowTop)
}

function tryReadEXCELJSON(ppath, param) {
    let workbook
    try {
        if (fileExists(ppath + '.csv')) {
            workbook = XLSX.read(window.Application.FileSystem.ReadFile(ppath + '.csv'), {
                type: 'binary'
            })
        } else {
            workbook = XLSX.read(window.Application.FileSystem.ReadFile(ppath + '.xls'), {
                type: 'binary'
            })
        }
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet, param);
    } catch (error) {
        console.error(error)
        return {}
    }
}

function fileExists(ppath) {
    return window.Application.FileSystem.Exists(ppath)
}

function getActiveSheetPath() {
    let fullName = window.Application.ThisWorkbook.FullName;
    return window.Application.FileSystem.absolutePath(fullName)
}

export default {
    WPS_Enum,
    GetUrlPath,
    GetRouterHash,
    runGeneratorInFrames,
    SetLocalCfgByStr,
    GetLocalCfgJson,
    ShowSelectionItemDialog,
    tryReadEXCELJSON,
    selectionItemDialogStatus,
    templateLinkTag,
    fileExists,
    getActiveSheetPath,
}