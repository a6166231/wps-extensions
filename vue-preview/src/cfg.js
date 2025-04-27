import Util from './components/js/util'
let _projectList = [{
    url: "http://10.40.3.98/h5/game_super_power/index.html",
    name: "火源",
    view: {
        width: 1136,
        height: 640
    }
}, {
    url: "http://10.40.3.98/h5/game_box/index.html",
    name: "宝箱",
    view: {
        width: 640,
        height: 1136
    }
}, {
    url: "http://10.40.3.98/h5/snow/index.html",
    name: "雪人",
    view: {
        width: 640,
        height: 1136
    }
}]

function getLocalProjectCfgJson() {
    let list = Util.GetLocalCfgJson(window.Application.Env.GetTempPath() + "/wps-plugin-preview-project.json")
    if (list && list.length > 0) {
        _projectList = list
    }
    return _projectList
}

function SetLocalProjectTempCfg(data) {
    if (!data) {
        data = _projectList
    } else {
        _projectList = data
    }
    return Util.SetLocalCfgByStr(window.Application.Env.GetTempPath() + "/wps-plugin-preview-project.json", data)
}

function GetProjectList() {
    return getLocalProjectCfgJson()
}

function getCfgKeyRowIndex() {
    return 4;
}

function getCfgTypeRowIndex() {
    return 3;
}

export {
    GetProjectList,
    getCfgKeyRowIndex,
    getCfgTypeRowIndex,
    getLocalProjectCfgJson,
    SetLocalProjectTempCfg,
}