<template>
  <div>
    <!-- SEARCH BAR -->
    <v-toolbar flat>
      <v-text-field
        v-model="search"
        class="w-auto mr-4"
        density="compact"
        label="Search Products"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
        style="max-width: 300px;"
      ></v-text-field>
    </v-toolbar>

    <!-- PRODUCT CARDS -->
   <v-row>
      <v-col v-for="product in products" :key="product.id" cols="3"> <!-- Adjust the width according to your preference -->
        <v-card class="v-card" elevation="2" style="height: 100%;">
          <img :src="product.image" alt="Product Image"> <!-- Display the product image here -->
          <v-card-title class="product-name">{{ product.product_name }}</v-card-title>
          <v-card-text class="product-description">Stock: {{ product.quantity }}</v-card-text>
          <v-card-actions class="product-price">
            <v-btn color="primary" @click="reserve(product)">Reserve</v-btn>
            <div class="flex-grow-1"></div> <!-- This creates space between button and price -->
            <span class="caption">₱{{ product.price }}</span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      search: '',
      editedItem:{
        product_image: '',
        product_id: '',
        product_name: '',
        supplier: '',
        quantity: '',
        price: '',
        image: '',
      },

      products: [],

        
      
    };
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    reserve(product) {
      // Logic for reserving the product
      console.log('Product reserved:', product.product_name);
    },
    fetchProducts() {
    axios.get('/products')
        .then(response => {
            this.products = response.data.map(product => {
                product.image = product.image; // Prepend '/storage/' to the image path
                return product;
            });
        })
        .catch(error => {
            console.error('Error fetching products: ', error);
        });
},
  }
};
</script>

<style>
.v-card {
  height: 100%;
}

.v-card:hover {
  background-color: #f0f0f0; /* Set the hover color here */
}

.headers {
  font-weight: bold;
}

.four-in-one-column {
  display: flex;
}
</style>
