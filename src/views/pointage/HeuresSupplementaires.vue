<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- En-tête -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          ⭐ Heures Supplémentaires
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Gestion et suivi des heures supplémentaires
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
              @click="chargerHeuresSup" 
              class="w-full px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark 
                     transition-colors font-semibold flex items-center justify-center space-x-2">
              <Icon icon="mdi:magnify" class="w-5 h-5" />
              <span>Afficher</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Bouton ajout -->
      <button 
        @click="showAddForm = !showAddForm" 
        class="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 
               transition-colors font-semibold flex items-center justify-center space-x-2 mb-6">
        <Icon :icon="showAddForm ? 'mdi:close' : 'mdi:plus'" class="w-5 h-5" />
        <span>{{ showAddForm ? 'Annuler' : 'Ajouter heures supplémentaires' }}</span>
      </button>

      <!-- Formulaire ajout -->
      <div v-if="showAddForm" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Nouvelle entrée d'heures supplémentaires
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input 
              v-model="newHeureSup.date" 
              type="date" 
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre d'heures
            </label>
            <input 
              v-model.number="newHeureSup.nbHeure" 
              type="number" 
              step="0.5"
              placeholder="Ex: 2.5"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pourcentage
            </label>
            <input 
              v-model.number="newHeureSup.pourcentage" 
              type="number" 
              step="0.1"
              placeholder="Ex: 130"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <button 
          @click="ajouterHeureSup" 
          class="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark 
                 transition-colors font-semibold flex items-center justify-center space-x-2">
          <Icon icon="mdi:check" class="w-5 h-5" />
          <span>Enregistrer</span>
        </button>
      </div>

      <!-- Statistiques -->
      <div v-if="heuresSup.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Total heures supplémentaires</p>
              <p class="text-4xl font-bold text-gray-900 dark:text-white">{{ totalHeures }}h</p>
            </div>
            <Icon icon="mdi:clock-plus" class="w-16 h-16 text-yellow-500" />
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">Pourcentage moyen</p>
              <p class="text-4xl font-bold text-gray-900 dark:text-white">{{ moyennePourcentage }}%</p>
            </div>
            <Icon icon="mdi:percent" class="w-16 h-16 text-green-500" />
          </div>
        </div>
      </div>

      <!-- Liste des heures sup -->
      <div v-if="heuresSup.length > 0" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Liste des heures supplémentaires
        </h2>
        <div class="space-y-3">
          <div 
            v-for="heure in heuresSup" 
            :key="heure.idHeureSup"
            class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4 flex-1">
                <Icon icon="mdi:calendar-star" class="w-8 h-8 text-yellow-500 flex-shrink-0" />
                <div class="flex-1">
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ formatDate(heure.date) }}
                  </p>
                  <div class="flex flex-wrap gap-4 mt-2 text-sm">
                    <span class="text-gray-600 dark:text-gray-400">
                      <strong class="text-gray-900 dark:text-white">{{ heure.nbHeure }}h</strong>
                    </span>
                    <span class="text-gray-600 dark:text-gray-400">
                      Majoration: <strong class="text-green-600 dark:text-green-400">{{ heure.pourcentage }}%</strong>
                    </span>
                    <span v-if="heure.presenceJournaliere" class="text-gray-600 dark:text-gray-400">
                      📎 Lié à la présence
                    </span>
                  </div>
                </div>
              </div>
              <button 
                @click="supprimerHeureSup(heure.idHeureSup)" 
                class="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Supprimer">
                <Icon icon="mdi:delete" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Aucun résultat -->
      <div v-else-if="!loading" class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-12 text-center">
        <Icon icon="mdi:clock-alert-outline" class="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400 text-lg">Aucune heure supplémentaire</p>
        <p class="text-gray-500 dark:text-gray-500 text-sm mt-2">
          Aucune donnée trouvée pour cette période
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import { heureSupService } from '@/services/heureSupService';

export default {
  name: 'HeuresSupplementaires',
  components: {
    Icon
  },
  data() {
    return {
      idPersonnel: null,
      mois: new Date().getMonth() + 1,
      annee: new Date().getFullYear(),
      heuresSup: [],
      loading: false,
      showAddForm: false,
      newHeureSup: {
        date: new Date().toISOString().split('T')[0],
        nbHeure: null,
        pourcentage: 130
      }
    };
  },
  computed: {
    totalHeures() {
      return this.heuresSup.reduce((sum, h) => sum + parseFloat(h.nbHeure || 0), 0).toFixed(2);
    },
    moyennePourcentage() {
      if (this.heuresSup.length === 0) return 0;
      const sum = this.heuresSup.reduce((sum, h) => sum + parseFloat(h.pourcentage || 0), 0);
      return (sum / this.heuresSup.length).toFixed(1);
    }
  },
  methods: {
    async chargerHeuresSup() {
      if (!this.idPersonnel) {
        alert('Veuillez entrer un ID personnel');
        return;
      }

      this.loading = true;
      try {
        this.heuresSup = await heureSupService.getHeuresSupMois(
          this.idPersonnel,
          this.mois,
          this.annee
        );
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement des heures supplémentaires');
      } finally {
        this.loading = false;
      }
    },

    async ajouterHeureSup() {
      if (!this.idPersonnel || !this.newHeureSup.nbHeure) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
      }

      try {
        const data = {
          personnel: { idPersonnel: this.idPersonnel },
          date: this.newHeureSup.date,
          nbHeure: this.newHeureSup.nbHeure,
          pourcentage: this.newHeureSup.pourcentage
        };

        await heureSupService.creerHeureSupManuelle(data);
        alert('✓ Heures supplémentaires ajoutées avec succès!');
        
        await this.chargerHeuresSup();
        
        this.showAddForm = false;
        this.newHeureSup = {
          date: new Date().toISOString().split('T')[0],
          nbHeure: null,
          pourcentage: 130
        };
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'ajout des heures supplémentaires');
      }
    },

    async supprimerHeureSup(idHeureSup) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer ces heures supplémentaires ?')) {
        return;
      }

      try {
        await heureSupService.supprimerHeureSup(idHeureSup);
        alert('✓ Heures supplémentaires supprimées');
        await this.chargerHeuresSup();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
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
        month: 'long',
        year: 'numeric'
      });
    }
  }
};
</script>