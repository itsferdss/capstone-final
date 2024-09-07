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
      <div class="banner-card">
        <p>MEN</p>
        <img src="../assets/bgm.jpg" alt="Men's Glasses">
      </div>
      <div class="banner-card">
        <p>WOMEN</p>
        <img src="../assets/bgfm.jpg" alt="Women's Glasses">
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

    <div class="product-section">
      <h2>Categories</h2>
      <div class="product-grid">
        <div class="product-card">
          <img src="../assets/product2.jpg" class="product-image" alt="Salamin">
          <div class="product-name-container">
            <p class="product-name">FRAMES</p>
          </div>
        </div>
        <div class="product-card">
          <img src="../assets/product1.jpg" class="product-image" alt="Sports Eye Glass">
          <div class="product-name-container">
            <p class="product-name">LENSES</p>
          </div>
        </div>
        <div class="product-card">
          <img src="../assets/product3.jpg" class="product-image" alt="Contact Lense">
          <div class="product-name-container">
            <p class="product-name">Contact Lense</p>
          </div>
        </div>
        <div class="product-card">
          <img src="../assets/5.jpg" class="product-image" alt="Sun Glass">
          <div class="product-name-container">
            <p class="product-name">ACCESSORIES</p>
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
      <h2>New Products</h2>
      <div class="product-grid">
        <div class="product-card">
          <img src="../assets/product2.jpg" class="product-image" alt="Salamin">
          <div class="product-name-container">
            <p class="product-name">Salamin</p>
          </div>
        </div>
        <div class="product-card">
          <img src="../assets/product1.jpg" class="product-image" alt="Sports Eye Glass">
          <div class="product-name-container">
            <p class="product-name">Sports Eye Glass</p>
          </div>
        </div>
        <div class="product-card">
          <img src="../assets/product3.jpg" class="product-image" alt="Contact Lense">
          <div class="product-name-container">
            <p class="product-name">Contact Lense</p>
          </div>
        </div>
        <div class="product-card">
          <img src="../assets/product4.jpg" class="product-image" alt="Sun Glass">
          <div class="product-name-container">
            <p class="product-name">Sun Glass</p>
          </div>
        </div>
      </div>
    </div>

    <div class="description-section">
      <h2>THE MOST TRUSTED CLINIC</h2>
      <p>Welcome to MVC optical. We're an optical clinic in Cabangan, Zambales. Bringing a new category of prescription
        eyeglasses and sunglasses by bringing proven, cutting-edge sport performance tech to everyday eyewear.</p>
      <p>If you're active and need a versatile eyewear solution, we've got you covered.</p>
      <img src="../assets/mvc.png" alt="Logo" class="description-logo">
      <img src="../assets/ECHODE.png" alt="Logo" class="description-logo">
      <img src="../assets/newlogo.png" alt="Logo" class="description-logo">
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage',
  methods: {
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
      // Handle shop sunglasses action
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px; /* Increase padding */
}

.header-banner {
  position: relative;
  text-align: center;
  margin-bottom: 30px; /* Increase bottom margin */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Increase shadow size */
}

.logo-container {
  position: relative;
  width: 100%;
  height: 500px; /* Increase height */
  overflow: hidden;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.welcome {
  position: absolute;
  bottom: 120px; /* Increase bottom position */
  left: 30px; /* Increase left position */
  padding: 40px; /* Increase padding */
  z-index: 10;
}

.welcome h1 {
  font-size: 36px; /* Increase font size */
  font-weight: 700;
  margin: 0;
  color: #89f070;
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
  background-color: #6baff8;
  color: #fafcff;
}

.header-video {
  position: absolute;
  top: 0;
  left: 0;
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
  margin-left: 30px;
  margin-top: 80px; /* Increase top margin */
}

.banner-card {
  flex: 1;
  position: relative;
  padding: 30px; /* Increase padding */
  background-color: #fff;
  border-radius: 12px; /* Increase border-radius */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Increase shadow size */
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.banner-card:hover {
  transform: scale(1.08); /* Increase scale effect */
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2); /* Increase shadow size */
}

.banner-card img {
  width: 100%;
  height: 400px; /* Increase height */
  object-fit: cover;
  border-radius: 12px;
  margin-top: 15px; /* Increase top margin */
}

.banner-card p {
  font-size: 24px; /* Increase font size */
  font-weight: 700;
  color: #2c3e50;
}

.product-section {
  margin-top: 80px; /* Increase top margin */
  margin-left: 60px; /* Increase left margin */
  margin-right: 60px; /* Increase right margin */
}

.product-section h2 {
  font-size: 28px; /* Increase font size */
  margin-bottom: 25px; /* Increase bottom margin */
  color: #2c3e50;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px; /* Increase gap between grid items */
}

.product-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  padding: 30px; /* Increase padding */
  border-radius: 12px; /* Increase border-radius */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Increase shadow size */
  text-align: center;
  position: relative;
  overflow: hidden;
}

.product-card:hover {
  animation: continuousBounce 1s ease-in-out infinite;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2); /* Increase shadow size */
  transition: box-shadow 0.3s ease;
}

.product-image {
  width: 100%;
  height: 250px; /* Increase height */
  object-fit: cover;
  border-radius: 12px; /* Increase border-radius */
  transition: transform 0.3s ease;
}

.product-name-container {
  background: #6baff8;
  padding: 15px; /* Increase padding */
  border-radius: 8px; /* Increase border-radius */
  margin-top: 20px; /* Increase top margin */
  display: flex;
  align-items: center;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
}

.product-name-container:hover {
  background-color: #5a9cd7;
}

.product-name {
  font-size: 20px; /* Increase font size */
  color: #fafcff;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
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
  margin-left: 50px; /* Increase left margin */
  margin-top: 80px; /* Increase top margin */
}

.rate {
  position: absolute;
  bottom: 40px; /* Increase bottom position */
  left: 30px; /* Increase left position */
  padding: 40px; /* Increase padding */
  z-index: 10;
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

</style>