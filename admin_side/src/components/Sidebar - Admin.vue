<template>
  <v-navigation-drawer
    v-model="drawer"
    :permanent="!isMobile"
    class="navigation-drawer"
    :mini-variant="miniVariant"
    @update:mini-variant="toggleMiniVariant"
    :style="{ width: miniVariant ? '70px' : '260px', display: isMobile && !drawer ? 'none' : 'block' }"
    app
  >
    <div class="admin-title">
      <v-icon class="admin-icon">mdi-account-circle-outline</v-icon>
      <h1 class="admin-text" :class="{ 'hide-text': miniVariant }">Admin</h1>
    </div>
    <v-divider></v-divider>

    <v-list dense nav>
      <router-link :to="{ path: '/dashboard' }" active-class="active-link" class="sidebar-link">
        <v-icon class="link-icon">mdi-view-dashboard</v-icon>
        <span class="link-text" :class="{ 'hide-text': miniVariant }">Dashboard</span>
      </router-link>

      <router-link :to="{ path: '/viewusers' }" active-class="active-link" class="sidebar-link">
        <v-icon class="link-icon">mdi-account-group</v-icon>
        <span class="link-text" :class="{ 'hide-text': miniVariant }">View Patients</span>
      </router-link>

      <router-link :to="{ path: '/schedule' }" active-class="active-link" class="sidebar-link">
        <v-icon class="link-icon">mdi-calendar-clock</v-icon>
        <span class="link-text" :class="{ 'hide-text': miniVariant }">See Reservations</span>
      </router-link>

      <router-link :to="{ path: '/inventory' }" active-class="active-link" class="sidebar-link">
        <v-icon class="link-icon">mdi-package-variant-closed</v-icon>
        <span class="link-text" :class="{ 'hide-text': miniVariant }">See Products</span>
      </router-link>
    </v-list>

    <v-icon class="toggle-icon" @click="toggleMiniVariant">
      {{ miniVariant ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left' }}
    </v-icon>

    <v-list-item class="logout-link">
      <router-link to="/" class="sidebar-link">
        <v-icon class="link-icon">mdi-logout</v-icon>
        <span class="link-text" :class="{ 'hide-text': miniVariant }">Logout</span>
      </router-link>
    </v-list-item>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    miniVariant: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    drawer: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  data() {
    return {
      isMobile: window.innerWidth <= 960,
    };
  },
  mounted() {
    this.checkScreenWidth();
    window.addEventListener('resize', this.checkScreenWidth);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenWidth);
  },
  methods: {
    checkScreenWidth() {
      this.isMobile = window.innerWidth <= 960;
      if (!this.isMobile && !this.drawer) {
        this.drawer = true;
      }
    },
    toggleMiniVariant() {
      this.$emit('toggle-mini-variant');
    }
  }
};
</script>

<style scoped>
.navigation-drawer {
  height: 100vh;
  background-color: #B3D9E6;
  border-radius: 10px;
  transition: width 0.3s;
  overflow-x: hidden;
}

.admin-title {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  background-color: #B3D9E6;
  color: black;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  transition: width 0.3s;
}

.admin-icon {
  font-size: 40px;
  margin-right: 5px;
}

.admin-text {
  font-weight: bold;
  font-size: 24px;
  margin: 0;
}

.sidebar-link {
  display: flex;
  align-items: center;
  color: black;
  text-decoration: none;
  padding: 16px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.sidebar-link:hover {
  background-color: #a1becd;
}

.active-link {
  background-color: #E3F1F8;
}

.link-icon {
  margin-right: 20px;
  transition: margin 0.3s;
}

.link-text {
  font-size: 16px;
  transition: opacity 0.3s;
}

.hide-text {
  display: none;
}

.logout-link {
  margin-top: 200px;
}

.toggle-icon {
  position: absolute;
  bottom: 20px;
  right: 10px;
  z-index: 100;
  font-size: 24px;
  cursor: pointer;
  color: black;
}

@media (max-width: 960px) {
  .navigation-drawer {
    position: fixed;
    top: 0;
    left: 0;
    width: 50px;
    height: 100%;
    overflow: hidden;
    z-index: 10;
  }

  .link-icon {
    font-size: 20px;
    margin-right: 10px;
  }

  .admin-icon {
    font-size: 30px;
  }

  .admin-text {
    font-size: 18px;
  }

  .link-text {
    font-size: 12px;
  }

  .logout-link {
    margin-top: 180px;
  }

  .toggle-icon {
    display: none;
  }
}
</style>
