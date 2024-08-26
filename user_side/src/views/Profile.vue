<template>
    <main>
        <div class="main-content">
            <div class="Profile">
                <div class="logo-container">
                    <img src="/src/assets/MVC_logo.png" class="mvcLogo" alt="MVC Logo">
                </div>
                <Profile/>
            </div>
        </div>
    </main>
</template>

<script>
import Profile from '../components/Profile.vue';

export default {
  components: {
    Profile
  }
};
</script>

<style lang="scss" scoped>
.main-content {
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    .Profile {
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 90vh;
        border: 1px solid #ccc;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .logo-container {
        display: none; /* Hide by default */
    }

    .mvcLogo {
        display: none;
    }
}

@media (max-width: 960px) {
    .main-content {
        margin-left: 0px;
        max-width: 100%;

        .Profile {
            padding: 0.5rem;
            height: 100%;
        }
        
        .logo-container {
            display: block; /* Show on mobile */
        }

        .mvcLogo {
            max-width: 235px;
            margin-left: 40px;
            border-radius: 10px;
        }
    }
}
</style>
