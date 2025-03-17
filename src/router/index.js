import {createRouter, createWebHistory} from 'vue-router'
import HomeView from "../components/Home.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "/topstories"
        },
        {
            path: "/:stories",
            name: "HomeTop",
            component: HomeView
        },
    ]
})

export default router;
