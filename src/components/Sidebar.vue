<template>
  <!-- sidebar -->
  <nav class="sidebar bg-white dark:bg-gray-800">
    <!-- sidebar head -->
    <div class="sidebar-head p-4">
      <div class="flex justify-center">
        <router-link to="/" exact class="flex">
          <img class="w-8 mt-1" src="@/assets/logo/logo.svg" alt="logo ERP RH" />
        </router-link>
      </div>
      <button class="lg:hidden block dark:text-gray-400 float-right -mt-7" @click="$emit('sidebarToggle')">
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="25px" height="25px"
          preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
          <path fill="currentColor"
            d="M7.219 5.781L5.78 7.22L14.563 16L5.78 24.781l1.44 1.439L16 17.437l8.781 8.782l1.438-1.438L17.437 16l8.782-8.781L24.78 5.78L16 14.563z" />
        </svg>
      </button>
    </div>
    <!-- sidebar list -->
    <div class="sidebar-list p-4 mt-4 divide-y dark:divide-gray-700">
      <div class="pb-5">
        <p class="font-medium text-gray-400 dark:text-gray-400">Menu Principal</p>
        <div class="wrap-item mt-4 dark:text-gray-500">
          <div class="item">
            <router-link to="/" exact
              class="w-full flex text-left rounded-md box-border p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
              <span class="mr-3 text-xl">
                <Icon icon="bxs:dashboard" />
              </span>
              <span class="w-full"> Tableau de bord </span>
            </router-link>
          </div>
          <div class="item">
            <router-link to="/pointage" exact
              class="w-full flex text-left rounded-md box-border p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
              <span class="mr-3 text-xl">
                <Icon icon="bxs:dashboard" />
              </span>
              <span class="w-full"> Pointage </span>
            </router-link>
          </div>
          <div class="item">
            <router-link to="/historique" exact
              class="w-full flex text-left rounded-md box-border p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
              <span class="mr-3 text-xl">
                <Icon icon="bxs:dashboard" />
              </span>
              <span class="w-full"> Historique Pointage </span>
            </router-link>
          </div>
          <div class="item">
            <router-link to="/presence" exact
              class="w-full flex text-left rounded-md box-border p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
              <span class="mr-3 text-xl">
                <Icon icon="bxs:dashboard" />
              </span>
              <span class="w-full"> Présence </span>
            </router-link>
          </div>
          <div class="item">
            <router-link to="/heures-sup" exact
              class="w-full flex text-left rounded-md box-border p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
              <span class="mr-3 text-xl">
                <Icon icon="bxs:dashboard" />
              </span>
              <span class="w-full"> Heure Supplémentaires </span>
            </router-link>
          </div>
          <div class="item mt-3">
            <menu-accordion>
              <template v-slot:icon>
                <Icon icon="mdi:account-group" />
              </template>
              <template v-slot:title> Gestion des Employés </template>
              <template v-slot:content>
                <router-link to="/employes/ajouter"
                  class="w-full text-left block rounded-md p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                  Ajouter un employé
                </router-link>
                <router-link to="/employes/liste"
                  class="w-full text-left block rounded-md p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                  Liste des employés
                </router-link>
              </template>
            </menu-accordion>
          </div>
          <div class="item mt-3">
            <menu-accordion>
              <template v-slot:icon>
                <Icon icon="mdi:calendar-clock" />
              </template>
              <template v-slot:title> Gestion des Congés </template>
              <template v-slot:content>
                <router-link to="/conges/demandes"
                  class="w-full text-left block rounded-md p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                  Demandes de congés
                </router-link>
                <router-link to="/conges/liste"
                  class="w-full text-left block rounded-md p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                  Liste des congés
                </router-link>
                <router-link to="/conges/calendrier"
                  class="w-full text-left block rounded-md p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                  Calendrier
                </router-link>
              </template>
            </menu-accordion>
          </div>
          <div class="item mt-3">
            <menu-accordion>
              <template v-slot:icon>
                <Icon icon="mdi:account-tie" />
              </template>
              <template v-slot:title> Gestion des Postes </template>
              <template v-slot:content>
                <router-link to="/postes/liste"
                  class="w-full text-left block rounded-md p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                  Liste des postes
                </router-link>
                <router-link to="/postes/creation"
                  class="w-full text-left block rounded-md p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                  Créer un poste
                </router-link>
                <router-link to="/postes/organigramme"
                  class="w-full text-left block rounded-md p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                  Organigramme
                </router-link>
                <router-link to="/postes/competences"
                  class="w-full text-left block rounded-md p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                  Compétences requises
                </router-link>
              </template>
            </menu-accordion>
          </div>
        </div>
      </div>
      <div class="pb-5">
        <p class="font-medium text-gray-400 mt-4 dark:text-gray-400">
          Administration
        </p>

        <div class="item mt-3">
          <menu-accordion>
            <template v-slot:icon>
              <Icon icon="mdi:file-document-multiple" />
            </template>
            <template v-slot:title> Documents </template>
            <template v-slot:content>
              <router-link to="/documents/contrats"
                class="w-full text-left block rounded-md p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                Contrats types
              </router-link>
              <router-link to="/documents/attestations"
                class="w-full text-left block rounded-md p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                Attestations
              </router-link>
              <router-link to="/documents/modeles"
                class="w-full text-left block rounded-md p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                Modèles de documents
              </router-link>
            </template>
          </menu-accordion>
        </div>

        <div class="item mt-3">
          <menu-accordion>
            <template v-slot:icon>
              <Icon icon="mdi:cog" />
            </template>
            <template v-slot:title> Paramètres </template>
            <template v-slot:content>
              <router-link to="/parametres/entreprise"
                class="w-full text-left block rounded-md p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                Informations entreprise
              </router-link>
              <router-link to="/parametres/utilisateurs"
                class="w-full text-left block rounded-md p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                Utilisateurs système
              </router-link>
              <router-link to="/parametres/droits"
                class="w-full text-left block rounded-md p-3 hover:bg-gray-200 dark:hover:bg-gray-700">
                Droits d'accès
              </router-link>
            </template>
          </menu-accordion>
        </div>

        <div class="item mt-3">
          <router-link to="/rapports">
            <button
              class="text-gray-800 dark:text-gray-500 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 w-full flex text-left rounded-md box-border p-3">
              <span class="mr-3 text-xl">
                <Icon icon="mdi:chart-box" />
              </span>
              <span class="w-full"> Rapports </span>
              <span class="box-border mt-1 text-gray-500"> </span>
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { Icon } from "@iconify/vue";
import MenuAccordion from "./MenuAccordion.vue";
export default {
  components: {
    Icon,
    MenuAccordion,
  },
};
</script>