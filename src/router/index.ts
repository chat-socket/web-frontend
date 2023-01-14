import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import PasswordReset from "../views/PasswordReset.vue";
import Index from "../components/about/About.vue";
import useAuthStore from "../stores/auth";

const routes = [
    {
        path: "/about",
        name: "About",
        component: Index,
    },
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: '/reset/',
        name: "Password Reset",
        component: PasswordReset,
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: '/',
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/about'];
    const authRequired = !publicPages.includes(to.path);
    const auth = useAuthStore();

    if (authRequired && !auth.user) {
        // If the user is not already authenticated, redirect them to about page
        return '/about';
    } else if (auth.user && to.path === "/about") {
        // If the user is already authenticated, we redirect them to the home page directly
        return '/';
    }
});

export default router;