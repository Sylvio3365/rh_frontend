<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Modifier le statut
            </h3>
            
            <div class="mb-4">
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Employé: <strong>{{ event.employe }}</strong>
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {{ capitalizeFirstLetter(event.typeLibelle) }} • {{ event.duree }}
                </p>
            </div>
            
            <div class="space-y-3 mb-6">
                <label v-for="statut in statuts" :key="statut.value"
                       class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                       :class="{'border-primary bg-primary/5': nouveauStatut === statut.value}">
                    <input type="radio" 
                           :value="statut.value" 
                           v-model="nouveauStatut"
                           class="mr-3">
                    <div class="flex items-center">
                        <div class="w-3 h-3 rounded-full mr-2" :style="{backgroundColor: statut.couleur}"></div>
                        <span class="font-medium">{{ statut.nom }}</span>
                    </div>
                </label>
            </div>
            
            <div class="flex gap-3">
                <button @click="$emit('close')" 
                        class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    Annuler
                </button>
                <button @click="confirmer" 
                        class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    Confirmer
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ModalModificationStatut',
    props: {
        event: {
            type: Object,
            required: true
        },
        statutActuel: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            nouveauStatut: this.statutActuel,
            statuts: [
                { value: 1, nom: 'En attente', couleur: '#F59E0B' },
                { value: 2, nom: 'Validé', couleur: '#10B981' },
                { value: 3, nom: 'Refusé', couleur: '#EF4444' }
            ]
        };
    },
    methods: {
        confirmer() {
            this.$emit('update:statut', this.nouveauStatut);
        },
        capitalizeFirstLetter(string) {
            if (!string) return '';
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
};
</script>