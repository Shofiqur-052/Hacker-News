import {createRouter, createWebHistory} from 'vue-router'
import HomeView from "@/components/Home.vue"
import Error from '@/components/Error.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "/topstories"
        },
        {
            path: "/:stories",
            name: "Home",
            component: HomeView
        },
        {
            path: "/comments/:id",
            name: "Comment",
            component: HomeView
        },
        {
            path: "/:catchAll(.*)?",
            name: "Error",
            component: Error
        }
    ]
})

export default router;
