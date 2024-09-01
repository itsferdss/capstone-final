<template>
    <main>
        <div class="title-container">
            <h1 class="ghostTitle">Inventory</h1>
            <div class="dash">
                <span class="material-icons">inventory</span>
                <span class="text">View Inventory</span>
            </div>
        </div>
        <hr class="divider">
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

    .inventory {
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100%;
        border: 1px solid #ccc; // Add border
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Add shadow effect
        border-width: 2px 2px 2px 2px;
        border-color: rgb(178, 177, 177);
        margin-bottom: 20px;
    }
}
</style>
