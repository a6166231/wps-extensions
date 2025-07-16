function condition(str) {
    let format = (cfgs) => {
        let arr = String(str).split('|');
        let result = []
        for (let key in arr) {
            let or = []
            for (let id of arr[key].split("&")) {
                cfgs[id] && or.push(cfgs[id].txt)
            }
            result.push(or)
        }
        return result.map(v => v.join(' 且 ')).join('\n或')
    }
    return { format, table: 'cfg_conditions', key_row: 4, key: 'id' }
}
window.scriptMap.condition = condition