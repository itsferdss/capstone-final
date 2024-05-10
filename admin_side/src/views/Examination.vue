<template>
    <main>

        <div class="main-content">

            <div class="schedules">
                <Examination/>
            </div>
        </div>

        
</main>

</template>

<script>
import Examination from '../components/Examination.vue';

export default {
  components: {
    Examination
  }
};
</script>

<style lang="scss" scoped>
.top-container{
    display: flex;
    margin: 0.5rem;
    .schedules{
        flex: 1;
        
        .material-icons{
            color: var(--dark);
            font-size: 2.5rem;
        }
        .text{
            position: relative;
            color: var(--dark);
            font-size: 1.5rem;
            font-weight: 900;
            bottom: 0.5rem;
        }
    }

} 

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