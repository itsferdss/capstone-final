<template>
  <v-app>
    <AdminLogin v-if="showLogin" />
    
    <div v-else>
      <div class="app">
        <Sidebar v-if="showSidebar" :miniVariant="miniVariant" v-model="drawer" @toggle-mini-variant="toggleMiniVariant" />
        <div class="headerAndContent" :class="{ 'mini-variant': miniVariant }">
          <Header />
          <v-icon v-if="isMobile" class="menu-icon" @click="toggleDrawer">mdi-menu</v-icon>
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
import { computed, ref, onMounted, onUnmounted } from 'vue';
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
    const miniVariant = ref(false);
    const drawer = ref(false); // Default to true to ensure visibility
    const isMobile = ref(window.innerWidth <= 960);

    function toggleMiniVariant() {
      miniVariant.value = !miniVariant.value;
    }

    function toggleDrawer() {
      drawer.value = !drawer.value;
    }

    function checkScreenWidth() {
      isMobile.value = window.innerWidth <= 960;
    }

    onMounted(() => {
      window.addEventListener('resize', checkScreenWidth);
    });;

    onUnmounted(() => {
      window.removeEventListener('resize', checkScreenWidth);
    });

    return { showLogin, showSidebar, miniVariant, drawer, toggleMiniVariant, toggleDrawer, isMobile };
  }
};
</script>

<style lang="scss">
* {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.app {
    display: flex;
    height: 100vh;

    .headerAndContent {
        display: flex;
        flex-direction: column;
        width: 100%;
        transition: margin-left 0.3s ease;
        margin-left: 250px; /* Default margin for larger screens */
        flex: 1;
        padding: 1rem;

        &.mini-variant {
            margin-left: 70px; /* Adjust margin for mini-variant state */
        }
    }

    .menu-icon {
        display: none;
    }

    @media (max-width: 960px) {
        .headerAndContent {
            margin-left: 0;
            
            &.mini-variant {
                margin-left: 0;
            }
        }

        .menu-icon {
            display: block;
            position: absolute;
            top: 25px;
            left: 30px;
            cursor: pointer;
        }
    }
}
</style>
