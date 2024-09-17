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
        height: 100%;
    }
}

@media (max-width: 960px) {
    .main-content {
        margin-left: 0;
        max-width: 100%;
        margin-right: 0;
    }

    .landingPage{
        height: 100%;
    }
}
</style>
