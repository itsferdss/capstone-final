import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/dashboard',
            component: () => import('../views/Dashboard.vue'),
            meta: {
                requiresAuthentication: true, // Login page doesn't require authentication
            },
        },
        {
            path: '/adminlogin',
            component: () => import('../views/AdminLogin.vue'),
            meta: {
                requiresAuthentication: false, // Login page doesn't require authentication
            },
        },
        {
            path: '/viewusers',
            component: () => import('../views/ViewUsers.vue'),
            meta: {
                requiresAuthentication: true, // Login page doesn't require authentication
            },
        },
        {
            path: '/schedule',
            component: () => import('../views/Schedule.vue'),
            meta: {
                requiresAuthentication: true, // Login page doesn't require authentication
            },
        },
        {
            path: '/inventory',
            component: () => import('../views/Inventory.vue'),
            meta: {
                requiresAuthentication: true, // Login page doesn't require authentication
            },
        },
        {
            path: '/inventory2',
            component: () => import('../views/Inventory2.vue'),
            meta: {
                requiresAuthentication: true, // Login page doesn't require authentication
            },
        },
        {
            path: '/add/user',
            component: () => import('../views/Forms_Adding/AddUserForm.vue'),
            meta: {
                requiresAuthentication: true, // Login page doesn't require authentication
            },
        },
        {
            path: '/add/reservation',
            component: () => import('../views/Forms_Adding/AddDirectReservation.vue'),
            meta: {
                requiresAuthentication: true, // Login page doesn't require authentication
            },
        },
        {
            path: '/add/prescription',
            component: () => import('../views/Forms_Adding/PrescriptionForm.vue'),
            meta: {
                requiresAuthentication: true, // Login page doesn't require authentication
            },
        },
        {
            path: '/add/spectacles',
            component: () => import('../views/Forms_Adding/SpectaclesForm.vue'),
            meta: {
                requiresAuthentication: true, // Login page doesn't require authentication
            },
        },
        {
            path: '/add/history',
            component: () => import('../views/Forms_Adding/HistoryForm.vue'),
            meta: {
                requiresAuthentication: true, // Login page doesn't require authentication
            },
        },
        {
            path: '/view/pending',
            component: () => import('../views/Forms_Viewing/PendingReservation.vue'),
            meta: {
                requiresAuthentication: true, // Login page doesn't require authentication
            },
        },
        {
            path: '/view/pickedup',
            component: () => import('../views/Forms_Viewing/PickedUpReservation.vue'),
            meta: {
                requiresAuthentication: true, // Login page doesn't require authentication
            },
        },
        {
            path: '/view/product',
            component: () => import('../views/Form_Editing/EditProduct.vue'),
            meta: {
                requiresAuthentication: true, // Login page doesn't require authentication
            },
        },
        {
            path: '/add/product',
            component: () => import('../views/Forms_Adding/ProductForm.vue'),
            meta: {
                requiresAuthentication: true, // Login page doesn't require authentication
            },
        },
       
        { path: '/', redirect: '/adminlogin' }
    ]
});

router.beforeEach((to, from, next) => {
    const token = getToken(); // Get token from sessionStorage

    if (to.meta.requiresAuthentication && !token) {
        // If the route requires authentication and there is no token, redirect to login
        next('/');
    } else if (!to.meta.requiresAuthentication && token && to.path === '/adminlogin') {
        // If the route doesn't require authentication and there is a token, redirect to home
        next('/dashboard');
    } else {
        // Allow access to the route
        next();
    }
});


function getToken() {
    // Retrieve the token from sessionStorage
    return sessionStorage.getItem('token');
}

export default router;