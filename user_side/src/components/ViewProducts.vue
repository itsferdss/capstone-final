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
          <img :src="photo" />
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
          <div v-if="hasColorOptions" class="color-options">
            <p>Available Colors:</p>
            <div class="colors">
              <div v-for="item in product.color_stock" :key="item.color" class="color-palette"
                :style="{ backgroundColor: item.color }" @click="selectColor(item)">
              </div>
            </div>

            <!-- Display the stock for the selected color -->
            <p v-if="isLoggedIn">Stock for {{ selectedColor }}: {{ selectedColorStock }}</p>
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
        <v-card-title class="colorTitle">Enter your Reservation Information</v-card-title>
        <v-card-text>
          <div v-if="hasColorOptions" class="colors">
            <div v-for="item in product.color_stock" :key="item.color"
              :class="['color-palette', { selected: selectedColor === item.color }]"
              :style="{ backgroundColor: item.color }" @click="selectColor(item)">
            </div>
          </div>

          <!-- Display the selected color -->
          <v-row v-if="hasColorOptions" class="mt-4">
            <v-col cols="12">
              <div v-if="selectedColor">
                Selected color: <strong :style="{ color: selectedColor }">{{ selectedColor }}</strong>
              </div>
              <div v-else>
                No color selected
              </div>
              <strong v-if="isLoggedIn">Stock: {{ selectedColorStock }}</strong>
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
    <v-dialog v-model="loginDialog" persistent max-width="650px" class="login-dialog">
      <v-card class="login-card elevation-8">
        <v-card-title class="login-header justify-center">
          <span class="login-title">Sign In To Continue</span>
        </v-card-title>

        <v-card-text>
          <v-text-field label="Email Address" v-model="loginForm.email" required outlined prepend-icon="mdi-email"
            color="primary" class="mb-4" dense>
          </v-text-field>

          <v-text-field :type="showPassword ? 'text' : 'password'" label="Password" v-model="loginForm.password"
            required outlined prepend-icon="mdi-lock" color="primary" class="mb-4" dense>
            <template v-slot:append>
              <v-icon @click="togglePasswordVisibility" class="eye-icon" style="cursor: pointer;">
                {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
              </v-icon>
            </template>
          </v-text-field>

          <v-row justify="center" class="mt-2">
            <v-btn @click="forgotPassword" class="forgot-password">Forgot Password?</v-btn>
          </v-row>
        </v-card-text>

        <!-- Actions: Log In and Back -->
        <v-card-actions class="justify-center mt-4">
          <v-btn @click="login" class="login-button px-8 py-2" elevation="2">Log In</v-btn>
          <v-btn text @click="loginDialog = false" class="rounded-button px-6">Back</v-btn>
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
      baseURL: 'http://127.0.0.1:8000', 
      photos: [],
      isLoggedIn: false,
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
      selectedColorImage: null,
      loginDialog: false,
      showPassword: false,
      reserveQuantity: 1,
      loginForm: {
        email: '',
        password: '',
      }
    };
  },
  computed: {
    currentPhoto() {
      const token = localStorage.getItem('token');

      if (token) {
        this.isLoggedIn = true;
      }
      return this.photos[this.currentIndex];
    },
    ...mapState({
      patientId: state => state.patientId || localStorage.getItem('patientId'),
    }),
    selectedColorStock() {
      const selected = this.product.color_stock.find(item => item.color === this.selectedColor);
      return selected ? selected.stock : 0; // Return stock or 0 if no color is selected
    },
    hasColorOptions() {
      return Array.isArray(this.product.color_stock) &&
        this.product.color_stock.some(item => item.color); // Checks if there’s a non-empty color
    }
  },
  methods: {
    fetchProductData(productId) {
      axios.get(`/viewProduct/${productId}`)
        .then(response => {
          const product = response.data;

          // Parse color_stock JSON string into an array
          const colorStock = JSON.parse(product.color_stock || "[]");

          // Prepend the base URL to each color stock image if needed
          const colorStockImages = colorStock.map(color => {
            if (color.image && !color.image.startsWith('http') && !color.image.startsWith('127.0.0.1')) {
              // Prepend the base URL to the image path if it doesn't contain 'http' or '127.0.0.1'
              return `${this.baseURL}/${color.image}`;
            }
            return color.image; // Return as is if it starts with 'http' or '127.0.0.1'
          });

          // Combine product images and color stock images, ensuring base URL is only prepended if needed
          const allImages = [
            ...product.images.map(image => {
              // Check if the image URL starts with 'http' or '127.0.0.1'
              if (!image.startsWith('http') && !image.startsWith('127.0.0.1')) {
                // Prepend the base URL if image doesn't start with 'http' or '127.0.0.1'
                return `${this.baseURL}/${image}`;
              }
              return image; // Return the image as is if it starts with 'http' or '127.0.0.1'
            }),
            ...colorStockImages
          ].filter(Boolean); // Remove any invalid (null or undefined) values

          // Set the product data
          this.product = {
            ...product,
            color_stock: colorStock, // Store the parsed color stock
            images: allImages // Combine images
          };

          // Use the combined images (allImages)
          this.photos = allImages; // Ensure this is an array of image URLs
          this.currentIndex = 0; // Reset current index to display the first image
        })
        .catch(error => {
          console.error('Error fetching product data:', error);
        });
    },

    selectColor(item) {
      this.selectedColor = item.color;
      this.selectedColorImage = item.image; // Update the selected color image

      // Determine the two possible image URLs
      const baseColorImage = `${this.baseURL}/${item.image}`; // Image with base URL
      const altColorImage = item.image.startsWith('http') || item.image.startsWith('127.0.0.1') ? item.image : `${this.baseURL}/${item.image}`; // Image without base URL if already contains 'http' or '127.0.0.1'

      // Create an array of possible images to check
      const possibleImages = [baseColorImage, altColorImage];

      // Update currentPhoto to the selected color image
      this.currentIndex = this.photos.findIndex(photo => possibleImages.includes(photo)); // Find the image's index in photos

      // If neither the base URL version nor the alt version is in photos, add both versions
      possibleImages.forEach(image => {
        if (!this.photos.includes(image)) {
          this.photos.push(image);
        }
      });

      this.updateRightPhoto(this.currentIndex); // Update the displayed image
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

          this.loginDialog = false;

          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'Welcome!',
          });
        })
        .catch(error => {

          this.loginDialog = false;
          
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
    confirmColor() {
      // Check if color selection is required
      if (!this.product.color_stock || this.product.color_stock.length === 0) {
        // If no color stock is available, skip color selection
        this.selectedColor = null;
      } else if (this.product.color_stock.length === 1) {
        // If only one color is available, set it as the selected color
        this.selectedColor = this.product.color_stock[0].color;
      }

      // If selectedColor is still empty and color stock is available, prompt the user to select a color
      if (this.product.color_stock.length > 1 && !this.selectedColor) {
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

      // Validate the quantity
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

      // Send reservation request
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
            text: `Product ${this.selectedColor ? `(${this.selectedColor})` : ''} with quantity ${this.reserveQuantity} has been reserved successfully.`,
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
    forgotPassword() {
      this.$router.push('/forgot-password'); // Redirect to the forgot password page
    },
    goBack() {
      this.$router.go(-1);
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword; // Toggle the visibility state
    }

  },

      mounted() {
        const productId = this.$route.query.id;

        // Check if the user is logged in
        const token = sessionStorage.getItem('token');
        this.isLoggedIn = !!token; // Set to true if token exists

        // Fetch product data if product ID is available
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
    }

    .error-message {
      color: red;
      font-weight: bold;
      margin-top: 10px;
    }

    .v-btn:hover {
      background-color: rgba(0, 191, 255, 0.2);
    }

    .v-card-title {
      margin-bottom: 20px;
    }

    .mb-4 {
      margin-bottom: 16px !important;
    }

    .login-title {
      font-size: 20px;
      font-weight: 600;
    }

    .mb-4 {
      margin-bottom: 20px;
    }

    .error-message {
      color: red;
      text-align: center;
      font-size: 14px;
    }

    .login-dialog {
      border-radius: 10px;
    }

    .login-card {
      padding: 20px;
    }

    .login-header {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 16px;
    }

    .login-title {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }

    .mvcLogo {
      width: 40px;
      height: 40px;
    }

    .v-text-field {
      margin-bottom: 16px;
    }

    .login-button {
      background-color: #596f93;
      color: rgb(49, 49, 49);
      font-weight: bold;
      transition: background-color 0.3s ease;
    }

    .login-button:hover {
      background-color: #424c8b;
    }

    .error-message {
      color: red;
      font-size: 14px;
      margin-top: 8px;
    }

    .forgot-password {
      font-size: 14px;
      color: #3f51b5;
      text-decoration: underline;
    }

    .rounded-button {
      background-color: rgb(188, 92, 92);
      color: #000000;
    }

    .rounded-button:hover {
      background-color: rgb(176, 48, 48);
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
        width: auto;
        height: auto;
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

      .productPhoto {
        width: 10px;
      }

      .prev {
        display: none;
      }

      .next{
        display: none;
      }
    }
  </style>
