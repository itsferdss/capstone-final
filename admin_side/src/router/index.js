import { createRouter, createWebHashHistory } from 'vue-router'


const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/dashboard',
            component: () => import('../views/Dashboard.vue')
        },
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
        {
            path: '/inventory',
            component: () => import('../views/Inventory.vue')
        },
        {
            path: '/add/user',
            component: () => import('../views/Forms_Adding/AddUserForm.vue')
        },
        {
            path: '/add/prescription',
            component: () => import('../views/Forms_Adding/PrescriptionForm.vue')
        },
        {
            path: '/add/spectacles',
            component: () => import('../views/Forms_Adding/SpectaclesForm.vue')
        },
        {
            path: '/add/history',
            component: () => import('../views/Forms_Adding/HistoryForm.vue')
        },
        {
            path: '/view/pending',
            component: () => import('../views/Forms_Viewing/PendingReservation.vue')
        },
        {
            path: '/view/pickedup',
            component: () => import('../views/Forms_Viewing/PickedUpReservation.vue')
        },
        {
            path: '/view/prescription',
            component: () => import('../views/Forms_Viewing/FormPrescriptionView.vue')
        },
        {
            path: '/add/product',
            component: () => import('../views/Forms_Adding/ProductForm.vue')
        },
       
        { path: '/', redirect: '/adminlogin' }
    ]
})

export default router