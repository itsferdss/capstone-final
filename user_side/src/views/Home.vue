<template>
  <main>
    <div class="main-content">
      <div class="Home">
        <Home />
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
};
</script>

<style lang="scss" scoped>
.main-content {
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  margin-right: 30px;

  .Home {
    border-radius: 10px;
    padding: 0.5rem;
    height: 100%;
    margin-bottom: 20px;
    margin-top: -10px;
    margin-left: -60px;
    margin-right: -60px;
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

    .logo-container {
      display: block;
      /* Show on mobile */
    }

    .mvcLogo {
      max-width: 235px;
      margin-left: 40px;
      border-radius: 10px;
    }
  }
}
</style>
