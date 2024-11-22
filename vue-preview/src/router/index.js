import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
//import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHashHistory(''),
    routes: [{
            path: '/huoyuan',
            name: '火源',
            component: () => import('../components/Preview.vue'),
            props: {
                type: 0,
            }
        },
        {
            path: '/baoxiang',
            name: '宝箱',
            component: () => import('../components/Preview.vue'),
            props: {
                type: 1,
            }
        },
        {
            path: '/xueren',
            name: '雪人',
            component: () => import('../components/Preview.vue'),
            props: {
                type: 2,
            }
        },
    ]
})

export default router