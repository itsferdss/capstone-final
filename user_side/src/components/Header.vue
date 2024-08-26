<template>
    <header class="header sticky-lg-top" :class="{ 'mini-variant': miniVariant }">
        <img class="echodeLogo" src="../assets/echode_logo.png"/>
        <div class="logo-separator"></div>
        <img class="mvcLogo" src="../assets/MVC_logo.png"/>
        <div class="clock">{{ currentTime }}</div>
    </header>
</template>

<script>

export default {
    name: 'Header',
    data() {
    return {
       isSmallScreen: false,
       miniVariant: false,
       currentTime: ''
    };
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000); // Update time every second,
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize);
  },
  destroyed() {
    window.removeEventListener('resize', this.checkScreenSize);
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
        hour12: true
      };
      this.currentTime = now.toLocaleDateString('en-US', options);
    },
    checkScreenSize() {
      this.isSmallScreen = window.innerWidth <= 960;
    },
    toggleSidebar() {
      this.$emit('toggle-mini-variant');
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
    display: flex;
    background: #374974;
    height: var(--header-height);
    width: 100%;
    height: 100px;
    margin-left: 70px;

    .clock {
        color: #e2e2e2;
        align-self: center;
        margin-right: 1rem;
        margin-left: 25%;
      }

    .echodeLogo{
        margin-top: 10px;
        height: 80px;
        margin-left: 20px;
    }  
    
    .mvcLogo{
        margin-top: 10px;
        height: 80px;
        border-radius: 20px;
    }

    .logo-separator {
        height: 100px; /* Adjust height to match logos */
        width: 2px; /* Line thickness */
        background-color: black; /* Line color */
        margin: 0 20px; /* Space around the separator */
    }
}

</style>