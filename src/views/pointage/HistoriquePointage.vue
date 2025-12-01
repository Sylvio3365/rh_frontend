<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-5xl mx-auto">
      <!-- En-tête -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          📋 Historique des Pointages
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Consultez l'historique des pointages par personnel et par date
        </p>
      </div>

      <!-- Filtres -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
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
              Date
            </label>
            <input 
              v-model="selectedDate" 
              type="date" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <button 
          @click="chargerPointages" 
          class="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark 
                 transition-colors font-semibold flex items-center justify-center space-x-2">
          <Icon icon="mdi:magnify" class="w-5 h-5" />
          <span>Rechercher</span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
        <Icon icon="mdi:loading" class="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400">Chargement...</p>
      </div>

      <!-- Liste des pointages -->
      <div v-else-if="pointages.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
          <Icon icon="mdi:clipboard-text" class="w-6 h-6 text-primary" />
          <span>{{ pointages.length }} pointage(s) trouvé(s)</span>
        </h2>
        <div class="space-y-3">
          <PointageCard 
            v-for="pointage in pointages" 
            :key="pointage.idPointage"
            :pointage="pointage"
          />
        </div>
      </div>

      <!-- Aucun résultat -->
      <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
        <Icon icon="mdi:file-search-outline" class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400 text-lg">Aucun pointage trouvé</p>
        <p class="text-gray-500 dark:text-gray-500 text-sm mt-2">
          Essayez de modifier vos critères de recherche
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import { pointageService } from '@/services/pointageService';
import PointageCard from '@/components/pointage/PointageCard.vue';

export default {
  name: 'HistoriquePointage',
  components: {
    Icon,
    PointageCard
  },
  data() {
    return {
      idPersonnel: null,
      selectedDate: new Date().toISOString().split('T')[0],
      pointages: [],
      loading: false
    };
  },
  methods: {
    async chargerPointages() {
      if (!this.idPersonnel) {
        alert('Veuillez entrer un ID personnel');
        return;
      }

      this.loading = true;
      try {
        this.pointages = await pointageService.getPointagesJour(
          this.idPersonnel, 
          this.selectedDate
        );
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement des pointages');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>