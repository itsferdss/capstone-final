<template>
    <main>

        <div class="main-content">
       
            

            <div class="users">
           
                <ViewUsers/>
            </div>
        </div>

        
</main>

</template>

<script>
import ViewUsers from '../components/ViewUsers.vue';

export default {
  components: {
    ViewUsers
  }
};
</script>

<style lang="scss" scoped>
.top-container{
    display: flex;
    margin: 0.5rem;
    .users{
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

    .users{
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100vh;
    }
}


</style>