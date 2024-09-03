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
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend, registerables } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend, ...registerables);

const props = defineProps({
  chart: Object,
});

const chartCanvas = ref(null);
let chartInstance = null;

onMounted(() => {
  initializeChart();
});

watch(() => props.chart, (newValue, oldValue) => {
  updateChart(newValue);
}, { deep: true });

function initializeChart() {
  const ctx = chartCanvas.value.getContext('2d');
  if (ctx) {
    chartInstance = new Chart(ctx, {
      type: 'line',
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
                size: 12,
                family: 'Open Sans',
                style: 'normal',
                lineHeight: 2,
              },
              color: '#333',
            },
          },
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 12,
              },
            },
          },
          y: {
            max: 50,
            ticks: {
              font: {
                size: 12,
              },
            },
          },
        },
      },
    });
  }
}

function updateChart(newData) {
  if (chartInstance) {
    chartInstance.data = newData;
    chartInstance.update();
  }
}
</script>

<style scoped>
.chart-card {
  margin-bottom: 0px;
  height: auto;
}

.canvas-container {
  height: 100%;
  width: 100%;
}

canvas {
  width: 100% !important;
  height: 300px !important;
}

@media (max-width: 768px) {
  canvas {
    height: 300px !important;
  }
}

@media (max-width: 480px) {
  canvas {
    height: 200px !important;
  }
}
</style>
