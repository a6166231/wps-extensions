let projectList = [{
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

function getCfgKeyRowIndex() {
    return 4;
}

function getCfgTypeRowIndex() {
    return 3;
}

export {
    projectList,
    getCfgKeyRowIndex,
    getCfgTypeRowIndex,
}