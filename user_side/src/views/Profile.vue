<template>
    <main>
        <div class="title-container">
            <h1 class="ghostTitle">Profile</h1>
            <div class="dash">
                <span class="material-icons">person</span>
                <span class="text">Profile</span>
            </div>
        </div>
        <hr class="divider">
        <div class="main-content">
            <div class="Profile">
                <div class="logo-container">
                    <img src="/src/assets/MVC_logo.png" class="mvcLogo" alt="MVC Logo">
                </div>
                <Profile />
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
.ghostTitle {
    position: absolute;
    z-index: -1;
    opacity: 0.1;
    top: 0px;
    right: 50px;
    font-size: 120px;
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    color: #848484;
}

.title-container {
    display: flex;
    align-items: center;
    padding: 1rem;
    background-color: #ffffff;
    position: relative;
    z-index: 1;
}

.dash {
    flex: 1;
    display: flex;
    align-items: center;
    margin-left: 20px;
}

.material-icons {
    color: #1a1a1a;
    font-size: 2.5rem;
}

.text {
    margin-left: 0.5rem;
    color: #151515;
    font-size: 2rem;
    font-weight: 600;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
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
