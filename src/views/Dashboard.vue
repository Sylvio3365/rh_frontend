<template>
  <div class="dashboard p-4">
    <!-- end nav -->
    <div class="mt-2 w-full">
      <div class="lg:flex grid-cols-1 lg:space-y-0 space-y-3 gap-5 justify-between">
        <div>
          <p class="uppercase text-xs text-gray-700 font-semibold">Aperçu</p>
          <h1 class="text-2xl text-gray-900 dark:text-gray-200 font-medium">
            Tableau de Bord RH
          </h1>
        </div>
        <div class="flex gap-2">
          <button
            class="bg-white dark:bg-gray-800 hover:border-gray-200 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700 border rounded py-2 px-5">
            Nouvelle vue
          </button>
          <button
            class="bg-primary border flex gap-2 text-white hover:bg-primary/80 dark:border-gray-700 rounded py-3 px-5">
            <span class="icon text-2xl">
              <Icon icon="ic:twotone-plus" />
            </span>
            <span class="text"> Nouveau Rapport</span>
          </button>
        </div>
      </div>
    </div>

    <!-- grid wrapper card -->
    <div class="wrapper-card grid lg:grid-cols-4 grid-cols-1 md:grid-cols-2 gap-2 mt-5">
      <!-- card  -->
      <div class="card bg-white dark:bg-gray-800 w-full rounded-md p-5 border dark:border-gray-700 flex">
        <div class="p-2 max-w-sm">
          <div class="bg-orange-200 rounded-full w-14 h-14 text-lg p-3 text-orange-600 mx-auto">
            <span class="">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="30px" height="30px"
                preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M10 16V8a2 2 0 0 1 2-2h9V5c0-1.1-.9-2-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-1h-9a2 2 0 0 1-2-2zm3-8c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h9V8h-9zm3 5.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
              </svg>
            </span>
          </div>
        </div>

        <div class="block p-2 w-full">
          <p class="font-semibold text-gray-900 dark:text-gray-200 text-xl">
            156
          </p>
          <h2 class="font-normal text-gray-400 text-md mt-1">Employés Total</h2>
        </div>
      </div>
      <!-- end card -->
      <div class="card bg-white dark:bg-gray-800 w-full rounded-md p-5 border dark:border-gray-700 flex">
        <div class="p-2 max-w-sm">
          <div class="bg-green-200 rounded-full w-14 h-14 text-lg p-3 text-green-600 mx-auto">
            <span class="">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="30px" height="30px"
                preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M5 22h14a2 2 0 0 0 2-2V9a1 1 0 0 0-1-1h-3v-.777c0-2.609-1.903-4.945-4.5-5.198A5.005 5.005 0 0 0 7 7v1H4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2zm12-12v2h-2v-2h2zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v1H9V7zm-2 3h2v2H7v-2z" />
              </svg>
            </span>
          </div>
        </div>

        <div class="block p-2 w-full">
          <p class="font-semibold text-gray-900 dark:text-gray-200 text-xl">
            23
          </p>
          <h2 class="font-normal text-gray-400 text-md mt-1">Congés ce mois</h2>
        </div>
      </div>
      <!-- end card -->
      <div class="card bg-white dark:bg-gray-800 w-full rounded-md p-5 border dark:border-gray-700 flex">
        <div class="p-2 max-w-sm">
          <div class="bg-red-200 rounded-full w-14 h-14 text-lg p-3 text-red-600 mx-auto">
            <span class="">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="30px" height="30px"
                preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32">
                <path fill="none"
                  d="M8.007 24.93A4.996 4.996 0 0 1 13 20h6a4.996 4.996 0 0 1 4.993 4.93a11.94 11.94 0 0 1-15.986 0ZM20.5 12.5A4.5 4.5 0 1 1 16 8a4.5 4.5 0 0 1 4.5 4.5Z" />
                <path fill="currentColor"
                  d="M26.749 24.93A13.99 13.99 0 1 0 2 16a13.899 13.899 0 0 0 3.251 8.93l-.02.017c.07.084.15.156.222.239c.09.103.187.2.28.3c.28.304.568.596.87.87c.092.084.187.162.28.242c.32.276.649.538.99.782c.044.03.084.069.128.1v-.012a13.901 13.901 0 0 0 16 0v.012c.044-.031.083-.07.128-.1c.34-.245.67-.506.99-.782c.093-.08.188-.159.28-.242c.302-.275.59-.566.87-.87c.093-.1.189-.197.28-.3c.071-.083.152-.155.222-.24ZM16 8a4.5 4.5 0 1 1-4.5 4.5A4.5 4.5 0 0 1 16 8ZM8.007 24.93A4.996 4.996 0 0 1 13 20h6a4.996 4.996 0 0 1 4.993 4.93a11.94 11.94 0 0 1-15.986 0Z" />
              </svg>
            </span>
          </div>
        </div>

        <div class="block p-2 w-full">
          <p class="font-semibold text-gray-900 dark:text-gray-200 text-xl">
            12
          </p>
          <h2 class="font-normal text-gray-400 text-md mt-1">
            Postes Vacants
          </h2>
        </div>
      </div>
      <!-- end card -->
      <div class="card bg-white dark:bg-gray-800 w-full rounded-md p-5 border dark:border-gray-700 flex">
        <div class="p-2 max-w-sm">
          <div class="bg-purple-200 rounded-full w-14 h-14 text-lg p-3 text-purple-600 mx-auto">
            <span class="">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="30px" height="30px"
                preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16">
                <g fill="currentColor">
                  <path d="M15 13v1H1.5l-.5-.5V0h1v13h13Z" />
                  <path
                    d="M13 3.207L7.854 8.354h-.708L5.5 6.707l-3.646 3.647l-.708-.708l4-4h.708L7.5 7.293l5.146-5.147h.707l2 2l-.707.708L13 3.207Z" />
                </g>
              </svg>
            </span>
          </div>
        </div>

        <div class="block p-2 w-full">
          <p class="font-semibold text-gray-900 dark:text-gray-200 text-xl">
            89%
          </p>
          <h2 class="font-normal text-gray-400 text-md mt-1">Taux Présence</h2>
        </div>
      </div>
      <!-- end card -->
    </div>
    <!-- end wrapper card -->
    <div class="mt-2 lg:flex block lg:gap-2 relative">
      <div class="bg-white dark:bg-gray-800 p-0 lg:w-3/4 w-full rounded-md box-border border dark:border-gray-700">
        <div class="p-5 flex justify-between">
          <div>
            <h2 class="font-medium text-sm text-gray-800 dark:text-gray-200">
              ÉVOLUTION DES EFFECTIFS
            </h2>
            <h1 class="font-semibold text-4xl text-gray-800 dark:text-gray-200">
              15%
            </h1>

            <p class="text-gray-400 font-lexend font-normal">
              Évolution du personnel par année
            </p>
          </div>

          <div class="flex gap-5">
            <span class="">
              <h2 class="text-red-500 flex">
                <span class="mr-2"> 5.9% </span><span>
                  <Icon icon="akar-icons:arrow-down" />
                </span>
              </h2>
            </span>
            <span class="">
              <h2 class="text-green-500 flex">
                <span class="mr-2"> 27.9% </span><span>
                  <Icon icon="akar-icons:arrow-up" />
                </span>
              </h2>
            </span>
          </div>
        </div>

        <apexchart width="100%" height="260" type="area" :options="optionsArea" :series="seriesArea" :sparkline="{
          enabled: true,
        }"></apexchart>
        <br />
        <hr />
        <div class="wrapper-button p-5 flex justify-between mt-3">
          <select name="" id=""
            class="dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 border max-w-lg px-4 py-3 block rounded-md text-gray-500 dark:text-gray-400">
            <option value="">5 dernières années</option>
          </select>
          <button class="uppercase border-b border-red-600 text-red-600">
            Rapport Effectifs
          </button>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 p-5 lg:mt-0 mt-4 lg:w-2/4 border dark:border-gray-700 rounded-md w-full">
        <div class="">
          <h2 class="text-lg font-semibold dark:text-gray-200">
            DERNIÈRES RECRUTEMENTS
          </h2>
          <p class="text-gray-400">Liste des derniers recrutements</p>
        </div>
        <perfect-scrollbar class="divide-y h-96 mt-5 dark:divide-gray-700">
          <div class="p-3 w-full">
            <div class="flex gap-5">
              <div>
                <img class="w-14 rounded-md" src="../assets/img/user1.png" alt="" />
              </div>
              <div class="mt-1">
                <h2 class="dark:text-gray-200">Marie Dubois</h2>
                <p class="text-sm dark:text-gray-500 text-gray-400">
                  Développeuse Frontend
                </p>
                <p class="text-xs text-green-500">Embauche: 15/11/2024</p>
              </div>
            </div>
          </div>
          <div class="p-3 w-full">
            <div class="flex gap-5">
              <div>
                <img class="w-14 rounded-md" src="../assets/img/user2.png" alt="" />
              </div>
              <div class="mt-1">
                <h2 class="dark:text-gray-200">Pierre Martin</h2>
                <p class="text-sm dark:text-gray-500 text-gray-400">
                  Chef de Projet
                </p>
                <p class="text-xs text-green-500">Embauche: 10/11/2024</p>
              </div>
            </div>
          </div>
          <div class="p-3 w-full">
            <div class="flex gap-5">
              <div>
                <img class="w-14 rounded-md" src="../assets/img/user3.png" alt="" />
              </div>
              <div class="mt-1">
                <h2 class="dark:text-gray-200">Sophie Laurent</h2>
                <p class="text-sm dark:text-gray-500 text-gray-400">
                  Responsable RH
                </p>
                <p class="text-xs text-green-500">Embauche: 05/11/2024</p>
              </div>
            </div>
          </div>
          <div class="p-3 w-full">
            <div class="flex gap-5">
              <div>
                <img class="w-14 rounded-md" src="../assets/img/user4.png" alt="" />
              </div>
              <div class="mt-1">
                <h2 class="dark:text-gray-200">Thomas Bernard</h2>
                <p class="text-sm dark:text-gray-500 text-gray-400">
                  Analyste Data
                </p>
                <p class="text-xs text-green-500">Embauche: 01/11/2024</p>
              </div>
            </div>
          </div>
          <div class="p-3 w-full">
            <div class="flex gap-5">
              <div>
                <img class="w-14 rounded-md" src="../assets/img/user5.png" alt="" />
              </div>
              <div class="mt-1">
                <h2 class="dark:text-gray-200">Julie Petit</h2>
                <p class="text-sm dark:text-gray-500 text-gray-400">
                  Designer UI/UX
                </p>
                <p class="text-xs text-green-500">Embauche: 28/10/2024</p>
              </div>
            </div>
          </div>
        </perfect-scrollbar>
      </div>
    </div>
    <div class="mt-2 lg:flex block lg:gap-2">
      <div class="mt-2 bg-white dark:bg-gray-800 p-0 w-full rounded-md box-border border dark:border-gray-700">
        <div class="head p-5">
          <h2 class="font-bold text-lg text-gray-800 dark:text-gray-200">
            45
          </h2>
          <p class="text-gray-400 font-lexend font-normal">
            Congés en attente cette semaine
          </p>
          <span class="float-right">
            <h2 class="text-green-500 -mt-12 flex">
              <span class="mr-2"> 12.9% </span><span>
                <Icon icon="akar-icons:arrow-up" />
              </span>
            </h2>
          </span>
        </div>
        <div class="wrapper-chart mt-5 pr-2 pl-2">
          <apexchart width="100%" height="380" type="bar" :options="optionsBar" :series="seriesBar"></apexchart>
          <br />
          <hr />
          <div class="footer p-5">
            <div class="wrapper-button flex justify-between mt-3">
              <select name="" id=""
                class="dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 border max-w-lg px-4 py-3 block rounded-md text-gray-500 dark:text-gray-400">
                <option value="">7 derniers jours</option>
              </select>
              <button class="uppercase border-b border-red-600 text-red-600">
                Rapport Congés
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-2 bg-white dark:bg-gray-800 p-0 w-full rounded-md box-border border dark:border-gray-700">
        <div class="head p-5">
          <h2 class="font-bold text-lg text-gray-800 dark:text-gray-200">
            23
          </h2>
          <p class="text-gray-400 font-lexend font-normal">Évaluations cette semaine</p>

          <span class="float-right">
            <h2 class="text-green-500 -mt-12 flex">
              <span class="mr-2"> 8.9% </span><span>
                <Icon icon="akar-icons:arrow-up" />
              </span>
            </h2>
          </span>
        </div>
        <div class="wrapper-chart mt-5">
          <apexchart width="100%" height="380" type="area" :options="optionsVisitor" :series="seriesVisitor">
          </apexchart>
          <br />
          <hr />
          <div class="footer p-5">
            <div class="wrapper-button flex justify-between mt-3">
              <select name="" id=""
                class="dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 border max-w-lg px-4 py-3 block rounded-md text-gray-500 dark:text-gray-400">
                <option value="">7 derniers jours</option>
              </select>
              <button class="uppercase border-b border-red-600 text-red-600">
                Rapport Évaluations
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-2 bg-white dark:bg-gray-800 p-0 w-full rounded-md box-border border dark:border-gray-700">
        <div class="head p-5">
          <h2 class="font-bold text-lg text-gray-800 dark:text-gray-200">
            156
          </h2>
          <p class="text-gray-400 font-lexend font-normal">
            Répartition par département
          </p>
        </div>

        <div class="wrapper-chart mt-5">
          <apexchart width="100%" height="380" type="pie" :options="optionsDonut" :series="seriesDonut"></apexchart>
          <div class="p-3"></div>
          <br />
          <hr />
          <div class="footer p-5">
            <div class="wrapper-button flex justify-between mt-3">
              <select name="" id=""
                class="dark:bg-gray-800 dark:hover:bg-gray-700 border dark:border-gray-700 max-w-lg px-4 py-3 block rounded-md text-gray-500 dark:text-gray-400">
                <option value="">Par département</option>
              </select>

              <button class="uppercase border-b border-red-600 text-red-600">
                Rapport Effectifs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-2 bg-white dark:bg-gray-800 p-5 w-full rounded-md box-border border dark:border-gray-700">
      <h2 class="font-bold text-lg text-gray-800 dark:text-gray-200">
        Dernières Transactions RH
      </h2>
      <p class="text-gray-400 font-lexend font-normal">
        Liste des dernières opérations RH
      </p>
      <div class="wrapping-table mt-10">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 lg:overflow-auto overflow-x-scroll">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="uppercase px-6 py-3">
                Opération
              </th>
              <th scope="col" class="uppercase px-6 py-3">
                Date & Heure
              </th>
              <th scope="col" class="uppercase px-6 py-3">
                Employé
              </th>
              <th scope="col" class="uppercase px-6 py-3">
                Statut
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50"
              v-for="items in tableTransaction" :key="items.transaction">
              <td class="px-6 py-4">
                {{ items.transaction }}
              </td>
              <td class="px-6 py-4">
                {{ items.datetime }}
              </td>
              <td class="px-6 py-4">
                {{ items.employee }}
              </td>
              <td class="px-6 py-4">
                <span class="text-green-800 bg-green-300 px-3 py-1 rounded-md"
                  v-if="items.statusTransaction == 'completed'">
                  {{ items.statusTransaction }}
                </span>
                <span class="text-purple-800 bg-purple-300 px-3 py-1 rounded-md"
                  v-else-if="items.statusTransaction == 'progress'">
                  {{ items.statusTransaction }}
                </span>
                <span class="text-red-800 bg-red-300 px-3 py-1 rounded-md" v-else>
                  {{ items.statusTransaction }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="wrapper-button flex justify-between mt-3">
        <select name="" id=""
          class="dark:bg-gray-800 dark:hover:bg-gray-700 border dark:border-gray-700 max-w-lg px-4 py-3 block rounded-md text-gray-500 dark:text-gray-400">
          <option value="">7 derniers jours</option>
        </select>
        <button class="uppercase border-b border-red-600 text-red-600">
          Rapport Opérations
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Icon } from "@iconify/vue";

