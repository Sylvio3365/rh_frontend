<template>
    <div class="gestion-personnel p-6">
        <!-- En-tête -->
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Gestion du Personnel
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
                Gestion complète des employés, contrats et documents RH
            </p>
        </div>

        <!-- Actions -->
        <div class="flex justify-between items-center mb-6">
            <!-- <div class="flex gap-3">
                <button class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    <Icon icon="mdi:plus" class="mr-2" />
                    Nouvel Employé
                </button>
                <button
                    class="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Icon icon="mdi:filter" class="mr-2" />
                    Filtrer
                </button>
            </div> -->
            <div class="relative">
                <input type="text" placeholder="Rechercher un employé..."
                    class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary">
                <Icon icon="mdi:magnify" class="absolute left-3 top-2.5 text-gray-400" />
            </div>
        </div>

        <!-- Tableau des employés -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Employé
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Poste
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Département
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Contrat
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-for="employe in employes" :key="employe.id"
                            class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                            @click="voirFicheEmploye(employe.id)">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <img src="@/assets/img/user1.png" :alt="employe.nom"
                                        class="h-10 w-10 rounded-full object-cover">
                                    <div class="ml-4">
                                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                                            {{ employe.prenom }} {{ employe.nom }}
                                        </div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400">
                                            {{ employe.email }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900 dark:text-white">{{ employe.poste }}</div>
                                <div class="text-sm text-gray-500 dark:text-gray-400">{{ employe.departement }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {{ employe.departement }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                    :class="getCouleurContrat(employe.typeContrat)">
                                    {{ employe.typeContrat }}
                                </span>
                                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {{ formatDate(employe.dateDebut) }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex gap-2">
                                    <button @click.stop="editerEmploye(employe.idPersonnel)"
                                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                        <Icon icon="mdi:pencil" />
                                    </button>
                                    <button @click.stop="voirDocuments(employe.idPersonnel)"
                                        class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                                        <Icon icon="mdi:file-document" />
                                    </button>
                                    <button @click.stop="voirHistorique(employe.idPersonnel)"
                                        class="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300">
                                        <Icon icon="mdi:history" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import axios from "axios";

export default {
    name: "ListeEmployes",
    components: {
        Icon,
    },
    data() {
        return {
            employes: []
        };
    },

    mounted() {
        this.chargerEmployes();
    },
    methods: {
        async chargerEmployes() {
            try {
                const res = await axios.get("http://localhost:9090/personnels");
                const personnels = res.data;

                const employesComplets = await Promise.all(
                    personnels.map(async (p) => {
                        let contrat = null;
                        try {
                            const resContrat = await axios.get(`http://localhost:9090/personnels/${p.idPersonnel}/contrat/actif`);
                            contrat = resContrat.data;
                        } catch (error) {
                            console.warn("Pas de contrat actif pour :", p.idPersonnel);
                        }

                        return {
                            id: p.idPersonnel,
                            nom: p.nom,
                            prenom: p.prenom,
                            email: p.utilisateur?.username || "-",
                            photo: p.photo || "user1.png",

                            poste: contrat?.poste?.nom || "Aucun poste",
                            departement: contrat?.poste?.departement?.libelle || "N/A",
                            typeContrat: contrat?.typeContrat?.libelle || "Aucun contrat",
                            dateDebut: contrat?.dateDebut || null
                        };
                    })
                );

                this.employes = employesComplets;

            } catch (e) {
                console.error("Erreur lors du chargement :", e);
            }
        },

        getCouleurContrat(typeContrat) {
            const couleurs = {
                'CDI': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                'CDD': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                'Stage': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
                'Alternance': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
            };
            return couleurs[typeContrat] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        },
        getCouleurStatut(statut) {
            const couleurs = {
                'Actif': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                'En période d\'essai': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                'Absent': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                'Démission': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            };
            return couleurs[statut] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('fr-FR');
        },
        voirFicheEmploye(id) {
            this.$router.push(`/employes/${id}`);
        },
        editerEmploye(id) {
            this.$router.push(`/employes/${id}/edition`);
        },
        voirDocuments(id) {
            this.$router.push(`/employes/${id}/documents`);
        },
        voirHistorique(id) {
            this.$router.push(`/employes/${id}/historique`);
        },
        getImageUrl(nomFichier) {
            return new URL(`../../assets/img/${nomFichier}`, import.meta.url).href;
        }
    }
};
</script>