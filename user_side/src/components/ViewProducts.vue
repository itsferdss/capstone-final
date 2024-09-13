<template>
  <div class="container">
    <button class="back-button" @click="goBack">
      ◀ Back
    </button>
    <aside class="left-container">
      <div class="photo-grid">
        <a v-for="(photo, index) in photos" :key="index" @click="updateRightPhoto(index)"
          :class="{ selected: currentIndex === index }">
          <img :src="photo" :alt="'Photo ' + (index + 1)" />
        </a>
      </div>
    </aside>
    <main class="right-container">
      <div class="image-description-container">
        <div class="image-container" @mousemove="handleMouseMove" @mouseleave="hideZoom">
          <button class="nav-button prev" @click="prevPhoto">◀</button>
          <img :src="currentPhoto" alt="Selected Photo" v-if="currentPhoto" />
          <button class="nav-button next" @click="nextPhoto">▶</button>

          <!-- Larger Zoomed area container -->
          <div class="zoomed-container" v-if="zoomed" :style="{
              backgroundImage: `url(${currentPhoto})`,
              backgroundPosition: zoomPosition,
              backgroundSize: '300%'
            }">
          </div>
        </div>

        <div class="description-container">
          <h1>{{ product.product_name }}</h1>
          <p class="description-text">Total Stock: {{ product.quantity }}</p>
          <h2 class="price">₱{{ product.price }}</h2>
          <div class="rating">
            <span>⭐ {{ product.rating }} ({{ product.reviews }} reviews)</span>
          </div>
          <div class="color-options">
            <p>Available Colors:</p>
            <div class="colors">
              <div v-for="color in product.colors" :key="color" class="color-circle"
                :style="{ backgroundColor: color }"></div>
            </div>
          </div>

          <div class="offers">
            <p><strong>Special Offers:</strong></p>
            <ul>
              <li v-for="offer in product.offers" :key="offer">{{ offer }}</li>
            </ul>
          </div>
          <button class="select-button" @click="reserve(product)">Reserve Now</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { mapState } from 'vuex';

export default {
  name: 'ProductPage',
  data() {
    return {
      photos: [],
      currentIndex: 0,
      zoomed: false,
      zoomPosition: '0% 0%',
      product: {
        product_name: '',
        description: '',
        price: '',
        rating: '',
        reviews: '',
        colors: [],
        offers: []
      }
    };
  },
  computed: {
    currentPhoto() {
      return this.photos[this.currentIndex];
    },
    ...mapState({
      patientId: state => state.patientId || localStorage.getItem('patientId'),
    }),
  },
  methods: {
    fetchProductData(productId) {
      axios.get(`http://26.135.189.53:8000/api/viewProduct/${productId}`)
        .then(response => {
          const product = response.data;
          this.product = product;
          this.photos = product.images; // Ensure this is an array of image URLs
          console.log('Fetched product images:', this.photos); // Debugging line
        })
        .catch(error => {
          console.error('Error fetching product data:', error);
        });
    },
    updateRightPhoto(index) {
      this.currentIndex = index;
    },
    prevPhoto() {
      this.currentIndex =
        (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    },
    nextPhoto() {
      this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    },
    handleMouseMove(event) {
      this.zoomed = true;
      const imageContainer = event.currentTarget;
      const rect = imageContainer.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      this.zoomPosition = `${x}% ${y}%`;
    },
    hideZoom() {
      this.zoomed = false;
    },
    reserve(product) {
      if (!this.patientId) {
        console.error('User ID not available.');
        return;
      }
      
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to reserve this product?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, reserve it!'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.post('/reserve', {
            product_id: product.id,
            product_name: product.product_name,
            user_id: this.patientId,
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
          })
          .then(response => {
            console.log('Reservation created:', response.data);
            Swal.fire(
              'Reserved!',
              'Product has been reserved successfully.',
              'success'
            );
          })
          .catch(error => {
            console.error('Error reserving product:', error);
            Swal.fire(
              'Error!',
              'Failed to reserve product.',
              'error'
            );
          });
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  
  mounted() {
    const productId = this.$route.query.id;
    if (productId) {
      this.fetchProductData(productId);
    } else {
      console.error('No product ID provided in query parameters.');
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  font-family: 'Arial', sans-serif;
  margin-left: 10%;
  position: relative;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 250px;
  background-color: #99b3c6;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #2e425d;
  color: rgb(203, 202, 202);
}

.left-container {
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-right: 2px solid #ddd;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
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
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.photo-grid a.selected,
.photo-grid a:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.photo-grid img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.right-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 30px;
  background-color: #ffffff;
}

.image-description-container {
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 1000px;
  width: 100%;
}

.image-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 500px;
  height: 350px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  padding: 10px;
  position: relative;
  margin-top: 150px;
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
  margin-top: 150px;
}

.description-text {
  font-size: 16px;
  line-height: 1.5;
  color: #555;
  margin: 0;
}

.price {
  color: #e53935;
  font-size: 24px;
  font-weight: bold;
}

.rating {
  margin: 10px 0;
}

.color-options {
  margin: 20px 0;
}

.color-options p {
  margin: 0;
  font-weight: bold;
}

.colors {
  display: flex;
  gap: 10px;
}

.color-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #ccc;
}

.offers {
  margin: 20px 0;
}

.offers p {
  margin: 0;
}

.offers ul {
  padding-left: 20px;
}

.offers li {
  margin-bottom: 10px;
}

.select-button {
  background-color: #e53935;
  color: #ffffff;
  border: none;
  padding: 15px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.select-button:hover {
  background-color: #c62828;
}

/* New styles for the zoomed container */
.zoomed-container {
  position: absolute;
  width: 300px;
  height: 225px;
  border: 2px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-repeat: no-repeat;
  pointer-events: none;
  border-radius: 8px;
  z-index: 100;
  top: 10px; /* Adjusted top position */
  right: 10px; /* Adjusted right position */
  transition: background-position 0.1s ease;
}
</style>
