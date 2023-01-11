import { createRouter, createWebHistory } from "vue-router";

import Access from "../views/Access.vue";
import Home from "../views/Home.vue";
import PasswordReset from "../views/PasswordReset.vue";
import Index from "../components/index/Index.vue";

const routes = [
    {
        path: "/",
        name: "Index",
        component: Index,
    },
    {
        path: "/home",
        name: "Home",
        component: Home,
    },
    {
        path: '/access/:method/',
        name: "Access",
        component: Access,
    },
    {
        path: '/reset/',
        name: "Password Reset",
        component: PasswordReset,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;