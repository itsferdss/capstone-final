<template>
  <div class="container">
    <div class="header-banner">
      <div class="logo-container">
        <div class="welcome">
          <h1>Welcome to MVC Optical Clinic</h1>
        </div>
        <video ref="headerVideo" class="header-video" preload="auto" muted playsinline>
          <source src="../assets/vid.mp4" type="video/mp4">
        </video>
        <div class="button-container">
          <button class="shop-button" @click="shopSunglass">Shop Now</button>
        </div>
      </div>
    </div>

    <div class="banner-section">
      <div class="banner-card" @click="shopSunglass">
        <img src="../assets/men-model.jpg" alt="Men's Glasses">
        <div class="overlay">
          <p>MEN</p>
        </div>
      </div>
      <div class="banner-card" @click="shopSunglass">
        <img src="../assets/women-model.jpg" alt="Women's Glasses">
        <div class="overlay">
          <p>WOMEN</p>
        </div>
      </div>
    </div>

    <div class="ratings">
      <div class="rate">
        <p>“High quality construction, lightweight materials, and</p>
        <p>absolutely crystal clear lenses. I can’t recommend this</p>
        <p>brand enough.” </p>
        <p>-Ferdinand Espiritu. </p>
      </div>
      <div>
        <img src="../assets/bg.jpg" alt="Background Image" class="background-image">
      </div>
    </div>

    <div class="categories-section">
      <h2 class="categories-title">Explore Our Categories</h2>
      <div class="categories-grid">
        <div class="categories-card">
          <img src="../assets/frames.jpg" class="categories-image" alt="Frames">
          <div class="category-overlay">
            <button class="category-button" @click="shopSunglass">FRAMES</button>
          </div>
        </div>
        <div class="categories-card">
          <img src="../assets/lens.jpg" class="categories-image" alt="Lens">
          <div class="category-overlay">
            <button class="category-button" @click="shopSunglass">LENS</button>
          </div>
        </div>
        <div class="categories-card">
          <img src="../assets/contact-lens.jpg" class="categories-image" alt="Contact Lenses">
          <div class="category-overlay">
            <button class="category-button" @click="shopSunglass">CONTACT LENSES</button>
          </div>
        </div>
        <div class="categories-card">
          <img src="../assets/accessories.jpg" class="categories-image" alt="Accessories">
          <div class="category-overlay">
            <button class="category-button" @click="shopSunglass">ACCESSORIES</button>
          </div>
        </div>
      </div>
    </div>

    <div class="ratings">
      <div class="rate">
        <h1>NEW ARRIVAL</h1>
        <p>Find deeper savings on past-season eyewear.</p>
      </div>
      <div>
        <img src="../assets/new.jpg" alt="Background Image" class="background-image">
      </div>
    </div>

    <div class="product-section">
      <h2 class="newProds">New Products</h2>
      <div class="product-container">
        <div v-for="product in products" :key="product.id" class="product-card" @click="viewProduct(product.id)">
          <img :src="product.currentImage" class="main-image" @mouseover="changeImage(product, 'hover')"
            @mouseleave="changeImage(product, 'default')">
          <div class="product-details">
            <span class="product-name">{{ product.product_name }}</span>
            <span class="price">
              <span v-if="product.onSale" class="original-price">{{ product.originalPrice }}</span>
              <span class="sale-price">₱{{ product.price }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="description-section">
      <h2>THE MOST TRUSTED CLINIC</h2>
      <p class="liit">Welcome to MVC optical. We're an optical clinic in Cabangan, Zambales. Bringing a new category of
        prescription
        eyeglasses and sunglasses by bringing proven, cutting-edge sport performance tech to everyday eyewear.</p>
      <p class="liit">If you're active and need a versatile eyewear solution, we've got you covered.</p>
      <img src="../assets/mvc.png" alt="Logo" class="description-logo">
      <img src="../assets/echode_logo.png" alt="Logo" class="description-logo">
      <img src="../assets/newlogo.png" alt="Logo" class="description-logo">
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      products: [],
    };
  },
  name: 'WelcomePage',
  methods: {
    fetchProducts() {
      axios.get('/products/latest')
        .then(response => {
          this.products = response.data.map(product => ({
            ...product,
            currentImage: product.image // Set the default image
          }));
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    },
    changeImage(product, action) {
      if (action === 'hover' && product.images.length > 1) {
        product.currentImage = product.images[1]; // Use second image on hover
      } else {
        product.currentImage = product.images[0]; // Use default image otherwise
      }
    },
    viewProduct(productId) {
      this.$router.push({ path: '/viewProduct', query: { id: productId } });
    },
    playVideo() {
      if (this.$refs.headerVideo) {
        this.$refs.headerVideo.play().catch(error => {
          console.error('Error playing video:', error);
        });
      }
    },
    pauseVideo() {
      if (this.$refs.headerVideo) {
        this.$refs.headerVideo.pause();
      }
    },
    shopSunglass() {
      this.$router.push('/products');
    },
    shopPrescription() {
      // Handle shop prescription action
    },
    onVideoReady() {
      console.log('Video is ready to play.');
      this.playVideo();
    }
  },
  mounted() {
    const video = this.$refs.headerVideo;
    if (video) {
      video.addEventListener('mouseover', this.playVideo);
      video.addEventListener('mouseout', this.pauseVideo);
    }
    this.fetchProducts();
  },
  beforeDestroy() {
    const video = this.$refs.headerVideo;
    if (video) {
      video.removeEventListener('mouseover', this.playVideo);
      video.removeEventListener('mouseout', this.pauseVideo);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.container {
  max-width: 100%;

}

.header-banner {
  position: relative;
  text-align: center;
  margin-bottom: 50px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

.logo-container {
  position: relative;
  /* width: 100%; */
  height: 500px; /* Increase height */
  overflow: hidden;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.background-image{
  width: 100%;
}

.welcome {
  position: absolute;
  bottom: 140px;
  left: 40px;
  padding: 50px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
}

.welcome h1 {
  font-size: 48px;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.button-container {
  position: absolute;
  bottom: 30px; /* Increase bottom position */
  left: 30px; /* Increase left position */
  display: flex;
  gap: 15px; /* Increase gap between buttons */
  padding: 30px;
  z-index: 10;
}

.shop-button {
  background-color: transparent;
  color: #89f070;
  border: 2px solid #89f070;
  padding: 15px 30px; /* Increase padding */
  border-radius: 8px; /* Increase border-radius */
  cursor: pointer;
  font-size: 18px; /* Increase font size */
  font-weight: bold;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.shop-button:hover {
  background-color: #374f2d;
  color: #fafcff;
}

.header-video {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-banner:hover .header-video {
  opacity: 1;
}

.banner-section {
  display: flex;
  gap: 30px; /* Increase gap between banners */
  margin-bottom: 50px; /* Increase bottom margin */
  margin-left: 60px;
  margin-right: 50px;
  margin-top: 80px; /* Increase top margin */
}

.banner-card {
  position: relative;
  flex: 1;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.categories-section {
  text-align: center;
  margin-top: 50px;
  margin-left: 50px;
  margin-right: 50px;
}

.categories-title {
  font-size: 34px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 40px;
  text-transform: uppercase;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.categories-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.categories-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.categories-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.categories-card:hover .category-overlay {
  opacity: 1;
}

.category-button {
  background-color: #ffffff;
  color: #2c3e50;
  border: none;
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.category-button:hover {
  background-color: #2c3e50;
  color: #ffffff;
}

.banner-card img {
  width: 100%;
  height: 400px; /* Adjust as needed */
  object-fit: cover;
  border-radius: 12px;
}

.banner-card .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); 
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 36px;
  font-weight: bold;
  text-transform: uppercase;
  transition: background-color 0.3s ease;
}

.banner-card:hover .overlay {
  background-color: rgba(0, 0, 0, 0.6); 
}

.banner-card p {
  margin: 0;
}

.product-section{
  margin-right: 30px;
  margin-left: 30px;
}

.newProds{
  text-align: center;
  font-size: 34px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 40px;
  text-transform: uppercase;
}

.product-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.product-card {
  flex: 1 1 2%;
  max-width: 100%;
  margin: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.product-card img.main-image {
  max-width: 100%;
  height: 300px;
  display: block;
  margin: 0 auto;
  border-radius: 8px;
}

.product-details {
  padding: 15px;
  text-align: center;
}

.product-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.price {
  display: block;
  font-size: 16px;
  color: #333;
}

.sale-price {
  color: red;
}

.ratings {
  position: relative;
  width: 100%;
  height: 500px; /* Increase height */
  overflow: hidden;
  border-radius: 12px; /* Increase border-radius */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 80px; /* Increase top margin */
}

.rate {
  position: absolute;
  bottom: 40px; /* Increase bottom position */
  left: 10px; /* Increase left position */
  right:150px;
  padding: 40px; /* Increase padding */
  z-index: 10;
  top: 250px
}

.rate h1 {
  font-size: 40px; /* Increase font size */
  font-weight: 700;
  margin-bottom: 25px; /* Increase bottom margin */
  color: #f7f7f7;
}

.rate p {
  font-size: 20px; /* Increase font size */
  font-weight: 700;
  margin: 0;
  color: #f7f7f7;
}

@keyframes continuousBounce {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-15px); /* Increase bounce height */
  }
}

.description-section {
  padding: 50px; /* Increase padding */
  background-color: #f9f9f9;
  border-radius: 15px; /* Increase border-radius */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15); /* Increase shadow size */
  margin: 50px auto; /* Increase margin */
  max-width: 1000px;
  text-align: center;
}

.description-section h2 {
  font-size: 32px; /* Increase font size */
  margin-bottom: 25px; /* Increase bottom margin */
  color: #2c3e50;
}

.description-section p {
  font-size: 20px; /* Increase font size */
  color: #333;
  line-height: 1.8; /* Increase line height */
}

.description-logo {
  width: 120px; /* Increase width */
  height: auto;
  margin: 20px; /* Increase margin */
}

@media (max-width: 768px) {
  .container {
    overflow-x: hidden; 
  }

  .header-banner {
    margin-bottom: 20px;
    width: 120%;
    margin-left: -30px;
  }

  .logo-container {
    height: 300px; 
  }

  .welcome {
    bottom: 90px; 
    left: 0px; 
    padding: 30px; 
  }

  .welcome h1 {
    font-size: 30px;
  }

  .button-container {
    bottom: 10px;
    left: 10px;
    gap: 10px; 
  }

  .shop-button {
    padding: 10px 20px; 
    font-size: 16px; 
  }

  .banner-section {
    gap: 20px; 
    margin-bottom: 20px;
    margin-top: 50px;
    height: 300px;
    width: 100%;
    margin-left: 0px;
  }

  .background-image{
    width: 100%;
    height: 200px;
    margin-top: -100px;
  }

  .categories-title{
    font-size: 30px;
    margin-top: -50px;
  }

  .banner-card {
    flex: 1 1 10%; /* Adjust for mobile */
    width: 150%;
  }

  .categories-section{
    margin-top: -20px;
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr); 
    height: 100%;
    width: 100%;
   
  }

  .product-container {
    grid-template-columns: repeat(2, 1fr); 
    display: flex;
    justify-content:left;
    flex-wrap: wrap;
    width: 147%;

  }

  .product-card {
    flex-basis: 30%;
  }

  .ratings {
    height: 400px;
    width: 500px;
    margin-top: 20px;
    margin-left: -30px;
  }

  .rate {
    top: 60px;
  }

  .rate h1 {
    font-size: 12px;
    
  }

  .rate p {
    font-size: 12px;
    
  }

  .description-section {
    padding: 20px; /* Adjust padding */
    margin: 20px auto; /* Adjust margin */
    max-width: 90%; /* Adjust max-width */
  }

  .description-title {
    font-size: 28px;
  }

  .description-content {
    font-size: 16px;
  }

  .description-logo{
    width: 200px;
  }

  .product-card {
    flex: 1 1 30%; 
    max-width: 30%;
  }

  .product-section{
    width: 100%;
    margin-left: 0px;
    margin-right: 0px;
  }

  .header-video{
    width: 100%;
  }

  .product-card img.main-image {
    max-width: 100%;
    height: 200px;
    display: block;
    margin: 0 auto;
    border-radius: 8px;
  }
}

</style>