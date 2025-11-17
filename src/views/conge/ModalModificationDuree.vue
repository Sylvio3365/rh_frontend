<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-sm mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Modifier la durée</h3>
                <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    <Icon icon="mdi:close" class="w-5 h-5" />
                </button>
            </div>

            <!-- Informations employé -->
            <div class="flex items-center space-x-3 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img :src="getPhotoEmploye(event?.photo)" :alt="event?.employe"
                    class="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-600">
                <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 dark:text-white truncate">{{ event?.employe }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ event?.departement }}</p>
                </div>
            </div>

            <!-- Détails actuels -->
            <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div class="text-sm text-blue-800 dark:text-blue-200">
                    <div class="font-medium mb-1">Durée actuelle</div>
                    <div>{{ calculerDureeActuelle() }} jour(s)</div>
                    <div class="text-xs mt-1">{{ formaterPeriode(event?.start, event?.end) }}</div>
                </div>
            </div>

            <!-- Sélection de la durée -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Nouvelle durée (en jours)
                </label>
                <div class="flex items-center space-x-3">
                    <button @click="decrementerDuree"
                        class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Icon icon="mdi:minus" class="w-4 h-4" />
                    </button>
                    <input v-model.number="dureeLocale" type="number" min="1" max="30"
                        class="w-20 text-center border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700">
                    <button @click="incrementerDuree"
                        class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                        <Icon icon="mdi:plus" class="w-4 h-4" />
                    </button>
                    <span class="text-sm text-gray-600 dark:text-gray-400 ml-2">jour(s)</span>
                </div>
                <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Nouvelle période: {{ calculerNouvellePeriode() }}
                </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button @click="$emit('close')"
                    class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Annuler
                </button>
                <button @click="confirmer"
                    class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
                    Confirmer
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
    name: "ModalModificationDuree",
    components: {
        Icon
    },
    props: {
        event: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            dureeLocale: this.calculerDureeActuelle()
        };
    },
    methods: {
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
        calculerDureeActuelle() {
            if (!this.event?.start || !this.event?.end) return 1;
            const start = new Date(this.event.start);
            const end = new Date(this.event.end);
            const diffTime = Math.abs(end - start);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        },
        formaterPeriode(start, end) {
            if (!start || !end) return '';
            const startDate = new Date(start);
            const endDate = new Date(end);
            return `${startDate.toLocaleDateString('fr-FR')} - ${endDate.toLocaleDateString('fr-FR')}`;
        },
        calculerNouvellePeriode() {
            if (!this.event?.start) return '';
            const startDate = new Date(this.event.start);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + this.dureeLocale);
            return this.formaterPeriode(startDate, endDate);
        },
        incrementerDuree() {
            if (this.dureeLocale < 30) {
                this.dureeLocale++;
            }
        },
        decrementerDuree() {
            if (this.dureeLocale > 1) {
                this.dureeLocale--;
            }
        },
        confirmer() {
            this.$emit('update:duree', this.dureeLocale);
        }
    }
};
</script>