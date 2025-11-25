<template>
  <!-- this header -->
  <header class="bg-white dark:bg-gray-800 p-2 border-b-2 dark:border-gray-700">
    <div class="wrap-header flex items-center gap-5 justify-between flex-wrap">
      <div class="flex flex-no-shrink items-center">
        <button class="text-gray-500 lg:hidden ml-3 block" @click="$emit('sidebarToggle', true)">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em"
            preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M2.75 12.25h10.5m-10.5-4h10.5m-10.5-4h10.5" />
          </svg>
        </button>
      </div>

      <div class="mr-5 flex gap-3">
        <!-- btn dark mode -->

        <button class="lg:hidden block mr-5 text-2xl text-gray-500 relative">
          <i>
            <Icon icon="ic:outline-search" />
          </i>
        </button>

        <button @click="fullscreenToggle" class="mr-5 text-2xl text-gray-500 relative">
          <i v-if="!fullscreenMode">
            <Icon icon="ic:outline-fullscreen" />
          </i>
          <i v-else>
            <Icon icon="ic:outline-fullscreen-exit" />
          </i>
        </button>

        <button @click="setTheme(true)" class="mr-5 text-2xl text-gray-500" v-if="!darkMode">
          <Icon icon="ph:sun-dim" />
        </button>
        <button @click="setTheme(false)" v-else class="mr-5 text-2xl text-gray-500">
          <Icon icon="ri:moon-fill" />
        </button>
        <!-- btn notification -->
        <button @click="notifToggle" class="mr-5 text-2xl text-gray-500 relative">
          <i class="bg-red-500 rounded-full p-1.5 border border-white dark:border-gray-700 -mt-1 absolute"></i>
          <Icon icon="clarity:notification-line" />
        </button>

        <transition name="fade">
          <div id="notificaitons" v-show="notification"
            class="block absolute lg:right-56 right-28 mt-12 z-50 w-96 border dark:border-gray-700 bg-white dark:bg-gray-800 rounded divide-y dark:divide-gray-700 divide-gray-100 shadow">
            <!-- head notification -->
            <div class="flex justify-between p-3 text-gray-800 dark:text-gray-300">
              <h2>Notifications</h2>
              <button class="text-blue-500 text-sm">Tout marquer comme lu</button>
            </div>
            <div class="p-5 text-center" v-if="!notifList.length">
              <p class="text-gray-800 dark:text-gray-300">
                Aucune notification pour le moment.
              </p>
            </div>
            <div class="p-2 pl-3 w-full" v-for="(item, index) in notifList" :key="index">
              <div class="flex gap-5">
                <div>
                  <img class="w-9 rounded-full" :src="imageAssets(item.image)" alt="" />
                </div>
                <div class="mt-1">
                  <div class="flex gap-3">
                    <h2 class="dark:text-gray-200">{{ item.name }}</h2>
                    <p class="dark:text-gray-500 text-gray-400 text-xs">
                      {{ limitText(item.message) }}
                    </p>
                  </div>
                  <p class="text-sm dark:text-gray-500 text-gray-400">
                    {{ item.hours }}
                  </p>
                </div>
              </div>
            </div>
            <div class="p-2">
              <button class="w-full p-2 text-gray-800 dark:text-gray-300">
                Voir tout
              </button>
            </div>
          </div>
        </transition>

        <button @blur="menuToggleBlur" @click="menuToggle">
          <div class="user-avatar flex p-1 cursor-pointer rounded-md">
            <div>
              <img :src="userAvatar" class="rounded-full mr-4 w-10 h-10 p-1 ring-1 ring-gray-300 dark:ring-gray-500"
                alt="Avatar utilisateur" />
            </div>
            <div class="text-left lg:block md:block hidden">
              <h2 class="dark:text-white text-gray-800">Bonjour, {{ userName }}</h2>
              <p class="text-xs text-gray-400 dark:text-gray-500">
                {{ userRole }}
              </p>
            </div>
          </div>
        </button>

        <transition name="fade">
          <div id="dropdownSmall" v-show="menu"
            class="block absolute right-10 mt-12 z-50 w-52 border dark:border-gray-700 bg-white dark:bg-gray-800 rounded divide-y dark:divide-gray-700 divide-gray-100 shadow">
            <div class="py-3 px-4 text-sm text-gray-900 dark:text-gray-200">
              <div>Connecté en tant que</div>
              <div class="font-medium truncate">{{ user?.username || 'Utilisateur' }}</div>
              <div v-if="user?.personnel" class="text-xs text-gray-500 mt-1">
                {{ user.personnel.prenom }} {{ user.personnel.nom }}
              </div>
            </div>
            <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSmallButton">
              <li>
                <a href="#" class="block py-2 px-4 hover:bg-primary hover:text-white">Profil utilisateur</a>
              </li>
              <li>
                <a href="#" class="block py-2 px-4 hover:bg-primary hover:text-white">Paramètres</a>
              </li>
            </ul>
            <div class="py-1">
              <button @click="handleLogout"
                class="block w-full text-left py-2 px-4 text-sm text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white">
                Se déconnecter
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script>
import { Icon } from "@iconify/vue";
import { fullscreen } from "@/helper/fullscreen";
import { setDarkMode, loadDarkMode } from "@/helper/theme";
import AuthService from "@/services/authservice";

