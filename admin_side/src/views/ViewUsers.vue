<template>
    <main>
     <div class="header" v-if="isSmallScreen">
         <v-icon left>mdi-account-group</v-icon>
         USERS
     </div>
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
  },
  data() {
    return {
      isSmallScreen: false
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
    }
  }
};

</script>

<style lang="scss" scoped>
.main-content {
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    .users {
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100vh;
        border: 1px solid #ccc; // Add border
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Add shadow effect
        margin-bottom: 20px;
    }
}

@media (max-width: 960px) {
.header {
    display: block;
    font-size: 18px;
    border-radius: 10px;
    background-color: rgb(165, 215, 225);
    padding: 10px;
    margin-bottom: 10px;
    text-align: center;
    font-weight: bold;
    max-width: 100%;
}

.v-data-table {
    font-size: 10px;
}
    

    .main-content {
        display: flex;
        flex-direction: column;
        margin-left: 0px;
        max-width: 100%;

        .users {
            border-radius: 10px;
            background-color: #f0f0f0;
            padding: 0.5rem;
            height: 100%;
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
            max-width: 100%;
        }

     

}
  
}
</style>
