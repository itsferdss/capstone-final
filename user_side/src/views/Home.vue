<template>
    <main>
        <div class="main-content" :class="{ 'mini-variant': miniVariant }">
            <div class="home">
                <Home/>
            </div>
        </div>
    </main>
</template>

<script>
import Home from '../components/Home.vue';

export default {
  components: {
    Home
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

<style lang="scss" scoped>
.main-content {
    margin: 0;
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    .Home {
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100vh;
        margin-left: 200px;
    }
}
@media (max-width: 960px) {
    .main-content {
        margin-left: 0px;
        max-width: 100%;

        .Home {
        padding: 0.5rem;
        height: 100%;
        }
    }
}
</style>
