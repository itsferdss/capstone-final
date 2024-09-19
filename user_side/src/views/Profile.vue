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
  },
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
    margin-left: 30px;
    margin-right: 30px;

    .Profile {
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100%;
        border: 1px solid #ccc;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-width: 2px 2px 2px 2px;
        border-color: rgb(178, 177, 177);
        margin-bottom: 20px;
    }
}

@media (max-width: 960px) {
    .main-content {
        margin-left: 0;
        max-width: 100%;
        margin-right: 0;

        .Profile {
            padding: 0.5rem;
            height: 100%;
        }
    }
    .dash{
        margin-left: -10px;
        margin-bottom: -20px;
    }

    .title-container{
        height: 60px;
    }

    .material-icons{
        font-size: 28px;
    }

    .text{
        font-size: 25px;
    }
    

    .ghostTitle{
        font-size: 90px;
        margin-top: 30px;
    }
}
</style>
