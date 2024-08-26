<template>
    <main>
      <div class="header" v-if="isSmallScreen">RESERVATIONS</div>
        <div class="main-content">
            <div class="schedules">
                <Schedule />
            </div>
        </div>
    </main>
</template>

<script>
import Schedule from '../components/Schedule.vue';

export default {
  components: {
    Schedule
  },
   data() {
    return {
      isSmallScreen: false
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
    }
  }
};
</script>

<style lang="scss" scoped>
.main-content {
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    .schedules {
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100vh;
        border: 1px solid #ccc; // Add border
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Add shadow effect
        margin-bottom: 20px;
    }
}
@media (max-width: 960px) {
  .header {
    display: block;
    font-size: 18px;
    margin-right: 25%;
    border-radius: 10px;
    background-color: rgb(165, 215, 225);
    padding: 10px;
    margin-bottom: 10px;
    text-align: center;
    font-weight: bold;
   }
   .v-data-table {
    font-size: 12px;
   }
   .v-card-title {
    flex-wrap: wrap;
    }
    .v-card-title .v-text-field {
     flex: 1 1 100%;
     margin-bottom: 8px;
    }
     .v-card-title .v-btn {
        flex: 1 1 100%;
    }

  .main-content {
    display: flex;
    flex-direction: column;
    margin-left: 0px;
    margin-right: 80px;

    .schedules {
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100%;
        border: 1px solid #ccc; // Add border
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Add shadow effect
    }
 }
}

</style>
