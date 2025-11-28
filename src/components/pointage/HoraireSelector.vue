<template>
  <div class="horaire-selector">
    <label for="horaire">Horaire de travail</label>
    <select 
      id="horaire" 
      v-model="selectedHoraire" 
      @change="onHoraireChange"
      class="horaire-select"
    >
      <option :value="null">Sélectionner un horaire</option>
      <option 
        v-for="horaire in horaires" 
        :key="horaire.idHoraire" 
        :value="horaire"
      >
        {{ horaire.libelle }} ({{ formatTime(horaire.heureDebut) }} - {{ formatTime(horaire.heureFin) }})
      </option>
    </select>
    
    <div v-if="selectedHoraire" class="horaire-details">
      <p><strong>Durée pause:</strong> {{ selectedHoraire.dureePause }} min</p>
      <p v-if="selectedHoraire.heurePauseDebut">
        <strong>Pause:</strong> 
        {{ formatTime(selectedHoraire.heurePauseDebut) }} - {{ formatTime(selectedHoraire.heurePauseFin) }}
      </p>
      <p><strong>Tolérance retard:</strong> {{ selectedHoraire.toleranceRetard }} min</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HoraireSelector',
  props: {
    horaires: {
      type: Array,
      required: true
    },
    modelValue: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      selectedHoraire: this.modelValue
    };
  },
  watch: {
    modelValue(newVal) {
      this.selectedHoraire = newVal;
    }
  },
  methods: {
    onHoraireChange() {
      this.$emit('update:modelValue', this.selectedHoraire);
    },
    formatTime(time) {
      if (!time) return '';
      return time.substring(0, 5); // HH:mm
    }
  }
};
</script>

<style scoped>
.horaire-selector {
  margin: 20px 0;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.horaire-select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s;
}

.horaire-select:focus {
  outline: none;
  border-color: #4CAF50;
}

.horaire-details {
  margin-top: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.horaire-details p {
  margin: 6px 0;
  font-size: 14px;
  color: #666;
}
</style>
