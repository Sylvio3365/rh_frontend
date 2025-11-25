<template>
    <div class="hello-container">
        <h1>Test de l'API Spring Boot</h1>

        <div class="card">
            <h2>Endpoint /auth/hello</h2>
            <button @click="callHelloAPI" :disabled="loading" class="btn">
                {{ loading ? 'Chargement...' : 'Tester /auth/hello' }}
            </button>

            <div v-if="apiResponse" class="response">
                <h3>Réponse de l'API :</h3>
                <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>

                <div class="status" :class="isSuccess ? 'success' : 'error'">
                    Statut: {{ isSuccess ? '✅ Succès' : '❌ Erreur' }}
                </div>
                <div class="message">
                    Message: {{ apiResponse.message || apiResponse.msg || '—' }}
                </div>
                <div v-if="apiResponse.error" class="error-message">
                    Erreur: {{ apiResponse.error }}
                </div>
            </div>

            <div v-if="error" class="error">
                ❌ Erreur: {{ error }}
            </div>
        </div>
    </div>
</template>

<script>
// IMPORT CORRIGÉ - utiliser le bon chemin vers authservice
import AuthService from '../services/authservice';

export default {
    name: 'HelloWorld',
    data() {
        return {
            loading: false,
            apiResponse: null,
            error: ''
        };
    },
    computed: {
        isSuccess() {
            if (!this.apiResponse) return false;
            // accepter boolean ou string et plusieurs clés possibles
            return this.apiResponse.succes === true
                || this.apiResponse.succes === 'true'
                || this.apiResponse.success === true
                || this.apiResponse.success === 'true';
        }
    },
    methods: {
        async callHelloAPI() {
            this.loading = true;
            this.apiResponse = null;
            this.error = '';

            try {
                // AuthService.hello() retourne response.data (objet JSON)
                const response = await AuthService.hello();
                this.apiResponse = response;
                console.log('Réponse API:', response);
            } catch (err) {
                // gérer axios error structure si présent
                this.error = err?.response?.data?.message || err?.message || 'Erreur de connexion à l\'API';
                console.error('Erreur API:', err);
            } finally {
                this.loading = false;
            }
        }
    },
    mounted() {
        console.log('Component mounted, prêt à tester l\'API');
        console.log('URL backend:', process.env.VUE_APP_API_BASE_URL || 'http://localhost:9090');
    }
};
</script>
