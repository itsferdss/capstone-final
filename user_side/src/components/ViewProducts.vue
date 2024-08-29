<template>
  <div class="container">
    <div class="left-container">
      <div class="photo-grid">
        <a
          v-for="(photo, index) in photos"
          :key="index"
          @click="updateRightPhoto(index)"
          :class="{ selected: currentIndex === index }"
        >
          <img :src="photo" :alt="'Photo ' + (index + 1)" />
        </a>
      </div>
    </div>
    <div class="right-container">
      <div class="image-description-container">
        <div class="image-container">
          <button class="nav-button prev" @click="prevPhoto">◀</button>
          <img :src="currentPhoto" alt="Selected Photo" v-if="currentPhoto" />
          <button class="nav-button next" @click="nextPhoto">▶</button>
        </div>
        <div class="description-container">
          <h1>BONGBONG EYEGLASS</h1>
          <p>Black Full Frame Browline Eyeglasses for Men</p>
          <h2>₱1990</h2>
          <div class="rating">
            <span>⭐ 4.4 (5799)</span>
          </div>
          <div class="color-options">
            <p>Color</p>
            <div class="colors">
              <div v-for="color in colors" :key="color" class="color-circle" :style="{ backgroundColor: color }"></div>
            </div>
          </div>
          <div class="offers">
            <p><strong>Offers:</strong></p>
            <ul>
              <li>YOPO Offer - You Only Pay For One</li>
              <li>Free Eye test at store worth ₱2000 for up to 4 people</li>
            </ul>
          </div>
          <button class="select-button">SELECT LENS & RESERVE NOW</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import photo1 from '../assets/product1.jpg';
import photo2 from '../assets/product2.jpg';
import photo3 from '../assets/product1.jpg';
import photo4 from '../assets/product2.jpg';

export default {
  name: 'LeftContainer',
  data() {
    return {
      photos: [photo1, photo2, photo3, photo4],
      currentIndex: 0
    };
  },
  computed: {
    currentPhoto() {
      return this.photos[this.currentIndex];
    }
  },
  methods: {
    updateRightPhoto(index) {
      this.currentIndex = index;
    },
    prevPhoto() {
      this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    },
    nextPhoto() {
      this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.left-container {
  width: 150px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-right: 1px solid #ccc;
}

.photo-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  width: 100%;
}

.photo-grid a {
  display: block;
  opacity: 0.7;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.photo-grid a.selected,
.photo-grid a:hover {
  opacity: 1;
  transform: scale(1.05);
}

.photo-grid img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.right-container {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
}

.image-description-container {
  display: flex;
  align-items: center;
}

.image-container {
  display: flex;
  align-items: center;
  position: relative;
  margin-right: 30px;
  width: 600px;
  height: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  padding: 10px;
}

.right-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
}

.description-container {
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  height: 400px;
}

.description p {
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  margin: 0;
  padding: 0;
}

.nav-button {
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 10px;
  border-radius: 50%;
}

.nav-button.prev {
  margin-right: 10px;
}

.nav-button.next {
  margin-left: 10px;
}

.image-container:hover .nav-button {
  opacity: 1;
}
</style>