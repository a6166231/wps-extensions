import {
    createRouter,
    createWebHashHistory
} from 'vue-router'

import {
    projectList
} from '../cfg'

const getRoutes = function () {
    let list = []
    for (let i = 0; i < projectList.length; i++) {
        let item = projectList[i]
        list.push({
            path: '/preview_' + i,
            name:  item.name,
            component: () => import('../components/Preview.vue'),
            props: {
                type: i,
            }
        })
    }
    return list
}

const router = createRouter({
    history: createWebHashHistory(''),
    routes: getRoutes()
})

export default router