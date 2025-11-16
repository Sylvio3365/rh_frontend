<template>
    <div class="liste-employes p-4">
        <div class="mt-2 w-full">
            <div class="lg:flex grid-cols-1 lg:space-y-0 space-y-3 gap-5 justify-between">
                <div>
                    <p class="uppercase text-xs text-gray-700 font-semibold">Gestion des employés</p>
                    <h1 class="text-2xl text-gray-900 dark:text-gray-200 font-medium">
                        Liste des Employés
                    </h1>
                </div>
                <div class="flex gap-2">
                    <button
                        class="bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700 border rounded py-2 px-5">
                        Filtrer
                    </button>
                    <button
                        class="bg-primary border flex gap-2 text-white hover:bg-primary/80 dark:border-gray-700 rounded py-3 px-5">
                        <span class="icon text-2xl">
                            <Icon icon="ic:twotone-plus" />
                        </span>
                        <span class="text"> Nouvel Employé</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Liste des employés -->
        <div class="mt-5 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
            <div class="p-5">
                <h2 class="text-lg font-semibold dark:text-gray-200 mb-4">
                    {{ employes.length }} Employés
                </h2>

                <!-- Barre de recherche -->
                <div class="mb-4">
                    <div class="relative">
                        <input v-model="searchTerm" type="text" placeholder="Rechercher un employé..."
                            class="w-full p-3 pl-10 rounded-lg border dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary">
                        <Icon icon="ic:outline-search" class="absolute left-3 top-3.5 text-gray-400 text-xl" />
                    </div>
                </div>

                <!-- Liste -->
                <div class="space-y-3">
                    <div v-for="employe in filteredEmployes" :key="employe.id" @click="voirFicheEmploye(employe.id)"
                        class="flex items-center p-4 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200">
                        <!-- Photo -->
                        <div class="flex-shrink-0 mr-4">
                            <img :src="employe.photo" :alt="employe.nom"
                                class="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600">
                        </div>

                        <!-- Informations de base -->
                        <div class="flex-1">
                            <h3 class="font-semibold text-gray-900 dark:text-white">
                                {{ employe.prenom }} {{ employe.nom }}
                            </h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                {{ employe.poste }}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {{ employe.departement }}
                            </p>
                        </div>

                        <!-- Statut -->
                        <div class="flex-shrink-0">
                            <span :class="[
                                'px-2 py-1 rounded-full text-xs font-medium',
                                employe.statut === 'Actif' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                    employe.statut === 'En congé' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                            ]">
                                {{ employe.statut }}
                            </span>
                        </div>

                        <!-- Icône flèche -->
                        <div class="flex-shrink-0 ml-4">
                            <Icon icon="heroicons:chevron-right-20-solid" class="text-gray-400 text-lg" />
                        </div>
                    </div>
                </div>

                <!-- Message si aucun résultat -->
                <div v-if="filteredEmployes.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Icon icon="heroicons:user-group-20-solid" class="text-4xl mx-auto mb-2 opacity-50" />
                    <p>Aucun employé trouvé</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
    name: "ListeEmployes",
    components: {
        Icon,
    },
    data() {
        return {
            searchTerm: "",
            employes: [
                {
                    id: 1,
                    nom: "Dubois",
                    prenom: "Marie",
                    poste: "Développeuse Frontend",
                    departement: "IT",
                    statut: "Actif",
                    photo: require("@/assets/img/user1.png")
                },
                {
                    id: 2,
                    nom: "Martin",
                    prenom: "Pierre",
                    poste: "Chef de Projet",
                    departement: "Management",
                    statut: "Actif",
                    photo: require("@/assets/img/user2.png")
                },
                {
                    id: 3,
                    nom: "Laurent",
                    prenom: "Sophie",
                    poste: "Responsable RH",
                    departement: "Ressources Humaines",
                    statut: "En congé",
                    photo: require("@/assets/img/user3.png")
                },
                {
                    id: 4,
                    nom: "Bernard",
                    prenom: "Thomas",
                    poste: "Analyste Data",
                    departement: "IT",
                    statut: "Actif",
                    photo: require("@/assets/img/user4.png")
                },
                {
                    id: 5,
                    nom: "Petit",
                    prenom: "Julie",
                    poste: "Designer UI/UX",
                    departement: "Design",
                    statut: "Actif",
                    photo: require("@/assets/img/user5.png")
                },
                {
                    id: 6,
                    nom: "Moreau",
                    prenom: "David",
                    poste: "Développeur Backend",
                    departement: "IT",
                    statut: "Inactif",
                    photo: require("@/assets/img/user1.png")
                },
                {
                    id: 7,
                    nom: "Simon",
                    prenom: "Claire",
                    poste: "Marketing Manager",
                    departement: "Marketing",
                    statut: "Actif",
                    photo: require("@/assets/img/user3.png")
                },
                {
                    id: 8,
                    nom: "Lefebvre",
                    prenom: "Antoine",
                    poste: "Commercial",
                    departement: "Ventes",
                    statut: "En congé",
                    photo: require("@/assets/img/user2.png")
                }
            ]
        };
    },
    computed: {
        filteredEmployes() {
            if (!this.searchTerm) {
                return this.employes;
            }
            const term = this.searchTerm.toLowerCase();
            return this.employes.filter(employe =>
                employe.nom.toLowerCase().includes(term) ||
                employe.prenom.toLowerCase().includes(term) ||
                employe.poste.toLowerCase().includes(term) ||
                employe.departement.toLowerCase().includes(term)
            );
        }
    },
    methods: {
        voirFicheEmploye(id) {
            this.$router.push(`/employes/${id}`);
        }
    }
};
</script>

<style scoped>
.liste-employes {
    min-height: 100vh;
}
</style>