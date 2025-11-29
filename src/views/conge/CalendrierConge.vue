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

        <!-- Spinner de chargement -->
        <div v-if="isLoading" class="flex justify-center items-center h-96">
            <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto mb-4"></div>
                <p class="text-gray-600 dark:text-gray-400">Chargement des congés...</p>
            </div>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
import DemandeService from '@/services/DemandeService';
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
            isLoading: true,
            demandes: [],
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
                events: [],
                eventClick: this.handleEventClick.bind(this),
                dateClick: this.handleDateClick.bind(this),
                eventDrop: this.handleEventDrop.bind(this),
                eventResize: this.handleEventResize.bind(this),
                editable: true,
                droppable: true,
                eventsSet: this.handleEventsSet.bind(this),
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
                eventContent: this.renderEventContent.bind(this),
                eventDidMount: this.handleEventMount.bind(this)
            }
        };
    },
    methods: {
        async chargerDonnees() {
            try {
                this.isLoading = true;
                console.log('Chargement des données depuis l\'API...');
                
                // Récupérer les données de l'API
                const data = await DemandeService.getDemandesForCalendar();
                console.log('Données reçues de l\'API:', data);
                this.demandes = data;

                // Transformer les données de l'API en événements pour FullCalendar
                const events = data.map(d => {
                    // Mapping des types de congé
                    const typeCongeMapping = {
                        'maladie': 'maladie',
                        'exceptionnel': 'exceptionnel', 
                        'annuel': 'payes',
                        'paternité': 'exceptionnel',
                        'maternité': 'exceptionnel',
                        'formation': 'exceptionnel'
                    };

                    const type = typeCongeMapping[d.typeConge?.libelle] || 'payes';
                    const typeConfig = this.typesConge.find(t => t.id === type) || this.typesConge[0];

                    // Mapping des statuts
                    const statutMapping = {
                        1: 'en-attente',
                        2: 'valide',
                        3: 'refuse'
                    };
                    const statut = statutMapping[d.etat] || 'en-attente';

                    return {
                        id: d.idDemande.toString(),
                        title: `${d.personnel.prenom} ${d.personnel.nom}`.trim(),
                        start: d.debut,
                        end: new Date(new Date(d.fin).getTime() + 86400000).toISOString().split('T')[0], // +1 jour
                        extendedProps: {
                            type: type,
                            statut: statut,
                            employe: `${d.personnel.prenom} ${d.personnel.nom}`.trim(),
                            departement: d.personnel.categoriePersonnel?.libelle || 'Non spécifié',
                            motif: d.nature || 'Congé',
                            photo: this.getPhotoUrl(d.personnel.photo),
                            duree: this.calculerDuree(d.debut, d.fin)
                        },
                        backgroundColor: typeConfig.couleur,
                        borderColor: typeConfig.couleur,
                        editable: d.etat !== 2 // Non éditable si validé
                    };
                });

                console.log('Événements créés:', events);

                // Mettre à jour les événements du calendrier
                if (this.$refs.calendarRef) {
                    const calendarApi = this.$refs.calendarRef.getApi();
                    calendarApi.removeAllEvents();
                    calendarApi.addEventSource(events);
                }

            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            } finally {
                this.isLoading = false;
            }
        },

        getPhotoUrl(photo) {
            if (!photo) return '/assets/img/default-user.png';
            if (photo.startsWith('http')) return photo;
            return `/assets/img/personnel/${photo}`;
        },

        calculerDuree(debut, fin) {
            const diff = (new Date(fin) - new Date(debut)) / 86400000 + 1;
            return `${Math.round(diff)} jour${diff > 1 ? 's' : ''}`;
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
            const photo = props.photo;

            return {
                html: `
          <div class="fc-event-content">
            <div class="flex items-center space-x-2">
              <!-- Point de statut à gauche -->
              <div class="fc-event-statut-point" style="background-color: ${statutColor}"></div>
              
              <!-- Photo de l'utilisateur -->
              <img src="${photo}" alt="${props.employe}" class="w-4 h-4 rounded-full object-cover flex-shrink-0" onerror="this.src='/assets/img/default-user.png'">
              
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
                
                // Convertir pour l'API
                const debut = modifications.start.toISOString().split('T')[0];
                const fin = new Date(modifications.end.getTime() - 86400000).toISOString().split('T')[0];
                
                await DemandeService.updateDates(id, debut, fin);

                const calendarApi = this.$refs.calendarRef.getApi();
                const event = calendarApi.getEventById(id);

                if (event) {
                    // Recalculer la durée
                    const diffTime = Math.abs(modifications.end - modifications.start);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    event.setExtendedProp('duree', `${diffDays} jour${diffDays > 1 ? 's' : ''}`);
                }

                this.$toast.success('Congé mis à jour avec succès');
            } catch (error) {
                console.error('Erreur mise à jour:', error);
                this.$toast.error('Erreur lors de la mise à jour');
            }
        },

        async confirmerChangementStatut(nouveauStatut) {
            if (this.eventSelectionne) {
                try {
                    // Mapping inverse pour l'API
                    const statutMapping = {
                        'en-attente': 1,
                        'valide': 2,
                        'refuse': 3
                    };
                    
                    await DemandeService.updateStatut(this.eventSelectionne.id, statutMapping[nouveauStatut]);

                    const calendarApi = this.$refs.calendarRef.getApi();
                    const event = calendarApi.getEventById(this.eventSelectionne.id);

                    if (event) {
                        event.setExtendedProp('statut', nouveauStatut);
                        event.setProp('editable', nouveauStatut !== 'valide');

                        if (nouveauStatut === 'valide') {
                            event.el.classList.add('fc-event-non-modifiable');
                        } else {
                            event.el.classList.remove('fc-event-non-modifiable');
                        }
                    }

                    this.fermerModalStatut();
                    this.$toast.success('Statut mis à jour avec succès');
                    
                } catch (error) {
                    console.error('Erreur lors de la mise à jour du statut:', error);
                    this.$toast.error('Erreur lors de la mise à jour du statut');
                }
            }
        },

        async confirmerModificationDuree(nouvelleDuree) {
            if (this.eventSelectionne) {
                try {
                    const startDate = new Date(this.eventSelectionne.start);
                    const endDate = new Date(startDate);
                    endDate.setDate(startDate.getDate() + nouvelleDuree - 1);

                    await DemandeService.updateDates(
                        this.eventSelectionne.id, 
                        startDate.toISOString().split('T')[0], 
                        endDate.toISOString().split('T')[0]
                    );

                    this.fermerModalDuree();
                    this.$toast.success('Durée du congé modifiée avec succès');
                    this.chargerDonnees(); // Recharger les données
                    
                } catch (error) {
                    console.error('Erreur lors de la modification de la durée:', error);
                    this.$toast.error('Erreur lors de la modification de la durée');
                }
            }
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
        },

        getBadgeClass(statut) {
            const classes = {
                'en-attente': 'bg-yellow-500 text-white',
                'valide': 'bg-green-500 text-white',
                'refuse': 'bg-red-500 text-white'
            };
            return `text-xs px-2 py-1 rounded-full font-semibold ${classes[statut] || 'bg-gray-500 text-white'}`;
        }
    },

    async mounted() {
        await this.chargerDonnees();
        const calendarApi = this.$refs.calendarRef.getApi();
        this.titreCalendrier = calendarApi.currentData.viewTitle;
    }
};
</script>

<style scoped>
/* Les styles restent identiques */
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

/* ... autres styles ... */
</style>