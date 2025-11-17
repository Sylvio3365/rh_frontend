<template>
    <div class="calendrier-conges p-6">
        <!-- En-tête -->
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Calendrier des Congés
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
                Visualisation globale des absences et congés de l'entreprise
            </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <!-- Calendrier principal -->
            <div class="lg:col-span-3">
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <!-- Contrôles du calendrier -->
                    <div class="flex justify-between items-center mb-6">
                        <div class="flex gap-3">
                            <button @click="afficherAujourdhui"
                                class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                Aujourd'hui
                            </button>
                            <div class="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                <button @click="changerVue('dayGridMonth')"
                                    :class="['px-4 py-2', vueActive === 'dayGridMonth' ? 'bg-primary text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700']">
                                    Mois
                                </button>
                                <button @click="changerVue('timeGridWeek')"
                                    :class="['px-4 py-2', vueActive === 'timeGridWeek' ? 'bg-primary text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700']">
                                    Semaine
                                </button>
                                <button @click="changerVue('listMonth')"
                                    :class="['px-4 py-2', vueActive === 'listMonth' ? 'bg-primary text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700']">
                                    Liste
                                </button>
                            </div>
                        </div>
                        <div class="text-xl font-semibold text-gray-900 dark:text-white">
                            {{ titreCalendrier }}
                        </div>
                        <div class="flex gap-2">
                            <button @click="calendrierPrev"
                                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <Icon icon="mdi:chevron-left" />
                            </button>
                            <button @click="calendrierNext"
                                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                <Icon icon="mdi:chevron-right" />
                            </button>
                        </div>
                    </div>

                    <!-- Instructions à gauche -->
                    <div class="flex items-center mb-4 text-sm text-gray-600 dark:text-gray-400">
                        <Icon icon="mdi:information" class="w-4 h-4 mr-2 text-blue-500" />
                        <span><strong>Clic normal</strong> : Modifier le statut</span>
                        <span class="mx-2">•</span>
                        <span><strong>Ctrl + Clic</strong> : Modifier la durée</span>
                    </div>

                    <!-- Calendrier FullCalendar -->
                    <FullCalendar ref="calendarRef" :options="calendarOptions" />
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Légende des types de congé -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Types de Congé
                    </h3>
                    <div class="space-y-3">
                        <div v-for="type in typesConge" :key="type.id" class="flex items-center">
                            <div class="w-4 h-4 rounded mr-3" :style="{ backgroundColor: type.couleur }"></div>
                            <span class="text-sm text-gray-700 dark:text-gray-300">{{ type.nom }}</span>
                        </div>
                    </div>
                </div>

                <!-- Légende des statuts -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Statuts
                    </h3>
                    <div class="space-y-3">
                        <div v-for="statut in legendesStatut" :key="statut.id" class="flex items-center">
                            <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: statut.couleur }"></div>
                            <span class="text-sm text-gray-700 dark:text-gray-300">{{ statut.nom }}</span>
                        </div>
                    </div>
                </div>

                <!-- Filtres -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Filtres
                    </h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Département
                            </label>
                            <select v-model="filtres.departement"
                                class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">
                                <option value="">Tous les départements</option>
                                <option value="IT">IT</option>
                                <option value="RH">Ressources Humaines</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Type de congé
                            </label>
                            <div class="space-y-2">
                                <label v-for="type in typesConge" :key="type.id" class="flex items-center">
                                    <input type="checkbox" :value="type.id" v-model="filtres.types"
                                        class="rounded border-gray-300 text-primary focus:ring-primary">
                                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ type.nom }}</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Statut
                            </label>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input type="checkbox" value="valide" v-model="filtres.statuts"
                                        class="rounded border-gray-300 text-primary focus:ring-primary">
                                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Validés</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" value="en-attente" v-model="filtres.statuts"
                                        class="rounded border-gray-300 text-primary focus:ring-primary">
                                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">En attente</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="checkbox" value="refuse" v-model="filtres.statuts"
                                        class="rounded border-gray-300 text-primary focus:ring-primary">
                                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Refusés</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Alertes -->
                <div
                    class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div class="flex items-start">
                        <Icon icon="mdi:alert" class="text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
                        <div>
                            <div class="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                                Alertes en cours
                            </div>
                            <div class="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                                <div>• 3 demandes en attente > 7 jours</div>
                                <div>• 2 employés en absence non justifiée</div>
                                <div>• 1 département avec 40% d'absence</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de modification -->
        <ModalModificationStatut v-if="showModalStatut" :event="eventSelectionne" :statut-actuel="nouveauStatut"
            @update:statut="confirmerChangementStatut" @close="fermerModalStatut" />

        <!-- Modal de modification de durée -->
        <ModalModificationDuree v-if="showModalDuree" :event="eventSelectionne"
            @update:duree="confirmerModificationDuree" @close="fermerModalDuree" />
    </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import ModalModificationStatut from './ModalModificationStatut.vue';
