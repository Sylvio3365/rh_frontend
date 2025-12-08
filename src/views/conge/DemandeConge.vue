<template>
    <div class="nouvelle-demande p-6">
        <!-- En-tête -->
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Nouvelle Demande de Congé
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
                Soumettez une demande de congé pour un employé
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Formulaire -->
            <div class="lg:col-span-2">
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <form @submit.prevent="soumettreDemande">
                        <!-- Sélection de l'employé -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Employé concerné *
                            </label>
                            <div class="relative">
                                <input v-model="searchEmployee" @input="filterEmployees"
                                    @focus="showEmployeeList = true" type="text" placeholder="Rechercher un employé..."
                                    :disabled="isLoadingEmployees"
                                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                                <Icon v-if="!isLoadingEmployees" icon="mdi:magnify"
                                    class="absolute right-3 top-3.5 text-gray-400 text-xl" />
                                <Icon v-else icon="mdi:loading"
                                    class="absolute right-3 top-3.5 text-gray-400 text-xl animate-spin" />

                                <!-- Liste déroulante des employés -->
                                <div v-if="showEmployeeList && filteredEmployees.length > 0"
                                    class="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    <div v-for="employee in filteredEmployees" :key="employee.id"
                                        @click="selectEmployee(employee)"
                                        class="p-3 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                                        <div class="flex items-center">
                                            <img src="@/assets/img/user1.png" :alt="employee.nom"
                                                class="w-8 h-8 rounded-full mr-3">
                                            <div>
                                                <div class="font-medium text-gray-900 dark:text-white">
                                                    {{ employee.prenom }} {{ employee.nom }}
                                                </div>
                                                <div class="text-sm text-gray-500 dark:text-gray-400">
                                                    {{ employee.poste }} • {{ employee.departement }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Employé sélectionné -->
                            <div v-if="demande.employe"
                                class="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        <img src="@/assets/img/user1.png" :alt="demande.employe.nom"
                                                class="w-8 h-8 rounded-full mr-3">
                                        <div>
                                            <div class="font-medium text-gray-900 dark:text-white">
                                                {{ demande.employe.prenom }} {{ demande.employe.nom }}
                                            </div>
                                            <!-- <div class="text-sm text-gray-600 dark:text-gray-400">
                                                {{ demande.employe.poste }} • {{ demande.employe.departement }}
                                            </div> -->
                                        </div>
                                    </div>
                                    <button type="button" @click="demande.employe = null"
                                        class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                        <Icon icon="mdi:close" class="text-xl" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Type de congé -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Type de congé *
                            </label>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-for="type in typesConge" :key="type.id" @click="selectTypeConge(type)" :class="[
                                    'border-2 rounded-lg p-4 cursor-pointer transition-all',
                                    demande.typeConge === type.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                ]">
                                    <div class="flex items-center">
                                        <div :class="[
                                            'w-4 h-4 rounded-full border-2 mr-3',
                                            demande.typeConge === type.id ? 'border-primary bg-primary' : 'border-gray-300'
                                        ]"></div>
                                        <div>
                                            <div class="font-medium text-gray-900 dark:text-white">{{ type.nom }}</div>
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
                                <input v-model="demande.dateDebut" type="date" required :min="minDate"
                                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Date de fin *
                                </label>
                                <input v-model="demande.dateFin" type="date" required
                                    :min="demande.dateDebut || minDate"
                                    class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white">
                            </div>
                        </div>

                        <!-- Calcul automatique -->
                        <div v-if="demande.dateDebut && demande.dateFin"
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
                                    <div class="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                        Jours ouvrables : {{ calculerJoursOuvrables() }}
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
                                placeholder="Décrivez la raison de la demande de congé..."
                                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white resize-none"></textarea>
                        </div>

                        <!-- Contact d'urgence -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Contact d'urgence pendant le congé
                            </label>
                            <input v-model="demande.contactUrgence" type="text" placeholder="Nom et numéro de téléphone"
                                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary dark:text-white">
                        </div>

                        <!-- Boutons -->
                        <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button type="button" @click="$router.back()"
                                class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                Annuler
                            </button>
                            <button type="submit" :disabled="!formValide || isSubmitting"
                                class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
                                <Icon v-if="!isSubmitting" icon="mdi:send" class="text-lg" />
                                <Icon v-else icon="mdi:loading" class="text-lg animate-spin" />
                                {{ isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Sidebar - Informations -->
            <div class="space-y-6">
                <!-- Solde des congés -->
                <div v-if="demande.employe"
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Solde de congés de {{ demande.employe.prenom }}
                    </h3>
                    <div class="space-y-3">
                        <div v-for="solde in soldesConges" :key="solde.type"
                            class="flex justify-between items-center p-3 rounded-lg border"
                            :class="getCouleurSolde(solde.type)">
                            <div>
                                <div class="font-medium text-gray-900 dark:text-white">{{ solde.nom }}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">Acquis : {{ solde.acquis }}j</div>
                            </div>
                            <div class="text-right">
                                <div class="text-2xl font-bold text-gray-900 dark:text-white">{{ solde.restant }}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">restant</div>
                            </div>
                        </div>
                    </div>

                    <!-- Avertissement si solde insuffisant -->
                    <div v-if="demande.typeConge && demande.dateDebut && demande.dateFin" class="mt-4 p-3 rounded-lg"
                        :class="soldeSuffisant ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'">
                        <div class="flex items-center">
                            <Icon :icon="soldeSuffisant ? 'mdi:check-circle' : 'mdi:alert-circle'"
                                :class="soldeSuffisant ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                                class="mr-2" />
                            <span
                                :class="soldeSuffisant ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'">
                                {{ soldeSuffisant ? 'Solde suffisant' : 'Solde insuffisant' }}
                            </span>
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

                <!-- Historique récent -->
                <div v-if="demande.employe"
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Dernières demandes
                    </h3>
                    <div class="space-y-3">
                        <div v-for="demande in historiqueDemandes" :key="demande.id"
                            class="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                            <div class="flex justify-between items-start mb-2">
                                <span class="text-sm font-medium text-gray-900 dark:text-white">
                                    {{ demande.type }}
                                </span>
                                <span class="text-xs px-2 py-1 rounded-full" :class="getStatusClass(demande.statut)">
                                    {{ demande.statut }}
                                </span>
                            </div>
                            <div class="text-sm text-gray-600 dark:text-gray-400">
                                {{ formatDate(demande.dateDebut) }} - {{ formatDate(demande.dateFin) }}
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {{ demande.motif }}
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
                                • Soumettez les demandes au moins 48h à l'avance<br>
                                • Vérifiez le solde avant de soumettre<br>
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
import PersonnelService from '@/services/PersonnelService';
import TypeCongeService from '@/services/TypeCongeService';
import DemandeService from '@/services/DemandeService';
import SoldeCongeService from '@/services/SoldeCongeService';

export default {
    name: "NouvelleDemandeConge",
    components: {
        Icon,
    },
    data() {
        return {
            searchEmployee: '',
            showEmployeeList: false,
            isLoadingEmployees: false,
            isLoadingTypesConge: false,
            isSubmitting: false,
            demande: {
                employe: null,
                typeConge: null,
                dateDebut: '',
                dateFin: '',
                motif: '',
                contactUrgence: ''
            },
            employees: [],
            typesConge: [
                { id: 1, code: 'MATERNITE', nom: 'Maternité', nbMax: 90, icone: 'mdi:baby-carriage' },
                { id: 2, code: 'PATERNITE', nom: 'Paternité', nbMax: 15, icone: 'mdi:baby-face' },
                { id: 3, code: 'ANNUEL', nom: 'Annuel', nbMax: 30, icone: 'mdi:beach' },
                { id: 4, code: 'MALADIE', nom: 'Maladie', nbMax: 60, icone: 'mdi:medical-bag' },
                { id: 5, code: 'FORMATION', nom: 'Formation', nbMax: 20, icone: 'mdi:school' },
                { id: 6, code: 'EXCEPTIONNEL', nom: 'Exceptionnel', nbMax: 10, icone: 'mdi:star' }
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
            ],
            historiqueDemandes: [
                {
                    id: 1,
                    type: 'Congés Payés',
                    dateDebut: '2024-11-10',
                    dateFin: '2024-11-15',
                    motif: 'Vacances familiales',
                    statut: 'Approuvé'
                },
                {
                    id: 2,
                    type: 'Congés Maladie',
                    dateDebut: '2024-10-20',
                    dateFin: '2024-10-21',
                    motif: 'Consultation médicale',
                    statut: 'Approuvé'
                }
            ]
        };
    },
    computed: {
        formValide() {
            return this.demande.employe &&
                this.demande.typeConge &&
                this.demande.dateDebut &&
                this.demande.dateFin &&
                this.demande.motif;
        },
        filteredEmployees() {
            if (!this.searchEmployee) return this.employees;
            return this.employees.filter(employee =>
                `${employee.prenom} ${employee.nom}`.toLowerCase().includes(this.searchEmployee.toLowerCase()) ||
                employee.poste.toLowerCase().includes(this.searchEmployee.toLowerCase()) ||
                employee.departement.toLowerCase().includes(this.searchEmployee.toLowerCase())
            );
        },
        minDate() {
            return new Date().toISOString().split('T')[0];
        },
        soldeSuffisant() {
            if (!this.demande.typeConge || !this.demande.dateDebut || !this.demande.dateFin) return true;

            const solde = this.soldesConges.find(s => s.type === this.demande.typeConge);
            const duree = this.calculerDuree();

            return solde && solde.restant >= duree;
        }
    },
    methods: {
        async loadAllTypesConge() {
            this.isLoadingTypesConge = true;
            try {
                const typesConges = await TypeCongeService.getAllTypeConge();
                console.log('✅ Types de congés chargés depuis API:', typesConges);

                if (typesConges && typesConges.length > 0) {
                    // Mapper les données de l'API vers le format attendu
                    this.typesConge = typesConges.map(type => ({
                        id: type.id,
                        code: type.code,
                        nom: type.nom,
                        icone: this.getIconeByCode(type.code)
                    }));
                    console.log('✅ Types de congés mappés:', this.typesConge);
                }
            } catch (error) {
                console.error('❌ Erreur lors du chargement des types de congés:', error);
                // Ne pas afficher d'alerte, garder les types par défaut
                console.warn('ℹ️ Utilisation des types de congés par défaut');
            } finally {
                this.isLoadingTypesConge = false;
            }
        },

        getIconeByCode(code) {
            const icones = {
                'PAYES': 'mdi:beach',
                'MALADIE': 'mdi:medical-bag',
                'EXCEPTIONNEL': 'mdi:star',
                'SANS_SOLDE': 'mdi:calendar-remove'
            };
            return icones[code] || 'mdi:calendar';
        },

        async loadAllPersonnel() {
            this.isLoadingEmployees = true;
            try {
                const response = await PersonnelService.getAllPersonnel();

                // L'API retourne un objet avec une propriété 'data' qui contient le tableau
                const personnels = response.data;

                if (!personnels || !Array.isArray(personnels)) {
                    console.error('❌ La réponse des personnels n\'est pas un tableau:', response);
                    this.employees = [];
                    alert('Erreur: Aucun employé trouvé ou format de données incorrect.');
                    return;
                }

                console.log('✅ Personnels récupérés:', personnels);

                const employeesWithContract = await Promise.all(
                    personnels.map(async (personnel) => {
                        let contratActif = null;
                        try {
                            contratActif = await PersonnelService.getContratActif(personnel.idPersonnel);
                        } catch (e) {
                            console.warn(`Impossible de récupérer le contrat actif pour ${personnel.nom} ${personnel.prenom}`, e);
                        }

                        return {
                            id: personnel.idPersonnel,
                            nom: personnel.nom,
                            prenom: personnel.prenom,
                            poste: contratActif?.poste?.nom || 'Non défini',
                            departement: contratActif?.poste?.departement?.libelle || 'Non défini',
                            photo: personnel.photo || '/assets/img/default-user.png',
                            email: personnel.email || ''
                        };
                    })
                );

                this.employees = employeesWithContract;
                console.log('✅ Employés transformés:', this.employees);

            } catch (error) {
                console.error('Erreur lors du chargement des employés:', error);
                alert('Impossible de charger la liste des employés. Veuillez réessayer. Erreur : ' + error.message);
                this.employees = [];
            } finally {
                this.isLoadingEmployees = false;
            }
        },

        async selectEmployee(employee) {
            this.demande.employe = employee;
            this.searchEmployee = '';
            this.showEmployeeList = false;

            await this.chargerSoldesEmploye(employee.id);
        },
        async chargerSoldesEmploye(idPersonnel) {
            try {
                const soldes = await SoldeCongeService.getSoldesByPersonnel(idPersonnel);
                console.log('✅ Soldes chargés:', soldes);

                // Mapper les soldes vers le format attendu
                this.soldesConges = soldes.map(solde => ({
                    type: solde.typeConge.idTypeConge,
                    nom: this.capitalizeFirstLetter(solde.typeConge.libelle),
                    acquis: solde.typeConge.nbMax,
                    utilise: parseFloat(solde.congeUtilise),
                    restant: solde.typeConge.nbMax - parseFloat(solde.congeUtilise)
                }));

                console.log('✅ Soldes mappés:', this.soldesConges);
            } catch (error) {
                console.error('❌ Erreur lors du chargement des soldes:', error);
                // Garder les soldes par défaut en cas d'erreur
            }
        },
        // Ajouter cette méthode utilitaire
        capitalizeFirstLetter(string) {
            if (!string) return '';
            return string.charAt(0).toUpperCase() + string.slice(1);
        },

        // Modifier getSoldeType pour utiliser l'ID du type de congé
        getSoldeType(typeId) {
            const solde = this.soldesConges.find(s => s.type === typeId);
            return solde ? solde.restant : 0;
        },
        filterEmployees() {
            this.showEmployeeList = true;
        },
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
        calculerJoursOuvrables() {
            // Simulation simple - en réalité il faudrait exclure les weekends et jours fériés
            const duree = this.calculerDuree();
            const weekends = Math.floor(duree / 7) * 2;
            return duree - weekends;
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
        getStatusClass(statut) {
            const classes = {
                'Approuvé': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                'En attente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                'Refusé': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            };
            return classes[statut] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        },
        async soumettreDemande() {
            if (!this.soldeSuffisant) {
                alert('Solde insuffisant pour ce type de congé !');
                return;
            }

            if (!this.formValide) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }

            const confirmation = confirm(`Confirmer la demande de congé pour ${this.demande.employe.prenom} ${this.demande.employe.nom} ?`);

            if (!confirmation) return;

            this.isSubmitting = true;

            try {
                const demandeData = {
                    personnel: { idPersonnel: this.demande.employe.id },
                    typeConge: { idTypeConge: this.demande.typeConge },
                    debut: this.demande.dateDebut,
                    fin: this.demande.dateFin,
                    motif: this.demande.motif,
                    etat: 1
                };

                console.log('📤 Envoi de la demande:', demandeData);

                const response = await DemandeService.createDemande(demandeData);

                console.log('✅ Demande créée avec succès:', response);
                alert('Demande de congé soumise avec succès !');
                this.$router.push('/conges/liste');

            } catch (error) {
                console.error('❌ Erreur lors de la soumission:', error);
                let errorMessage = error.response?.data?.message || error.message || 'Une erreur est survenue.';
                alert(`Erreur: ${errorMessage}`);
            } finally {
                this.isSubmitting = false;
            }
        }

    },
    mounted() {
        // Charger les employés depuis l'API au montage du composant
        this.loadAllPersonnel();

        // Fermer la liste déroulante quand on clique ailleurs
        document.addEventListener('click', (e) => {
            if (!this.$el.contains(e.target)) {
                this.showEmployeeList = false;
            }
        });
    }
};
</script>

<style scoped>
.nouvelle-demande {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Style pour la liste déroulante */
.employee-list {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
}

.employee-list::-webkit-scrollbar {
    width: 6px;
}

.employee-list::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

.employee-list::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
}

.employee-list::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* Animation pour l'icône de chargement */
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}
</style>