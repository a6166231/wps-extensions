import {
    createRouter,
    createWebHashHistory
} from 'vue-router'

const getRoutes = function () {
    let list = []
    for (let i = 0; i < 99; i++) {
        list.push({
            path: '/preview_' + i,
            name: '/preview_' + i,
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
    routes: [{
            path: '/ProjectList',
            name: 'ProjectList',
            component: () => import('../components/ProjectList.vue'),
        },
        ...getRoutes()
    ]
})

export default router