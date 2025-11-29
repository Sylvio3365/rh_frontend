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
                    <button @click="$router.push('/conges/demandes')"
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
                            <option value="1">En attente</option>
                            <option value="2">Validé</option>
                            <option value="3">Refusé</option>
                            <option value="4">Annulé</option>
                        </select>

                        <select v-model="filtres.type"
                            class="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">
                            <option value="">Tous les types</option>
                            <option value="maladie">Maladie</option>
                            <option value="exceptionnel">Exceptionnel</option>
                            <option value="annuel">Annuel</option>
                            <option value="paternité">Paternité</option>
                            <option value="formation">Formation</option>
                        </select>

                        <input v-model="filtres.recherche" type="text" placeholder="Rechercher un employé..."
                            class="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">

                        <button @click="reinitialiserFiltres"
                            class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
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
                        <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{{ statistiques.enAttente }}</div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">En attente</div>
                    </div>
                    <Icon icon="mdi:clock-outline" class="text-yellow-500 text-xl" />
                </div>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ statistiques.valides }}</div>
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

        <!-- Message si aucune donnée -->
        <div v-if="isLoading" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8 text-center">
            <Icon icon="mdi:loading" class="text-4xl text-primary animate-spin mx-auto mb-4" />
            <p class="text-gray-600 dark:text-gray-400">Chargement des demandes...</p>
        </div>

        <div v-else-if="congesFiltres.length === 0" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8 text-center">
            <Icon icon="mdi:calendar-remove" class="text-6xl text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 dark:text-gray-400" v-if="conges.length === 0">
                Aucune demande de congé pour le moment
            </p>
            <p class="text-gray-600 dark:text-gray-400" v-else>
                Aucune demande ne correspond aux filtres sélectionnés
            </p>
        </div>

        <!-- Liste des congés -->
        <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employé</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Période</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Durée</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Workflow</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="conge in congesFiltres" :key="conge.idDemande"
                            class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <img :src="getPhotoUrl(conge.personnel?.photo)" 
                                         :alt="conge.personnel?.nom || 'Employé'"
                                         class="h-10 w-10 rounded-full object-cover">
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                                            {{ conge.personnel?.prenom }} {{ conge.personnel?.nom }}
                                        </div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400">
                                            {{ conge.personnel?.categoriePersonnel?.libelle || 'N/A' }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(conge.debut) }}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">au {{ formatDate(conge.fin) }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs font-medium rounded-full"
                                    :class="getCouleurType(conge.typeConge?.libelle)">
                                    {{ getNomType(conge.typeConge?.libelle) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {{ calculerDuree(conge.debut, conge.fin) }} jour(s)
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 py-1 text-xs font-medium rounded-full"
                                    :class="getCouleurStatut(conge.etat)">
                                    {{ getNomStatut(conge.etat) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex -space-x-2">
                                    <div v-for="(etape, index) in getWorkflow(conge.etat)" :key="index" :class="[
                                        'w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs',
                                        etape.statut === 'termine' ? 'bg-green-500 text-white' :
                                            etape.statut === 'encours' ? 'bg-primary text-white' :
                                                'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                                    ]" :title="etape.nom">
                                        {{ index + 1 }}
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex gap-2">
                                    <button v-if="conge.etat === 1" @click="validerConge(conge.idDemande)"
                                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                                        title="Valider">
                                        <Icon icon="mdi:check" class="w-5 h-5" />
                                    </button>
                                    <button v-if="conge.etat === 1" @click="refuserConge(conge.idDemande)"
                                        class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                        title="Refuser">
                                        <Icon icon="mdi:close" class="w-5 h-5" />
                                    </button>
                                    <button @click="voirDetails(conge.idDemande)"
                                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        title="Détails">
                                        <Icon icon="mdi:eye" class="w-5 h-5" />
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
                    <button class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700">Précédent</button>
                    <button class="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90">Suivant</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import DemandeService from "@/services/DemandeService";

export default {
    name: "ListeConges",
    components: { Icon },

    data() {
        return {
            afficherFiltres: false,
            isLoading: false,
            filtres: {
                statut: '',
                type: '',
                recherche: ''
            },
            conges: []
        };
    },

    mounted() {
        this.chargerDemandes();
    },

    methods: {
        async chargerDemandes() {
            this.isLoading = true;
            try {
                const response = await DemandeService.getAllDemandes();
                console.log('Demandes chargées:', response);
                this.conges = Array.isArray(response) ? response : [];
            } catch (error) {
                console.error("Erreur lors du chargement des demandes:", error);
                alert("Impossible de charger les demandes de congé. Veuillez réessayer.");
                this.conges = [];
            } finally {
                this.isLoading = false;
            }
        },

        getPhotoUrl(photo) {
            if (!photo) return '/assets/img/default-user.png';
            if (photo.startsWith('http')) return photo;
            return `/assets/img/personnel/${photo}`;
        },

        calculerDuree(dateDebut, dateFin) {
            if (!dateDebut || !dateFin) return 0;
            const debut = new Date(dateDebut);
            const fin = new Date(dateFin);
            const diffTime = Math.abs(fin - debut);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        },

        formatDate(date) {
            if (!date) return 'N/A';
            return new Date(date).toLocaleDateString('fr-FR');
        },

        getCouleurType(libelle) {
            if (!libelle) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            
            const couleurs = {
                'maternité': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
                'paternité': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                'annuel': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                'maladie': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                'formation': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
                'exceptionnel': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            };
            return couleurs[libelle.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        },

        getNomType(libelle) {
            if (!libelle) return 'N/A';
            
            const noms = {
                'maladie': 'Maladie',
                'exceptionnel': 'Exceptionnel',
                'annuel': 'Annuel',
                'paternité': 'Paternité',
                'formation': 'Formation'
            };
            return noms[libelle] || libelle;
        },

        getCouleurStatut(etat) {
            const couleurs = {
                1: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                2: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                3: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                4: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            };
            return couleurs[etat] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        },

        getNomStatut(etat) {
            const noms = {
                1: 'En attente',
                2: 'Validé',
                3: 'Refusé',
                4: 'Annulé'
            };
            return noms[etat] || 'Inconnu';
        },

        getWorkflow(etat) {
            const workflow = [
                { nom: 'Soumission', statut: 'termine' },
                { nom: 'Validation Manager', statut: etat === 1 ? 'encours' : 'termine' },
                { nom: 'Validation RH', statut: etat === 2 ? 'termine' : 'attente' },
                { nom: 'Approbation', statut: etat === 2 ? 'termine' : 'attente' }
            ];
            return workflow;
        },

        reinitialiserFiltres() {
            this.filtres = { statut: '', type: '', recherche: '' };
        },

        async validerConge(id) {
            if (confirm('Confirmer la validation de cette demande ?')) {
                try {
                    await DemandeService.updateStatut(id, 2); // 2 pour valider
                    this.$toast.success('Demande validée avec succès');
                    await this.chargerDemandes();
                } catch (error) {
                    console.error('Erreur lors de la validation:', error);
                    this.$toast.error('Erreur lors de la validation de la demande');
                }
            }
        },

        async refuserConge(id) {
            if (confirm('Confirmer le refus de cette demande ?')) {
                try {
                    await DemandeService.updateStatut(id, 3); // 3 pour refuser
                    this.$toast.success('Demande refusée');
                    await this.chargerDemandes();
                } catch (error) {
                    console.error('Erreur lors du refus:', error);
                    this.$toast.error('Erreur lors du refus de la demande');
                }
            }
        },

        voirDetails(id) {
            this.$router.push(`/conges/${id}`);
        }
    },

    computed: {
        congesFiltres() {
            let filtered = this.conges;

            // Filtre par statut
            if (this.filtres.statut) {
                filtered = filtered.filter(conge => conge.etat === parseInt(this.filtres.statut));
            }

            // Filtre par type
            if (this.filtres.type) {
                filtered = filtered.filter(conge => 
                    conge.typeConge?.libelle?.toLowerCase() === this.filtres.type.toLowerCase()
                );
            }

            // Filtre par recherche
            if (this.filtres.recherche) {
                const searchTerm = this.filtres.recherche.toLowerCase();
                filtered = filtered.filter(conge => 
                    `${conge.personnel?.prenom} ${conge.personnel?.nom}`.toLowerCase().includes(searchTerm) ||
                    conge.nature?.toLowerCase().includes(searchTerm) ||
                    conge.typeConge?.libelle?.toLowerCase().includes(searchTerm)
                );
            }

            return filtered;
        },

        statistiques() {
            return {
                total: this.conges.length,
                enAttente: this.conges.filter(c => c.etat === 1).length,
                valides: this.conges.filter(c => c.etat === 2).length,
                refuses: this.conges.filter(c => c.etat === 3).length
            };
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

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>