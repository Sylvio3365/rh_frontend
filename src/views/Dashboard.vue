<template>
  <div class="dashboard p-4">
    <!-- Navigation et en-tête -->
    <div class="mt-2 w-full">
      <div class="lg:flex grid-cols-1 lg:space-y-0 space-y-3 gap-5 justify-between">
        <div>
          <h1 class="text-2xl text-gray-900 dark:text-gray-200 font-medium">
            Tableau de Bord RH
          </h1>
        </div>
        <div class="flex gap-2">
          <button
            class="bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700 border rounded py-2 px-4 text-sm">
            Exporter PDF
          </button>
          <button
            class="bg-primary border flex gap-2 text-white hover:bg-primary/80 dark:border-gray-700 rounded py-2 px-4 text-sm">
            <Icon icon="ic:twotone-plus" class="text-lg" />
            Nouveau Rapport
          </button>
        </div>
      </div>
    </div>

    <!-- Cartes principales -->
    <div class="wrapper-card grid lg:grid-cols-4 grid-cols-1 md:grid-cols-2 gap-4 mt-5">
      <!-- Carte Effectifs Total -->
      <div class="card bg-white dark:bg-gray-800 w-full rounded-lg p-5 border dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-semibold text-gray-900 dark:text-gray-200 text-2xl">156</p>
            <h2 class="font-normal text-gray-400 text-sm mt-1">Employés Total</h2>
          </div>
          <div class="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center">
            <Icon icon="mdi:account-group" class="text-orange-600 text-xl" />
          </div>
        </div>
        <div class="mt-3 flex justify-between text-xs">
          <span class="text-green-600">+5% vs mois dernier</span>
          <span class="text-gray-500">CDI: 89%</span>
        </div>
      </div>

      <!-- Carte Turnover -->
      <div class="card bg-white dark:bg-gray-800 w-full rounded-lg p-5 border dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-semibold text-gray-900 dark:text-gray-200 text-2xl">8.2%</p>
            <h2 class="font-normal text-gray-400 text-sm mt-1">Taux de Turnover</h2>
          </div>
          <div class="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center">
            <Icon icon="mdi:account-switch" class="text-red-600 text-xl" />
          </div>
        </div>
        <div class="mt-3 flex justify-between text-xs">
          <span class="text-red-600">+1.2% vs trimestre dernier</span>
          <span class="text-gray-500">Objectif: 7%</span>
        </div>
      </div>

      <!-- Carte Absentéisme -->
      <div class="card bg-white dark:bg-gray-800 w-full rounded-lg p-5 border dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-semibold text-gray-900 dark:text-gray-200 text-2xl">4.1%</p>
            <h2 class="font-normal text-gray-400 text-sm mt-1">Taux d'Absentéisme</h2>
          </div>
          <div class="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center">
            <Icon icon="mdi:calendar-remove" class="text-yellow-600 text-xl" />
          </div>
        </div>
        <div class="mt-3 flex justify-between text-xs">
          <span class="text-green-600">-0.3% vs mois dernier</span>
          <span class="text-gray-500">Maladie: 3.2%</span>
        </div>
      </div>

      <!-- Carte Ancienneté -->
      <div class="card bg-white dark:bg-gray-800 w-full rounded-lg p-5 border dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-semibold text-gray-900 dark:text-gray-200 text-2xl">4.8 ans</p>
            <h2 class="font-normal text-gray-400 text-sm mt-1">Ancienneté Moyenne</h2>
          </div>
          <div class="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center">
            <Icon icon="mdi:clock-outline" class="text-blue-600 text-xl" />
          </div>
        </div>
        <div class="mt-3 flex justify-between text-xs">
          <span class="text-green-600">+6 mois vs 2023</span>
          <span class="text-gray-500">Senior: >5 ans</span>
        </div>
      </div>
    </div>

    <!-- Section Statistiques Démographiques -->
    <div class="mt-6 grid lg:grid-cols-3 gap-6">
      <!-- Répartition par Genre -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-gray-200 mb-4">Répartition par Genre</h3>
        <div class="flex items-center justify-center">
          <apexchart width="300" height="300" type="donut" :options="genderChart.options" :series="genderChart.series">
          </apexchart>
        </div>
        <div class="grid grid-cols-2 gap-4 mt-4">
          <div class="text-center">
            <div class="flex items-center justify-center mb-2">
              <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span class="text-sm">Hommes</span>
            </div>
            <p class="font-semibold text-lg">58%</p>
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center mb-2">
              <div class="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
              <span class="text-sm">Femmes</span>
            </div>
            <p class="font-semibold text-lg">42%</p>
          </div>
        </div>
      </div>

      <!-- Répartition par Âge -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-gray-200 mb-4">Pyramide des Âges</h3>
        <apexchart width="100%" height="300" type="bar" :options="ageChart.options" :series="ageChart.series">
        </apexchart>
      </div>

      <!-- Répartition par Type de Contrat -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-gray-200 mb-4">Types de Contrat</h3>
        <apexchart width="100%" height="300" type="pie" :options="contractChart.options" :series="contractChart.series">
        </apexchart>
      </div>
    </div>

    <!-- Section Évolution des indicateurs -->
    <div class="mt-6 grid lg:grid-cols-2 gap-6">
      <!-- Évolution du Turnover -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-gray-200 mb-4">Évolution du Turnover</h3>
        <apexchart width="100%" height="300" type="line" :options="turnoverTrend.options"
          :series="turnoverTrend.series">
        </apexchart>
      </div>

      <!-- Évolution des Effectifs -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
        <h3 class="font-semibold text-gray-900 dark:text-gray-200 mb-4">Évolution des Effectifs</h3>
        <apexchart width="100%" height="300" type="area" :options="workforceTrend.options"
          :series="workforceTrend.series">
        </apexchart>
      </div>
    </div>

    <!-- Section Alertes -->
    <div class="mt-6 grid lg:grid-cols-2 gap-6">
      <!-- Alertes Fin de Contrat -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-gray-900 dark:text-gray-200">Alertes Fin de Contrat</h3>
          <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">5 alertes</span>
        </div>
        <div class="space-y-3">
          <div v-for="alert in contractAlerts" :key="alert.id"
            class="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div>
              <p class="font-medium text-sm">{{ alert.employee }}</p>
              <p class="text-xs text-gray-500">{{ alert.position }} • {{ alert.department }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-red-600">{{ alert.daysLeft }} jours</p>
              <p class="text-xs text-gray-500">Fin: {{ alert.endDate }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Alertes Congés Non Pris -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-gray-900 dark:text-gray-200">Congés Non Pris</h3>
          <span class="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">12 employés</span>
        </div>
        <div class="space-y-3">
          <div v-for="leave in unusedLeaves" :key="leave.id"
            class="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div>
              <p class="font-medium text-sm">{{ leave.employee }}</p>
              <p class="text-xs text-gray-500">{{ leave.department }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold text-orange-600">{{ leave.daysLeft }} jours</p>
              <p class="text-xs text-gray-500">À utiliser avant {{ leave.deadline }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Indicateurs par Service -->
    <div class="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
      <h3 class="font-semibold text-gray-900 dark:text-gray-200 mb-4">Indicateurs par Service</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b dark:border-gray-600">
              <th class="text-left py-3 font-medium">Service</th>
              <th class="text-center py-3 font-medium">Effectif</th>
              <th class="text-center py-3 font-medium">Turnover</th>
              <th class="text-center py-3 font-medium">Absentéisme</th>
              <th class="text-center py-3 font-medium">Ancienneté</th>
              <th class="text-center py-3 font-medium">Budget Formation</th>
              <th class="text-center py-3 font-medium">Satisfaction</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="dept in departmentStats" :key="dept.name"
              class="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="py-3">
                <div class="flex items-center">
                  <div class="w-2 h-2 rounded-full mr-2" :class="dept.color"></div>
                  {{ dept.name }}
                </div>
              </td>
              <td class="text-center py-3">{{ dept.employees }}</td>
              <td class="text-center py-3">
                <span
                  :class="dept.turnover > 10 ? 'text-red-600' : dept.turnover > 7 ? 'text-orange-600' : 'text-green-600'">
                  {{ dept.turnover }}%
                </span>
              </td>
              <td class="text-center py-3">
                <span :class="dept.absenteeism > 5 ? 'text-orange-600' : 'text-green-600'">
                  {{ dept.absenteeism }}%
                </span>
              </td>
              <td class="text-center py-3">{{ dept.seniority }} ans</td>
              <td class="text-center py-3">
                <span :class="dept.budgetStatus === 'dépassé' ? 'text-red-600' : 'text-green-600'">
                  {{ dept.budgetStatus }}
                </span>
              </td>
              <td class="text-center py-3">
                <span
                  :class="dept.satisfaction >= 8 ? 'text-green-600' : dept.satisfaction >= 7 ? 'text-yellow-600' : 'text-red-600'">
                  {{ dept.satisfaction }}/10
                </span>
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

export default {
  name: "DashboardRH",
  data() {
    return {
      // Données pour les graphiques démographiques
      genderChart: {
        series: [58, 42],
        options: {
          chart: {
            type: 'donut',
          },
          labels: ['Hommes', 'Femmes'],
          colors: ['#3B82F6', '#EC4899'],
          legend: {
            show: false
          },
          dataLabels: {
            enabled: false
          }
        }
      },

      ageChart: {
        series: [
          {
            name: 'Hommes',
            data: [8, 12, 15, 18, 16, 10, 6]
          },
          {
            name: 'Femmes',
            data: [7, 10, 14, 16, 14, 9, 5]
          }
        ],
        options: {
          chart: {
            type: 'bar',
            stacked: true
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          colors: ['#3B82F6', '#EC4899'],
          xaxis: {
            categories: ['<25', '25-30', '31-35', '36-40', '41-45', '46-50', '>50']
          },
          legend: {
            position: 'top'
          }
        }
      },

      contractChart: {
        series: [78, 15, 7],
        options: {
          chart: {
            type: 'pie',
          },
          labels: ['CDI', 'CDD', 'Alternance'],
          colors: ['#10B981', '#F59E0B', '#8B5CF6'],
          legend: {
            position: 'bottom'
          }
        }
      },

      // Évolution du turnover
      turnoverTrend: {
        series: [{
          name: 'Taux de turnover',
          data: [6.8, 7.2, 8.1, 7.5, 8.2, 7.9, 8.2]
        }],
        options: {
          chart: {
            type: 'line',
            height: 350
          },
          stroke: {
            width: 3,
            curve: 'smooth'
          },
          xaxis: {
            categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul']
          },
          colors: ['#EF4444'],
          markers: {
            size: 5
          }
        }
      },

      // Évolution des effectifs
      workforceTrend: {
        series: [{
          name: 'Effectifs',
          data: [142, 145, 148, 150, 152, 154, 156]
        }],
        options: {
          chart: {
            type: 'area',
            height: 350
          },
          stroke: {
            width: 3,
            curve: 'smooth'
          },
          xaxis: {
            categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul']
          },
          colors: ['#3B82F6'],
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.2,
            }
          }
        }
      },

      // Alertes fin de contrat
      contractAlerts: [
        {
          id: 1,
          employee: "Marie Dubois",
          position: "Développeuse Frontend",
          department: "IT",
          endDate: "15/12/2024",
          daysLeft: 15
        },
        {
          id: 2,
          employee: "Thomas Bernard",
          position: "Analyste Data",
          department: "Data",
          endDate: "20/12/2024",
          daysLeft: 20
        },
        {
          id: 3,
          employee: "Julie Petit",
          position: "Designer UI/UX",
          department: "Design",
          endDate: "25/12/2024",
          daysLeft: 25
        }
      ],

      // Congés non pris
      unusedLeaves: [
        {
          id: 1,
          employee: "Pierre Martin",
          department: "Commercial",
          daysLeft: 12,
          deadline: "31/12/2024"
        },
        {
          id: 2,
          employee: "Sophie Laurent",
          department: "RH",
          daysLeft: 8,
          deadline: "31/12/2024"
        },
        {
          id: 3,
          employee: "Marc Dupont",
          department: "IT",
          daysLeft: 15,
          deadline: "31/12/2024"
        }
      ],

      // Postes ouverts
      openPositions: [
        {
          id: 1,
          title: "Développeur Fullstack",
          department: "IT",
          candidates: 24,
          daysOpen: 15,
          progress: 75,
          urgency: "Élevée",
          urgencyClass: "bg-red-100 text-red-800"
        },
        {
          id: 2,
          title: "Chef de Projet",
          department: "IT",
          candidates: 18,
          daysOpen: 22,
          progress: 60,
          urgency: "Moyenne",
          urgencyClass: "bg-orange-100 text-orange-800"
        },
        {
          id: 3,
          title: "Commercial B2B",
          department: "Commercial",
          candidates: 32,
          daysOpen: 10,
          progress: 45,
          urgency: "Normale",
          urgencyClass: "bg-blue-100 text-blue-800"
        }
      ],

      // Formations à venir
      upcomingTrainings: [
        {
          id: 1,
          title: "Leadership & Management",
          date: "15/12/2024",
          participants: 12,
          status: "confirmée"
        },
        {
          id: 2,
          title: "Cybersécurité Avancée",
          date: "20/12/2024",
          participants: 8,
          status: "en attente"
        },
        {
          id: 3,
          title: "Intelligence Artificielle",
          date: "05/01/2025",
          participants: 15,
          status: "confirmée"
        }
      ],

      // Compétences critiques
      criticalSkills: [
        {
          name: "Data Science",
          department: "IT/Data",
          gap: 3
        },
        {
          name: "Cloud Architecture",
          department: "IT",
          gap: 2
        },
        {
          name: "Marketing Digital",
          department: "Marketing",
          gap: 2
        }
      ],

      // Statistiques par service
      departmentStats: [
        {
          name: "IT",
          employees: 45,
          turnover: 12.5,
          absenteeism: 3.2,
          seniority: 3.8,
          budgetStatus: "dépassé",
          satisfaction: 8.7,
          color: "bg-blue-500"
        },
        {
          name: "Commercial",
          employees: 38,
          turnover: 8.2,
          absenteeism: 2.1,
          seniority: 4.2,
          budgetStatus: "dans budget",
          satisfaction: 8.2,
          color: "bg-green-500"
        },
        {
          name: "Marketing",
          employees: 22,
          turnover: 6.5,
          absenteeism: 4.8,
          seniority: 5.1,
          budgetStatus: "dans budget",
          satisfaction: 7.8,
          color: "bg-purple-500"
        },
        {
          name: "RH",
          employees: 15,
          turnover: 3.2,
          absenteeism: 2.5,
          seniority: 6.3,
          budgetStatus: "dans budget",
          satisfaction: 8.9,
          color: "bg-pink-500"
        },
        {
          name: "Production",
          employees: 36,
          turnover: 15.2,
          absenteeism: 7.8,
          seniority: 2.8,
          budgetStatus: "dépassé",
          satisfaction: 6.5,
          color: "bg-orange-500"
        }
      ]
    };
  },
  components: {
    Icon,
  },
  mounted() {
    // Ici vous pouvez ajouter des appels API pour récupérer les données réelles
  }
};
</script>

<style scoped>
.dashboard {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Styles pour le défilement personnalisé */
.ps {
  max-height: 400px;
}
</style>