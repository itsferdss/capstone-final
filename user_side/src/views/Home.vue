<template>
    <main>
        <div class="main-content">
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
  }
};
</script>

<style lang="scss" scoped>
.main-content {
    margin: 0;
    display: flex;
    flex-direction: column;
    margin-left: 250px;

    .Home {
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100vh;
        margin-left: 200px;
    }
}

</style>
