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
            path: '/examination',
            component: () => import('../views/Examination.vue')
        },
       
        { path: '/', redirect: '/adminlogin' }
    ]
})

export default router