<template>
    <div class="fiche-employe p-6">
        <!-- Navigation -->
        <div class="mb-6">
            <button @click="$router.back()" class="flex items-center text-primary hover:text-primary/80 mb-4">
                <Icon icon="mdi:arrow-left" class="mr-2" />
                Retour à la liste
            </button>

            <!-- Onglets -->
            <div class="border-b border-gray-200 dark:border-gray-700">
                <nav class="-mb-px flex space-x-8">
                    <button v-for="onglet in onglets" :key="onglet.id" @click="ongletActif = onglet.id" :class="[
                        'py-4 px-1 border-b-2 font-medium text-sm',
                        ongletActif === onglet.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    ]">
                        {{ onglet.nom }}
                    </button>
                </nav>
            </div>
        </div>

        <!-- En-tête employé -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div class="flex items-start justify-between">
                <div class="flex items-start space-x-6">
                    <img :src="employe.photo" :alt="employe.nom"
                        class="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-600 shadow">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                            {{ employe.prenom }} {{ employe.nom }}
                        </h1>
                        <p class="text-lg text-gray-600 dark:text-gray-400 mb-2">{{ employe.poste }}</p>
                        <div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div class="flex items-center">
                                <Icon icon="mdi:email" class="mr-1" />
                                {{ employe.email }}
                            </div>
                            <div class="flex items-center">
                                <Icon icon="mdi:phone" class="mr-1" />
                                {{ employe.telephone }}
                            </div>
                            <div class="flex items-center">
                                <Icon icon="mdi:map-marker" class="mr-1" />
                                {{ employe.adresse }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Icon icon="mdi:circle" class="mr-1 w-2 h-2" />
                        {{ employe.statut }}
                    </span>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Employé depuis {{ calculerAnciennete(employe.dateEntree) }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Contenu des onglets -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Colonne principale -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Informations personnelles -->
                <div v-if="ongletActif === 'informations'"
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations Personnelles</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date de
                                naissance</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(employe.dtn)
                                }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Lieu de
                                naissance</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ employe.lieuNaissance }}</p>
                        </div>
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nationalité</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ employe.nationalite }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Situation
                                familiale</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ employe.situationFamiliale }}</p>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Adresse
                                complète</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ employe.adresse }}</p>
                        </div>
                    </div>
                </div>

                <!-- Informations professionnelles -->
                <div v-if="ongletActif === 'professionnel'"
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations Professionnelles
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Matricule</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ employe.matricule }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date
                                d'embauche</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ formatDate(employe.dateEntree) }}
                            </p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type de
                                contrat</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ employe.typeContrat }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Statut</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ employe.statut }}</p>
                        </div>
                        <div>
                            <label
                                class="block text-sm font-medium text-gray-700 dark:text-gray-300">Département</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ employe.departement }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Poste</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ employe.poste }}</p>
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description du
                                poste</label>
                            <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ employe.posteDescription }}</p>
                        </div>
                    </div>
                </div>

                <!-- Historique des postes -->
                <div v-if="ongletActif === 'historique'"
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Historique des Postes
                    </h2>
                    <div class="space-y-4">
                        <div v-for="histo in historiquePostes" class="border-l-4 border-primary pl-4 py-2">
                            <div class="flex justify-between items-start"> 
                                <div>
                                    <h3 class="font-medium text-gray-900 dark:text-white">{{ histo.poste }}</h3>
                                    <p class="text-sm text-gray-600 dark:text-gray-400"> Département : {{ histo.departement }}</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400"> Salaire : {{ histo.salaire.toLocaleString() }} MGA </p>
                                    <!-- Badge du mouvement -->
                                    <span class="inline-block mt-1 px-2 py-1 text-xs rounded-full"
                                        :class="{
                                            'bg-blue-100 text-blue-800': histo.mouvement === 'Mobilité',
                                            'bg-green-100 text-green-800': histo.mouvement === 'Promotion',
                                            'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300': histo.mouvement === 'Premier poste'
                                        }">
                                        {{ histo.mouvement }}
                                    </span>
                                </div>
                                <div class="text-right text-sm text-gray-500 dark:text-gray-400">
                                    <div>{{ formatDate(histo.dateDebut) }}</div>
                                    <div v-if="histo.dateFin">{{ formatDate(histo.dateFin) }}</div>
                                    <div v-else class="text-green-600 dark:text-green-400">Actuel</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Colonne latérale -->
            <div class="space-y-6">
                <!-- Statut du contrat -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statut du Contrat</h2>
                    <div class="space-y-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                            <p class="text-sm text-gray-900 dark:text-white">{{ employe.typeContrat }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Début</label>
                            <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(employe.dateEntree) }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fin</label>
                            <p class="text-sm text-gray-900 dark:text-white">{{ employe.dateFinContrat ?
                                formatDate(employe.dateFinContrat) : 'Indéterminée' }}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Période
                                d'essai</label>
                            <p class="text-sm text-gray-900 dark:text-white">{{ employe.periodeEssai }}</p>
                        </div>
                    </div>
                </div>

                <!-- Documents -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents</h2>
                    <div class="space-y-2">
                        <div v-for="doc in documents" :key="doc.id"
                            class="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                            <div class="flex items-center">
                                <Icon :icon="getIconDocument(doc.type)" class="text-gray-400 mr-2" />
                                <span class="text-sm text-gray-700 dark:text-gray-300">{{ doc.nom }}</span>
                            </div>
                            <button class="text-primary hover:text-primary/80">
                                <Icon icon="mdi:download" />
                            </button>
                        </div>
                    </div>
                    <button
                        class="w-full mt-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 text-center text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Icon icon="mdi:plus" class="mr-1" />
                        Ajouter un document
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import axios from "axios";

