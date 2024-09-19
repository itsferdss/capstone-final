<template>
  <header class="header">
    <button class="menu-button" @click="toggleMenu">☰</button>
    <img class="mvcLogo" src="../assets/MVC_logo.png" />
    <div class="logo-separator"></div>
    <img class="logo" src="../assets/newlogo.png" />
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
  width: 100%;
  position: relative;
  box-shadow: 0 4px 8px rgba(1, 1, 1, 0.4);
  z-index: 1;
  padding: 0 10px;
  box-sizing: border-box;
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
  background-color: #dce9f1;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 30px;
}

.mvcLogo {
  height: 40px;
  border-radius: 10px;
  margin-left: 30px;
}

.logo-separator {
  height: 20px;
  width: 2px;
  background-color: #464646;
  margin: 0 20px;
}

.logo {
  height: 40px;
}

.time-container {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.calendar-icon {
  font-size: 24px;
  margin-right: 8px;
  color: #333;
}

.clock {
  font-size: 16px;
  color: rgb(68, 67, 67);
}

@media (max-width: 960px) {
  .header {
    width: 100%;
  }

  .menu-button {
    font-size: 15px;
    margin-left: 0px;
  }

  .mvcLogo {
    display: none;
  }

  .logo {
    display: none;
  }

  .calendar-icon {
    font-size: 12px;
  }

  .clock {
    font-size: 10px;
  }
}
</style>
