let attributeStrFormat = function (str) {
    let list = str.split('|')
    let attrObj = {};
    for (let i = 0; i < list.length; i++) {
        let attrInf = list[i].split("#");
        attrObj[attrInf[0]] = attrInf[1];
    }
    return attrObj;
}

let attributeValFrmat = function (val, cfgs) {
    let list = []

    for (let k in val) {
        if (!cfgs[k]) continue
        list.push(cfgs[k].description + ":" + val[k])
    }

    return list
}

function attribute(str) {
    let format = (cfgs) => {
        let arr = String(str).split('&');

        let result = []
        if (arr.length == 1) {
            let attrObj = attributeStrFormat(arr[0])
            let attrList = attributeValFrmat(attrObj, cfgs)
            result.push(`${attrList.join('\n')}`)
        } else if(arr.length == 3){
            let job = ["战", "法", "道"]
            for (let i = 0; i < arr.length; i++) {

                let attrObj = attributeStrFormat(arr[i])
                let attrList = attributeValFrmat(attrObj, cfgs)

                result.push(`${job[i]} :\n${attrList.join('    \n')}`)
            }
        }
        return result.join('\n')
    }
    return { format, table: 'cfg_attribute_score', key_row: 4, key: 'id' }
}
window.scriptMap.attribute = attribute