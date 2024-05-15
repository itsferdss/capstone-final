<template>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="dataHolder.Products"  
    :sort-by="[{ key: 'product_id', order: 'asc' }]"
    class="four-in-one-column"
  >
    <!-- SEARCH BAR -->
    <template v-slot:top>
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
    </template>

    <!-- PRODUCT CARD -->
    <template v-slot:item="{ item }">
      <v-col cols="3"> <!-- Adjust the width according to your preference -->
        <v-card class="v-card" elevation="2">
          <v-img :src="item.image" aspect-ratio="16/9"></v-img>
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-text>{{ item.description }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="reserve(item)">Reserve</v-btn>
            <div class="flex-grow-1"></div> <!-- This creates space between button and price -->
            <span class="caption">{{ item.price }}</span>
          </v-card-actions>
        </v-card>
      </v-col>
    </template>

  </v-data-table>
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
            image: './assets/product1.jpg'
          },
          { 
            product_id: 2,
            name: 'Product 2',
            description: 'Description for Product 2',
            price: '$200',
            image: './assets/product2.jpg'
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
.v-card:hover {
  background-color: #f0f0f0; /* Set the hover color here */
}

.headers {
  font-weight: bold;
}

.four-in-one-column {
  display: flex;
  flex-wrap: wrap;
}
</style>
