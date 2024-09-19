<template>
    <main>
        <div class="title-container">
            <h1 class="ghostTitle">Products</h1>
            <div class="dash">
                <span class="material-icons">shopping_cart</span>
                <span class="text">See Products</span>
            </div>
        </div>
        <hr class="divider">
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



    .logo-container {
        display: none; /* Hide by default */
    }

    .mvcLogo {
        display: none;
    }
}

@media (max-width: 960px) {
    .main-content {
        margin: 0px;
        max-width: 100%;
    }

    .Products {
      width: 100%;
      height: 100%;
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
        font-size: 80px;
        margin-top: 30px;
    }
}
</style>
