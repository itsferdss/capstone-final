<template>
    <main>
        <div class="main-content">
            <div class="Products">
                <div class="logo-container">
                    <img src="/src/assets/MVC_logo.png" class="mvcLogo" alt="MVC Logo">
                </div>
                <Products />
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
    margin-left: 10px;

    .Products {
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100vh;
        border: 1px solid #ccc; // Add border
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Add shadow effect
        flex: 1;
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
    }

    .Products {
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100%;
        border: 1px solid #ccc; // Add border
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); // Add shadow effect
        flex: 1;
    }

    .logo-container {
        display: block; /* Show on mobile */
    }

    .mvcLogo {
        display: block;
        max-height: 200px;
        max-width: 235px;
        margin-left: 40px;
        border-radius: 10px;
    }
}
</style>
