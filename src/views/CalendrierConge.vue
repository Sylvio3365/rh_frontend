<template>
    <div class="calendrier-conge p-4">
        <div class="mt-2 w-full">
            <div class="lg:flex grid-cols-1 lg:space-y-0 space-y-3 gap-5 justify-between">
                <div>
                    <p class="uppercase text-xs text-gray-700 font-semibold">Gestion des congés</p>
                    <h1 class="text-2xl text-gray-900 dark:text-gray-200 font-medium">
                        Calendrier des Congés
                    </h1>
                </div>
                <div class="flex gap-2">
                    <button
                        class="bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700 border rounded py-2 px-5"
                        @click="afficherAujourdhui">
                        Aujourd'hui
                    </button>
                    <button
                        class="bg-primary border flex gap-2 text-white hover:bg-primary/80 dark:border-gray-700 rounded py-3 px-5"
                        @click="openNouvelleDemande">
                        <span class="icon text-2xl">
                            <Icon icon="ic:twotone-plus" />
                        </span>
                        <span class="text"> Nouvelle Demande</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Filtres -->
        <div class="mt-5 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
            <div class="flex flex-wrap gap-4 items-center">
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span class="text-sm text-gray-600 dark:text-gray-400">Créé</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 bg-yellow-500 rounded-full"></span>
                    <span class="text-sm text-gray-600 dark:text-gray-400">En attente</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span class="text-sm text-gray-600 dark:text-gray-400">Validé</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span class="text-sm text-gray-600 dark:text-gray-400">Refusé</span>
                </div>

                <select v-model="filtreDepartement"
                    class="ml-auto border dark:border-gray-600 dark:bg-gray-700 rounded px-3 py-2 text-sm">
                    <option value="">Tous les départements</option>
                    <option value="IT">IT</option>
                    <option value="RH">Ressources Humaines</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                </select>
            </div>
        </div>

        <!-- Calendrier -->
        <div class="mt-5 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 shadow-sm">
            <div class="flex justify-between items-center mb-6">
                <button @click="moisPrecedent"
                    class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Icon icon="heroicons:chevron-left-20-solid" class="text-xl text-gray-600 dark:text-gray-400" />
                </button>

                <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ moisCourant }} {{ anneeCourante }}
                </h2>

                <button @click="moisSuivant"
                    class="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Icon icon="heroicons:chevron-right-20-solid" class="text-xl text-gray-600 dark:text-gray-400" />
                </button>
            </div>

            <!-- En-têtes des jours -->
            <div class="grid grid-cols-7 gap-2 mb-4">
                <div v-for="jour in joursSemaine" :key="jour"
                    class="text-center py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    {{ jour }}
                </div>
            </div>

            <!-- Grille du calendrier -->
            <div class="grid grid-cols-7 gap-2">
                <div v-for="(jour, index) in joursCalendrier" :key="index" :class="[
                    'min-h-28 p-3 border-2 rounded-xl transition-all duration-200',
                    !jour.estCeMois ? 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400' :
                        jour.estAujourdhui ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 shadow-sm' :
                            'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                ]">
                    <!-- Numéro du jour -->
                    <div class="flex justify-between items-start mb-2">
                        <span :class="[
                            'text-sm font-semibold',
                            jour.estAujourdhui ? 'text-blue-600 dark:text-blue-400' :
                                !jour.estCeMois ? 'text-gray-400' : 'text-gray-900 dark:text-white'
                        ]">
                            {{ jour.numero }}
                        </span>
                        <span v-if="jour.estWeekend" class="text-xs text-red-500 font-medium">
                            ●
                        </span>
                    </div>

                    <!-- Indicateurs de congés -->
                    <div class="space-y-2">
                        <div v-for="conge in getCongesPourJour(jour.date)" :key="conge.id" :class="[
                            'text-xs p-2 rounded-lg cursor-pointer font-medium transition-all hover:scale-105',
                            getCouleurConge(conge.statut)
                        ]" @click="voirDetailsConge(conge)" :title="getTooltipConge(conge)">
                            <div class="flex items-center justify-between">
                                <span class="truncate flex-1 mr-2">
                                    {{ getTypeAbrege(conge.type) }}
                                </span>
                                <span class="flex-shrink-0">
                                    {{ getStatutAbrege(conge.statut) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Compteur de congés -->
                    <div v-if="getNombreCongesJour(jour.date) > 0" class="absolute bottom-2 right-2">
                        <span
                            class="text-xs bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center font-semibold shadow-sm">
                            {{ getNombreCongesJour(jour.date) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Résumé du mois -->
        <div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div v-for="stat in statistiquesMois" :key="stat.statut" :class="[
                'p-4 rounded-xl border-2 transition-all hover:scale-105 cursor-pointer',
                stat.classes
            ]" @click="filtrerParStatut(stat.statut)">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-2xl font-bold">{{ stat.nombre }}</p>
                        <p class="text-sm font-medium mt-1">{{ stat.label }}</p>
                    </div>
                    <div class="text-2xl opacity-80">
                        <Icon :icon="stat.icon" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Détails des congés -->
        <div class="mt-6 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 shadow-sm">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Détails des congés</h3>
                <div class="flex gap-2">
                    <button v-for="statut in ['Tous', 'Créé', 'En attente', 'Validé', 'Refusé']" :key="statut"
                        @click="filtreStatut = statut === 'Tous' ? '' : statut" :class="[
                            'px-3 py-1 rounded-lg text-sm font-medium transition-all',
                            filtreStatut === (statut === 'Tous' ? '' : statut)
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        ]">
                        {{ statut }}
                    </button>
                </div>
            </div>

            <div class="space-y-3">
                <div v-for="conge in congesFiltres" :key="conge.id"
                    class="flex items-center justify-between p-4 border-2 dark:border-gray-600 rounded-xl hover:shadow-md transition-all"
                    :class="getCouleurConge(conge.statut)">
                    <div class="flex items-center space-x-4">
                        <div
                            class="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-2 shadow-sm">
                            <span class="text-sm font-bold">{{ conge.employePrenom.charAt(0) }}{{
                                conge.employeNom.charAt(0) }}</span>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-gray-900 dark:text-white">
                                {{ conge.employePrenom }} {{ conge.employeNom }}
                            </p>
                            <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {{ conge.type }} • {{ conge.departement }}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                {{ formatDateComplete(conge.debut) }} - {{ formatDateComplete(conge.fin) }}
                            </p>
                        </div>
                    </div>
                    <div class="text-right">
                        <span :class="getBadgeStatut(conge.statut)" class="text-xs font-semibold">
                            {{ conge.statut }}
                        </span>
                        <p class="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">
                            {{ conge.duree }} jour(s)
                        </p>
                    </div>
                </div>

                <div v-if="congesFiltres.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Icon icon="heroicons:calendar-20-solid" class="text-4xl mx-auto mb-3 opacity-50" />
                    <p>Aucun congé trouvé pour les critères sélectionnés</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
    name: "CalendrierConge",
    components: {
        Icon,
    },
    data() {
        return {
            dateCourante: new Date(),
            filtreDepartement: "",
            filtreStatut: "",
            joursSemaine: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            conges: [
                {
                    id: 1,
                    employeId: 1,
                    employePrenom: "Marie",
                    employeNom: "Dubois",
                    type: "Congés payés",
                    debut: "2024-11-15",
                    fin: "2024-11-22",
                    duree: 8,
                    statut: "Validé",
                    departement: "IT",
                    dateDemande: "2024-10-20"
                },
                {
                    id: 2,
                    employeId: 2,
                    employePrenom: "Pierre",
                    employeNom: "Martin",
                    type: "RTT",
                    debut: "2024-11-18",
                    fin: "2024-11-20",
                    duree: 3,
                    statut: "En attente",
                    departement: "Management",
                    dateDemande: "2024-10-25"
                },
                {
                    id: 3,
                    employePrenom: "Sophie",
                    employeNom: "Laurent",
                    employeId: 3,
                    type: "Congés payés",
                    debut: "2024-11-25",
                    fin: "2024-11-29",
                    duree: 5,
                    statut: "Créé",
                    departement: "RH",
                    dateDemande: "2024-11-05"
                },
                {
                    id: 4,
                    employeId: 4,
                    employePrenom: "Thomas",
                    employeNom: "Bernard",
                    type: "RTT",
                    debut: "2024-12-05",
                    fin: "2024-12-06",
                    duree: 2,
                    statut: "Refusé",
                    departement: "IT",
                    dateDemande: "2024-11-10"
                },
                {
                    id: 5,
                    employeId: 5,
                    employePrenom: "Julie",
                    employeNom: "Petit",
                    type: "Congés payés",
                    debut: "2024-11-10",
                    fin: "2024-11-12",
                    duree: 3,
                    statut: "Validé",
                    departement: "Design",
                    dateDemande: "2024-10-15"
                },
                {
                    id: 6,
                    employeId: 6,
                    employePrenom: "David",
                    employeNom: "Moreau",
                    type: "Congés payés",
                    debut: "2024-11-28",
                    fin: "2024-12-02",
                    duree: 5,
                    statut: "En attente",
                    departement: "IT",
                    dateDemande: "2024-11-08"
                }
            ]
        };
    },
    computed: {
        moisCourant() {
            return this.dateCourante.toLocaleString('fr-FR', { month: 'long' });
        },
        anneeCourante() {
            return this.dateCourante.getFullYear();
        },
        joursCalendrier() {
            const year = this.dateCourante.getFullYear();
            const month = this.dateCourante.getMonth();

            const premierJour = new Date(year, month, 1);
            const dernierJour = new Date(year, month + 1, 0);

            premierJour.setHours(0, 0, 0, 0);
            dernierJour.setHours(0, 0, 0, 0);

            const jours = [];

            const premierJourSemaine = premierJour.getDay();
            const debutCalendrier = new Date(premierJour);
            debutCalendrier.setDate(premierJour.getDate() - (premierJourSemaine === 0 ? 6 : premierJourSemaine - 1));

            for (let i = 0; i < 42; i++) {
                const date = new Date(debutCalendrier);
                date.setDate(debutCalendrier.getDate() + i);
                date.setHours(0, 0, 0, 0);

                const aujourdhui = new Date();
                aujourdhui.setHours(0, 0, 0, 0);

                jours.push({
                    numero: date.getDate(),
                    date: this.formatDateISO(date),
                    estCeMois: date.getMonth() === month,
                    estAujourdhui: date.getTime() === aujourdhui.getTime(),
                    estWeekend: date.getDay() === 0 || date.getDay() === 6
                });
            }

            return jours;
        },
        congesFiltres() {
            let filtered = this.conges;

            if (this.filtreDepartement) {
                filtered = filtered.filter(conge => conge.departement === this.filtreDepartement);
            }

            if (this.filtreStatut) {
                filtered = filtered.filter(conge => conge.statut === this.filtreStatut);
            }

            return filtered;
        },
        statistiquesMois() {
            const stats = {
                'Créé': { nombre: 0, label: 'Créés', icon: 'heroicons:document-plus-20-solid', classes: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' },
                'En attente': { nombre: 0, label: 'En attente', icon: 'heroicons:clock-20-solid', classes: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200' },
                'Validé': { nombre: 0, label: 'Validés', icon: 'heroicons:check-circle-20-solid', classes: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' },
                'Refusé': { nombre: 0, label: 'Refusés', icon: 'heroicons:x-circle-20-solid', classes: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200' }
            };

            this.conges.forEach(conge => {
                if (stats[conge.statut]) {
                    stats[conge.statut].nombre++;
                }
            });

            return Object.values(stats);
        }
    },
    methods: {
        formatDateISO(date) {
            return date.toISOString().split('T')[0];
        },
        formatDate(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
        },
        formatDateComplete(dateStr) {
            const date = new Date(dateStr);
            return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
        },
        getCongesPourJour(dateRechercheStr) {
            try {
                const dateRecherche = new Date(dateRechercheStr + 'T00:00:00');
                return this.conges.filter(conge => {
                    const debutConge = new Date(conge.debut + 'T00:00:00');
                    const finConge = new Date(conge.fin + 'T00:00:00');

                    return dateRecherche >= debutConge && dateRecherche <= finConge &&
                        (!this.filtreDepartement || conge.departement === this.filtreDepartement) &&
                        (!this.filtreStatut || conge.statut === this.filtreStatut);
                });
            } catch (error) {
                console.error('Erreur dans getCongesPourJour:', error);
                return [];
            }
        },
        getNombreCongesJour(date) {
            return this.getCongesPourJour(date).length;
        },
        getCouleurConge(statut) {
            const couleurs = {
                'Créé': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-700',
                'En attente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700',
                'Validé': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-700',
                'Refusé': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-700'
            };
            return couleurs[statut] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200 dark:border-gray-700';
        },
        getBadgeStatut(statut) {
            const classes = {
                'Créé': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                'En attente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                'Validé': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                'Refusé': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            };
            return `px-3 py-1 rounded-full text-xs font-semibold ${classes[statut] || 'bg-gray-100 text-gray-800'}`;
        },
        getStatutAbrege(statut) {
            const abreviations = {
                'Créé': 'CRÉÉ',
                'En attente': 'ATT',
                'Validé': 'OK',
                'Refusé': 'NOK'
            };
            return abreviations[statut] || statut;
        },
        getTypeAbrege(type) {
            const abreviations = {
                'Congés payés': 'CP',
                'RTT': 'RTT'
            };
            return abreviations[type] || type;
        },
        getTooltipConge(conge) {
            return `${conge.employePrenom} ${conge.employeNom}\n${conge.type} (${conge.statut})\n${this.formatDateComplete(conge.debut)} - ${this.formatDateComplete(conge.fin)}`;
        },
        moisPrecedent() {
            this.dateCourante = new Date(this.dateCourante.getFullYear(), this.dateCourante.getMonth() - 1, 1);
        },
        moisSuivant() {
            this.dateCourante = new Date(this.dateCourante.getFullYear(), this.dateCourante.getMonth() + 1, 1);
        },
        afficherAujourdhui() {
            this.dateCourante = new Date();
        },
        filtrerParStatut(statut) {
            this.filtreStatut = statut;
        },
        voirDetailsConge(conge) {
            alert(`Détails du congé:\n\nEmployé: ${conge.employePrenom} ${conge.employeNom}\nType: ${conge.type}\nStatut: ${conge.statut}\nDu: ${this.formatDateComplete(conge.debut)}\nAu: ${this.formatDateComplete(conge.fin)}\nDurée: ${conge.duree} jours`);
        },
        openNouvelleDemande() {
            alert('Ouvrir le formulaire de demande de congé');
        }
    },
    mounted() {
        console.log('Calendrier chargé avec', this.conges.length, 'congés');
    }
};
</script>

<style scoped>
.calendrier-conge {
    min-height: 100vh;
}
</style>