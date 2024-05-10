import { createRouter, createWebHashHistory } from 'vue-router'


const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/adminlogin',
            component: () => import('../views/AdminLogin.vue')
        },
        {
            path: '/viewusers',
            component: () => import('../views/ViewUsers.vue')
        },
        {
            path: '/schedule',
            component: () => import('../views/Schedule.vue')
        },
       
        { path: '/', redirect: '/adminlogin' }
    ]
})

export default router