import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/FirstPage.vue"),
    },
    {
      path: "/gachaCal",
      name: "gachaCal",
      component: () => import("@/views/GachaCal.vue")
    }
  ],
});

export default router;
