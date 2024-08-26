<template>
  <main>
    <div class="header" v-if="isSmallScreen">
      <div class="headerTitle">
        DASHBOARD
      </div>
    </div>
    <div class="main-content" :class="{ 'mini-variant': miniVariant }">
      <div class="dashboard">
        <Dashboard />
      </div>
    </div>
  </main>
</template>

<script>
import Dashboard from '../components/Dashboard.vue';

export default {
  components: {
    Dashboard,
  },
  data() {
    return {
      isSmallScreen: false,
      miniVariant: false, // State to manage sidebar visibility
    };
  },
  created() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  },
  destroyed() {
    window.removeEventListener('resize', this.checkScreenSize);
  },
  methods: {
    checkScreenSize() {
      this.isSmallScreen = window.innerWidth <= 960;
    },
    toggleSidebar() {
      this.$emit('toggle-mini-variant');
    },
  },
};
</script>

<style lang="scss">
.main-content {
  display: flex;
  flex-direction: column;
  margin-left: 10px;

  .dashboard {
    border-radius: 10px;
    background-color: #f0f0f0;
    padding: 1rem;
    height: 110vh;
    border: 1px solid #ccc; // Add border
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Add shadow effect
  }

  &.mini-variant {
    margin-left: 0px; // Adjust margin when sidebar is collapsed
  }
}

@media (max-width: 960px) {
  .header {
    padding: 10px;
    max-width: 100%;

    .headerTitle{
      font-size: 18px;
      font-weight: bold;
      margin-left: 35px;
    }
    
    .menu-icon {
      display: block; /* Show menu icon on mobile */
    }

    .v-icon {
      margin-right: 10px; /* Adjust spacing if needed */
    }
  }

  .main-content {
    margin-left: 0px;
    max-width: 100%;

    .dashboard {
      padding: 0.5rem;
      height: 100%;
    }
  }
}
</style>
