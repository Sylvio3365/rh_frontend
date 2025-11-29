<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- En-tête -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🕐 Pointage
        </h1>
        <!-- <p class="text-gray-600 dark:text-gray-400">
          Scanner le QR code ou entrer l'ID manuellement
        </p> -->
      </div>

      

      <!-- Saisie manuelle -->
      <div v-if="!personnelSelectionne" 
           class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Entrer l'ID manuellement
        </label>
        <div class="flex gap-3">
          <input 
            v-model.number="manualId" 
            type="number" 
            placeholder="Ex: 1"
            @keyup.enter="chargerPersonnel"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button 
            @click="chargerPersonnel" 
            class="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark 
                   transition-colors font-medium flex items-center space-x-2">
            <Icon icon="mdi:check" class="w-5 h-5" />
            <span>Valider</span>
          </button>
        </div>
      </div>

      <!-- Interface de pointage -->
      <div v-if="personnelSelectionne" class="space-y-6 animate-fade-in">
        <!-- Info personnel -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <Icon icon="mdi:account-circle" class="w-8 h-8 text-primary" />
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Personnel ID</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ idPersonnel }}</p>
              </div>
            </div>
            <button 
              @click="resetPersonnel" 
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                     transition-colors font-medium flex items-center space-x-2">
              <Icon icon="mdi:refresh" class="w-4 h-4" />
              <span>Changer</span>
            </button>
          </div>
        </div>

        <!-- Sélection horaire -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <HoraireSelector 
            v-model="selectedHoraire" 
            :horaires="horaires"
          />
        </div>

        <!-- Suggestion -->
        <div v-if="prochainType" 
             class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 
                    rounded-lg p-4 flex items-center space-x-3">
          <Icon icon="mdi:lightbulb-on" class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          <div>
            <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Prochain pointage suggéré
            </p>
            <p class="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
              {{ prochainType }}
            </p>
          </div>
        </div>

        <!-- Formulaire de pointage -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Enregistrer un pointage
          </h2>

          <div class="space-y-4">
            <!-- Type de pointage -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type de pointage
              </label>
              <select 
                v-model="typePointage" 
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-primary focus:border-transparent">
                <option value="ENTREE">🟢 Entrée</option>
                <option value="SORTIE">🔴 Sortie</option>
                <option value="PAUSE_DEBUT">⏸️ Début pause</option>
                <option value="PAUSE_FIN">▶️ Fin pause</option>
              </select>
            </div>

            <!-- Localisation -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Localisation <span class="text-gray-400">(optionnel)</span>
              </label>
              <input 
                v-model="localisation" 
                type="text" 
                placeholder="Ex: Bureau principal"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <!-- Remarque -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Remarque <span class="text-gray-400">(optionnel)</span>
              </label>
              <textarea 
                v-model="remarque" 
                rows="3"
                placeholder="Ajouter une remarque..."
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              ></textarea>
            </div>

            <!-- Bouton d'enregistrement -->
            <button 
              @click="enregistrerPointage" 
              :disabled="loading || !idPersonnel"
              class="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark 
                     transition-colors font-semibold flex items-center justify-center space-x-2
                     disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon v-if="loading" icon="mdi:loading" class="w-5 h-5 animate-spin" />
              <Icon v-else icon="mdi:check-circle" class="w-5 h-5" />
              <span>{{ loading ? 'Enregistrement...' : 'Enregistrer le pointage' }}</span>
            </button>
          </div>
        </div>

        <!-- Message -->
        <div v-if="message" 
             :class="[
               'rounded-lg p-4 flex items-center space-x-3',
               messageType === 'success' 
                 ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700' 
                 : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700'
             ]">
          <Icon 
            :icon="messageType === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle'" 
            :class="[
              'w-6 h-6',
              messageType === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            ]" 
          />
          <p :class="[
            'font-medium',
            messageType === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
          ]">
            {{ message }}
          </p>
        </div>

        <!-- Pointages du jour -->
        <div v-if="pointagesJour.length > 0" 
             class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Icon icon="mdi:calendar-today" class="w-6 h-6 text-primary" />
            <span>Pointages d'aujourd'hui</span>
          </h2>
          <div class="space-y-3">
            <PointageCard 
              v-for="pointage in pointagesJour" 
              :key="pointage.idPointage"
              :pointage="pointage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import { pointageService } from '@/services/pointageService';
