<template>
  <div>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-lg-12">
          <div class="row">
            <div class="col-lg-3 col-md-6 col-12 mb-4">
              <mini-statistics-card
                title="Total of Patients"
                :value="totalPatients"
                description="See Patients"
                link="/viewUsers"
                class="dashCards"
                :icon="{
                  component: 'mdi-account-multiple',
                  background: '#FFCDD2',
                  shape: 'rounded-circle',
                  color: '#B71C1C',
                }"
              />
            </div>
            <div class="col-lg-3 col-md-6 col-12 mb-4">
              <mini-statistics-card
                title="Total of Products"
                :value="totalProducts"
                description="See Products"
                link="/inventory"
                class="dashCards"
                :icon="{
                  component: 'mdi-package-variant',
                  background: '#E1BEE7',
                  shape: 'rounded-circle',
                  color: '#4A148C',
                }"
              />
            </div>
            <div class="col-lg-3 col-md-6 col-12 mb-4">
              <mini-statistics-card
                title="Total Reservations"
                :value="totalReservations"
                description="See Reservations"
                link="/schedule"
                class="dashCards"
                :icon="{
                  component: 'mdi-clipboard-list',
                  background: '#C8E6C9',
                  shape: 'rounded-circle',
                  color: '#2E7D32',
                }"
              />
            </div>
            <div class="col-lg-3 col-md-6 col-12 mb-4">
              <mini-statistics-card
                title="Accepted Reservations"
                :value="acceptedReservations"
                description="See Reservations"
                link="/schedule"
                class="dashCards"
                :icon="{
                  component: 'mdi-cart-arrow-down',
                  background: '#FFF9C4',
                  shape: 'rounded-circle',
                  color: '#F57F17',
                }"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-lg-7 mb-lg">
              <div class="card z-index-2">
                <v-card-title class="grey lighten-2">
                  <div>
                    <h5 class="lineTitle">Patients Overview</h5>
                    <div v-html="'<span class=\'font-weight-bold\'>Total of Patient</span> in 2024'" class="lineCaption"></div>
                  </div>
                </v-card-title>

                <v-divider></v-divider>

                <div v-if="chartData.datasets[0].data.length > 0">
                  <gradient-line-chart
                    id="chart-line"
                    :chart="chartData"
                  ></gradient-line-chart>
                </div>
              </div>
            </div>
            <div class="col-lg-5">
              <!-- pie chart -->
              <div class="card z-index-2">
                <v-card-title class="grey lighten-2">
                  <div>
                    <h5 class="pieTitle">{{ pieTitle }}</h5>
                    <div v-html="pieDescription" class="pieDescription"></div>
                  </div>
                </v-card-title>

                <!-- Divider -->
                <v-divider></v-divider>

                <!-- Chart Component -->
                <div v-if="statusCounts.length > 0">
                  <gradient-pie-chart
                    id="chart-pie"
                    :chart="{
                      labels: ['Declined', 'Accepted', 'Picked Up', 'Pending'],
                      datasets: [
                        {
                          data: statusCounts,
                          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#AFE1AF'],
                        },
                      ],
                    }"
                  ></gradient-pie-chart>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>    
    </div>
  </div>
</template>


<script setup>
import MiniStatisticsCard from "../examples/MiniStatisticsCard.vue";
import GradientLineChart from "../examples/GradientLineChart.vue";
import GradientPieChart from "../examples/GradientPieChart.vue";
import axios from 'axios';
import { ref, onMounted } from 'vue';

const pieTitle = 'Reservations Breakdown';
const pieDescription = '<span class="font-weight-bold">Reservation types</span> in 2024';

const totalPatients = ref(0);
const totalProducts = ref(0);
const totalReservations = ref(0);
const acceptedReservations = ref(0);
const statusCounts = ref([0, 0, 0, 0]);

const chartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Number of Patients',
      data: new Array(12).fill(0),
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 1,
    },
  ],
});

onMounted(() => {
  fetchPatients();
  fetchProducts();
  fetchTotalReservations();
  fetchAppointments();
  fetchReservationStatusCounts();
  fetchAccountsCreatedPerMonth();
});

async function fetchPatients() {
  try {
    const response = await axios.get('/patients');
    if (Array.isArray(response.data)) {
      totalPatients.value = response.data.length;
    } else {
      console.error('Unexpected response format');
    }
  } catch (error) {
    console.error('Error fetching patients:', error.message);
  }
}

async function fetchProducts() {
  try {
    const response = await axios.get('/products');
    if (Array.isArray(response.data)) {
      totalProducts.value = response.data.length;
    } else {
      console.error('Unexpected response format');
    }
  } catch (error) {
    console.error('Error fetching products:', error.message);
  }
}

async function fetchTotalReservations() {
  try {
    const response = await axios.get('/reservations/total');
    totalReservations.value = response.data;
  } catch (error) {
    console.error('Error fetching total reservations:', error.message);
  }
}

async function fetchAppointments() {
  axios.get('/reservations')
    .then(response => {
      acceptedReservations.value = response.data.filter(appointment => appointment.status === 'accepted').length;
    })
    .catch(error => {
      console.error('Error fetching appointments:', error);
    });
}

async function fetchReservationStatusCounts() {
  try {
    const response = await axios.get('/reservations/counts');
    const data = response.data;
    console.log('Fetched status counts:', data);
    statusCounts.value = [data.declined, data.accepted, data.picked_up, data.pending];
  } catch (error) {
    console.error('Error fetching reservation status counts:', error.message);
  }
}

async function fetchAccountsCreatedPerMonth() {
  try {
    const response = await axios.get('/accounts/created-per-month');
    const data = response.data;
    console.log('Fetched status dates:', data);

    // Normalize keys to expected month format
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedData = months.map(month => data[month.toLowerCase()] || 0);

    chartData.value.datasets[0].data = formattedData;
    console.log('Chart Data:', chartData.value.datasets[0].data); // Log the data
  } catch (error) {
    console.error('Error fetching accounts created per month:', error.message);
  }
}
</script>

<style scoped>
.caption {
  font-size: 15px; /* Adjust font size for mobile view */
}

.lineTitle {
  font-size: 18px; /* Adjust font size for mobile view */
}

.container-fluid {
  padding-left: 0;
  padding-right: 0;
}

.card {
  margin-bottom: 1rem;
  border-radius: 10px;
  border-width: 1px 1px 2px 4px;
  border-color: rgb(67, 100, 101);
  box-shadow: 0 10px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.dashCards{
  border-width: 1px 1px 2px 4px;
  border-color: rgb(67, 100, 101);
}

@media (max-width: 960px) {
  .container-fluid {
    padding-left: 0;
    padding-right: 0;
  }
  .dashCards {
     max-height: 150px;
     padding: 5px;
     font-size: 10px;
     }
    .v-card__title {
      font-size: 1px; /* Smaller font size for titles */
    }
    .v-card__subtitle {
      font-size: 8px;
    }

    .mainTitle{
      display: none;
    }

    .icon{
      size: 10px;
    }
    
    .lineTitle{
      font-size: 12px;
    }
    
    .lineCaption{
      font-size: 13px;
    }
    .line-chart-container {
      width: 50%;
      height: 200px; /* Adjust height as needed */
      overflow: hidden;
    }

    .line-chart {
      width: 100%;
      height: 100%;
    }

    .pieTitle{
      font-size: 12px;
    }

    .pieDescription{
      font-size: 13px
    }
    .v-toolbar {
      display: none !important;
    }
}
</style>
