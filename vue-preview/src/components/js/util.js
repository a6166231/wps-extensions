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

export default {
    WPS_Enum,
    GetUrlPath,
    GetRouterHash,
    runGeneratorInFrames,
    SetLocalCfgByStr,
    GetLocalCfgJson,
}