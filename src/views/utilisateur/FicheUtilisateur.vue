<template>
    <div class="fiche-utilisateur p-6">
        <!-- En-tête -->
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Fiche Employé
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
                Gestion des informations personnelles et badge d'identification
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Colonne principale -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Informations personnelles -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                            Informations Personnelles
                        </h2>
                        <button @click="modifierInformations"
                            class="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                            <Icon icon="mdi:pencil" class="w-4 h-4" />
                            <span>{{ modeEdition ? 'Sauvegarder' : 'Modifier' }}</span>
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Photo de profil -->
                        <div class="md:col-span-2 flex items-center space-x-6">
                            <div class="relative">
                                <img :src="getPhotoEmploye(utilisateur.photo)" :alt="utilisateur.nom"
                                    class="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-600 shadow-lg">
                                <button v-if="modeEdition" @click="changerPhoto"
                                    class="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors">
                                    <Icon icon="mdi:camera" class="w-4 h-4" />
                                </button>
                            </div>
                            <div>
                                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">{{ utilisateur.nom }}</h3>
                                <p class="text-gray-600 dark:text-gray-400">{{ utilisateur.poste }}</p>
                                <p class="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                    ID: <span class="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{{
                                        utilisateur.idPersonnel }}</span>
                                </p>
                            </div>
                        </div>

                        <!-- Informations éditable -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nom Complet
                            </label>
                            <input v-model="utilisateur.nom" :disabled="!modeEdition"
                                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-600">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <input v-model="utilisateur.email" type="email" :disabled="!modeEdition"
                                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-600">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Téléphone
                            </label>
                            <input v-model="utilisateur.telephone" :disabled="!modeEdition"
                                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-600">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Département
                            </label>
                            <select v-model="utilisateur.departement" :disabled="!modeEdition"
                                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-600">
                                <option value="IT">IT</option>
                                <option value="RH">Ressources Humaines</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Management">Management</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Poste
                            </label>
                            <input v-model="utilisateur.poste" :disabled="!modeEdition"
                                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-600">
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Date d'embauche
                            </label>
                            <input v-model="utilisateur.dateEmbauche" type="date" :disabled="!modeEdition"
                                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 disabled:bg-gray-50 dark:disabled:bg-gray-600">
                        </div>
                    </div>

                    <!-- Informations supplémentaires en mode édition -->
                    <div v-if="modeEdition" class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                        <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Informations supplémentaires
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Adresse
                                </label>
                                <textarea v-model="utilisateur.adresse" rows="3"
                                    class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Situation familiale
                                </label>
                                <select v-model="utilisateur.situationFamiliale"
                                    class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">
                                    <option value="célibataire">Célibataire</option>
                                    <option value="marié(e)">Marié(e)</option>
                                    <option value="divorcé(e)">Divorcé(e)</option>
                                    <option value="veuf(ve)">Veuf(ve)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Statistiques et congés -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Statistiques -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Statistiques
                        </h3>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600 dark:text-gray-400">Ancienneté</span>
                                <span class="font-semibold text-gray-900 dark:text-white">{{ calculerAnciennete()
                                    }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600 dark:text-gray-400">Congés pris</span>
                                <span class="font-semibold text-gray-900 dark:text-white">{{ utilisateur.congesPris }}
                                    jours</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600 dark:text-gray-400">Congés restants</span>
                                <span class="font-semibold text-green-600 dark:text-green-400">{{
                                    utilisateur.congesRestants }} jours</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600 dark:text-gray-400">Absences cette année</span>
                                <span class="font-semibold text-gray-900 dark:text-white">{{ utilisateur.absences }}
                                    jours</span>
                            </div>
                        </div>
                    </div>

                    <!-- Derniers congés -->
                    <div
                        class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Derniers Congés
                        </h3>
                        <div class="space-y-3">
                            <div v-for="conge in derniersConges" :key="conge.id"
                                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div>
                                    <div class="font-medium text-gray-900 dark:text-white">{{ conge.type }}</div>
                                    <div class="text-sm text-gray-600 dark:text-gray-400">{{ conge.periode }}</div>
                                </div>
                                <span
                                    :class="['px-2 py-1 rounded-full text-xs font-medium', getBadgeClass(conge.statut)]">
                                    {{ getNomStatut(conge.statut) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Colonne latérale -->
            <div class="space-y-6">
                <!-- Badge employé -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                            Badge Employé
                        </h3>
                        <button @click="genererBadge"
                            class="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <Icon icon="mdi:download" class="w-4 h-4" />
                            <span class="text-sm">PDF</span>
                        </button>
                    </div>

                    <!-- Badge visuel -->
                    <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white text-center">
                        <div class="bg-white rounded-full p-1 w-20 h-20 mx-auto mb-4">
                            <img :src="getPhotoEmploye(utilisateur.photo)" :alt="utilisateur.nom"
                                class="w-full h-full rounded-full object-cover">
                        </div>
                        <h4 class="text-xl font-bold mb-1">{{ utilisateur.nom }}</h4>
                        <p class="text-blue-100 mb-2">{{ utilisateur.poste }}</p>
                        <div class="bg-white/20 rounded-lg p-2">
                            <p class="text-sm font-mono">{{ utilisateur.idPersonnel }}</p>
                        </div>
                        <div class="mt-4 flex justify-center space-x-2">
                            <div class="bg-white/20 rounded px-2 py-1 text-xs">
                                {{ utilisateur.departement }}
                            </div>
                            <div class="bg-white/20 rounded px-2 py-1 text-xs">
                                {{ utilisateur.dateEmbauche }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Code QR -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Code QR Personnel
                    </h3>

                    <div class="text-center">
                        <!-- Conteneur QR Code -->
                        <div ref="qrCodeContainer"
                            class="bg-white p-4 rounded-lg border border-gray-200 inline-block mb-4">
                            <canvas ref="qrCanvas" class="mx-auto"></canvas>
                        </div>

                        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Scannez pour accéder aux informations de l'employé
                        </p>

                        <div class="flex justify-center space-x-3">
                            <button @click="telechargerQRCode"
                                class="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                                <Icon icon="mdi:download" class="w-4 h-4" />
                                <span>Télécharger</span>
                            </button>
                            <button @click="imprimerQRCode"
                                class="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <Icon icon="mdi:printer" class="w-4 h-4" />
                                <span>Imprimer</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Actions rapides -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Actions Rapides
                    </h3>
                    <div class="space-y-3">
                        <button @click="voirConges"
                            class="w-full flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <Icon icon="mdi:calendar" class="w-5 h-5 text-blue-500" />
                            <span class="text-gray-700 dark:text-gray-300">Voir les congés</span>
                        </button>
                        <button @click="genererContrat"
                            class="w-full flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <Icon icon="mdi:file-document" class="w-5 h-5 text-green-500" />
                            <span class="text-gray-700 dark:text-gray-300">Générer contrat</span>
                        </button>
                        <button @click="historiqueEmploye"
                            class="w-full flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <Icon icon="mdi:history" class="w-5 h-5 text-purple-500" />
                            <span class="text-gray-700 dark:text-gray-300">Historique</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
    name: "FicheUtilisateur",
    components: {
        Icon
    },
    data() {
        return {
            modeEdition: false,
            utilisateur: {
                id: 1,
                idPersonnel: 'EMP-2025-001',
                nom: 'Marie Dubois',
                email: 'marie.dubois@entreprise.com',
                telephone: '+33 1 23 45 67 89',
                departement: 'IT',
                poste: 'Développeuse Fullstack',
                dateEmbauche: '2023-03-15',
                photo: 'user1',
                adresse: '123 Avenue des Champs-Élysées, 75008 Paris',
                situationFamiliale: 'célibataire',
                congesPris: 15,
                congesRestants: 20,
                absences: 2
            },
            derniersConges: [
                { id: 1, type: 'Congés Payés', periode: '15-25 Jan 2025', statut: 'valide' },
                { id: 2, type: 'Congés Maladie', periode: '5-7 Fév 2025', statut: 'valide' },
                { id: 3, type: 'Congés Exceptionnels', periode: '10-12 Mar 2025', statut: 'en-attente' }
            ]
        };
    },
    mounted() {
        this.genererQRCode();
    },
    methods: {
        getPhotoEmploye(photoId) {
            const photos = {
                'user1': require('@/assets/img/user1.png'),
                'user2': require('@/assets/img/user2.png'),
                'user3': require('@/assets/img/user3.png'),
                'user4': require('@/assets/img/user4.png'),
                'user5': require('@/assets/img/user5.png')
            };
            return photos[photoId] || require('@/assets/img/user2.png');
        },
        modifierInformations() {
            if (this.modeEdition) {
                // Sauvegarder les modifications
                this.$toast.success('Informations mises à jour avec succès');
                // Ici, vous ajouteriez l'appel API pour sauvegarder
            }
            this.modeEdition = !this.modeEdition;
        },
        changerPhoto() {
            // Simuler la sélection d'une nouvelle photo
            this.$toast.info('Fonctionnalité de changement de photo');
        },
        calculerAnciennete() {
            const embauche = new Date(this.utilisateur.dateEmbauche);
            const aujourdhui = new Date();
            const diff = aujourdhui.getFullYear() - embauche.getFullYear();
            return `${diff} an${diff > 1 ? 's' : ''}`;
        },
        getBadgeClass(statut) {
            const classes = {
                'en-attente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                'valide': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                'refuse': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            };
            return classes[statut] || 'bg-gray-100 text-gray-800';
        },
        getNomStatut(statut) {
            const noms = {
                'en-attente': 'En attente',
                'valide': 'Validé',
                'refuse': 'Refusé'
            };
            return noms[statut] || statut;
        },
        genererBadge() {
            this.$toast.success('Génération du badge PDF en cours...');
            // Implémentation de la génération PDF
        },
        genererQRCode() {
            // Données pour le QR Code
            const qrData = {
                id: this.utilisateur.idPersonnel,
                nom: this.utilisateur.nom,
                poste: this.utilisateur.poste,
                departement: this.utilisateur.departement,
                email: this.utilisateur.email
            };

            const qrText = `EMPLOYÉ: ${qrData.nom}\nPOSTE: ${qrData.poste}\nDÉPARTEMENT: ${qrData.departement}\nID: ${qrData.id}\nEMAIL: ${qrData.email}`;

            // Simulation de génération de QR Code
            // En production, utiliser une librairie comme qrcode.js
            this.simulerQRCode(qrText);
        },
        simulerQRCode(text) {
            const canvas = this.$refs.qrCanvas;
            const ctx = canvas.getContext('2d');

            // Dimensions
            canvas.width = 200;
            canvas.height = 200;

            // Fond blanc
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Simulation de motif QR (carrés noirs)
            ctx.fillStyle = 'black';

            // Coins
            ctx.fillRect(10, 10, 40, 40);
            ctx.fillRect(150, 10, 40, 40);
            ctx.fillRect(10, 150, 40, 40);

            // Motif central simplifié
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    if ((i + j) % 3 === 0) {
                        ctx.fillRect(60 + i * 10, 60 + j * 10, 8, 8);
                    }
                }
            }

            // Texte simulé
            ctx.fillStyle = '#333';
            ctx.font = '8px Arial';
            ctx.fillText('QR Code Simulé', 60, 190);
        },
        telechargerQRCode() {
            const canvas = this.$refs.qrCanvas;
            const link = document.createElement('a');
            link.download = `QRCode-${this.utilisateur.idPersonnel}.png`;
            link.href = canvas.toDataURL();
            link.click();
            this.$toast.success('QR Code téléchargé');
        },
        imprimerQRCode() {
            this.$toast.info('Impression du QR Code');
            // Implémentation de l'impression
        },
        voirConges() {
            this.$router.push('/calendrier-conges');
        },
        genererContrat() {
            this.$toast.info('Génération du contrat en cours...');
        },
        historiqueEmploye() {
            this.$toast.info('Ouverture de l\'historique employé');
        }
    }
};
</script>

<style scoped>
.fiche-utilisateur {
    max-width: 1400px;
    margin: 0 auto;
}

/* Styles pour les inputs en mode édition */
input:disabled,
select:disabled,
textarea:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/* Animation pour le badge */
.bg-gradient-to-br {
    background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
}

/* Responsive */
@media (max-width: 1024px) {
    .grid-cols-1.lg\:grid-cols-3 {
        grid-template-columns: 1fr;
    }

    .lg\:col-span-2 {
        grid-column: 1;
    }
}
</style>