import HoraireSelector from '@/components/pointage/HoraireSelector.vue';
import PointageCard from '@/components/pointage/PointageCard.vue';
import QrScanner from '@/components/pointage/QrScanner.vue';

export default {
  name: 'ScanPointage',
  components: {
    Icon,
    HoraireSelector,
    PointageCard,
    QrScanner
  },
  data() {
    return {
      manualId: null,
      idPersonnel: null,
      personnelSelectionne: false,
      typePointage: 'ENTREE',
      localisation: '',
      remarque: '',
      selectedHoraire: null,
      horaires: [],
      pointagesJour: [],
      prochainType: null,
      loading: false,
      message: '',
      messageType: ''
    };
  },
  async mounted() {
    await this.chargerHoraires();
  },
  watch: {
    async idPersonnel(newVal) {
      if (newVal) {
        await this.chargerPointagesJour();
        await this.chargerProchainType();
      }
    }
  },
  methods: {
    onQrScanned(employeeId) {
      console.log("ID scanné:", employeeId);
      this.manualId = employeeId;
      this.chargerPersonnel();
    },

    async chargerPersonnel() {
      if (!this.manualId) {
        this.showMessage('Veuillez scanner un QR code ou entrer un ID', 'error');
        return;
      }

      this.idPersonnel = this.manualId;
      this.personnelSelectionne = true;
      
      await this.chargerPointagesJour();
      await this.chargerProchainType();
    },

    resetPersonnel() {
      this.personnelSelectionne = false;
      this.idPersonnel = null;
      this.manualId = null;
      this.pointagesJour = [];
      this.prochainType = null;
      this.message = '';
    },

    async chargerHoraires() {
      try {
        this.horaires = await pointageService.getHorairesActifs();
      } catch (error) {
        this.showMessage('Erreur lors du chargement des horaires', 'error');
      }
    },

    async chargerPointagesJour() {
      try {
        this.pointagesJour = await pointageService.getPointagesJour(this.idPersonnel);
      } catch (error) {
        console.error('Erreur chargement pointages:', error);
      }
    },

    async chargerProchainType() {
      try {
        const response = await pointageService.suggererProchainType(this.idPersonnel);
        this.prochainType = response.prochainType;
        this.typePointage = response.prochainType;
      } catch (error) {
        console.error('Erreur suggestion:', error);
      }
    },

    async enregistrerPointage() {
      if (!this.idPersonnel) {
        this.showMessage('Veuillez entrer votre ID personnel', 'error');
        return;
      }

      this.loading = true;
      try {
        const pointageData = {
          personnel: { idPersonnel: this.idPersonnel },
          typePointage: this.typePointage,
          dateHeure: new Date().toISOString(),
          localisation: this.localisation || null,
          remarque: this.remarque || null,
          horaireTravail: this.selectedHoraire ? { idHoraire: this.selectedHoraire.idHoraire } : null
        };

        await pointageService.enregistrerPointage(pointageData);
        this.showMessage('✓ Pointage enregistré avec succès!', 'success');
        
        await this.chargerPointagesJour();
        await this.chargerProchainType();
        
        this.localisation = '';
        this.remarque = '';
      } catch (error) {
        this.showMessage('Erreur lors de l\'enregistrement: ' + error.message, 'error');
      } finally {
        this.loading = false;
      }
    },

    showMessage(text, type) {
      this.message = text;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 5000);
    }
  }
};
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>