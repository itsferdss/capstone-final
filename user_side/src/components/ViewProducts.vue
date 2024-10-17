<template>
  <div class="container">
    <header>
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i> <span class="add-text">Back</span>
      </button>
    </header>
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
          <button class="nav-button prev" @click="prevPhoto"><i class="fas fa-arrow-left"></i></button>
          <img :src="currentPhoto" alt="Selected Photo" v-if="currentPhoto" />
          <button class="nav-button next" @click="nextPhoto"><i class="fas fa-arrow-right"></i></button>

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

    <!-- Color selection dialog -->
    <v-dialog v-model="colorDialog" max-width="600px">
      <v-card>
        <v-card-title class="colorTitle">Please select a color</v-card-title>
        <v-card-text>
          <div class="colors">
            <div v-for="item in product.color_stock" :key="item.color"
              :class="['color-palette', { selected: selectedColor === item.color }]"
              :style="{ backgroundColor: item.color }" @click="selectColor(item.color)">
            </div>
          </div>

          <!-- Display the selected color -->
          <v-row class="mt-4">
            <v-col cols="12">
              <div v-if="selectedColor">
                Selected color: <strong :style="{ color: selectedColor }">{{ selectedColor }}</strong>
              </div>
              <div v-else>
                No color selected
              </div>
            </v-col>
          </v-row>

          <!-- Input for quantity -->
          <v-row class="mt-4">
            <v-col cols="12">
              <v-text-field v-model.number="reserveQuantity" label="Quantity to Reserve" type="number" min="1">
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="confirmColor">Reserve Now</v-btn>
          <v-btn text @click="colorDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--LOGIN DIALOG-->
    <v-dialog v-model="loginDialog" persistent max-width="400px" class="login-dialog">
    <v-card class="login-card elevation-8">
      <v-card-title class="login-title text-center">Log in to continue.</v-card-title>

      <v-card-text class="text-center">
        <v-img src="../src/assets/MVC_logo.png" class="mvcLogo" contain></v-img>

        <v-text-field
          label="Email"
          v-model="email"
          required
          outlined
          class="mb-4"
          prepend-icon="mdi-email"
        ></v-text-field>

        <v-text-field
          :type="passwordType"
          label="Password"
          v-model="password"
          required
          outlined
          class="mb-4"
          prepend-icon="mdi-lock"
        >
          <template v-slot:append>
            <v-icon
              @click="togglePasswordVisibility"
              class="eye-icon"
              style="cursor: pointer;"
            >
              {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
            </v-icon>
          </template>
        </v-text-field>

        <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn color="#00BFFF" @click="login" class="mr-2 rounded-button" elevation="2">Log In</v-btn>
        <v-btn text @click="loginDialog = false" class="rounded-button">Back</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>





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
      },
      colorDialog: false,
      selectedColor: null,
      loginDialog: false,
      loginForm: {
        email: '',
        password: '',
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
      axios.get(`/viewProduct/${productId}`)
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
    login() {
      axios.post('/login', {
        email: this.loginForm.email,  
        password: this.loginForm.password
      })
        .then(response => {
          const token = response.data.token; // Assuming the token is returned in the response
          const id = response.data.id;
          localStorage.setItem('patientId', id);
          sessionStorage.setItem('token', token); // Store the token in sessionStorage
          this.$store.commit('setPatientId', id);
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'Welcome!',
          });
          this.$router.push('/home'); // Redirect to home after successful login
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password',
          });
          console.error('Login failed:', error);
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
      const token = sessionStorage.getItem('token'); // Check if token exists

      if (!token) {
        // Show login dialog if not logged in
        this.loginDialog = true;
        return;
      }

      if (!this.patientId) {
        console.error('User ID not available.');
        return;
      }

      this.colorDialog = true; // Open the color selection dialog if logged in
    },
        selectColor(color) {
          this.selectedColor = color; // Set the selected color
        },
    confirmColor() {
      if (!this.selectedColor) {
        this.colorDialog = false;
        Swal.fire({
          icon: 'warning',
          title: 'No color selected!',
          text: 'Please select a color before proceeding.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        return;
      }

      if (!this.reserveQuantity || this.reserveQuantity < 1) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Quantity!',
          text: 'Please enter a valid quantity to reserve.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
        return;
      }

      axios.post('/reserve', {
        product_id: this.product.id,
        product_name: this.product.product_name,
        user_id: this.patientId,
        color: this.selectedColor,
        quantity: this.reserveQuantity // Sending quantity
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
        .then(response => {
          this.colorDialog = false; // Close the dialog
          Swal.fire({
            icon: 'success',
            title: 'Reservation Successful',
            text: `Product (${this.selectedColor}) with quantity ${this.reserveQuantity} has been reserved successfully.`,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
          console.log('Reservation created:', response.data);
        })
        .catch(error => {
          console.error('Error reserving product:', error);
          Swal.fire({
            icon: 'error',
            title: 'Reservation Failed',
            text: 'Failed to reserve product. Please try again later.',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
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
      background-color: #b2b2b2;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 5px;
      color: #fff7f7;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.3s ease;
    }

    .back-button:hover {
      background-color: #575757;
      transform: scale(1.05);
      color: rgb(0, 0, 0);
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
      border: 2px solid #000;
      /* Border for selected color */
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

    .colorTitle {
      text-align: center;
      background-color: #86b6ea;
    }

    .loginDialog {
      background-color: #e0f7fa;
    }

    .loginCard {
      background-color: #f0f8ff;
      padding: 16px;
      border-radius: 10px;
    }

    .mvcLogo {
      width: 100%;
      height: auto;
      max-width: 300px;
      margin: 0 auto 16px;
      display: block;
    }

    .input-group {
      margin-bottom: 16px;
    }

    .inputTitle {
      font-size: 16px;
      margin-bottom: 8px;
      display: block;
    }

    input {
      width: 100%;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }

    .eye-icon {
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 250 px;
    }

    .loginButton {
      width: 100%;
      background-color: #b3e5fc;
      color: #000;
      text-transform: none;
      font-weight: bold;
    }

    .error {
      color: red;
      text-align: center;
    }

    .login-dialog {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 240, 240, 0.9)); /* Gradient background */
}

.login-card {
  padding: 30px;
  border-radius: 12px; /* Increased border-radius for softness */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Softer shadow */
}

.login-title {
  font-size: 20px; /* Smaller font size for title */
}

.mvcLogo {
  width: 520px; /* Adjust logo size as needed */
  margin-bottom: 20px;
  margin-top: -40px;
}

.eye-icon {
  cursor: pointer;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 10px; /* Spacing above error message */
}

.rounded-button {
  border-radius: 20px;
  font-weight: bold;
  min-width: 120px; /* Ensures buttons have a consistent width */
  transition: background-color 0.3s ease; /* Smooth transition for button hover */
}

/* Optional: Button Hover Effect */
.v-btn:hover {
  background-color: rgba(0, 191, 255, 0.2); /* Lighten the button color on hover */
}

/* Centering and Spacing */
.v-card-title {
  margin-bottom: 20px;
}

.mb-4 {
  margin-bottom: 16px !important; /* Ensures consistent spacing */
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
        position: relative;
        top: auto;
        left: auto;
        transform: translateX(0%);
        margin: 15px 0;
      }
    }
  </style>
