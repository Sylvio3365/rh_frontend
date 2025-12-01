<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- En-tête -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          📅 Présence Mensuelle
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Vue d'ensemble des présences et statistiques mensuelles
        </p>
      </div>

      <!-- Filtres -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="md:col-span-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ID Personnel
            </label>
            <input 
              v-model.number="idPersonnel" 
              type="number" 
              placeholder="Entrez l'ID du personnel"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mois
            </label>
            <select 
              v-model.number="mois" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary focus:border-transparent">
              <option v-for="m in 12" :key="m" :value="m">
                {{ getMonthName(m) }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Année
            </label>
            <input 
              v-model.number="annee" 
              type="number" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div class="flex items-end">
            <button 
              @click="chargerPresences" 
              class="w-full px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark 
                     transition-colors font-semibold flex items-center justify-center space-x-2">
              <Icon icon="mdi:calendar-search" class="w-5 h-5" />
              <span>Afficher</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div v-if="presences.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Jours travaillés</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalJours }}</p>
            </div>
            <Icon icon="mdi:calendar-check" class="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Heures totales</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalHeures }}h</p>
            </div>
            <Icon icon="mdi:clock" class="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Retards</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalRetards }}</p>
            </div>
            <Icon icon="mdi:alert-circle" class="w-12 h-12 text-red-500" />
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Heures sup</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalHeuresSup }}h</p>
            </div>
            <Icon icon="mdi:star" class="w-12 h-12 text-yellow-500" />
          </div>
        </div>
      </div>

      <!-- Liste des présences -->
      <div v-if="presences.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Détail des présences
        </h2>
        <div class="space-y-3">
          <div 
            v-for="presence in presences" 
            :key="presence.idPresenceJour"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <Icon 
                    :icon="presence.statut === 'COMPLET' ? 'mdi:check-circle' : 'mdi:clock-outline'" 
                    :class="[
                      'w-8 h-8',
                      presence.statut === 'COMPLET' ? 'text-green-500' : 'text-yellow-500'
                    ]" 
                  />
                </div>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ formatDate(presence.date) }}
                  </p>
                  <span :class="[
                    'inline-block px-2 py-1 text-xs font-medium rounded-full mt-1',
                    presence.statut === 'COMPLET' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  ]">
                    {{ presence.statut }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Arrivée</p>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ presence.heureArrivee || '-' }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Départ</p>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ presence.heureDepart || '-' }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Travaillées</p>
                  <p class="font-medium text-gray-900 dark:text-white">
                    {{ presence.heuresTravaillees }}h
                  </p>
                </div>
                <div>
                  <p class="text-gray-500 dark:text-gray-400">Retard</p>
                  <p :class="[
                    'font-medium',
                    presence.minutesRetard > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
                  ]">
                    {{ presence.minutesRetard > 0 ? `${presence.minutesRetard} min` : '-' }}
                  </p>
                </div>
              </div>
            </div>

            <p v-if="presence.observation" class="mt-3 text-sm text-gray-600 dark:text-gray-400 italic border-t border-gray-200 dark:border-gray-700 pt-3">
              💬 {{ presence.observation }}
            </p>
          </div>
        </div>
      </div>

      <!-- Aucun résultat -->
      <div v-else-if="!loading" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
        <Icon icon="mdi:calendar-remove" class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400 text-lg">Aucune présence trouvée</p>
        <p class="text-gray-500 dark:text-gray-500 text-sm mt-2">
          Aucune donnée disponible pour cette période
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import { presenceService } from '@/services/presenceService';

export default {
  name: 'PresenceMensuelle',
  components: {
    Icon
  },
  data() {
    return {
      idPersonnel: null,
      mois: new Date().getMonth() + 1,
      annee: new Date().getFullYear(),
      presences: [],
      loading: false
    };
  },
  computed: {
    totalJours() {
      return this.presences.length;
    },
    totalHeures() {
      return this.presences.reduce((sum, p) => sum + parseFloat(p.heuresTravaillees || 0), 0).toFixed(2);
    },
    totalRetards() {
      return this.presences.filter(p => p.minutesRetard > 0).length;
    },
    totalHeuresSup() {
      return this.presences.reduce((sum, p) => sum + parseFloat(p.heuresSupplementaires || 0), 0).toFixed(2);
    }
  },
  methods: {
    async chargerPresences() {
      if (!this.idPersonnel) {
        alert('Veuillez entrer un ID personnel');
        return;
      }

      this.loading = true;
      try {
        this.presences = await presenceService.getPresencesMois(
          this.idPersonnel,
          this.mois,
          this.annee
        );
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement des présences');
      } finally {
        this.loading = false;
      }
    },

    getMonthName(month) {
      const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
      return months[month - 1];
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
    }
  }
};
</script>