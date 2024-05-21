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
.main-content {
    display: flex;
    flex-direction: column;
    margin-left: 250px;

    .users {
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100vh;
    }
}


</style>