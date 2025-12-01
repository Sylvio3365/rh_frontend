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

        <div v-show="!isLoading" class="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

                    <!-- Instructions -->
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

                <!-- Statistiques -->
                <div
                    class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Statistiques
                    </h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600 dark:text-gray-400">Total demandes</span>
                            <span class="font-bold text-gray-900 dark:text-white">{{ demandes.length }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600 dark:text-gray-400">En attente</span>
                            <span class="font-bold text-yellow-600">{{ demandesEnAttente }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600 dark:text-gray-400">Validées</span>
                            <span class="font-bold text-green-600">{{ demandesValidees }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de modification de statut -->
        <ModalModificationStatut v-if="showModalStatut" :event="eventSelectionne"
            :statut-actuel="eventSelectionne?.statut" @update:statut="confirmerChangementStatut"
            @close="fermerModalStatut" />

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
            isLoading: false,  // Changé de true à false
            demandes: [],
            vueActive: 'dayGridMonth',
            titreCalendrier: '',
            showModalStatut: false,
            showModalDuree: false,
            eventSelectionne: null,
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
                eventClick: this.handleEventClick,
                dateClick: this.handleDateClick,
                eventDrop: this.handleEventDrop,
                eventResize: this.handleEventResize,
                editable: true,
                droppable: true,
                eventsSet: this.handleEventsSet,
                eventDisplay: 'block',
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

    computed: {
        demandesEnAttente() {
            return this.demandes.filter(d => d.etat === 1).length;
        },
        demandesValidees() {
            return this.demandes.filter(d => d.etat === 2).length;
        }
    },

    methods: {
        async chargerDonnees() {
            try {
                this.isLoading = true;
                console.log('📥 Chargement des données depuis l\'API...');

                const data = await DemandeService.getDemandesForCalendar();
                console.log('✅ Données reçues de l\'API:', data);

                if (!data || data.length === 0) {
                    console.warn('⚠️ Aucune demande trouvée');
                    this.isLoading = false;
                    return;
                }

                this.demandes = data;

                const events = data.map(d => {
                    console.log('🔄 Traitement demande:', {
                        id: d.idDemande,
                        debut: d.debut,
                        fin: d.fin,
                        personnel: d.personnel,
                        typeConge: d.typeConge
                    });

                    if (!d.personnel || !d.typeConge || !d.debut || !d.fin) {
                        console.error('❌ Données manquantes pour la demande:', d);
                        return null;
                    }

                    // Mapping des types de congé selon idTypeConge
                    const typeCongeMapping = {
                        1: 'exceptionnel',  // maternité
                        2: 'exceptionnel',  // paternité
                        3: 'payes',         // annuel
                        4: 'maladie',       // maladie
                        5: 'exceptionnel',  // formation
                        6: 'exceptionnel'   // exceptionnel
                    };

                    const type = typeCongeMapping[d.typeConge.idTypeConge] || 'payes';
                    const typeConfig = this.typesConge.find(t => t.id === type) || this.typesConge[0];

                    // Mapping des statuts (etat)
                    const statutMapping = {
                        1: 'en-attente',
                        2: 'valide',
                        3: 'refuse',
                        4: 'annule'
                    };
                    const statut = statutMapping[d.etat] || 'en-attente';

                    // IMPORTANT : FullCalendar utilise une date de fin EXCLUSIVE
                    // Si le congé va du 28 au 2, on doit mettre end: '3' pour inclure le 2
                    const endDate = new Date(d.fin);
                    endDate.setDate(endDate.getDate() + 1); // Ajouter 1 jour
                    const endFormatted = endDate.toISOString().split('T')[0];

                    // IMPORTANT : Ne pas modifier les dates, les utiliser directement
                    const event = {
                        id: d.idDemande.toString(),
                        title: `${d.personnel.prenom || ''} ${d.personnel.nom || ''}`.trim(),
                        start: d.debut,  // Format YYYY-MM-DD direct
                        end: endFormatted,      // Date de fin + 1 jour (exclusif)
                        allDay: true,    // IMPORTANT : événements sur toute la journée
                        extendedProps: {
                            type: type,
                            statut: statut,
                            employe: `${d.personnel.prenom || ''} ${d.personnel.nom || ''}`.trim(),
                            departement: 'N/A',
                            motif: d.nature || 'Congé',
                            photo: this.getPhotoUrl(d.personnel.photo),
                            duree: this.calculerDuree(d.debut, d.fin),
                            typeLibelle: d.typeConge.libelle || 'Congé'
                        },
                        backgroundColor: typeConfig.couleur,
                        borderColor: typeConfig.couleur,
                        editable: d.etat !== 2
                    };

                    console.log('✅ Événement créé:', event);
                    return event;
                }).filter(e => e !== null);

                console.log('📅 TOUS LES ÉVÉNEMENTS:', events);
                console.log('📊 Nombre d\'événements:', events.length);

                // NE PAS attendre nextTick ici, le calendrier est déjà prêt

                if (this.$refs.calendarRef) {
                    console.log('✅ CalendarRef trouvé !');
                    const calendarApi = this.$refs.calendarRef.getApi();

                    // Supprimer tous les événements existants
                    calendarApi.removeAllEvents();
                    console.log('🗑️ Événements existants supprimés');

                    // Ajouter les nouveaux événements UN PAR UN pour voir lequel pose problème
                    events.forEach((event, index) => {
                        try {
                            calendarApi.addEvent(event);
                            console.log(`✅ Événement ${index + 1} ajouté:`, event.title);
                        } catch (error) {
                            console.error(`❌ Erreur ajout événement ${index + 1}:`, error, event);
                        }
                    });

                    console.log('✅ Tous les événements ajoutés au calendrier');

                    // Vérifier les événements dans le calendrier
                    const calendarEvents = calendarApi.getEvents();
                    console.log('📋 Événements dans le calendrier:', calendarEvents.length);
                } else {
                    console.error('❌ calendarRef non disponible');
                }

            } catch (error) {
                console.error('❌ Erreur lors du chargement des données:', error);
                alert('Erreur lors du chargement du calendrier: ' + error.message);
            } finally {
                this.isLoading = false;
            }
        },

        getPhotoUrl(photo) {
            // Si pas de photo, retourner l'image par défaut
            if (!photo) {
                return '/assets/img/default-user.png';
            }

            // Si c'est déjà une URL complète
            if (photo.startsWith('http://') || photo.startsWith('https://')) {
                return photo;
            }

            // Si c'est un chemin relatif
            if (photo.startsWith('/')) {
                return photo;
            }

            // Sinon, considérer que c'est juste un nom de fichier
            return `/assets/img/default-user.png`; // Toujours retourner l'image par défaut pour l'instant
        },

        calculerDuree(debut, fin) {
            if (!debut || !fin) return '0 jour';
            const diff = (new Date(fin) - new Date(debut)) / 86400000 + 1;
            const jours = Math.round(diff);
            return `${jours} jour${jours > 1 ? 's' : ''}`;
        },

        renderEventContent(eventInfo) {
            const event = eventInfo.event;
            const props = event.extendedProps;
            const statut = this.getNomStatut(props.statut);
            const statutColor = this.getCouleurStatut(props.statut);
            const badgeClass = this.getBadgeClass(props.statut);
            const photo = props.photo || '/assets/img/default-user.png';

            return {
                html: `
          <div class="fc-event-content">
            <div class="flex items-center space-x-2">
              <div class="fc-event-statut-point" style="background-color: ${statutColor}"></div>
              <img src="${photo}" 
                   alt="${props.employe}" 
                   class="w-4 h-4 rounded-full object-cover flex-shrink-0" 
                   onerror="this.style.display='none'">
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
            const props = event.extendedProps;

            // Bloquer si le congé est déjà validé
            if (props.statut === 'valide') {
                alert('⚠️ Les congés validés ne peuvent plus être modifiés');
                return;
            }

            this.eventSelectionne = {
                id: event.id,
                employe: event.extendedProps.employe,
                type: event.extendedProps.type,
                typeLibelle: event.extendedProps.typeLibelle,
                statut: event.extendedProps.statut,
                motif: event.extendedProps.motif,
                photo: event.extendedProps.photo,
                departement: event.extendedProps.departement,
                start: event.start,
                end: event.end,
                duree: event.extendedProps.duree
            };

            this.showModalStatut = false;
            this.showModalDuree = false;

            if (clickInfo.jsEvent.ctrlKey) {
                this.showModalDuree = true;
            } else {
                this.showModalStatut = true;
            }
        },

        fermerModalStatut() {
            this.showModalStatut = false;
            this.eventSelectionne = null;
        },

        fermerModalDuree() {
            this.showModalDuree = false;
            this.eventSelectionne = null;
        },

        handleDateClick(clickInfo) {
            this.$router.push({
                path: '/conges/demandes',
                query: { date: clickInfo.dateStr }
            });
        },

        async handleEventDrop(dropInfo) {
            const event = dropInfo.event;
            const props = event.extendedProps;

            if (props.statut === 'valide') {
                dropInfo.revert();
                alert('Les congés validés ne peuvent pas être modifiés');
                return;
            }

            try {
                const debut = event.start.toISOString().split('T')[0];
                const endDate = new Date(event.end);
                endDate.setDate(endDate.getDate() - 1);
                const fin = endDate.toISOString().split('T')[0];

                await DemandeService.updateDates(event.id, debut, fin);

                event.setExtendedProp('duree', this.calculerDuree(debut, fin));
                alert('Dates mises à jour avec succès');
            } catch (error) {
                console.error('Erreur mise à jour:', error);
                dropInfo.revert();
                alert('Erreur lors de la mise à jour des dates');
            }
        },

        async handleEventResize(resizeInfo) {
            const event = resizeInfo.event;
            const props = event.extendedProps;

            if (props.statut === 'valide') {
                resizeInfo.revert();
                alert('Les congés validés ne peuvent pas être modifiés');
                return;
            }

            try {
                const debut = event.start.toISOString().split('T')[0];
                const endDate = new Date(event.end);
                endDate.setDate(endDate.getDate() - 1);
                const fin = endDate.toISOString().split('T')[0];

                await DemandeService.updateDates(event.id, debut, fin);

                event.setExtendedProp('duree', this.calculerDuree(debut, fin));
                alert('Durée mise à jour avec succès');
            } catch (error) {
                console.error('Erreur mise à jour:', error);
                resizeInfo.revert();
                alert('Erreur lors de la mise à jour de la durée');
            }
        },

        async confirmerChangementStatut(nouveauStatut) {
            if (!this.eventSelectionne) {
                console.error('❌ Aucun événement sélectionné');
                alert('Erreur: Aucun congé sélectionné');
                return;
            }

            console.log('🔍 DEBUG - Début confirmerChangementStatut:', {
                eventSelectionne: this.eventSelectionne,
                nouveauStatut: nouveauStatut
            });

            // Double vérification : empêcher la modification si déjà validé
            if (this.eventSelectionne.statut === 'valide') {
                alert('⚠️ Ce congé est déjà validé et ne peut plus être modifié');
                this.fermerModalStatut();
                return;
            }

            try {
                // Mapping pour l'API - CORRIGÉ avec vérification
                const statutMapping = {
                    'en-attente': 1,
                    'valide': 2,
                    'refuse': 3,
                    'annule': 4
                };

                const nouvelEtat = statutMapping[nouveauStatut];

                console.log('🔍 DEBUG - Mapping statut:', {
                    nouveauStatut,
                    nouvelEtat,
                    mappingComplet: statutMapping
                });

                // Validation renforcée
                if (nouvelEtat === undefined || nouvelEtat === null) {
                    const statutsValides = Object.keys(statutMapping).join(', ');
                    throw new Error(`Statut "${nouveauStatut}" invalide. Statuts valides: ${statutsValides}`);
                }

                console.log(`📝 Mise à jour du statut de la demande ${this.eventSelectionne.id} de "${this.eventSelectionne.statut}" vers "${nouveauStatut}" (etat: ${nouvelEtat})`);

                // Vérifier si le statut change réellement
                if (this.eventSelectionne.statut === nouveauStatut) {
                    console.log('ℹ️ Aucun changement de statut nécessaire');
                    this.fermerModalStatut();
                    return;
                }

                // DEBUG: Afficher les données envoyées à l'API
                console.log('🔍 DEBUG - Données envoyées à l\'API:', {
                    idDemande: this.eventSelectionne.id,
                    nouvelEtat: nouvelEtat,
                    typeEtat: typeof nouvelEtat
                });

                // Appel API avec gestion d'erreur détaillée
                console.log('🔍 DEBUG - Appel API DemandeService.updateStatut...');
                const resultat = await DemandeService.updateStatut(this.eventSelectionne.id, nouvelEtat);
                console.log('🔍 DEBUG - Réponse API réussie:', resultat);

                // Mettre à jour l'événement dans le calendrier
                if (this.$refs.calendarRef) {
                    const calendarApi = this.$refs.calendarRef.getApi();
                    const event = calendarApi.getEventById(this.eventSelectionne.id);

                    if (event) {
                        console.log('🔍 DEBUG - Mise à jour de l\'événement dans le calendrier');

                        // Mettre à jour les propriétés de l'événement
                        event.setExtendedProp('statut', nouveauStatut);

                        // Si validé, rendre non-éditable
                        if (nouveauStatut === 'valide') {
                            event.setProp('editable', false);
                            console.log('🔍 DEBUG - Congé validé -> non éditable');

                            // Ajouter la classe CSS pour indiquer que c'est non-modifiable
                            setTimeout(() => {
                                const eventEl = event.el;
                                if (eventEl) {
                                    eventEl.classList.add('fc-event-non-modifiable');
                                    console.log('🔍 DEBUG - Classe non-modifiable ajoutée');
                                }
                            }, 100);
                        } else {
                            event.setProp('editable', true);
                            console.log('🔍 DEBUG - Congé non validé -> éditable');

                            // Retirer la classe si ce n'est plus validé
                            setTimeout(() => {
                                const eventEl = event.el;
                                if (eventEl) {
                                    eventEl.classList.remove('fc-event-non-modifiable');
                                    console.log('🔍 DEBUG - Classe non-modifiable retirée');
                                }
                            }, 100);
                        }

                        // Forcer le re-rendu de l'événement
                        console.log('🔍 DEBUG - Refetch des événements');
                        calendarApi.refetchEvents();
                    } else {
                        console.warn('⚠️ Événement non trouvé dans le calendrier avec ID:', this.eventSelectionne.id);
                    }
                } else {
                    console.error('❌ Référence du calendrier non disponible');
                }

                // Fermer le modal et afficher message de succès
                this.fermerModalStatut();
                console.log('✅ Statut mis à jour avec succès');
                alert('✅ Statut du congé mis à jour avec succès');

                // Recharger les données pour synchronisation complète
                console.log('🔍 DEBUG - Rechargement des données...');
                await this.chargerDonnees();
                console.log('🔍 DEBUG - Données rechargées avec succès');

            } catch (error) {
                console.error('❌ Erreur complète lors de la mise à jour du statut:', error);

                // Log détaillé de l'erreur
                if (error.response) {
                    // Erreur HTTP
                    console.error('❌ Erreur HTTP:', {
                        status: error.response.status,
                        statusText: error.response.statusText,
                        data: error.response.data,
                        headers: error.response.headers
                    });
                } else if (error.request) {
                    // Pas de réponse du serveur
                    console.error('❌ Pas de réponse du serveur:', error.request);
                } else {
                    // Erreur autre
                    console.error('❌ Erreur de configuration:', error.message);
                }

                console.error('❌ Stack trace:', error.stack);
                console.error('❌ Données au moment de l\'erreur:', {
                    eventSelectionne: this.eventSelectionne,
                    nouveauStatut: nouveauStatut
                });

                // Message d'erreur utilisateur adapté
                let messageUtilisateur = 'Erreur lors de la mise à jour du statut';

                if (error.message.includes('Statut invalide')) {
                    messageUtilisateur = 'Le statut sélectionné n\'est pas valide. Veuillez contacter l\'administrateur.';
                } else if (error.response?.status === 400) {
                    messageUtilisateur = 'Requête incorrecte. Les données envoyées sont invalides.';
                } else if (error.response?.status === 404) {
                    messageUtilisateur = 'Congé non trouvé. Il a peut-être été supprimé.';
                } else if (error.response?.status === 403) {
                    messageUtilisateur = 'Vous n\'avez pas les permissions pour modifier ce congé.';
                } else if (error.response?.status === 500) {
                    messageUtilisateur = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
                } else if (error.message) {
                    messageUtilisateur = error.message;
                }

                alert('❌ ' + messageUtilisateur);

                // Ne pas fermer le modal en cas d'erreur pour permettre une nouvelle tentative
                // this.fermerModalStatut();
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
                    alert('Durée du congé modifiée avec succès');
                    await this.chargerDonnees();

                } catch (error) {
                    console.error('Erreur:', error);
                    alert('Erreur lors de la modification de la durée');
                }
            }
        },

        getCouleurStatut(statut) {
            const couleurs = {
                'valide': '#10B981',
                'en-attente': '#F59E0B',
                'refuse': '#EF4444'
            };
            return couleurs[statut] || '#6B7280';
        },

        handleEventsSet() {
            if (this.$refs.calendarRef) {
                const calendarApi = this.$refs.calendarRef.getApi();
                this.titreCalendrier = calendarApi.view.title;
            }
        },

        afficherAujourdhui() {
            if (this.$refs.calendarRef) {
                const calendarApi = this.$refs.calendarRef.getApi();
                calendarApi.today();
            }
        },

        changerVue(vue) {
            this.vueActive = vue;
            if (this.$refs.calendarRef) {
                const calendarApi = this.$refs.calendarRef.getApi();
                calendarApi.changeView(vue);
            }
        },

        calendrierPrev() {
            if (this.$refs.calendarRef) {
                const calendarApi = this.$refs.calendarRef.getApi();
                calendarApi.prev();
            }
        },

        calendrierNext() {
            if (this.$refs.calendarRef) {
                const calendarApi = this.$refs.calendarRef.getApi();
                calendarApi.next();
            }
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
        console.log('🔧 Calendrier monté');

        // Attendre plusieurs cycles pour être sûr
        await this.$nextTick();
        await this.$nextTick();

        // Attendre que FullCalendar soit complètement initialisé
        setTimeout(async () => {
            console.log('⏰ Timeout atteint, vérification du calendrier...');

            if (this.$refs.calendarRef) {
                console.log('✅ CalendarRef existe !');
                try {
                    const calendarApi = this.$refs.calendarRef.getApi();
                    console.log('✅ CalendarApi accessible:', calendarApi);
                    this.titreCalendrier = calendarApi.view.title;

                    // Charger les données
                    await this.chargerDonnees();

                    // IMPORTANT : Forcer le rendu du calendrier après le chargement
                    await this.$nextTick();
                    calendarApi.updateSize(); // Recalculer la taille
                    calendarApi.render();     // Forcer le rendu
                    console.log('✅ Calendrier rendu');

                } catch (error) {
                    console.error('❌ Erreur lors de l\'accès à calendarApi:', error);
                }
            } else {
                console.error('❌ Calendrier non accessible après timeout');
            }
        }, 1000);
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

.fc-event-non-modifiable {
    cursor: not-allowed !important;
    opacity: 0.8;
}

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