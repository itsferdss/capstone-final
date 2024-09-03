<template>
  <div class="wrapper">
    <div class="header-banner">
      <img class="header-image" src="../assets/MVC_logo.png" alt="MVC Optical Clinic Banner" />
    </div>

    <div class="banner-section">
      <div class="banner-card">
        <div class="overlay">
          <p class="banner-text">MEN</p>
          <img src="../assets/men-model.jpg" alt="Men Model">
        </div>
      </div>
      <div class="banner-card">
        <div class="overlay">
          <p class="banner-text">WOMEN</p>
          <img src="../assets/women-model2.jpg" alt="Women Model">
        </div>
      </div>
    </div>

    <div class="product-section">
      <h2>New-In Eye Wear</h2>
      <div class="product-grid">
        <div class="product-card">
          <img src="../assets/product2.jpg" class="product-image">
          <div class="product-name-container">
            <p class="product-name">Salamin</p>
          </div>
        </div>
        <div class="product-card">
          <img src="../assets/product1.jpg" class="product-image">
          <div class="product-name-container">
            <p class="product-name">Sports Eye Glass</p>
          </div>
        </div>
        <div class="product-card">
          <img src="../assets/product3.jpg" class="product-image">
          <div class="product-name-container">
            <p class="product-name">Contact Lense</p>
          </div>
        </div>
        <div class="product-card">
          <img src="../assets/product4.jpg" class="product-image">
          <div class="product-name-container">
            <p class="product-name">Sun Glass</p>
          </div>
        </div>
      </div>
    </div>

    <div class="product-section">
      <h2>Featured Products</h2>
      <div class="product-grid">
        <div class="product-card">
          <img src="../assets/product2.jpg" class="product-image">
          <div class="product-name-container">
            <p class="product-name">Salamin</p>
          </div>
        </div>
        <div class="product-card">
          <img src="../assets/product1.jpg" class="product-image">
          <div class="product-name-container">
            <p class="product-name">Sports Eye Glass</p>
          </div>
        </div>
        <div class="product-card">
          <img src="../assets/product3.jpg" class="product-image">
          <div class="product-name-container">
            <p class="product-name">Contact Lense</p>
          </div>
        </div>
        <div class="product-card">
          <img src="../assets/product4.jpg" class="product-image">
          <div class="product-name-container">
            <p class="product-name">Sun Glass</p>
          </div>
        </div>
      </div>
    </div>

    <div class="product-section">
      <h2>Best Sellers</h2>
      <div class="product-grid">
        <div class="product-card">
          <img src="../assets/product2.jpg" class="product-image">
          <div class="product-name-container">
            <p class="product-name">Salamin</p>
          </div>
        </div>
        <div class="product-card">
          <img src="../assets/product1.jpg" class="product-image">
          <div class="product-name-container">
            <p class="product-name">Sports Eye Glass</p>
          </div>
        </div>
        <div class="product-card">
          <img src="../assets/product3.jpg" class="product-image">
          <div class="product-name-container">
            <p class="product-name">Contact Lense</p>
          </div>
        </div>
        <div class="product-card">
          <img src="../assets/product4.jpg" class="product-image">
          <div class="product-name-container">
            <p class="product-name">Sun Glass</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage',
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.wrapper {
  margin: 0 auto;
  max-width: 1200px;
  padding: 30px;
  font-family: 'Lora', serif;
  color: #333;
}

.header-banner {
  position: relative;
  text-align: center;
  margin-bottom: 20px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.header-image {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  display: block;
}

.banner-section {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}

.banner-card {
  flex: 1;
  position: relative;
  overflow: hidden;
  /* Ensure content is contained within the card */
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.banner-card:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.overlay {
  position: relative;
  width: 100%;
  height: 100%;
}

.overlay img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
}

.overlay::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  /* Black overlay */
  border-radius: 10px;
}

.banner-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  z-index: 1;
  /* Ensure text is above the overlay */
}

.banner-card p {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.product-section {
  margin-top: 40px;
}

.product-section h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #2c3e50;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.product-card:hover {
  animation: continuousBounce 1s ease-in-out infinite;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.product-name-container {
  background: #6baff8;
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-name {
  font-size: 18px;
  color: #fafcff;
  font-weight: 600;
}

@keyframes continuousBounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}
</style>