export default {
    name: "FicheEmploye",
    components: {
        Icon,
    },
    data() {
        return {
            ongletActif: 'informations',
            onglets: [
                { id: 'informations', nom: 'Informations' },
                { id: 'professionnel', nom: 'Professionnel' },
                { id: 'historique', nom: 'Historique' },
                { id: 'documents', nom: 'Documents' },
                { id: 'contrat', nom: 'Contrat' }
            ],
            employe: {},                
            historiquePostes: [],     
            documents: []     
        };
    },
    mounted() {
        this.chargerEmploye();
        this.chargerHistoriques();
    },
    methods: {
        async chargerEmploye() {
            const id = this.$route.params.id;
            try {
                const response = await axios.get(`http://localhost:9090/personnels/${id}`);
                const data = response.data;
                this.employe = {
                    id: data.idPersonnel,
                    nom: data.nom,
                    prenom: data.prenom,
                    email: data.nom + data.prenom + "@gmail.com",
                    dtn: data.dtn,
                    lieuNaissance: data.lieuNaissance,
                    nationalite: data.nationalite,
                    situationFamiliale: data.stf,
                    photo: require(`@/assets/img/user1.png`),
                    poste: null,
                    departement: null,
                    typeContrat: null,      
                    dateEntree: null,   
                    statut: data.statut == 1 ? "Actif" : "Non actif",
                    matricule: data.matricule || "N/A",
                    adresse: data.adresse || "Non spécifiée",
                    telephone: data.telephone || "Non spécifié"
                };

                const contrat = await axios.get(`http://localhost:9090/personnels/${id}/contrat/actif`);
                this.employe.typeContrat = contrat.data.typeContrat.libelle;
                this.employe.dateEntree = contrat.data.dateDebut;
                this.employe.dateFinContrat = contrat.data.dateFin;
                this.employe.periodeEssai = contrat.data.typeContrat.nbMois + ' mois';
                this.employe.poste = contrat.data.poste.nom;
                this.employe.posteDescription = contrat.data.poste.description || "--";
                this.employe.departement = contrat.data.poste.departement.libelle;

            } catch (error) {
                console.error("Erreur lors du chargement employé :", error);
            }
        },
        async chargerHistoriques() {
            const id = this.$route.params.id;
            try {
                const response = await axios.get(`http://localhost:9090/personnels/${id}/contrats`);
                const data = response.data;
                let histo = data.map(item => ({
                    poste: item.poste.nom,
                    departement: item.poste.departement.libelle,
                    salaire: item.salaire,
                    dateDebut: item.dateDebut,
                    dateFin: item.dateFin,
                    typeContrat: item.typeContrat.libelle
                }));
                histo.sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut));
                // Détection mouvement (promotion / mobilité)
                histo = histo.map((item, index) => {
                    if (index === 0) {
                        return { ...item, mouvement: "Premier poste" };
                    }
                    const prev = histo[index - 1];
                    // Mobilité = le département change
                    if (item.departement !== prev.departement) {
                        return { ...item, mouvement: "Mobilité" };
                    }
                    // Promotion = salaire augmente OU poste change dans le même département
                    if (item.salaire > prev.salaire || item.poste !== prev.poste) {
                        return { ...item, mouvement: "Promotion" };
                    }
                    return { ...item, mouvement: "Changement" };
                });
                this.historiquePostes = histo;
            } catch (error) {
                console.error("Erreur lors du chargement de l'historique :", error);
            }
        },
        formatDate(date) {
            if (!date) return 'Non spécifié';
            return new Date(date).toLocaleDateString('fr-FR');
        },
        calculerAnciennete(dateEntree) {
            const entree = new Date(dateEntree);
            const aujourdhui = new Date();
            const annees = aujourdhui.getFullYear() - entree.getFullYear();
            const mois = aujourdhui.getMonth() - entree.getMonth();

            if (mois < 0) {
                return `${annees - 1} an${annees - 1 > 1 ? 's' : ''} et ${12 + mois} mois`;
            }
            return `${annees} an${annees > 1 ? 's' : ''} et ${mois} mois`;
        },
        getIconDocument(type) {
            const icons = {
                'cin': 'mdi:card-account-details',
                'diplome': 'mdi:school',
                'attestation': 'mdi:file-certificate',
                'contrat': 'mdi:file-document'
            };
            return icons[type] || 'mdi:file';
        }
    }
};
</script>