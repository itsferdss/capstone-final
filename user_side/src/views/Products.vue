<template>
    <main>
        <div class="main-content">
            <div class="Products">
                <Products/>
            </div>
        </div>
    </main>
</template>

<script>
import Products from '../components/Products.vue';

export default {
  components: {
    Products
  }
};
</script>

<style lang="scss" scoped>
.main-content {
    display: flex;
    flex-direction: column;

    .Products {
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100vh;
    }
}

.Products {
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
