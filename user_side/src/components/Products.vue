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
      <v-col v-for="item in dataHolder.Products" :key="item.product_id" cols="3"> <!-- Adjust the width according to your preference -->
        <v-card class="v-card" elevation="2" style="height: 100%;">
          <v-img :src="item.image" contain></v-img>
          <v-card-title class="product-name">{{ item.name }}</v-card-title>
          <v-card-text class="product-description">{{ item.description }}</v-card-text>
          <v-card-actions class="product-price">
            <v-btn color="primary" @click="reserve(item)">Reserve</v-btn>
            <div class="flex-grow-1"></div> <!-- This creates space between button and price -->
            <span class="caption">{{ item.price }}</span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      dataHolder: {
        Products: [
          { 
            product_id: 1,
            name: 'Product 1',
            description: 'Description for Product 1',
            price: '$100',
            image: '../src/assets/product1.jpg'
          },
          { 
            product_id: 2,
            name: 'Product 2',
            description: 'Description for Product 2',
            price: '$200',
            image: '../src/assets/product1.jpg'
          },

          { 
            product_id: 2,
            name: 'Product 2',
            description: 'Description for Product 2',
            price: '$200',
            image: '../src/assets/product1.jpg'
          },

          { 
            product_id: 1,
            name: 'Product 1',
            description: 'Description for Product 1',
            price: '$100',
            image: '../src/assets/product1.jpg'
          },

          { 
            product_id: 1,
            name: 'Product 1',
            description: 'Description for Product 1',
            price: '$100',
            image: '../src/assets/product1.jpg'
          },
          // Add more products as needed
        ]
      },
      headers: [
        // Define your table headers here if needed
      ]
    };
  },
  methods: {
    reserve(item) {
      // Logic for reserving the product
      console.log('Product reserved:', item.name);
    }
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
