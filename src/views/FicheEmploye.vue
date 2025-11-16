<template>
    <div class="fiche-employe p-4">
        <div class="mb-4">
            <button @click="$router.back()" class="flex items-center text-primary hover:text-primary/80">
                <Icon icon="heroicons:arrow-left-20-solid" class="mr-2" />
                Retour à la liste
            </button>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
            <div v-if="employe" class="flex items-start space-x-6">
                <!-- Photo -->
                <div class="flex-shrink-0">
                    <img :src="employe.photo" :alt="employe.nom"
                        class="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600">
                </div>

                <!-- Informations -->
                <div class="flex-1">
                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {{ employe.prenom }} {{ employe.nom }}
                    </h1>
                    <p class="text-lg text-gray-600 dark:text-gray-400 mb-1">
                        {{ employe.poste }}
                    </p>
                    <p class="text-gray-500 dark:text-gray-500">
                        {{ employe.departement }}
                    </p>

                    <div class="mt-4">
                        <span :class="[
                            'px-3 py-1 rounded-full text-sm font-medium',
                            employe.statut === 'Actif' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                employe.statut === 'En congé' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        ]">
                            {{ employe.statut }}
                        </span>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">Employé non trouvé</p>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
    name: "FicheEmploye",
    components: {
        Icon,
    },
    data() {
        return {
            employe: null
        };
    },
    mounted() {
        this.chargerEmploye();
    },
    methods: {
        chargerEmploye() {
            // Simuler le chargement des données
            const employes = [
                {
                    id: 1,
                    nom: "Dubois",
                    prenom: "Marie",
                    poste: "Développeuse Frontend",
                    departement: "IT",
                    statut: "Actif",
                    photo: require("@/assets/img/user1.png")
                },
                // ... autres employés
            ];

            this.employe = employes.find(e => e.id === parseInt(this.$route.params.id));
        }
    }
};
</script>