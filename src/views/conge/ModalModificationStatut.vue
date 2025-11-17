<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-sm mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Modifier le statut</h3>
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

            <!-- Détails du congé -->
            <div class="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div>
                    <span class="text-gray-500 dark:text-gray-400">Type:</span>
                    <p class="font-medium">{{ getNomType(event?.type) }}</p>
                </div>
                <div>
                    <span class="text-gray-500 dark:text-gray-400">Période:</span>
                    <p class="font-medium">{{ formaterPeriode(event?.start, event?.end) }}</p>
                </div>
            </div>

            <!-- Sélection du statut -->
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Nouveau statut</label>
                <div class="space-y-2">
                    <button v-for="option in optionsStatut" :key="option.value" @click="statutLocal = option.value"
                        :class="[
                            'w-full flex items-center justify-between p-3 border rounded-lg transition-colors',
                            statutLocal === option.value
                                ? option.classes.active
                                : option.classes.inactive
                        ]">
                        <div class="flex items-center space-x-3">
                            <span :class="['w-2 h-2 rounded-full', option.classes.dot]"></span>
                            <span class="font-medium">{{ option.label }}</span>
                        </div>
                        <Icon v-if="statutLocal === option.value" icon="mdi:check" class="w-5 h-5" />
                    </button>
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
    name: "ModalModificationStatut",
    components: {
        Icon
    },
    props: {
        event: {
            type: Object,
            default: null
        },
        statutActuel: {
            type: String,
            default: 'en-attente'
        }
    },
    data() {
        return {
            statutLocal: this.statutActuel,
            optionsStatut: [
                {
                    value: 'en-attente',
                    label: 'En attente',
                    classes: {
                        active: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200',
                        inactive: 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
                        dot: 'bg-yellow-500'
                    }
                },
                {
                    value: 'valide',
                    label: 'Validé',
                    classes: {
                        active: 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200',
                        inactive: 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
                        dot: 'bg-green-500'
                    }
                },
                {
                    value: 'refuse',
                    label: 'Refusé',
                    classes: {
                        active: 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200',
                        inactive: 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
                        dot: 'bg-red-500'
                    }
                }
            ]
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
        getNomType(type) {
            const noms = {
                'payes': 'Congés Payés',
                'maladie': 'Congés Maladie',
                'exceptionnel': 'Exceptionnels',
                'sans-solde': 'Sans Solde'
            };
            return noms[type] || type;
        },
        formaterPeriode(start, end) {
            if (!start || !end) return '';
            const startDate = new Date(start);
            const endDate = new Date(end);
            return `${startDate.toLocaleDateString('fr-FR')} - ${endDate.toLocaleDateString('fr-FR')}`;
        },
        confirmer() {
            this.$emit('update:statut', this.statutLocal);
        }
    },
    watch: {
        statutActuel(newVal) {
            this.statutLocal = newVal;
        }
    }
};
</script>