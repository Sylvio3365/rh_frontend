<template>
    <div class="liste-conges p-6">
        <!-- En-tête -->
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Gestion des Congés
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
                Suivi et validation des demandes de congés
            </p>
        </div>

        <!-- Actions et Filtres -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div class="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                <div class="flex gap-3">
                    <button @click="$router.push('/conges/nouveau')"
                        class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center">
                        <Icon icon="mdi:plus" class="mr-2" />
                        Nouvelle Demande
                    </button>
                    <button @click="afficherFiltres = !afficherFiltres"
                        class="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                        <Icon icon="mdi:filter" class="mr-2" />
                        Filtres
                    </button>
                </div>

                <!-- Filtres avancés -->
                <transition name="slide-down">
                    <div v-if="afficherFiltres" class="flex flex-wrap gap-4 w-full lg:w-auto">
                        <select v-model="filtres.statut"
                            class="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">
                            <option value="">Tous les statuts</option>
                            <option value="en-attente">En attente</option>
                            <option value="valide">Validé</option>
                            <option value="refuse">Refusé</option>
                            <option value="annule">Annulé</option>
                        </select>

                        <select v-model="filtres.type"
                            class="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">
                            <option value="">Tous les types</option>
                            <option value="payes">Congés Payés</option>
                            <option value="maladie">Congés Maladie</option>
                            <option value="exceptionnel">Congés Exceptionnels</option>
                            <option value="sans-solde">Sans Solde</option>
                        </select>

                        <input v-model="filtres.recherche" type="text" placeholder="Rechercher..."
                            class="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">

                        <button @click="reinitialiserFiltres"
                            class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                            Réinitialiser
                        </button>
                    </div>
                </transition>
            </div>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ statistiques.total }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Total</div>
                    </div>
                    <Icon icon="mdi:calendar-multiple" class="text-blue-500 text-xl" />
                </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ statistiques.enAttente
                            }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">En attente</div>
                    </div>
                    <Icon icon="mdi:clock-outline" class="text-yellow-500 text-xl" />
                </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ statistiques.valides }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Validés</div>
                    </div>
                    <Icon icon="mdi:check-circle" class="text-green-500 text-xl" />
                </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-2xl font-bold text-red-600 dark:text-red-400">{{ statistiques.refuses }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">Refusés</div>
                    </div>
                    <Icon icon="mdi:close-circle" class="text-red-500 text-xl" />
                </div>
            </div>
        </div>

        <!-- Liste des congés -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Employé
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Période
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Type
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Durée
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Statut
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Workflow
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="conge in congesFiltres" :key="conge.id"
                            class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <img :src="conge.photo" :alt="conge.nom"
                                        class="h-10 w-10 rounded-full object-cover">
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                                            {{ conge.prenom }} {{ conge.nom }}
                                        </div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400">
                                            {{ conge.departement }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(conge.dateDebut) }}
                                </div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">au {{ formatDate(conge.dateFin) }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs font-medium rounded-full"
                                    :class="getCouleurType(conge.type)">
                                    {{ getNomType(conge.type) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {{ conge.duree }} jour(s)
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs font-medium rounded-full"
                                    :class="getCouleurStatut(conge.statut)">
                                    {{ getNomStatut(conge.statut) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex -space-x-2">
                                    <div v-for="etape in conge.workflow" :key="etape.id" :class="[
                                        'w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs',
                                        etape.statut === 'termine' ? 'bg-green-500 text-white' :
                                            etape.statut === 'encours' ? 'bg-primary text-white' :
                                                'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                                    ]" :title="etape.nom">
                                        {{ etape.ordre }}
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex gap-2">
                                    <button v-if="conge.statut === 'en-attente'" @click="validerConge(conge.id)"
                                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                        title="Valider">
                                        <Icon icon="mdi:check" />
                                    </button>
                                    <button v-if="conge.statut === 'en-attente'" @click="refuserConge(conge.id)"
                                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                        title="Refuser">
                                        <Icon icon="mdi:close" />
                                    </button>
                                    <button @click="voirDetails(conge.id)"
                                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                        title="Détails">
                                        <Icon icon="mdi:eye" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div class="text-sm text-gray-700 dark:text-gray-300">
                    Affichage de {{ congesFiltres.length }} sur {{ conges.length }} demandes
                </div>
                <div class="flex gap-2">
                    <button
                        class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm">Précédent</button>
                    <button class="px-3 py-1 bg-primary text-white rounded text-sm">Suivant</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
    name: "ListeConges",
    components: {
        Icon,
    },
    data() {
        return {
            afficherFiltres: false,
            filtres: {
                statut: '',
                type: '',
                recherche: ''
            },
            conges: [
                {
                    id: 1,
                    nom: "Dubois",
                    prenom: "Marie",
                    photo: require("@/assets/img/user1.png"),
                    departement: "IT",
                    type: "payes",
                    dateDebut: "2024-12-20",
                    dateFin: "2024-12-27",
                    duree: 8,
                    statut: "en-attente",
                    motif: "Vacances de Noël en famille",
                    workflow: [
                        { id: 1, ordre: 1, nom: 'Soumission', statut: 'termine' },
                        { id: 2, ordre: 2, nom: 'Manager', statut: 'encours' },
                        { id: 3, ordre: 3, nom: 'RH', statut: 'attente' }
                    ]
                },
                {
                    id: 2,
                    nom: "Martin",
                    prenom: "Pierre",
                    photo: require("@/assets/img/user2.png"),
                    departement: "Management",
                    type: "maladie",
                    dateDebut: "2024-11-15",
                    dateFin: "2024-11-18",
                    duree: 4,
                    statut: "valide",
                    motif: "Grippe saisonnière",
                    workflow: [
                        { id: 1, ordre: 1, nom: 'Soumission', statut: 'termine' },
                        { id: 2, ordre: 2, nom: 'Manager', statut: 'termine' },
                        { id: 3, ordre: 3, nom: 'RH', statut: 'termine' }
                    ]
                },
                {
                    id: 3,
                    nom: "Laurent",
                    prenom: "Sophie",
                    photo: require("@/assets/img/user3.png"),
                    departement: "RH",
                    type: "exceptionnel",
                    dateDebut: "2024-12-05",
                    dateFin: "2024-12-06",
                    duree: 2,
                    statut: "refuse",
                    motif: "Mariage frère",
                    workflow: [
                        { id: 1, ordre: 1, nom: 'Soumission', statut: 'termine' },
                        { id: 2, ordre: 2, nom: 'Manager', statut: 'termine' },
                        { id: 3, ordre: 3, nom: 'RH', statut: 'termine' }
                    ]
                }
            ]
        };
    },
    computed: {
        congesFiltres() {
            return this.conges.filter(conge => {
                const matchStatut = !this.filtres.statut || conge.statut === this.filtres.statut;
                const matchType = !this.filtres.type || conge.type === this.filtres.type;
                const matchRecherche = !this.filtres.recherche ||
                    `${conge.prenom} ${conge.nom}`.toLowerCase().includes(this.filtres.recherche.toLowerCase()) ||
                    conge.motif.toLowerCase().includes(this.filtres.recherche.toLowerCase());

                return matchStatut && matchType && matchRecherche;
            });
        },
        statistiques() {
            return {
                total: this.conges.length,
                enAttente: this.conges.filter(c => c.statut === 'en-attente').length,
                valides: this.conges.filter(c => c.statut === 'valide').length,
                refuses: this.conges.filter(c => c.statut === 'refuse').length
            };
        }
    },
    methods: {
        formatDate(date) {
            return new Date(date).toLocaleDateString('fr-FR');
        },
        getCouleurType(type) {
            const couleurs = {
                'payes': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                'maladie': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                'exceptionnel': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
                'sans-solde': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            };
            return couleurs[type] || 'bg-gray-100 text-gray-800';
        },
        getNomType(type) {
            const noms = {
                'payes': 'Congés Payés',
                'maladie': 'Congés Maladie',
                'exceptionnel': 'Exceptionnels',
                'sans-solde': 'Sans Solde'
            };
            return noms[type] || type;
        },
        getCouleurStatut(statut) {
            const couleurs = {
                'en-attente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                'valide': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                'refuse': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                'annule': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            };
            return couleurs[statut] || 'bg-gray-100 text-gray-800';
        },
        getNomStatut(statut) {
            const noms = {
                'en-attente': 'En attente',
                'valide': 'Validé',
                'refuse': 'Refusé',
                'annule': 'Annulé'
            };
            return noms[statut] || statut;
        },
        reinitialiserFiltres() {
            this.filtres = {
                statut: '',
                type: '',
                recherche: ''
            };
        },
        validerConge(id) {
            if (confirm('Confirmer la validation de cette demande ?')) {
                alert(`Demande ${id} validée avec succès`);
            }
        },
        refuserConge(id) {
            if (confirm('Confirmer le refus de cette demande ?')) {
                alert(`Demande ${id} refusée`);
            }
        },
        voirDetails(id) {
            this.$router.push(`/conges/${id}`);
        }
    }
};
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s ease;
    max-height: 200px;
    overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
    max-height: 0;
    opacity: 0;
}
</style>