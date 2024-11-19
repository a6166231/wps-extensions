import {
    createRouter,
    createWebHashHistory
} from 'vue-router'
//import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHashHistory(''),
    routes: [{
            path: '/xueren',
            name: '雪人',
            component: () => import('../components/Preview.vue'),
            props: {
                type: 1,
            }
        },
        {
            path: '/huoyuan',
            name: '火源',
            component: () => import('../components/Preview.vue'),
            props: {
                type: 0,
            }
        },
    ]
})

export default router