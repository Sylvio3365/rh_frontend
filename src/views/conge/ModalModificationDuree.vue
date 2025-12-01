<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Modifier la durée
            </h3>
            
            <div class="mb-4">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Employé: <strong>{{ event.employe }}</strong>
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {{ capitalizeFirstLetter(event.typeLibelle) }} • {{ event.duree }}
                </p>
            </div>
            
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nouvelle durée (en jours)
                </label>
                <input type="number" 
                       v-model.number="nouvelleDuree" 
                       min="1" 
                       max="90"
                       class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    La date de fin sera ajustée automatiquement
                </p>
            </div>
            
            <div class="flex gap-3">
                <button @click="$emit('close')" 
                        class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    Annuler
                </button>
                <button @click="confirmer" 
                        :disabled="!nouvelleDuree || nouvelleDuree < 1"
                        class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
                    Confirmer
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ModalModificationDuree',
    props: {
        event: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            nouvelleDuree: this.extraireDuree(this.event.duree)
        };
    },
    methods: {
        extraireDuree(dureeStr) {
            const match = dureeStr.match(/\d+/);
            return match ? parseInt(match[0]) : 1;
        },
        confirmer() {
            this.$emit('update:duree', this.nouvelleDuree);
        },
        capitalizeFirstLetter(string) {
            if (!string) return '';
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
};
</script>