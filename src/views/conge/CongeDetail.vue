<template>
    <div class="conge-detail p-6">
        <!-- En-tête avec bouton retour -->
        <div class="mb-6 flex items-center justify-between">
            <div>
                <button @click="$router.back()" 
                    class="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-2">
                    <Icon icon="mdi:arrow-left" class="mr-2" />
                    Retour
                </button>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Détails du Congé</h1>
                <p class="text-gray-600 dark:text-gray-400">Informations complètes de la demande</p>
            </div>
            
            <div class="flex gap-3">
                <button v-if="conge.etat === 1" @click="validerConge"
                    class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <Icon icon="mdi:check" class="mr-2" />
                    Valider
                </button>
                <button v-if="conge.etat === 1" @click="refuserConge"
                    class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
                    <Icon icon="mdi:close" class="mr-2" />
                    Refuser
                </button>
                <button @click="imprimerDetails"
                    class="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                    <Icon icon="mdi:printer" class="mr-2" />
                    Imprimer
                </button>
            </div>
        </div>

        <!-- Spinner de chargement -->
        <div v-if="isLoading" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8 text-center">
            <Icon icon="mdi:loading" class="text-4xl text-primary animate-spin mx-auto mb-4" />
            <p class="text-gray-600 dark:text-gray-400">Chargement des détails...</p>
        </div>

        <!-- Message si aucune donnée -->
        <div v-else-if="!conge.idDemande" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-8 text-center">
            <Icon icon="mdi:alert-circle" class="text-6xl text-gray-400 mx-auto mb-4" />
            <p class="text-gray-600 dark:text-gray-400">Demande de congé non trouvée</p>
            <button @click="$router.back()" class="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
                Retour à la liste
            </button>
        </div>

        <!-- Détails du congé -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Colonne principale -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Carte Informations principales -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Informations du Congé</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Type de congé</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">
                                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getCouleurType(conge.typeConge?.libelle)">
                                    {{ getNomType(conge.typeConge?.libelle) }}
                                </span>
                            </p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Statut</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">
                                <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getCouleurStatut(conge.etat)">
                                    {{ getNomStatut(conge.etat) }}
                                </span>
                            </p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Date de début</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(conge.debut) }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Date de fin</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(conge.fin) }}</p>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Durée</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ calculerDuree(conge.debut, conge.fin) }} jours</p>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Nature/Motif</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ conge.nature || 'Non spécifié' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Carte Workflow -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Processus de Validation</h2>
                    <div class="space-y-4">
                        <div v-for="(etape, index) in getWorkflowDetails(conge.etat)" :key="index" 
                            class="flex items-center justify-between p-3 rounded-lg border" 
                            :class="etape.statut === 'termine' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                                    etape.statut === 'encours' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' :
                                    'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700'">
                            <div class="flex items-center">
                                <div :class="[
                                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-3',
                                    etape.statut === 'termine' ? 'bg-green-500 text-white' :
                                    etape.statut === 'encours' ? 'bg-blue-500 text-white' :
                                    'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                                ]">
                                    {{ index + 1 }}
                                </div>
                                <div>
                                    <div class="font-medium text-gray-900 dark:text-white">{{ etape.nom }}</div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ etape.description }}</div>
                                </div>
                            </div>
                            <div class="text-sm" :class="etape.statut === 'termine' ? 'text-green-600 dark:text-green-400' :
                                                       etape.statut === 'encours' ? 'text-blue-600 dark:text-blue-400' :
                                                       'text-gray-500 dark:text-gray-400'">
                                {{ etape.statut === 'termine' ? 'Terminé' :
                                   etape.statut === 'encours' ? 'En cours' :
                                   'En attente' }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Colonne latérale -->
            <div class="space-y-6">
                <!-- Carte Informations employé -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Informations de l'Employé</h2>
                    <div class="flex items-center mb-4">
                        <img :src="getPhotoUrl(conge.personnel?.photo)" 
                             :alt="conge.personnel?.nom" 
                             class="h-16 w-16 rounded-full object-cover">
                        <div class="ml-4">
                            <div class="text-lg font-semibold text-gray-900 dark:text-white">
                                {{ conge.personnel?.prenom }} {{ conge.personnel?.nom }}
                            </div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                                {{ conge.personnel?.matricule || 'N/A' }}
                            </div>
                        </div>
                    </div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-500 dark:text-gray-400">Département:</span>
                            <span class="text-gray-900 dark:text-white">{{ conge.personnel?.categoriePersonnel?.libelle || 'N/A' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500 dark:text-gray-400">Genre:</span>
                            <span class="text-gray-900 dark:text-white">{{ conge.personnel?.genre?.libelle || 'N/A' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500 dark:text-gray-400">Téléphone:</span>
                            <span class="text-gray-900 dark:text-white">{{ conge.personnel?.telephone || 'N/A' }}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-500 dark:text-gray-400">Email:</span>
                            <span class="text-gray-900 dark:text-white">{{ conge.personnel?.email || 'N/A' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Carte Métadonnées -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Métadonnées</h2>
                    <div class="space-y-3 text-sm">
                        <div>
                            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Date de demande</label>
                            <p class="mt-1 text-gray-900 dark:text-white">{{ formatDate(conge.dateDemande) }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">ID de la demande</label>
                            <p class="mt-1 text-gray-900 dark:text-white">{{ conge.idDemande }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">Dernière modification</label>
                            <p class="mt-1 text-gray-900 dark:text-white">{{ formatDate(conge.dateModification) || 'Non modifiée' }}</p>
                        </div>
                    </div>
                </div>

                <!-- Carte Actions rapides -->
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Actions</h2>
                    <div class="space-y-2">
                        <button @click="modifierDates" 
                            class="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex items-center">
                            <Icon icon="mdi:calendar-edit" class="mr-2" />
                            Modifier les dates
                        </button>
                        <button @click="envoyerRappel" 
                            class="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex items-center">
                            <Icon icon="mdi:email-fast" class="mr-2" />
                            Envoyer un rappel
                        </button>
                        <button @click="historiqueModifications" 
                            class="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex items-center">
                            <Icon icon="mdi:history" class="mr-2" />
                            Voir l'historique
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import DemandeService from "@/services/DemandeService";

export default {
    name: "CongeDetail",
    components: { Icon },

    data() {
        return {
            isLoading: false,
            conge: {}
        };
    },

    mounted() {
        this.chargerDetails();
    },

    methods: {
        async chargerDetails() {
            this.isLoading = true;
            try {
                const id = this.$route.params.id;
                const response = await DemandeService.getDemandeById(id);
                console.log('Détails du congé:', response);
                this.conge = response;
            } catch (error) {
                console.error("Erreur lors du chargement des détails:", error);
                this.$toast.error("Impossible de charger les détails de la demande");
            } finally {
                this.isLoading = false;
            }
        },

        async validerConge() {
            if (confirm('Confirmer la validation de cette demande ?')) {
                try {
                    await DemandeService.validerDemande(this.conge.idDemande);
                    this.$toast.success('Demande validée avec succès');
                    await this.chargerDetails(); // Recharger les données
                } catch (error) {
                    console.error('Erreur lors de la validation:', error);
                    this.$toast.error('Erreur lors de la validation de la demande');
                }
            }
        },

        async refuserConge() {
            if (confirm('Confirmer le refus de cette demande ?')) {
                try {
                    await DemandeService.refuserDemande(this.conge.idDemande);
                    this.$toast.success('Demande refusée');
                    await this.chargerDetails(); // Recharger les données
                } catch (error) {
                    console.error('Erreur lors du refus:', error);
                    this.$toast.error('Erreur lors du refus de la demande');
                }
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
            return new Date(date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
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

        getWorkflowDetails(etat) {
            return [
                { 
                    nom: 'Soumission', 
                    description: 'Demande soumise par l\'employé',
                    statut: 'termine'
                },
                { 
                    nom: 'Validation Manager', 
                    description: 'Validation par le responsable hiérarchique',
                    statut: etat >= 1 ? 'termine' : 'attente'
                },
                { 
                    nom: 'Validation RH', 
                    description: 'Validation par les ressources humaines',
                    statut: etat === 1 ? 'encours' : (etat >= 2 ? 'termine' : 'attente')
                },
                { 
                    nom: 'Approbation finale', 
                    description: 'Approbation définitive',
                    statut: etat === 2 ? 'termine' : 'attente'
                }
            ];
        },

        imprimerDetails() {
            window.print();
        },

        modifierDates() {
            this.$toast.info('Fonctionnalité à implémenter');
        },

        envoyerRappel() {
            this.$toast.info('Fonctionnalité à implémenter');
        },

        historiqueModifications() {
            this.$toast.info('Fonctionnalité à implémenter');
        }
    }
};
</script>

<style scoped>
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* Styles pour l'impression */
@media print {
    .conge-detail {
        padding: 0;
    }
    
    button {
        display: none !important;
    }
    
    .bg-white, .bg-gray-50 {
        background: white !important;
        color: black !important;
    }
    
    .shadow, .border {
        box-shadow: none !important;
        border: 1px solid #ccc !important;
    }
}
</style>