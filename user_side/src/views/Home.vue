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
    margin: 0;
    max-width: 100%;
    

    .Home {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }
  }
}
</style>