export default {
  name: "Dashboard",
  data() {
    return {
      // for more guide apexchart.js
      // https://apexcharts.com/docs/chart-types/line-chart/

      // chart data area
      optionsArea: {
        xaxis: {
          categories: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
        },
        fontFamily: "Segoe UI, sans-serif",
        stroke: {
          curve: "straight",
        },
        chart: {
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: false,
          },
          sparkline: {
            enabled: true,
          },
        },
        markers: {
          size: 0,
        },
        yaxis: {
          show: false,
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 0,
            opacityFrom: 0.2,
            opacityTo: 0.5,
            stops: [0, 90, 100],
          },
        },
      },

      chart: {
        fontFamily: "lexend, sans-serif",
      },

      seriesArea: [
        {
          name: "Effectifs",
          data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
        {
          name: "Effectifs (Période précédente)",
          data: [20, 34, 45, 55, 79, 87, 90, 98],
        },
      ],
      optionsBar: {
        chart: {
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          sparkline: {
            enabled: true,
          },
        },
        legend: {
          show: false,
        },
        xaxis: {
          show: false,
        },
        yaxis: {
          show: false,
        },
        colors: ["#4f46e5", "#DC2626"],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
      },

      seriesBar: [
        {
          name: "Congés approuvés",
          data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
        {
          name: "Congés refusés",
          data: [20, 34, 45, 55, 79, 87, 90, 98],
        },
      ],
      optionsVisitor: {
        chart: {
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
          sparkline: {
            enabled: true,
          },
        },
        legend: {
          show: false,
        },
        xaxis: {
          show: false,
        },
        yaxis: {
          show: false,
        },
        colors: ["#4f46e5"],
        dataLabels: {
          enabled: false,
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 0,
            opacityFrom: 0,
            opacityTo: 0.3,
            stops: [0, 90, 100],
          },
        },
        stroke: {
          curve: "smooth",
        },
      },

      seriesVisitor: [
        {
          name: "Évaluations",
          data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
      ],
      optionsDonut: {
        chart: {
          type: "donut",
        },
        legend: false,
        dataLabels: {
          enabled: false,
        },
        labels: ["IT", "RH", "Commercial", "Marketing", "Production"],
      },

      seriesDonut: [45, 12, 38, 25, 36],
      tableTransaction: [
        {
          transaction: "Demande de congé approuvée",
          datetime: "22 Nov 2024",
          employee: "Marie Dubois",
          statusTransaction: "completed",
        },
        {
          transaction: "Nouvelle embauche",
          datetime: "20 Nov 2024",
          employee: "Pierre Martin",
          statusTransaction: "completed",
        },
        {
          transaction: "Évaluation en cours",
          datetime: "18 Nov 2024",
          employee: "Sophie Laurent",
          statusTransaction: "progress",
        },
        {
          transaction: "Demande de formation refusée",
          datetime: "15 Nov 2024",
          employee: "Thomas Bernard",
          statusTransaction: "cancelled",
        },
      ],
    };
    // end chart data line
  },
  components: {
    Icon,
  },
  mounted() { },
};
</script>