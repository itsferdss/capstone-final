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
   .v-data-table {
    font-size: 12px;
   }
  .main-content {
    margin-left: 0;
    max-width: 100%;
    margin-right: 0;

    .schedules {
      padding: 0.5rem;
      height: 100%;
    }
 }

 .dash {
   margin-left: -10px;
   margin-bottom: -20px;
 }

 .title-container {
   height: 60px;
 }

 .material-icons {
   font-size: 28px;
 }

 .text {
   font-size: 25px;
 }


 .ghostTitle {
   font-size: 60px;
   margin-top: 30px;
 }
}

</style>