import ModalModificationDuree from './ModalModificationDuree.vue';

export default {
    name: "CalendrierConges",
    components: {
        Icon,
        FullCalendar,
        ModalModificationStatut,
        ModalModificationDuree
    },
    data() {
        return {
            vueActive: 'dayGridMonth',
            titreCalendrier: '',
            showModalStatut: false,
            showModalDuree: false,
            eventSelectionne: null,
            nouveauStatut: '',
            filtres: {
                departement: '',
                types: ['payes', 'maladie', 'exceptionnel', 'sans-solde'],
                statuts: ['valide', 'en-attente', 'refuse']
            },
            typesConge: [
                { id: 'payes', nom: 'Congés Payés', couleur: '#3B82F6' },
                { id: 'maladie', nom: 'Congés Maladie', couleur: '#10B981' },
                { id: 'exceptionnel', nom: 'Congés Exceptionnels', couleur: '#8B5CF6' },
                { id: 'sans-solde', nom: 'Sans Solde', couleur: '#6B7280' }
            ],
            legendesStatut: [
                { id: 'valide', nom: 'Validé', couleur: '#10B981' },
                { id: 'en-attente', nom: 'En attente', couleur: '#F59E0B' },
                { id: 'refuse', nom: 'Refusé', couleur: '#EF4444' }
            ],
            calendarOptions: {
                plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
                initialView: 'dayGridMonth',
                headerToolbar: false,
                events: this.getEvenementsCalendrier(),
                eventClick: this.handleEventClick,
                dateClick: this.handleDateClick,
                eventDrop: this.handleEventDrop,
                eventResize: this.handleEventResize,
                editable: true,
                droppable: true,
                eventsSet: this.handleEventsSet,
                eventDisplay: 'block',
                eventTimeFormat: {
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false
                },
                locale: 'fr',
                firstDay: 1,
                buttonText: {
                    today: 'Aujourd\'hui',
                    month: 'Mois',
                    week: 'Semaine',
                    day: 'Jour',
                    list: 'Liste'
                },
                views: {
                    dayGridMonth: {
                        dayMaxEventRows: 4,
                        moreLinkClick: 'week'
                    },
                    timeGridWeek: {
                        dayMaxEvents: 6
                    }
                },
                eventContent: this.renderEventContent,
                eventDidMount: this.handleEventMount
            }
        };
    },
    methods: {
        getEvenementsCalendrier() {
            return [
                {
                    id: 1,
                    title: 'Marie Dubois',
                    start: '2025-01-20',
                    end: '2025-01-28',
                    extendedProps: {
                        type: 'payes',
                        statut: 'valide',
                        employe: 'Marie Dubois',
                        departement: 'IT',
                        motif: 'Vacances de Noël',
                        photo: 'user1',
                        duree: '9 jours'
                    },
                    backgroundColor: '#3B82F6',
                    borderColor: '#3B82F6',
                    editable: false
                },
                {
                    id: 2,
                    title: 'Pierre Martin',
                    start: '2025-02-15',
                    end: '2025-02-19',
                    extendedProps: {
                        type: 'maladie',
                        statut: 'valide',
                        employe: 'Pierre Martin',
                        departement: 'Management',
                        motif: 'Grippe',
                        photo: 'user2',
                        duree: '5 jours'
                    },
                    backgroundColor: '#10B981',
                    borderColor: '#10B981',
                    editable: false
                },
                {
                    id: 3,
                    title: 'Sophie Laurent',
                    start: '2025-03-05',
                    end: '2025-03-07',
                    extendedProps: {
                        type: 'exceptionnel',
                        statut: 'en-attente',
                        employe: 'Sophie Laurent',
                        departement: 'RH',
                        motif: 'Mariage',
                        photo: 'user3',
                        duree: '3 jours'
                    },
                    backgroundColor: '#8B5CF6',
                    borderColor: '#8B5CF6',
                    editable: true
                },
                {
                    id: 4,
                    title: 'Thomas Bernard',
                    start: '2025-01-25',
                    end: '2025-01-26',
                    extendedProps: {
                        type: 'sans-solde',
                        statut: 'refuse',
                        employe: 'Thomas Bernard',
                        departement: 'IT',
                        motif: 'Raison personnelle',
                        photo: 'user4',
                        duree: '2 jours'
                    },
                    backgroundColor: '#6B7280',
                    borderColor: '#6B7280',
                    editable: true
                },
                {
                    id: 5,
                    title: 'Julie Moreau',
                    start: '2025-02-10',
                    end: '2025-02-15',
                    extendedProps: {
                        type: 'payes',
                        statut: 'en-attente',
                        employe: 'Julie Moreau',
                        departement: 'Marketing',
                        motif: 'Vacances',
                        photo: 'user5',
                        duree: '6 jours'
                    },
                    backgroundColor: '#3B82F6',
                    borderColor: '#3B82F6',
                    editable: true
                }
            ];
        },
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
        renderEventContent(eventInfo) {
            const event = eventInfo.event;
            const props = event.extendedProps;
            const statut = this.getNomStatut(props.statut);
            const statutColor = this.getCouleurStatut(props.statut);
            const badgeClass = this.getBadgeClass(props.statut);
            const photo = this.getPhotoEmploye(props.photo);

            return {
                html: `
          <div class="fc-event-content">
            <div class="flex items-center space-x-2">
              <!-- Point de statut à gauche -->
              <div class="fc-event-statut-point" style="background-color: ${statutColor}"></div>
              
              <!-- Photo de l'utilisateur -->
              <img src="${photo}" alt="${props.employe}" class="w-4 h-4 rounded-full object-cover flex-shrink-0">
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <div class="fc-event-title truncate text-xs font-medium">${props.employe}</div>
                  <span class="${badgeClass} fc-event-badge">${statut}</span>
                </div>
                <div class="fc-event-details text-xs text-gray-600 dark:text-gray-400 truncate">
                  ${this.getNomType(props.type)} • ${props.duree}
                </div>
              </div>
            </div>
          </div>
        `
            };
        },
        getBadgeClass(statut) {
            const classes = {
                'en-attente': 'bg-yellow-500 text-white',
                'valide': 'bg-green-500 text-white',
                'refuse': 'bg-red-500 text-white'
            };
            return `text-xs px-2 py-1 rounded-full font-semibold ${classes[statut] || 'bg-gray-500 text-white'}`;
        },
        handleEventMount(info) {
            const event = info.event;
            const props = event.extendedProps;

            if (props.statut === 'valide') {
                info.el.classList.add('fc-event-non-modifiable');
            }

            info.el.style.fontSize = '0.7rem';
            info.el.style.padding = '4px 6px';
            info.el.style.marginBottom = '2px';
        },
        handleEventClick(clickInfo) {
            const event = clickInfo.event;

            // Réinitialiser la sélection à chaque clic
            this.eventSelectionne = {
                id: event.id,
                employe: event.extendedProps.employe,
                type: event.extendedProps.type,
                statut: event.extendedProps.statut,
                motif: event.extendedProps.motif,
                photo: event.extendedProps.photo,
                departement: event.extendedProps.departement,
                start: event.start,
                end: event.end,
                duree: event.extendedProps.duree
            };
            this.nouveauStatut = event.extendedProps.statut;

            // Fermer les modaux ouverts
            this.showModalStatut = false;
            this.showModalDuree = false;

            // Ouvrir le modal approprié selon le contexte
            if (clickInfo.jsEvent.ctrlKey) {
                this.showModalDuree = true;
            } else {
                this.showModalStatut = true;
            }
        },
        fermerModalStatut() {
            this.showModalStatut = false;
            this.eventSelectionne = null;
            this.nouveauStatut = '';
        },
        fermerModalDuree() {
            this.showModalDuree = false;
            this.eventSelectionne = null;
        },
        handleDateClick(clickInfo) {
            this.$router.push({
                path: '/conges/nouveau',
                query: { date: clickInfo.dateStr }
            });
        },
        handleEventDrop(dropInfo) {
            const event = dropInfo.event;
            const props = event.extendedProps;

            if (props.statut === 'valide') {
                dropInfo.revert();
                this.$toast.warning('Les congés validés ne peuvent pas être modifiés');
                return;
            }

            this.mettreAJourCongé(event.id, {
                start: event.start,
                end: event.end
            });
        },
        handleEventResize(resizeInfo) {
            const event = resizeInfo.event;
            const props = event.extendedProps;

            if (props.statut === 'valide') {
                resizeInfo.revert();
                this.$toast.warning('Les congés validés ne peuvent pas être modifiés');
                return;
            }

            this.mettreAJourCongé(event.id, {
                start: event.start,
                end: event.end
            });
        },
        async mettreAJourCongé(id, modifications) {
            try {
                console.log('Mise à jour du congé:', id, modifications);
                const calendarApi = this.$refs.calendarRef.getApi();
                const event = calendarApi.getEventById(id);

                if (event) {
                    // Recalculer la durée
                    const start = new Date(modifications.start);
                    const end = new Date(modifications.end);
                    const diffTime = Math.abs(end - start);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    event.setExtendedProp('duree', `${diffDays} jour${diffDays > 1 ? 's' : ''}`);
                    event.setProp('title', `${event.extendedProps.employe}`);
                }

                this.$toast.success('Congé mis à jour avec succès');
            } catch (error) {
                console.error('Erreur mise à jour:', error);
                this.$toast.error('Erreur lors de la mise à jour');
            }
        },
        confirmerChangementStatut(nouveauStatut) {
            if (this.eventSelectionne) {
                this.mettreAJourCongé(this.eventSelectionne.id, {
                    statut: nouveauStatut
                });

                const calendarApi = this.$refs.calendarRef.getApi();
                const event = calendarApi.getEventById(this.eventSelectionne.id);

                if (event) {
                    const nouvelleCouleur = this.getCouleurAvecStatut(event.extendedProps.type, nouveauStatut);
                    event.setProp('backgroundColor', nouvelleCouleur);
                    event.setProp('borderColor', nouvelleCouleur);
                    event.setProp('editable', nouveauStatut !== 'valide');

                    // Mettre à jour le badge du statut
                    event.setExtendedProp('statut', nouveauStatut);
                }

                this.fermerModalStatut();
                this.$toast.success('Statut mis à jour avec succès');
            }
        },
        confirmerModificationDuree(nouvelleDuree) {
            if (this.eventSelectionne) {
                const calendarApi = this.$refs.calendarRef.getApi();
                const event = calendarApi.getEventById(this.eventSelectionne.id);

                if (event) {
                    // Calculer les nouvelles dates basées sur la durée
                    const startDate = new Date(this.eventSelectionne.start);
                    const endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + nouvelleDuree);

                    event.setDates(startDate, endDate);
                    event.setExtendedProp('duree', `${nouvelleDuree} jour${nouvelleDuree > 1 ? 's' : ''}`);
                }

                this.fermerModalDuree();
                this.$toast.success('Durée du congé modifiée avec succès');
            }
        },
        getCouleurAvecStatut(type, statut) {
            const couleursBase = {
                'payes': '#3B82F6',
                'maladie': '#10B981',
                'exceptionnel': '#8B5CF6',
                'sans-solde': '#6B7280'
            };
            return couleursBase[type] || '#6B7280';
        },
        getCouleurStatut(statut) {
            const couleurs = {
                'valide': '#10B981', // Vert
                'en-attente': '#F59E0B', // Jaune
                'refuse': '#EF4444' // Rouge
            };
            return couleurs[statut] || '#6B7280';
        },
        handleEventsSet(events) {
            const calendarApi = this.$refs.calendarRef.getApi();
            this.titreCalendrier = calendarApi.currentData.viewTitle;
        },
        afficherAujourdhui() {
            const calendarApi = this.$refs.calendarRef.getApi();
            calendarApi.today();
        },
        changerVue(vue) {
            this.vueActive = vue;
            const calendarApi = this.$refs.calendarRef.getApi();
            calendarApi.changeView(vue);
        },
        calendrierPrev() {
            const calendarApi = this.$refs.calendarRef.getApi();
            calendarApi.prev();
        },
        calendrierNext() {
            const calendarApi = this.$refs.calendarRef.getApi();
            calendarApi.next();
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
        getNomStatut(statut) {
            const noms = {
                'en-attente': 'En attente',
                'valide': 'Validé',
                'refuse': 'Refusé'
            };
            return noms[statut] || statut;
        }
    },
    mounted() {
        const calendarApi = this.$refs.calendarRef.getApi();
        this.titreCalendrier = calendarApi.currentData.viewTitle;
    }
};
</script>

