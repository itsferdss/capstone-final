<template>
  <v-navigation-drawer
    v-model="drawer"
    permanent
    class="navigation-drawer"
  >
    <div class="admin-title">
      <h1 class="admin-text">Admin</h1>
    </div>

    <v-divider></v-divider>

    <v-list dense nav>
      <router-link :to="{ path: '/viewusers' }" active-class="active-link" class="sidebar-link">
        <span class="material-icons">people</span>
        <span class="link-text">View Patients</span>
      </router-link>

      <router-link :to="{ path: '/schedule' }" active-class="active-link" class="sidebar-link">
        <span class="material-icons">bookmark</span>
        <span class="link-text">See Reservations</span>
      </router-link>

      <router-link :to="{ path: '/inventory' }" active-class="active-link" class="sidebar-link">
        <span class="material-icons">inventory</span>
        <span class="link-text">See Products</span>
      </router-link>
    </v-list>

    <!-- Logout Link -->
    <v-list-item class="logout-link">
      <router-link to="/" class="sidebar-link">
        <span class="material-icons">logout</span>
        <span class="link-text">Logout</span>
      </router-link>
    </v-list-item>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: true
    };
  }
};
</script>

<style scoped>
.navigation-drawer {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #B3D9E6; /* Light blue background */
  border-radius: 10px; /* Rounded corners */
}

.admin-title {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px; /* Ensure enough height for the text */
}

.admin-text {
  font-weight: bold;
  font-size: 33px; /* Make the "ADMIN" text bigger */
  margin: 0; /* Remove default margin */
}

.sidebar-link {
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  padding: 16px;
  border-radius: 5px; /* Rounded corners */
}

.sidebar-link:hover {
  background-color: #a1becd; /* Lighter blue on hover */
}

.active-link {
  background-color: #E3F1F8; /* Lighter blue for active link */
}

.material-icons {
  margin-right: 8px;
}

.link-text {
  font-size: 16px;
}

.logout-link {
  margin-top: 300px; /* Push the logout link to the bottom */
}
</style>