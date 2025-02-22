<template>
  <v-navigation-drawer v-model="drawer" :permanent="!isMobile" class="navigation-drawer" :mini-variant="miniVariant"
    @update:mini-variant="toggleMiniVariant"
    :style="{ width: miniVariant ? '70px' : '260px', display: isMobile && !drawer ? 'none' : 'block' }" app>
    <div class="user-title">
      <v-icon class="user-icon">mdi-account-circle-outline</v-icon>
      <h1 class="user-text" :class="{ 'hide-text': miniVariant }">
      Welcome, {{ full_name }}
    </h1>
    </div>
    <v-divider></v-divider>

    <v-list dense nav>
      <router-link :to="{ path: '/home' }" active-class="active-link" class="sidebar-link">
        <v-icon class="link-icon">mdi-home</v-icon>
        <span class="link-text" :class="{ 'hide-text': miniVariant }">Home</span>
      </router-link>

      <v-list-item @click="handleProfileClick" class="sidebar-link">
        <v-icon class="link-icon">mdi-account</v-icon>
        <span class="link-text" :class="{ 'hide-text': miniVariant }">Profile</span>
      </v-list-item>

      <router-link :to="{ path: '/products' }" active-class="active-link" class="sidebar-link">
        <v-icon class="link-icon">mdi-cart</v-icon>
        <span class="link-text" :class="{ 'hide-text': miniVariant }">See Products</span>
      </router-link>
    </v-list>

    <v-list-item class="logout-link" @click="confirmLogout">
      <v-icon class="link-icon">mdi-logout</v-icon>
      <span class="link-text" :class="{ 'hide-text': miniVariant }">{{ isAuthenticated ? 'Logout' : 'Exit' }}</span>
    </v-list-item>
  </v-navigation-drawer>
</template>


<script>
import Swal from 'sweetalert2';

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
    },
    isAuthenticated() {
      // Check if a token or auth flag exists
      return !!sessionStorage.getItem('token');
    },
    full_name() {
      // Retrieve the first name from sessionStorage or another source
      return sessionStorage.getItem('full_name') || 'User';
    }
  },
  data() {
    return {
      isMobile: window.innerWidth <= 960,
    };
  },
  mounted() {
  
  // Check if sessionStorage data is available, and update loading state
  if (sessionStorage.getItem('full_name')) {
    this.isLoading = false;
  }
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
      if (this.isMobile) {
        this.miniVariant = false;
      } else {
        this.miniVariant = !this.miniVariant;
      }
    },
    handleProfileClick() {
      if (this.isAuthenticated) {
        this.$router.push('/profile');
      } else {
        Swal.fire({
          title: 'Login Required',
          text: 'Please login to access your profile.',
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Login',
          cancelButtonText: 'Cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.$router.push('/login');
          }
        });
      }
    },
    confirmLogout() {
      if (this.isAuthenticated) {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, log out!',
          cancelButtonText: 'No, cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('full_name'); // Optionally remove the user's name too
            this.$router.push('/'); // Redirect to home or login
          }
        });
      } else {
        this.$router.push('/'); // Redirect if not authenticated
      }
    }
  }
};
</script>

<style scoped>
.navigation-drawer {
  height: 100vh;
  background-color: #B3D9E6;
  border-radius: 10px;
  transition: width 0.2s ease, transform 0.2s ease;
  overflow-x: hidden;
  box-shadow: 0 10px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.user-title {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  background-color: #B3D9E6;
  color: black;
  margin-top: 15px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.user-icon {
  font-size: 40px;
  margin-left: 15px;
}

.user-text {
  font-weight: bold;
  font-size: 21px; /* Change this value to a smaller size */
  margin-left: 10px;
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
  margin-top:250px;
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

  .user-icon {
    font-size: 30px;
  }

  .user-text {
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
