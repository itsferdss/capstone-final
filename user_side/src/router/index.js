import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/login',
            component: () => import('../views/AdminLogin.vue'),
            // meta: {
            //     requiresAuthentication: false, // Login page doesn't require authentication
            // },
        },
        {
            path: '/home',
            component: () => import('../views/Home.vue'),
            // meta: {
            //     requiresAuthentication: true, // Home requires authentication
            // },
        },
        {
            path: '/profile',
            component: () => import('../views/Profile.vue'),
        //     meta: {
        //         requiresAuthentication: true, // Profile requires authentication
        //     },
        },
        {
            path: '/products',
            component: () => import('../views/Products.vue'),
            // meta: {
            //     requiresAuthentication: true, // Products requires authentication
            // },
        },
        {
            path: '/',
            component: () => import('../views/LandingPage.vue'),
            // meta: {
            //     requiresAuthentication: false, // Landing page doesn't require authentication
            // },
        },
        {
            path: '/newproducts',
            component: () => import('../components/NEWPRODUCTS.vue'),
            // meta: {
            //     requiresAuthentication: false, // Landing page doesn't require authentication
            // },
        },
        {
            path: '/viewProduct',
            component: () => import('../components/ViewProducts.vue'),
            // meta: {
            //     requiresAuthentication: false, // Landing page doesn't require authentication
            // },
        },
        {
            path: '/viewReservation',
            component: () => import('../views/Viewing/ViewReservation.vue'),
            // meta: {
            //     requiresAuthentication: false, // Landing page doesn't require authentication
            // },
        }
    ],
});

router.beforeEach((to, from, next) => {
    const token = getToken(); // Get token from sessionStorage

    if (to.meta.requiresAuthentication && !token) {
        // If the route requires authentication and there is no token, redirect to login
        next('/');
    } else if (!to.meta.requiresAuthentication && token && to.path === '/login') {
        // If the route doesn't require authentication and there is a token, redirect to home
        next('/home');
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
