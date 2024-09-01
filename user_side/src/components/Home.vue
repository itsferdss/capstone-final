<template>
  <div>
    <div class="section1">
     <div class="model-container">
        <!-- Image with overlay -->
        <img class="model" src="../assets/bgModel.jpg" alt="Model"/>
        <!-- Black overlay with opacity -->
        <div class="overlay"></div>
        <!-- Text on top of the overlay -->
        <div class="overlay-text">
          <h2 class="sec3Title">Welcome to <br>MVC Optical Clinic Website!</h2>
        </div>
      </div>
    </div>
 
      <!-- LATEST PRODUCT -->
      <div >
        <div class="latestprod">
          <p class="newP">NEW PRODUCTS!</p>
        </div>
        <!-- PRODUCT BOX OF LATESTS -->
        <v-row class="products">
          <v-col class="latestdia" v-for="product in products" :key="product.id" cols="12" sm="6" md="4" lg="3">
            <v-card class="v-card" elevation="2" style="height: 100%;" @click="viewProduct(product.id)">
              <img :src="getProductImageUrl(product.image)" alt="Product Image" class="productPic">
              <v-card-title class="product-name">{{ product.product_name }}</v-card-title>
              <v-card-text class="product-price">
                ₱{{ product.price }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'WelcomePage',
  data() {
    return {
      products: []
    };
  },
  methods: {
    goToProducts() {
      this.$router.push('/products');
    },
    fetchProducts() {
      axios.get('/products/latest')
        .then(response => {
          this.products = response.data.map(product => {
            console.log('Product Image URL:', product.image);
            return product;
          });
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    },

    getProductImageUrl(imagePath) {
      return imagePath;
    },

    viewProduct(productId) {
      this.$router.push({ path: '/viewProduct', query: { id: productId } });
    },
  },
  created() {
    this.fetchProducts();
  }
};
</script>

<style scoped>
#section1 {
  max-height: 500px;
}

.model-container {
  position: relative;
  width: 100%;
  height: 300px; /* Height of the model image container */
  margin-top: -20px;
  margin-right: -20px;
  box-shadow: 0 10px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 50px 0 rgba(0, 0, 0, 0.19);
}

/* Model image styling */
.model {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image covers the container */
}

/* Black overlay styling */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Black with 50% opacity */
}

/* Text on top of the overlay */
.overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center text */
  color: white; /* Text color */
  text-align: center; /* Center align text */
  font-size: 24px; /* Adjust font size */
  font-weight: bold; /* Optional: Make the text bold */
}

.sec3Title {
  font-family: 'Times New Roman', Times, serif;
  font-size: 50px;
}

html, body {
  margin: 0;
  padding: 0;
}

.full-height {
  height: 100vh;
}

.btnCheck {
  margin-top: 50px;
  margin-left: 200px;
}

.latestprod {
  font-weight: bold;
  font-size: 32px;
  text-align: center;
  margin-top: 20px;
  border:rgba(0, 0, 0, 0.19)
}

.newP {
  font-family: 'Playfair Display', serif;
  font-weight: bold;
}

.productPic {
  height: 200px;
  width: 100%; /* Ensure width is 100% to maintain aspect ratio */
  object-fit: cover; /* Ensures the image covers the container */
  border: 7px solid #0e0c0a;
}

.v-card {
  background-color: #0e0c0a; /* Black background for the product box */
  color: white; /* White text color for contrast */
  display: flex;
  flex-direction: column;
  align-items: center; /* Center horizontally */
  justify-content: center; /* Center vertically */
  text-align: center; /* Center text within the card */
}

.latestdia {
  margin-top: 20px;
  
}

.product-name{
  font-family: 'Playfair Display', serif;
  font-weight: bold;
  color: rgb(255, 255, 255);
}

.product-price{
  color: rgb(255, 255, 255);
}

.products {
  margin-right: 40px;
  margin-left: 40px;
}


</style>
