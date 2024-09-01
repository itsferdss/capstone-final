<template>
  <v-app>
    <AdminLogin v-if="showLogin" />

    <div v-else>
      <div class="app">
        <Sidebar v-if="showSidebar" :miniVariant="miniVariant" v-model="drawer" />
        <div class="headers" :class="{ 'mini-variant': miniVariant, 'sidebar-open': drawer && !isMobile, 'sidebar-closed': !drawer || isMobile }">
          <Header class="header" @toggle-menu="toggleDrawer" />
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
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import AdminLogin from './views/AdminLogin.vue';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  components: {
    Sidebar,
    AdminLogin,
    Header,
  },
  setup() {
    const route = useRoute();
    const showLogin = computed(() => route.path === '/adminlogin');
    const showSidebar = computed(() => route.path !== '/');
    const miniVariant = ref(false);
    const drawer = ref(false);
    const isMobile = ref(window.innerWidth <= 960);

    function toggleDrawer() {
      drawer.value = !drawer.value;
      if (isMobile.value) {
        miniVariant.value = false; // On mobile, disable mini variant
      } else {
        miniVariant.value = !miniVariant.value; // Toggle mini variant on desktop
      }
    }

    function checkScreenWidth() {
      isMobile.value = window.innerWidth <= 960;
      if (!isMobile.value && !drawer.value) {
        drawer.value = true; // Automatically open the drawer when switching to desktop view
      }
    }

    onMounted(() => {
      window.addEventListener('resize', checkScreenWidth);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkScreenWidth);
    });

    return { showLogin, showSidebar, miniVariant, drawer, toggleDrawer, isMobile };
  }
};
</script>

<style lang="scss">
.app {
  display: flex;
  height: 100%;
  
  .headers {
    display: flex;
    flex-direction: column;
    width: 100%;
    
    &.mini-variant {
      margin-left: 70px; /* Adjust margin for mini-variant state */
    }

    &.sidebar-open {
      margin-left: 240px; /* Sidebar open width */
      transition: margin-left 0.3s ease;
    }

    &.sidebar-closed {
      margin-left: 0; /* Sidebar closed */
      transition: margin-left 0.3s ease;
    }
  }

  @media (max-width: 960px) {
    .headerAndContent {
      margin-left: 0;
      &.sidebar-open,
      &.sidebar-closed,
      &.mini-variant {
        margin-left: 0;
      }
    }
  }
}


</style>