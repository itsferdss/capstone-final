<template>
  <aside :class="{ 'is_expanded': is_expanded }">
    <h2 class="sp-text">PediaCare Admin</h2>
    <br>
    <hr>

    <div class="menu">
      <router-link class="button" to="/viewusers">
        <span class="material-icons">people</span>
        <span class="text">User List</span>
      </router-link>
    </div>

    <div class="menu">
      <router-link class="button" to="/inventory">
        <span class="material-icons">inventory_2</span>
        <span class="text">Inventory</span>
      </router-link>
    </div>

    <div class="menu">
      <router-link class="button" to="/schedule">
        <span class="material-icons">event_available</span>
        <span class="text">Reservations</span>
      </router-link>
    </div>

    <div class="menu-logout">
      <router-link class="button" to="/">
        <span class="text">Logout</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const is_expanded = ref(true)
</script>

<style lang="scss" scoped>
aside {
  display: flex;
  flex-direction: column;
  width: 250px;
  min-height: 100vh;
  padding: 1rem;
  background-color: #35623D;
  color: #cdd1da;

  .sp-text {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: #fff;
    display: block;
    text-align: center;
  }

  .button .text {
    opacity: 1;
    transition: 0.3s ease-out;
  }

  .menu {
    margin: 0 -1rem;

    .button {
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: 0.8rem 1rem;
      margin-bottom: 0.5rem;
      transition: 0.2s ease-out;
      position: relative;

      .material-icons {
        font-size: 30px;
        color: #cdd1da;
        margin-right: 1rem;
        transition: 0.1s ease-out;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .text {
        color: #cdd1da;
        transition: 0.2s ease-out;
      }

      &:hover,
      &.router-link-exact-active {
        .material-icons {
          background-color: #fff;
          color: #35623D;
        }
        .text {
          color: #fff; /* Adjust text color on hover or active state */
        }
      }
    }
  }

  .menu-logout {
    margin: 0 -1rem;
    flex: 1;
    display: flex;
    align-items: flex-end;

    .button {
      display: flex;
      align-items: center;
      text-decoration: none;
      padding: 0.8rem 1rem;
      margin-bottom: 0.5rem;
      transition: 0.2s ease-out;

      .material-icons {
        font-size: 1rem;
        color: #cdd1da;
        transition: 0.1s ease-out;
      }

      .text {
        color: #cdd1da;
        transition: 0.2s ease-out;
      }

      &:hover,
      &.router-link-exact-active {
        .material-icons,
        .text {
          color: #727885;
        }
      }
    }
  }

  @media (max-width: 768px) {
    z-index: 99;
  }
}
</style>
