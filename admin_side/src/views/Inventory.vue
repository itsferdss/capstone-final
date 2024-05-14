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

    .inventory{
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100vh;
    }
}


</style>