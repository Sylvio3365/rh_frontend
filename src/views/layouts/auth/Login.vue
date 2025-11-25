<template>
  <div class="w-full h-screen">
    <div class="flex shadow rounded-md h-screen">
      <div class="bg-white dark:bg-gray-900 w-full">
        <form @submit.prevent="handleLogin">
          <div class="form-body lg:max-w-xl mx-auto lg:p-20 p-8 lg:mt-20 mt-5 space-y-8">
            <div class="form-head cursor-pointer flex justify-center" @click="$router.push('/')">
              <img src="../../../assets/logo/logo.svg" alt="Logo ERP" class="w-10" />
            </div>
            <div class="space-y-3 text-center">
              <h2 class="dark:text-white font-semibold text-gray-800 text-4xl">
                <span class="text-primary">Bienvenue</span>
              </h2>
              <p class="dark:text-gray-400 text-gray-700">
                Veuillez saisir vos identifiants pour continuer.
              </p>
            </div>
            <div class="space-y-5">
              <div class="relative z-0 w-full mb-6 group">
                <input type="text" name="username" id="floating_email" v-model="credentials.username"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-primary focus:outline-none focus:ring-0 focus:border-primary peer"
                  placeholder=" " required :disabled="loading" />
                <label for="floating_email"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Nom d'utilisateur
                </label>
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input type="password" name="password" id="floating_password" v-model="credentials.password"
                  class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-primary focus:outline-none focus:ring-0 focus:border-primary peer"
                  placeholder=" " required :disabled="loading" />
                <label for="floating_password"
                  class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-primary peer-focus:dark:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Mot de passe
                </label>
              </div>
            </div>

            <button type="submit" :disabled="loading"
              class="text-white bg-primary hover:bg-primary/80 p-3 w-full rounded-md flex justify-center items-center"
              :class="{ 'opacity-50 cursor-not-allowed': loading }">
              <span v-if="loading" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Connexion...
              </span>
              <span v-else>Se connecter</span>
            </button>
          </div>
        </form>
      </div>
      <div class="bg-wave dark:bg-gray-900 bg-white w-2/5 lg:block hidden"></div>
    </div>

    <!-- Modal d'erreur -->
    <div v-if="showErrorModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
        <div class="flex items-center justify-between p-6 border-b">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="ml-3 text-lg font-medium text-gray-900">Erreur de connexion</h3>
          </div>
          <button @click="showErrorModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <p class="text-gray-700">{{ error }}</p>
        </div>
        <div class="bg-gray-50 px-6 py-3 flex justify-end rounded-b-lg">
          <button @click="showErrorModal = false"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors">
            Fermer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de succès -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all">
        <div class="flex items-center justify-between p-6 border-b">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="ml-3 text-lg font-medium text-gray-900">Connexion réussie</h3>
          </div>
          <button @click="showSuccessModal = false" class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <p class="text-gray-700">Vous êtes maintenant connecté. Redirection en cours...</p>
        </div>
        <div class="bg-gray-50 px-6 py-3 flex justify-end rounded-b-lg">
          <button @click="showSuccessModal = false"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '@/services/authservice';

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const credentials = ref({
      username: '',
      password: ''
    });
    const loading = ref(false);
    const error = ref('');
    const showErrorModal = ref(false);
    const showSuccessModal = ref(false);

    const handleLogin = async () => {
      error.value = '';
      showErrorModal.value = false;
      showSuccessModal.value = false;

      // Validation simple
      if (!credentials.value.username || !credentials.value.password) {
        error.value = 'Veuillez remplir tous les champs';
        showErrorModal.value = true;
        return;
      }

      loading.value = true;

      try {
        const response = await AuthService.login(
          credentials.value.username,
          credentials.value.password
        );

        if (response.success) {
          // Stocker les informations utilisateur dans le localStorage
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('isAuthenticated', 'true');

          // Afficher le modal de succès
          showSuccessModal.value = true;

          // Redirection après 2 secondes
          setTimeout(() => {
            router.push('/');
          }, 2000);

        } else {
          error.value = response.message || 'Erreur de connexion';
          showErrorModal.value = true;
        }
      } catch (err) {
        error.value = err.message || 'Une erreur est survenue lors de la connexion';
        showErrorModal.value = true;
        console.error('Login error:', err);
      } finally {
        loading.value = false;
      }
    };

    // Vérifier si l'utilisateur est déjà connecté
    onMounted(async () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      if (isAuthenticated === 'true') {
        try {
          const response = await AuthService.checkAuth();
          if (response.success) {
            router.push('/');
          } else {
            // Si la session a expiré, nettoyer le localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
          }
        } catch (error) {
          console.log('Auth check failed, user not authenticated');
        }
      }
    });

    return {
      credentials,
      loading,
      error,
      showErrorModal,
      showSuccessModal,
      handleLogin
    };
  }
};
</script>

<style>
/* custom pattern https://superdesigner.co/tools/css-backgrounds */
.bg-wave {
  background: radial-gradient(circle at top left,
      transparent 25%,
      #4f46e5 25.5%,
      #4f46e5 36%,
      transparent 37%,
      transparent 100%),
    radial-gradient(circle at bottom right,
      transparent 34%,
      #4f46e5 34.5%,
      #4f46e5 45.5%,
      transparent 46%,
      transparent 100%);
  background-size: 6em 6em;
  opacity: 1;
}

/* Animation pour les modals */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>