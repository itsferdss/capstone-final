<template>
  <v-card class="chart-card">
    <v-card-text>
      <v-responsive>
        <v-container fluid class="canvas-container">
          <canvas ref="chartCanvas"></canvas>
        </v-container>
      </v-responsive>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend, registerables } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend, ...registerables);

const props = defineProps({
  chart: Object,
});

const chartCanvas = ref(null);
let chartInstance = null;

onMounted(() => {
  initializeChart();
});

watch(() => props.chart, () => {
  if (chartInstance) {
    chartInstance.destroy();
  }
  initializeChart();
});

function initializeChart() {
  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d');
    if (ctx) {
      chartInstance = new Chart(ctx, {
        type: 'doughnut', 
        data: props.chart,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                font: {
                  size: 10,
                  family: 'Open Sans',
                  style: 'normal',
                  lineHeight: 2,
                },
                color: '#333',
              },
            },
          },
        },
      });
    }
  }
}
</script>

<style scoped>
.chart-card {
  margin-bottom: 0px;
  height: auto; /* Ensures card expands to fit content */
}

.canvas-container {
  height: 100%;
}

.canvas-container canvas {
  width: 100% !important;
  height: 300px !important; /* Adjust this height as needed */
}
</style>
