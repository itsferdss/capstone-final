<template>
    <aside :class="`${is_expanded && 'is_expanded'}`">
        
        <h2 class="sp-text">PediaCare User</h2>
      <br>
  <hr>
          <div class="menu-toggle-wrap">
              <button class="menu-toggle" @click="ToggleMenu"> 
                  <span class="material-icons">
                      keyboard_double_arrow_right
                      </span> 
              </button>
      </div>
      
      <div class="menu">
          <router-link class="button" to="/home">
              <span class="material-icons">home</span>
              <span class="text">Home</span>
          </router-link>
          
      </div>

      <div class="menu">
          <router-link class="button" to="/schedule">
              <span class="material-icons">calendar_month</span>
              <span class="text">Schedules</span>
          </router-link>
          
      </div>
  
      <div class="menu-logout">
          <router-link class="button" to="/">
              <span class="material-icons">logout</span>
              <span class="text">Logout</span>
          </router-link>
      </div>
    </aside>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const is_expanded = ref(localStorage.getItem("is_expanded") === "true")
  
  const ToggleMenu = () => {
      is_expanded.value = !is_expanded.value
  
      localStorage.setItem("is_expanded", is_expanded.value)
  }
  </script>
  
  <style lang="scss" scoped>
  aside {
      display: flex;
      flex-direction: column;
      width: calc(2.5rem + 32px);
      min-height: 100vh;
      overflow: hidden;
      padding: 1rem;
      background-color: var(--dark);
      color: var(--light);
  
      transition: 0.2s ease-out;

      .sp-text{
        display: none;
        transition: 0.2s ease-out;
      }
      .menu-toggle-wrap {
          display: flex;
          justify-content: flex-end;
  
          position: relative;
          top: 0;
          transition: 0.2s ease-out;
  
          margin: 5px;
          .menu-toggle {
              transition: 0.2s ease-out;
              .material-icons{
                  font-size: 2rem;
                  color: var(--light);
                  transition: 0.2s ease-out;
              }
  
              &:hover {
                  .material-icons {
                      color: var(--primary);
                      transform: translateX(0.5rem);
                  }
              }
          }
      }
       .button .text {
          opacity: 0;
          transition: 0.3s ease-out;
      }
  
  
      .menu {
          margin: -0 -1rem;
  
          .button{
              display: flex;
              align-items: center;
              text-decoration: none;
  
              padding: 0.8rem 1rem;
              margin-bottom: 0.5rem;
              transition: 0.2s ease-out;
              .material-icons {
                  font-size: 2rem;
                  color: var(--light);
                  transition: 0.2s ease-out;
              }
  
              .text{
                  color: var(--light);
                  transition: 0.2s ease-out;
              }
  
              &:hover, &.router-link-exact-active{
                  background-color: #fff;
                  margin-left: 0.5rem;
                  border-top-left-radius: 20px;
                  border-bottom-left-radius: 20px;
                  .material-icons, .text {
                      color: var(--dark);
                  }
              }
          }
      }
  
      .menu-logout {
          margin: -0 -1rem ;
          transition: 0.2s ease-out;
          flex: 1;
          display: flex;
          align-items: flex-end;
          .button{
              display: flex;
              align-items: center;
              text-decoration: none;
  
              padding: 0.8rem 1rem;
              margin-bottom: 0.5rem;
              transition: 0.2s ease-out;
              .material-icons {
                  font-size: 2rem;
                  color: var(--light);
                  transition: 0.2s ease-out;
              }
  
              .text{
                  color: var(--light);
                  transition: 0.2s ease-out;
              }
  
              &:hover, &.router-link-exact-active{
                  .material-icons, .text {
                      color: var(--primary);
                  }
              }
          }
      }
      &.is_expanded {
          width: var(--sidebar-width);
  
          .menu-logout{
              display: flex;
              align-items: flex-end;
              margin: -0 2rem ;
              transition: 0.2s ease-out;
              
  
          }
          .sna-logo{
                height: 9rem;
                width: 9rem;
                transition: 0.2s ease-out;
                align-self: center;
                border-radius: 5rem;
          }

          .sp-text {
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            color: #fff;
            opacity: 1;
            display: block;
            transition: 0.2s ease-out;
            text-align: center;
          }
  
          .menu-toggle-wrap {
              top:-4rem;
              left: 0.5rem;
              .menu-toggle{
                  transform: rotate(-180deg);
              }
              
          }
          .button .text {
              opacity: 1;
          }
          
          .button {
              .material-icons {
                  margin-right: 1rem;
              }
          }
      }
      @media (max-width: 768px) {
          z-index: 99;
      }

  }
  </style>