<style scoped>
.fc-event-content {
    padding: 2px;
    line-height: 1.2;
}

.fc-event-statut-point {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
}

.fc-event-title {
    font-size: 0.7rem;
    font-weight: 500;
}

.fc-event-details {
    font-size: 0.6rem;
}

.fc-event-badge {
    font-size: 0.5rem;
    flex-shrink: 0;
    margin-left: 2px;
}

/* Personnalisation FullCalendar */
.fc {
    font-family: inherit;
}

.fc .fc-toolbar-title {
    font-size: 1.5em;
    font-weight: 600;
}

.fc .fc-button {
    background-color: #4f46e5;
    border-color: #4f46e5;
    font-weight: 500;
}

.fc .fc-button:hover {
    background-color: #4338ca;
    border-color: #4338ca;
}

.fc .fc-button-primary:not(:disabled).fc-button-active {
    background-color: #3730a3;
    border-color: #3730a3;
}

.fc-theme-standard .fc-scrollgrid {
    border: 1px solid #e5e7eb;
}

.fc-theme-standard td,
.fc-theme-standard th {
    border: 1px solid #e5e7eb;
}

.fc .fc-daygrid-day-number {
    color: #374151;
    font-weight: 500;
}

.fc .fc-col-header-cell-cushion {
    color: #374151;
    font-weight: 600;
    text-decoration: none;
}

.fc .fc-event {
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
}

.fc .fc-event .fc-event-main {
    color: white;
}

/* Événements non modifiables */
.fc-event-non-modifiable {
    cursor: not-allowed !important;
    opacity: 0.8;
}

.fc-event-non-modifiable .fc-event-resizer {
    display: none !important;
}

/* Ajustement de la hauteur des événements */
.fc .fc-daygrid-event {
    margin-bottom: 1px;
}

.fc .fc-daygrid-block-event .fc-event-time {
    font-weight: 500;
}

/* Dark mode */
.dark .fc-theme-standard .fc-scrollgrid {
    border-color: #374151;
}

.dark .fc-theme-standard td,
.dark .fc-theme-standard th {
    border-color: #374151;
}

.dark .fc .fc-daygrid-day-number {
    color: #d1d5db;
}

.dark .fc .fc-col-header-cell-cushion {
    color: #d1d5db;
}

.dark .fc .fc-daygrid-day.fc-day-today {
    background-color: #1e3a8a;
}
</style>