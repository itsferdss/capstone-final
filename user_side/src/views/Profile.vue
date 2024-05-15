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

</style>
