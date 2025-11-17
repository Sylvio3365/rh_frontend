import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "../views/Dashboard.vue";
import Login from "../views/layouts/auth/Login.vue";

// layouts
import Blank from "../views/layouts/Blank.vue";

// views
import ListeEmployes from "../views/emp/ListeEmployes.vue";
import FicheEmploye from "../views/emp/FicheEmploye.vue";
import CalendrierConge from "../views/conge/CalendrierConge.vue";

import DemandeConge from "../views/conge/DemandeConge.vue";
import ListeConges from "../views/conge/ListeConges.vue";

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
    path: "/fiche-utilisateur",
    name: "FicheUtilisateur",
    component: () => import("../views/utilisateur/FicheUtilisateur.vue"),
    meta: { title: "Fiche Utilisateur" },
  },
  {
    path: "/employes/:id",
    name: "FicheEmploye",
    component: FicheEmploye,
    meta: { title: "Fiche Employé" + appname },
  },
  {
    path: "/conges/demandes",
    name: "DemandeConges",
    component: () => DemandeConge,
    meta: { title: "Nouveau Congé" },
  },
  {
    path: "/conges/liste",
    name: "ListeConges",
    component: () => ListeConges,
    meta: { title: "Liste des Congés" },
  },
  {
    path: "/conges/calendrier",
    name: "CalendrierConges",
    component: () => CalendrierConge,
    meta: { title: "Calendrier des Congés" },
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
