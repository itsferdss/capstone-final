<template>
    <main>

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
  }
};
</script>

<style lang="scss" scoped>
.main-content {
    display: flex;
    flex-direction: column;

    .schedules{
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100vh;
    }
}


</style>