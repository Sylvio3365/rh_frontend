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

        <div v-if="errorMessage"
            class="mb-4 p-4 text-red-800 bg-red-100 border border-red-300 rounded-lg dark:bg-red-900 dark:text-red-100 dark:border-red-700">
            {{ errorMessage }}
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
                        Employé depuis {{ employe.anciennete }}
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
                                    <p class="text-sm text-gray-600 dark:text-gray-400"> Département : {{
                                        histo.departement }}</p>
                                    <p class="text-sm text-gray-600 dark:text-gray-400"> Salaire : {{
                                        histo.salaire.toLocaleString() }} MGA </p>
                                    <!-- Badge du mouvement -->
                                    <span class="inline-block mt-1 px-2 py-1 text-xs rounded-full" :class="{
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

                <!-- Documents -->
                <div v-if="ongletActif === 'documents'" class="space-y-4">
                    <div v-if="documents.length === 0" class="text-gray-500 dark:text-gray-400 italic text-center py-6">
                        Aucun document disponible pour cet employé.
                    </div>

                    <!-- Liste documents -->
                    <div v-for="doc in documents" :key="doc.id"
                        class="flex items-center justify-between gap-4 p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow">
                        <img v-if="doc.docs && doc.docs.toLowerCase().endsWith('.jpg') || doc.docs.toLowerCase().endsWith('.png')"
                            :src="`http://localhost:9090/uploads/documents/${doc.docs}`"
                            class="w-14 h-14 object-cover rounded-md border" />
                        <div v-else
                            class="w-14 h-14 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-md">
                            <Icon icon="mdi:file-document" class="text-gray-600 text-3xl" />
                        </div>
                        <div class="flex-1">
                            <h3 class="font-medium text-gray-900 dark:text-white truncate">
                                {{ doc.typeDocument.libelle }}
                            </h3>
                            <span class="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                                Valide
                            </span>
                        </div>
                        <div class="flex flex-col gap-2 text-right">
                            <button @click="afficherDocument(doc)"
                                class="flex items-center gap-1 text-sm px-3 py-1 bg-primary text-white rounded hover:bg-primary/80 transition">
                                <Icon icon="mdi:eye" />
                            </button>
                            <button @click="docToDelete = doc.id; showConfirmDelete = true"
                                class="flex items-center gap-1 text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">
                                <Icon icon="mdi:delete" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Onglet Fiche de Paie -->
                <div v-if="ongletActif === 'fiche-paie'"
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Générer la Fiche de Paie</h2>

                    <!-- Message d'information -->
                    <div v-if="messageFiche" :class="[
                        'mb-4 p-4 rounded-lg border',
                        messageFiche.type === 'success'
                            ? 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-100 dark:border-green-700'
                            : 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-100 dark:border-red-700'
                    ]">
                        {{ messageFiche.text }}
                    </div>

                    <!-- Formulaire de sélection -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Mois
                            </label>
                            <select v-model="moisSelectionne"
                                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                                <option value="">Sélectionnez un mois</option>
                                <option v-for="(mois, index) in listeMois" :key="index" :value="index + 1">
                                    {{ mois }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Année
                            </label>
                            <input type="number" v-model="anneeSelectionnee" min="2000" max="2100"
                                placeholder="Ex: 2025"
                                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Saisissez l'année (ex: 2025)
                            </p>
                        </div>
                    </div>

                    <!-- Bouton de génération -->
                    <div class="flex items-center justify-between">
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                            Le fichier Excel sera généré et téléchargé automatiquement
                        </div>
                        <button @click="genererFichePaie"
                            :disabled="!moisSelectionne || !anneeSelectionnee || generationEnCours" :class="[
                                'px-6 py-3 rounded-lg font-medium transition duration-200',
                                moisSelectionne && anneeSelectionnee && !generationEnCours
                                    ? 'bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg'
                                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            ]">
                            <span v-if="generationEnCours" class="flex items-center">
                                <Icon icon="mdi:loading" class="animate-spin mr-2" />
                                Génération en cours...
                            </span>
                            <span v-else class="flex items-center">
                                <Icon icon="mdi:file-excel" class="mr-2" />
                                Générer la fiche de paie
                            </span>
                        </button>
                    </div>

                    <!-- Historique des fiches générées -->
                    <div v-if="historiqueFiches.length > 0" class="mt-8">
                        <h3 class="text-md font-semibold text-gray-900 dark:text-white mb-4">
                            Historique des fiches générées
                        </h3>
                        <div
                            class="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div v-for="fiche in historiqueFiches" :key="fiche.id"
                                class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-800">
                                <div>
                                    <p class="font-medium text-gray-900 dark:text-white">
                                        {{ getNomMois(fiche.mois) }} {{ fiche.annee }}
                                    </p>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">
                                        Générée le {{ formatDateHeure(fiche.dateGeneration) }}
                                    </p>
                                </div>
                                <button @click="telechargerFicheExistante(fiche.id)"
                                    class="flex items-center text-primary hover:text-primary/80">
                                    <Icon icon="mdi:download" class="mr-1" />
                                    Télécharger
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Zone d'affichage -->
            <!-- MODAL DOCUMENT -->
            <div v-if="modalVisible" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div class="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-xl relative"
                    style="width: 80%; max-width: 900px; max-height: 90%; overflow: auto;">
                    <!-- Bouton fermer -->
                    <button @click="fermerDocument"
                        class="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded">
                        ✖
                    </button>
                    <!-- PDF -->
                    <iframe v-if="documentAffiche && documentAffiche.endsWith('.pdf')" :src="documentAffiche"
                        style="width: 100%; height: 80vh;">
                    </iframe>
                    <!-- Image -->
                    <img v-else-if="documentAffiche" :src="documentAffiche"
                        style="max-width: 100%; max-height: 80vh; margin: auto; display: block;">
                </div>
            </div>

            <!-- Confirmation de suppression -->
            <div v-if="showConfirmDelete"
                class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-[350px] shadow-xl">
                    <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Confirmer la suppression
                    </h2>
                    <p class="text-gray-700 dark:text-gray-300 mb-6">
                        Voulez-vous vraiment supprimer ce document :
                        <strong>{{ docToDelete?.typeDocument?.libelle }}</strong> ?
                    </p>
                    <div class="flex justify-end space-x-3">
                        <button @click="showConfirmDelete = false"
                            class="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400">
                            Annuler
                        </button>

                        <button @click="supprimerDocument"
                            class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
                            Supprimer
                        </button>
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
                                <Icon :icon="getIconDocument(doc.typeDocument)" class="text-gray-400 mr-2" />
                                <span class="text-sm text-gray-700 dark:text-gray-300">{{ doc.typeDocument.libelle
                                }}</span>
                            </div>
                            <button @click="telechargerDocument(doc)" class="text-primary hover:text-primary/80">
                                <Icon icon="mdi:download" />
                            </button>
                        </div>
                    </div>
                    <!-- Formulaire d'ajout -->
                    <div v-if="afficherFormDocument" class="mt-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                        <h3 class="text-md font-semibold mb-3 text-gray-800 dark:text-white">
                            Nouveau document
                        </h3>
                        <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Type de document</label>
                        <select v-model="nouveauDocument.type"
                            class="w-full border rounded p-2 mb-3 dark:bg-gray-800 dark:text-white">
                            <option disabled value="">-- Sélectionner --</option>
                            <option v-for="t in typesDocument" :key="t.idTypeDocument" :value="t.idTypeDocument">
                                {{ t.libelle }}
                            </option>
                        </select>
                        <label class="block text-sm text-gray-700 dark:text-gray-300 mb-1">Fichier</label>
                        <input type="file" @change="onFileSelected"
                            class="w-full border rounded p-2 mb-3 dark:bg-gray-800 dark:text-white" />

                        <div class="flex gap-4">
                            <button @click="envoyerDocument"
                                class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80">
                                Enregistrer
                            </button>

                            <button @click="afficherFormDocument = false" class="px-4 py-2 rounded border">
                                Annuler
                            </button>
                        </div>
                    </div>
                    <button @click="afficherFormDocument = true"
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
                { id: 'fiche-paie', nom: 'Fiche de Paie' }
            ],
            employe: {},
            historiquePostes: [],
            documents: [],
            errorMessage: null,
            afficherFormDocument: false,
            typesDocument: [],
            nouveauDocument: {
                type: "",
                fichier: null
            },
            documentAffiche: null,
            modalVisible: false,
            showConfirmDelete: false,
            docToDelete: null,

            // Données pour l'onglet fiche de paie
            moisSelectionne: '',
            anneeSelectionnee: '',
            listeMois: [
                'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
            ],
            generationEnCours: false,
            messageFiche: null,
            historiqueFiches: []
        };
    },
    mounted() {
        this.chargerEmploye();
        this.chargerHistoriques();
        this.chargerTypesDocument();
        this.chargerDocuments();
    },
    methods: {
        async chargerEmploye() {
            const id = this.$route.params.id;
            try {
                const response = await axios.get(`http://localhost:9090/personnels/${id}`);
                if (!response.data.success) {
                    this.errorMessage = response.data.error;
                    return;
                }
                const data = response.data.data;
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
                    telephone: data.telephone || "Non spécifié",
                    anciennete: data.anciennete || "N/A",
                };

                // ----- contrat actif -----
                const contratRes = await axios.get(
                    `http://localhost:9090/personnels/${id}/contrat/actif`
                );

                if (contratRes.data.success && contratRes.data.data) {
                    const contrat = contratRes.data.data;

                    this.employe.typeContrat = contrat.typeContrat.libelle;
                    this.employe.dateEntree = contrat.dateDebut;
                    this.employe.dateFinContrat = contrat.dateFin;
                    this.employe.periodeEssai = contrat.typeContrat.nbMois + ' mois';
                    this.employe.poste = contrat.poste.nom;
                    this.employe.posteDescription = contrat.poste.description || "--";
                    this.employe.departement = contrat.poste.departement.libelle;
                }

            } catch (error) {
                console.error("Erreur lors du chargement employé :", error);
            }
        },
        async chargerHistoriques() {
            const id = this.$route.params.id;
            try {
                const response = await axios.get(`http://localhost:9090/personnels/${id}/contrats`);
                if (!response.data.success) {
                    this.errorMessage = response.data.error;
                    return;
                }
                const data = response.data.data;
                let histo = data.map(item => ({
                    poste: item.poste.nom,
                    departement: item.poste.departement.libelle,
                    salaire: item.salaire,
                    dateDebut: item.dateDebut,
                    dateFin: item.dateFin,
                    typeContrat: item.typeContrat.libelle
                }));
                histo.sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut));
                histo = histo.map((item, index) => {
                    if (index === 0) return { ...item, mouvement: "Premier poste" };
                    const prev = histo[index - 1];
                    if (item.departement !== prev.departement) {
                        return { ...item, mouvement: "Mobilité" };
                    }
                    if (item.salaire > prev.salaire || item.poste !== prev.poste) {
                        return { ...item, mouvement: "Promotion" };
                    }

                    return { ...item, mouvement: "Changement" };
                });

                this.historiquePostes = histo;

            } catch (error) {
                this.errorMessage = response.data.error;
                console.error("Erreur lors du chargement de l'historique :", error);
            }
        },
        async chargerTypesDocument() {
            const res = await axios.get("http://localhost:9090/documents/types");
            if (res.data.success) {
                this.typesDocument = res.data.data;
            }
        },
        async chargerDocuments() {
            const id = this.$route.params.id;
            try {
                const res = await axios.get(`http://localhost:9090/personnels/${id}/documents`);
                if (!res.data.success) {
                    this.errorMessage = res.data.error;
                }
                this.documents = res.data.data;
            } catch (error) {
                this.errorMessage = res.data.error;
            }

        },
        formatDate(date) {
            if (!date) return 'Non spécifié';
            return new Date(date).toLocaleDateString('fr-FR');
        },
        getIconDocument(type) {
            const icons = {
                'cin': 'mdi:card-account-details',
                'diplome': 'mdi:school',
                'attestation': 'mdi:file-certificate',
                'contrat': 'mdi:file-document'
            };
            return icons[type] || 'mdi:file';
        },
        onFileSelected(e) {
            this.nouveauDocument.fichier = e.target.files[0];
        },
        async envoyerDocument() {
            console.log("Types documents reçus :", this.nouveauDocument);
            if (!this.nouveauDocument.type || !this.nouveauDocument.fichier) {
                alert("Veuillez remplir tous les champs.");
                return;
            }

            const id = this.$route.params.id;
            const formData = new FormData();
            formData.append("id_personnel", id);
            formData.append("id_type_document", this.nouveauDocument.type);
            formData.append("fichier", this.nouveauDocument.fichier);
            try {
                const res = await axios.post("http://localhost:9090/documents/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                if (!res.data.success) {
                    this.errorMessage = res.data.error;
                    return;
                }

                this.afficherFormDocument = false;
                this.nouveauDocument = { type: "", fichier: null };

                this.chargerDocuments();

            } catch (err) {
                console.error("Erreur upload :", err);
                this.errorMessage = "Erreur lors de l'upload.";
            }
        },
        afficherDocument(doc) {
            this.documentAffiche = "http://localhost:9090/uploads/documents/" + doc.docs;
            this.modalVisible = true;
        },
        fermerDocument() {
            this.modalVisible = false;
            this.documentAffiche = null;
        },
        async supprimerDocument() {
            if (!this.docToDelete) return;
            try {
                const res = await axios.delete(`http://localhost:9090/documents/${this.docToDelete.idPersonnel}/${this.docToDelete.idTypeDocument}`);
                if (!res.data.success) {
                    this.errorMessage = res.data.error;
                    return;
                }
                this.chargerDocuments();
            } catch (e) {
                console.error("Erreur lors de la suppression du document :", e);
            }

            this.showConfirmDelete = false;
            this.docToDelete = null;
        },
        telechargerDocument(doc) {
            const url = `http://localhost:9090/documents/download/${doc.docs}`;
            const link = document.createElement('a');
            link.href = url;
            link.download = doc.docs;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        },

        // Méthodes pour l'onglet fiche de paie
        async genererFichePaie() {
            if (!this.moisSelectionne || !this.anneeSelectionnee) {
                this.messageFiche = {
                    type: 'error',
                    text: 'Veuillez sélectionner un mois et une année'
                };
                return;
            }

            this.generationEnCours = true;
            this.messageFiche = null;

            try {
                const id = this.$route.params.id;
                const url = `http://localhost:9090/api/fiche-paie/${id}/excel?mois=${this.moisSelectionne}&annee=${this.anneeSelectionnee}`;

                // Utiliser axios pour télécharger le fichier
                const response = await axios({
                    url: url,
                    method: 'GET',
                    responseType: 'blob', // Important pour les fichiers
                });

                // Créer un lien pour télécharger le fichier
                const blob = new Blob([response.data], {
                    type: response.headers['content-type']
                });
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;

                // Nom du fichier basé sur la date
                const nomFichier = `fiche_paie_${this.employe.nom}_${this.employe.prenom}_${this.moisSelectionne}_${this.anneeSelectionnee}.xlsx`;
                link.download = nomFichier;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(downloadUrl);

                // Message de succès
                this.messageFiche = {
                    type: 'success',
                    text: `Fiche de paie générée avec succès pour ${this.getNomMois(this.moisSelectionne)} ${this.anneeSelectionnee}`
                };

                // Ajouter à l'historique
                this.historiqueFiches.unshift({
                    id: Date.now(),
                    mois: this.moisSelectionne,
                    annee: this.anneeSelectionnee,
                    dateGeneration: new Date().toISOString()
                });

                // Réinitialiser les sélections
                this.moisSelectionne = '';
                this.anneeSelectionnee = '';

            } catch (error) {
                console.error('Erreur lors de la génération de la fiche de paie:', error);
                this.messageFiche = {
                    type: 'error',
                    text: 'Erreur lors de la génération de la fiche de paie. Veuillez réessayer.'
                };
            } finally {
                this.generationEnCours = false;
            }
        },

        getNomMois(numeroMois) {
            return this.listeMois[numeroMois - 1] || '';
        },

        formatDateHeure(dateISO) {
            if (!dateISO) return '';
            const date = new Date(dateISO);
            return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR');
        },

        telechargerFicheExistante(idFiche) {
            // Cette méthode pourrait appeler une API pour télécharger une fiche existante
            // Pour l'instant, on affiche un message
            alert('Fonctionnalité de téléchargement des fiches existantes à implémenter');
        }
    }
};
</script>

<style scoped>
/* Animation pour le bouton de chargement */
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