<template>
    <main>
        <div class="main-content">
            <div class="landingPage">
                <LandingPage />
            </div>
        </div>
    </main>
</template>

<script>
import LandingPage from '../components/LandingPage.vue';

export default {
  components: {
    LandingPage
  }
};
</script>

<style lang="scss" scoped>
.main-content {
    display: flex;
    flex-direction: column;

    .landingPage {
        
       
    }
}
</style>
