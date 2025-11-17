    <template>
        <div class="nouvelle-demande p-6">
            <!-- En-tête -->
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Nouvelle Demande de Congé
                </h1>
                <p class="text-gray-600 dark:text-gray-400">
                    Soumettez votre demande de congé pour validation
                </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Formulaire -->
                <div class="lg:col-span-2">
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                        <form @submit.prevent="soumettreDemande">
                            <!-- Type de congé -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Type de congé *
                                </label>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div v-for="type in typesConge" :key="type.id" @click="selectTypeConge(type)"
                                        :class="[
                                            'border-2 rounded-lg p-4 cursor-pointer transition-all',
                                            demande.typeConge === type.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                        ]">
                                        <div class="flex items-center">
                                            <div :class="['w-4 h-4 rounded-full border-2 mr-3',
                                                demande.typeConge === type.id ? 'border-primary bg-primary' : 'border-gray-300']">
                                            </div>
                                            <div>
                                                <div class="font-medium text-gray-900 dark:text-white">{{ type.nom }}
                                                </div>
                                                <div class="text-sm text-gray-500 dark:text-gray-400">
                                                    Solde : {{ getSoldeType(type.id) }} jour(s)
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Période -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Date de début *
                                    </label>
                                    <input v-model="demande.dateDebut" type="date" required
                                        class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Date de fin *
                                    </label>
                                    <input v-model="demande.dateFin" type="date" required
                                        class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white">
                                </div>
                            </div>

                            <!-- Calcul automatique -->
                            <div
                                class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                                <div class="flex justify-between items-center">
                                    <div>
                                        <div class="text-sm text-blue-800 dark:text-blue-200 font-medium">
                                            Période sélectionnée
                                        </div>
                                        <div class="text-blue-600 dark:text-blue-300">
                                            {{ calculerDuree() }} jour(s) de congé
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-sm text-blue-800 dark:text-blue-200">
                                            Du {{ formatDate(demande.dateDebut) }} au {{ formatDate(demande.dateFin) }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Motif -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Motif du congé *
                                </label>
                                <textarea v-model="demande.motif" rows="4" required
                                    placeholder="Décrivez la raison de votre demande de congé..."
                                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white resize-none"></textarea>
                            </div>

                            <!-- Contact d'urgence -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Contact d'urgence pendant le congé
                                </label>
                                <input v-model="demande.contactUrgence" type="text"
                                    placeholder="Nom et numéro de téléphone"
                                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white">
                            </div>

                            <!-- Boutons -->
                            <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button type="button" @click="$router.back()"
                                    class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" :disabled="!formValide"
                                    class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                    Soumettre la demande
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Sidebar - Informations -->
                <div class="space-y-6">
                    <!-- Solde des congés -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Votre solde de congés
                        </h3>
                        <div class="space-y-3">
                            <div v-for="solde in soldesConges" :key="solde.type"
                                class="flex justify-between items-center p-3 rounded-lg border"
                                :class="getCouleurSolde(solde.type)">
                                <div>
                                    <div class="font-medium text-gray-900 dark:text-white">{{ solde.nom }}</div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400">Acquis : {{ solde.acquis }}j
                                    </div>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ solde.restant }}
                                    </div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400">restant</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Workflow -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Processus de validation
                        </h3>
                        <div class="space-y-4">
                            <div v-for="etape in workflow" :key="etape.id" class="flex items-center">
                                <div :class="[
                                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mr-3',
                                    etape.statut === 'termine' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                        etape.statut === 'encours' ? 'bg-primary text-white' :
                                            'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                                ]">
                                    {{ etape.ordre }}
                                </div>
                                <div>
                                    <div class="font-medium text-gray-900 dark:text-white">{{ etape.nom }}</div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ etape.description }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Alertes -->
                    <div
                        class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div class="flex items-start">
                            <Icon icon="mdi:alert-circle" class="text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
                            <div>
                                <div class="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                                    Important
                                </div>
                                <div class="text-sm text-yellow-700 dark:text-yellow-300">
                                    • Soumettez vos demandes au moins 48h à l'avance<br>
                                    • Vérifiez votre solde avant de soumettre<br>
                                    • Contactez les RH en cas d'urgence
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>

<script>
import { Icon } from "@iconify/vue";

export default {
    name: "NouvelleDemandeConge",
    components: {
        Icon,
    },
    data() {
        return {
            demande: {
                typeConge: null,
                dateDebut: '',
                dateFin: '',
                motif: '',
                contactUrgence: ''
            },
            typesConge: [
                { id: 'payes', nom: 'Congés Payés', icone: 'mdi:beach' },
                { id: 'maladie', nom: 'Congés Maladie', icone: 'mdi:medical-bag' },
                { id: 'exceptionnel', nom: 'Congés Exceptionnels', icone: 'mdi:star' },
                { id: 'sans-solde', nom: 'Congés Sans Solde', icone: 'mdi:calendar-remove' }
            ],
            soldesConges: [
                { type: 'payes', nom: 'Congés Payés', acquis: 25, restant: 18 },
                { type: 'maladie', nom: 'Congés Maladie', acquis: 15, restant: 15 },
                { type: 'exceptionnel', nom: 'Congés Exceptionnels', acquis: 5, restant: 3 }
            ],
            workflow: [
                { id: 1, ordre: 1, nom: 'Soumission', description: 'Demande créée', statut: 'termine' },
                { id: 2, ordre: 2, nom: 'Validation Manager', description: 'En attente', statut: 'encours' },
                { id: 3, ordre: 3, nom: 'Validation RH', description: 'En attente', statut: 'attente' },
                { id: 4, ordre: 4, nom: 'Approbation', description: 'En attente', statut: 'attente' }
            ]
        };
    },
    computed: {
        formValide() {
            return this.demande.typeConge &&
                this.demande.dateDebut &&
                this.demande.dateFin &&
                this.demande.motif;
        }
    },
    methods: {
        selectTypeConge(type) {
            this.demande.typeConge = type.id;
        },
        getSoldeType(type) {
            const solde = this.soldesConges.find(s => s.type === type);
            return solde ? solde.restant : 0;
        },
        calculerDuree() {
            if (!this.demande.dateDebut || !this.demande.dateFin) return 0;

            const debut = new Date(this.demande.dateDebut);
            const fin = new Date(this.demande.dateFin);
            const diffTime = Math.abs(fin - debut);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            return diffDays;
        },
        formatDate(date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString('fr-FR');
        },
        getCouleurSolde(type) {
            const couleurs = {
                'payes': 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20',
                'maladie': 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20',
                'exceptionnel': 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20'
            };
            return couleurs[type] || 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800';
        },
        soumettreDemande() {
            // Simulation de soumission
            alert('Demande soumise avec succès !');
            this.$router.push('/conges/liste');
        }
    }
};
</script>