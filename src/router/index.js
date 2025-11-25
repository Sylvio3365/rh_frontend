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

import Hello from "@/views/Hello.vue";

var appname = "RH";

const routes = [
  {
    path: "/hello",
    name: "Hello",
    component: Hello,
    meta: { title: "Hello" + appname, requiresAuth: false }, // Public
  },
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: { title: "Dashboard " + appname, requiresAuth: true }, // Protégé
  },
  {
    path: "/auth/login",
    name: "Login",
    component: Login,
    meta: { title: "Login" + appname, hideNav: true, requiresAuth: false }, // Public
  },

  // layouts
  {
    path: "/blank",
    name: "Blank Page",
    component: Blank,
    meta: { title: "Blank Page" + appname, requiresAuth: true }, // Protégé
  },

  // Employés
  {
    path: "/employes/liste",
    name: "Liste employes",
    component: ListeEmployes,
    meta: { title: "Liste emp" + appname, requiresAuth: true }, // Protégé
  },
  {
    path: "/employes/:id",
    name: "FicheEmploye",
    component: FicheEmploye,
    meta: { title: "Fiche Employé" + appname, requiresAuth: true }, // Protégé
  },

  // Utilisateurs
  {
    path: "/fiche-utilisateur",
    name: "FicheUtilisateur",
    component: () => import("../views/utilisateur/FicheUtilisateur.vue"),
    meta: { title: "Fiche Utilisateur" + appname, requiresAuth: true }, // Protégé
  },

  // Congés
  {
    path: "/conges/demandes",
    name: "DemandeConges",
    component: DemandeConge,
    meta: { title: "Nouveau Congé" + appname, requiresAuth: true }, // Protégé
  },
  {
    path: "/conges/liste",
    name: "ListeConges",
    component: ListeConges,
    meta: { title: "Liste des Congés" + appname, requiresAuth: true }, // Protégé
  },
  {
    path: "/conges/calendrier",
    name: "CalendrierConges",
    component: CalendrierConge,
    meta: { title: "Calendrier des Congés" + appname, requiresAuth: true }, // Protégé
  },

  // error page
  {
    path: "/:pathMatch(.*)*",
    name: "Page404",
    component: Page404,
    meta: { title: "Upps! 404" + appname, hideNav: true, requiresAuth: false }, // Public
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: "exact-active",
});

// Navigation guard amélioré
router.beforeEach((to, from, next) => {
  // Mettre à jour le titre de la page
  document.title = to.meta.title || appname;

  // Vérifier l'authentification
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const requiresAuth = to.meta.requiresAuth;

  // Si la route nécessite une authentification ET l'utilisateur n'est pas connecté
  if (requiresAuth && !isAuthenticated) {
    console.log('🔒 Accès refusé, redirection vers login');
    next('/auth/login');
  }
  // Si l'utilisateur est connecté ET essaie d'accéder à la page de login
  else if (to.path === '/auth/login' && isAuthenticated) {
    console.log('✅ Déjà connecté, redirection vers dashboard');
    next('/');
  }
  // Sinon, autoriser l'accès
  else {
    console.log('✅ Accès autorisé à:', to.path);
    next();
  }
});

export default router;