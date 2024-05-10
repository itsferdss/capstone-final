<template>
    <main>
        <div class="main-content">
            <div class="Profile">
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

    .Profile {
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100vh;
    }
}

.Profile {
    flex: 1;

    .material-icons {
        color: var(--dark);
        font-size: 2.5rem;
    }
    .text {
        position: relative;
        color: var(--dark);
        font-size: 1.5rem;
        font-weight: 900;
        bottom: 0.5rem;
    }
}

</style>
