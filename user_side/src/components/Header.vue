<template>
  <header class="header">
    <button class="menu-button" @click="toggleMenu">☰</button>
    <div class="time-container">
      <v-icon class="calendar-icon">mdi-calendar</v-icon>
      <div class="clock">{{ currentTime }}</div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      currentTime: '',
    };
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000); // Update time every second
  },
  methods: {
    updateTime() {
      const now = new Date();
      const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      this.currentTime = now.toLocaleDateString('en-US', options);
    },
    toggleMenu() {
      this.$emit('toggle-menu');
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  background: #B3D9E6;
  height: 50px;
  /* Consistent height */
  width: 100%;
  position: relative;
  /* Ensure positioning context for absolute elements */
  box-shadow: 0 4px 8px rgba(1, 1, 1, 0.4);
  /* Add shadow effect */
  z-index: 1;
  /* Ensure it is above other elements */
  padding: 0 10px;
  /* Add padding to the header */
  box-sizing: border-box;
  /* Include padding in height calculation */
}

.menu-button {
  background: none;
  border: none;
  color: black;
  font-size: 1.5rem;
  cursor: pointer;
  outline: none;
  padding: 0.5rem;
  border-radius: 50%;
  /* Make the button circular */
  background-color: #dce9f1;
  /* Gray background */
  height: 40px;
  /* Adjust height of the button */
  width: 40px;
  /* Ensure the width matches the height */
  display: flex;
  align-items: center;
  justify-content: center;
  /* Center the icon in the circle */
  margin-left: 30px;
}

.time-container {
  display: flex;
  align-items: center;
  margin-left: auto;
  /* Push the time-container to the right */
}

.calendar-icon {
  font-size: 24px;
  /* Adjust size if needed */
  margin-right: 8px;
  /* Space between icon and clock */
  color: #333;
  /* Change color if needed */
}

.clock {
  font-size: 16px;
  /* Adjust font size if needed */
  color: rgb(68, 67, 67);
}
</style>
