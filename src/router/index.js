import { createWebHistory, createRouter } from "vue-router";
import Index from "@/views/Index.vue";
import Doc from "@/views/Doc.vue";
import Example from "@/views/Example.vue"
const routes = [
    {
        path: "/",
        name: "Index",
        component: Index,
    },
    {
        path: "/doc",
        name: "Doc",
        component: Doc,
    },
    {
        path: "/example/:eid",
        name: "Example",
        component: Example,
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;