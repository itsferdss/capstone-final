<template>
  <div class="container">
    <button class="back-button" @click="goBack">
      ◀ Back
    </button>
    <aside class="left-container" v-if="photos.length > 0">
      <div class="photo-grid">
        <a v-for="(photo, index) in photos" :key="index" @click="updateRightPhoto(index)"
          :class="{ selected: currentIndex === index }">
          <img :src="photo" :alt="'Photo ' + (index + 1)" />
        </a>
      </div>
    </aside>
    <main class="right-container">
      <div class="image-description-container">
        <div class="image-container" @mousemove="handleMouseMove" @mouseleave="hideZoom" v-if="currentPhoto">
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
              <div v-for="item in product.color_stock" :key="item.color" class="color-palette"
                :style="{ backgroundColor: item.color }">
              </div>
            </div>
          </div>

          <div class="offers">

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
        color_stock: [],
        offers: [],
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
      axios.get(`http://127.0.0.1:8000/api/viewProduct/${productId}`)
        .then(response => {
          const product = response.data;
          // Parse color_stock JSON string into an array
          product.color_stock = JSON.parse(product.color_stock);
          this.product = product;
          this.photos = product.images; // Ensure this is an array of image URLs
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

      if (!Array.isArray(product.color_stock) || !product.color_stock.every(item => item.color)) {
        console.error('Color stock is not available or invalid.');
        return;
      }

      // Create color options with event listeners
      const colorOptions = product.color_stock.map(item => {
        return `
      <div class="color-palette" 
           style="background-color:${item.color}; width: 40px; height: 40px; border-radius: 50%; margin: 5px; cursor: pointer;" 
           data-color="${item.color}"></div>
    `;
      }).join('');

      // Show SweetAlert with color palette
      Swal.fire({
        title: 'Please select a color',
        html: `<div id="color-picker" style="display: flex; justify-content: center; align-items: center; flex-wrap: wrap;">${colorOptions}</div>`,
        showCancelButton: true,
        confirmButtonText: 'Reserve Now',
        preConfirm: () => {
          const selectedColorElement = document.querySelector('#color-picker .color-palette.selected');
          if (!selectedColorElement) {
            Swal.showValidationMessage('Please select a color.');
            return false;
          }
          return selectedColorElement.getAttribute('data-color');
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const selectedColor = result.value;

          // Proceed with reservation request
          axios.post('/reserve', {
            product_id: product.id,
            product_name: product.product_name,
            user_id: this.patientId,
            color: selectedColor  // Include selected color
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
          })
            .then(response => {
              console.log('Reservation created:', response.data);
              Swal.fire(
                'Reserved!',
                `Product (${selectedColor}) has been reserved successfully.`,
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

      // Add event listeners for color selection after SweetAlert2 is displayed
      Swal.getHtmlContainer().querySelectorAll('.color-palette').forEach(element => {
        element.addEventListener('click', () => {
          document.querySelectorAll('#color-picker .color-palette').forEach(el => el.classList.remove('selected'));
          element.classList.add('selected');
        });
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
  margin-left: 5%;
  position: relative;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: #007bff;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.back-button:hover {
  background-color: #0056b3;
  /* Darker shade for hover effect */
  transform: scale(1.05);
  /* Slightly enlarge button on hover */
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
  background-color: #f8f9fa;
  /* Lighter background for better contrast */
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
  flex-wrap: nowrap;
  gap: 10px;
}

.color-palette {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-palette.selected {
  border: 2px solid #000; /* Border for selected color */
}

.color-label {
  color: white;
  font-size: 12px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
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
  background-color: #28a745;
  /* Updated color for button */
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
  background-color: #218838;
  /* Darker shade for hover effect */
}

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
  top: 10px;
  right: 10px;
  transition: background-position 0.1s ease;
}

@media screen and (max-width: 960px) {
  .container {
    flex-direction: column;
    margin-left: 0px;
  }

  .left-container {
    width: 100%;
    padding: 10px;
    border-right: none;
    box-shadow: none;
    margin-bottom: 20px;
  }

  .photo-grid {
    flex-direction: row;
    gap: 10px;
    overflow-x: auto;
    justify-content: flex-start;
  }

  .photo-grid img {
    width: 100px;
  }

  .right-container {
    width: 100%;
    padding: 20px;
  }

  .image-description-container {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .image-container {
    width: 100%;
    height: 300px;
    margin-top: 50px;
  }

  .description-container {
    width: 100%;
    margin-top: 20px;
  }

  .select-button {
    width: 100%;
  }

   .back-button {
    position: fixed;
    top: 550px;
    left: 10px;
    z-index: 1000;
    padding: 10px 15px;
    font-size: 14px;
    border-radius: 5px;
    color: white;
   }
}
</style>