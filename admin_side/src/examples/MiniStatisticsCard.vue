<template>
  <div class="mb-3 card mini-statistics-card">
    <div class="p-3 card-body">
      <div class="d-flex align-items-center">
        <div
          class="icon-container text-center shadow icon icon-shape"
          :style="{
            backgroundColor: icon.background,
            borderRadius: icon.shape === 'rounded-circle' ? '50%' : '4px',
          }"
        >
          <v-icon :class="`text-lg opacity-10 ${icon.component}`" :style="{ color: icon.color }">
            {{ icon.component }}
          </v-icon>
        </div>
        <div :class="classContent" class="ms-3">
          <div class="numbers">
            <p class="mb-0 text-sm text-uppercase font-weight-bold">
              {{ title }}
            </p>
            <h5 class="mb-0 font-weight-bolder">
              {{ value }}
              <span
                v-if="percentage && typeof percentage === 'object'"
                :class="`text-sm font-weight-bolder text-${percentage.color}`"
              >
                {{ percentage.value }}
              </span>
            </h5>
            <router-link v-if="link" :to="link" class="mt-2 mb-0 text-muted d-block plain-link">
              {{ description }}
            </router-link>
            <p v-else-if="description" class="mt-2 mb-0 text-muted">
              {{ description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  percentage: {
    type: Object,
    default: () => ({}),
  },
  description: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    default: '',
  },
  icon: {
    type: Object,
    default: () => ({
      component: '',
      background: '#000', // Default background color
      shape: 'border-radius-md', // Default shape
      color: '#ffffff', // Default icon color
    }),
  },
  classContent: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.mini-statistics-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  transition: box-shadow 0.3s ease;
  box-shadow: 0 10px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.mini-statistics-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.icon-container {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.numbers p {
  color: #333333;
}

.numbers h5 {
  color: #333333;
}

.numbers .text-muted {
  color: #777777;
}

.plain-link {
  text-decoration: none; /* Remove underline */
  color: inherit; /* Inherit color */
}

.plain-link:hover {
  text-decoration: none; /* Ensure no underline on hover */
}
</style>
