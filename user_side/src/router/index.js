import { createRouter, createWebHashHistory } from 'vue-router'


const router = createRouter ({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: () => import('../views/AdminLogin.vue')

        },
        {
            path: '/studentrecords',
            component: () => import('../views/StudentRecords.vue')
        },
        {
            path: '/appointment',
            component: () => import('../views/Appointment.vue')
        }
    ]
})

export default router