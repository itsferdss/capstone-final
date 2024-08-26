<template>
    <main>
        <div class="main-content">
            <div class="inventory">
                <Inventory />
            </div>
        </div>
    </main>
</template>

<script>
import Inventory from '../components/Inventory.vue';

export default {
  components: {
    Inventory
  }
};
</script>

<style lang="scss" scoped>
.main-content {
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    .inventory {
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100vh;
        border: 1px solid #ccc; // Add border
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Add shadow effect
        margin-bottom: 20px;
    }
}
</style>
