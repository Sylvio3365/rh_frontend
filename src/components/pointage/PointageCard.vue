<template>
  <div class="pointage-card" :class="typeClass">
    <div class="card-header">
      <span class="type-badge">{{ pointage.typePointage }}</span>
      <span class="time">{{ formatTime(pointage.dateHeure) }}</span>
    </div>
    <div class="card-body">
      <p class="date">{{ formatDate(pointage.dateHeure) }}</p>
      <p v-if="pointage.horaireTravail" class="horaire">
        📅 {{ pointage.horaireTravail.libelle }}
      </p>
      <p v-if="pointage.localisation" class="location">
        📍 {{ pointage.localisation }}
      </p>
      <p v-if="pointage.remarque" class="remarque">
        💬 {{ pointage.remarque }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PointageCard',
  props: {
    pointage: {
      type: Object,
      required: true
    }
  },
  computed: {
    typeClass() {
      return `type-${this.pointage.typePointage.toLowerCase()}`;
    }
  },
  methods: {
    formatTime(dateTime) {
      return new Date(dateTime).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    formatDate(dateTime) {
      return new Date(dateTime).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.pointage-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.pointage-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.type-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.type-entree .type-badge {
  background: #d4edda;
  color: #155724;
}

.type-sortie .type-badge {
  background: #f8d7da;
  color: #721c24;
}

.type-pause_debut .type-badge {
  background: #fff3cd;
  color: #856404;
}

.type-pause_fin .type-badge {
  background: #d1ecf1;
  color: #0c5460;
}

.time {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.card-body p {
  margin: 6px 0;
  font-size: 14px;
  color: #666;
}

.date {
  font-weight: 500;
  color: #333;
}
</style>
