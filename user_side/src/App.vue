<template>
    <v-app>
    <AdminLogin v-if="showLogin"></AdminLogin>
    
    <div v-else>
    <div class="app">

    <Sidebar/>
        <div class="headerAndContent">
            <Header />
            <router-view v-slot="{Component}"> 
                <transition name="fade" mode="out-in">
                    <Component :is="Component"/>
                </transition>
            </router-view>
        </div>
    </div>
    </div>
</v-app>
</template>

<script>
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import AdminLogin from './views/AdminLogin.vue';
import StudentRecords from './views/StudentRecords.vue';

export default {
  name: 'App',
  components: {
    Sidebar, 
    Header,
    AdminLogin,
    StudentRecords,
},
    data() {
    return {
        showLogin: false// Initially show the login component
    };
}
}
</script>

<style lang="scss" >
:root {
    --primary: #727885;
    --grey:#64748b;
    --dark:#2F3F64;
    --dark-alt: #334155;
    --light:#cdd1da;
    --sidebar-width:300px;
    --header-height:100px
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Sofia Sans';
}

body {
    background: #e2e2e2;
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

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
    
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s ease-out;
    }    

}
</style>