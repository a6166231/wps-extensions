function items(str) {
    let format = (cfgs) => {
        let arr = String(str).split('&');
        let result = []
        for (let key in arr) {
            let rewards = arr[key].split("#")
            result.push(`${cfgs[rewards[0]] ? cfgs[rewards[0]].name : "！妹找到道具！"} * ${rewards[1]}`)
        }
        return result.join('\n')
    }
    return { format, table: 'cfg_items', key_row: 4, key: 'id' }
}
window.scriptMap.items = items