export default {
  data() {
    return {
      menu: false,
      darkMode: false,
      notification: false,
      fullscreenMode: false,
      user: null,

      notifList: [
        {
          name: "Elizabeth Begum",
          image: "user1.png",
          message:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora culpa blanditiis neque animi sequi sunt incidunt beatae? Aperiam facilis consectetur,",
          hours: "Il y a 12 heures",
        },
        {
          name: "Ethan Roger",
          image: "user2.png",
          message:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora culpa blanditiis neque animi sequi sunt incidunt beatae? Aperiam facilis consectetur,",
          hours: "Il y a 12 heures",
        },
        {
          name: "Taylor neal",
          image: "user4.png",
          message:
            "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora culpa blanditiis neque animi sequi sunt incidunt beatae? Aperiam facilis consectetur,",
          hours: "Il y a 2 jours",
        },
      ],
    };
  },
  components: {
    Icon,
  },
  computed: {
    userName() {
      if (this.user?.personnel) {
        return this.user.personnel.prenom;
      }
      return this.user?.username || 'Utilisateur';
    },
    userRole() {
      // Vous pouvez adapter cette logique selon vos besoins
      if (this.user?.username === 'admin') {
        return 'Administrateur';
      }
      return this.user?.personnel ? 'Employé' : 'Utilisateur';
    },
    userAvatar() {
      // Vous pouvez adapter l'avatar selon l'utilisateur
      return require("@/assets/img/user.jpg");
    }
  },
  watch: {
    $route() {
      this.menu = false;
      this.notification = false;
    },
  },
  methods: {
    fullscreen,
    setDarkMode,
    loadDarkMode,

    menuToggle: function () {
      this.menu = !this.menu;
    },
    menuToggleBlur: function () {
      this.menu = false;
    },
    notifToggle: function () {
      this.notification = !this.notification;
    },
    notifToggleBlur: function () {
      this.notification = false;
    },
    limitText(message) {
      const text =
        message.length > 25 ? message.substring(0, 25) + "..." : message;
      return text;
    },
    fullscreenToggle() {
      this.fullscreenMode = !this.fullscreenMode;
      this.fullscreen(this.fullscreenMode);
    },
    // set theme to dark and light
    setTheme(bool) {
      this.darkMode = bool;
      this.setDarkMode(bool);
    },

    imageAssets(url) {
      return require("@/assets/img/" + url);
    },

    async handleLogout() {
      try {
        await AuthService.logout();

        // Nettoyer le localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');

        // Rediriger vers la page de login
        this.$router.push('/auth/login');
      } catch (error) {
        console.error('Logout error:', error);
        // Nettoyer quand même le localStorage même en cas d'erreur
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        this.$router.push('/auth/login');
      }
    },

    loadUserData() {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    }
  },
  mounted() {
    this.darkMode = this.loadDarkMode();
    this.loadUserData();

    document.onfullscreenchange = (event) => {
      if (document.fullscreenElement) {
        this.fullscreenMode = true;
      } else {
        this.fullscreenMode = false;
      }
    };
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>