<template>
  <v-app>
    <AdminLogin v-if="showLogin" />
    
    <div v-else>
      <div class="app">
        <Sidebar v-if="showSidebar" />
        <div class="headerAndContent">
          <Header />
          <router-view v-slot="{ Component }"> 
            <transition name="fade" mode="out-in">
              <Component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
import AdminLogin from './views/AdminLogin.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  components: {
    Sidebar,
    AdminLogin,
   
  },
  setup() {
    const route = useRoute();
    const showLogin = computed(() => route.path === '/adminlogin');
    const showSidebar = computed(() => route.path !== '/');

    return { showLogin, showSidebar };
  }
};
</script>

<style lang="scss" >
:root {
    --primary: #727885;
    --grey:#64748b;
    --dark:#35623D;
    --dark-alt: #334155;
    --light:#cdd1da;
    --sidebar-width:250px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background: none; /* Remove the background color */
    margin: 0; /* Remove default margin */
    padding: 0
}

button {
    cursor: pointer;
    appearance: none;
    border: none;
    outline: none;
    background: none;
}

.app {
    display:flex;
    main {
        flex: 1 1 0;
        padding: 2rem;
        will-change: transform, opacity;

        @media (max-width: 768px){
          
            padding-left: 7rem;
        }
    }
    .headerAndContent {
        display: flex;
        flex-direction: column;
        width: 100%;
    }   
}
</style>