<template>
  <main>
    <div class="title-container">
      <h1 class="ghostTitle">Reservations</h1>
      <div class="dash">
        <span class="material-icons">event</span>
        <span class="text">View Reservations</span>
      </div>
    </div>
    <hr class="divider">
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
.ghostTitle {
  position: absolute;
  z-index: -1;
  opacity: 0.1;
  top: 0px;
  right: 50px;
  font-size: 120px;
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  color: #848484;
}

.title-container {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #ffffff;
  position: relative;
  z-index: 1;
}

.dash {
  flex: 1;
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.material-icons {
  color: #1a1a1a;
  font-size: 2.5rem;
}

.text {
  margin-left: 0.5rem;
  color: #151515;
  font-size: 2rem;
  font-weight: 600;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.main-content {
    display: flex;
    flex-direction: column;
    margin-left: 30px;
    margin-right: 30px;

    .schedules {
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100%;
        border: 1px solid #ccc; // Add border
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Add shadow effect
        border-width: 2px 2px 2px 2px;
        border-color: rgb(178, 177, 177);
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
