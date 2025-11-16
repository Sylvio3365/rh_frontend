import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "../views/Dashboard.vue";
import Login from "../views/layouts/auth/Login.vue";

// layouts
import Blank from "../views/layouts/Blank.vue";

// views
import ListeEmployes from "../views/ListeEmployes.vue";
import FicheEmploye from "../views/FicheEmploye.vue";

// error page
import Page404 from "../views/layouts/error/404.vue";

var appname = " - Windzo Dashboard Admin Template";

const routes = [
  // Routes
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: { title: "Dashboard " + appname },
  },
  // layouts
  {
    path: "/Blank",
    name: "Blank Page",
    component: Blank,
    meta: { title: "Blank Page" + appname },
  },
  {
    path: "/auth/login",
    name: "Login",
    component: Login,
    meta: { title: "Login" + appname, hideNav: true },
  },
  {
    path: "/employes/liste",
    name: "Liste employes",
    component: ListeEmployes,
    meta: { title: "Liste emp" },
  },
  {
    path: "/employes/:id",
    name: "FicheEmploye",
    component: FicheEmploye,
    meta: { title: "Fiche Employé" + appname },
  },
  {
    path: "/conges/calendrier",
    name: "CalendrierConge",
    component: () => import("../views/CalendrierConge.vue"),
    meta: { title: "Calendrier des Congés - ERP RH" },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "Page404",
    component: Page404,
    meta: { title: "Upps! 404" + appname, hideNav: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: "exact-active",
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;
