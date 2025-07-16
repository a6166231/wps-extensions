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
    {
        path: '/TemplateLink',
        name: 'TemplateLink',
        component: () => import('../components/TemplateLink.vue'),
    },
    {
        path: '/template-item-preview',
        name: 'template-item-preview',
        component: () => import('../components/TemplateItemPreview.vue'),
    },
    ...getRoutes()
    ]
})

export default router