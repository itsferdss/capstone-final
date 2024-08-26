<template>
  <div>
    <!-- HEADER -->
    <v-toolbar flat>
      <v-toolbar-title class="headers">
        <v-icon class="mr-2">mdi-package-variant-closed</v-icon> Products
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- SEARCH BAR -->
      <v-text-field
        v-model="search"
        class="search-bar w-auto mr-4"
        density="compact"
        label="Search Products"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
        style="max-width: 300px;"
      ></v-text-field>
      <!-- RESERVATION BUTTON -->
      <v-btn @click="showReservations" class="reservation-btn" elevation="2">
        <v-icon class="icon" left>mdi-information-outline</v-icon>
        <span class="reservation-text">See your Reservations</span>
      </v-btn>
    </v-toolbar>

    <!-- PRODUCT CARDS -->
    <v-row >
      <v-col class="productBox" v-for="product in products" :key="product.id" cols="6" sm="6" md="4" lg="3">
        <v-card  elevation="2" >
          <img :src="getProductImageUrl(product.image)" alt="Product Image" class="productPic">
          <v-card-title class="product-name">{{ product.product_name }}</v-card-title>
          <v-card-text class="product-description">Stock: {{ product.quantity }}</v-card-text>
          <v-card-actions class="product-price">
            <v-btn color="primary" @click="reserve(product)">Reserve</v-btn>
            <div class="flex-grow-1"></div>
            <span class="caption">₱{{ product.price }}</span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- RESERVATIONS DIALOG -->
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title class="headline">Your Reservations</v-card-title>
        <v-card-text>
          <v-data-table
            :headers="reservationHeaders"
            :items="reservations"
            item-key="id"
            class="elevation-1"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.product.product_name }}</td>
                <td>{{ formatCreatedDate(item.created_at) }}</td>
                <td>₱{{ item.product.price }}</td>
                <td :class="getStatusClass(item.status)">{{ displayStatus(item.status) }}</td>
                <td>
                  <v-btn v-if="showCancelButton(item.status)" @click="cancelReservation(item.id)" class="cancel-btn" elevation="2">
                    <span class="reservation-text">Cancel</span>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/dist/sweetalert2.css';

export default {
  data() {
    return {
      search: '',
      dialog: false,
      reservations: [],
      products: [],
      reservationHeaders: [
        { title: 'Product Name', value: 'product.product_name' },
        { title: 'Reservation Date', value: 'created_at' },
        { title: 'Price', value: 'product.price' },
        { title: 'Status', value: 'status' },
        { title: '', value: 'actions', sortable: false },
      ],
    };
  },

  computed: {
    ...mapState({
      patientId: state => state.patientId || localStorage.getItem('patientId'),
    }),
  },

  mounted() {
    if (this.patientId) {
      console.log('ID:', this.patientId);
      this.fetchProducts();
    } else {
      console.error('Patient ID is not available.');
    }
  },

  methods: {
    fetchProducts() {
      axios.get('/products')
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

    showReservations() {
      this.fetchReservations();
      this.dialog = true;
    },

    fetchReservations() {
      if (!this.patientId) {
        console.error('User ID not available.');
        return;
      }

      axios.get(`/reservations/${this.patientId}`)
        .then(response => {
          this.reservations = response.data;
        })
        .catch(error => {
          console.error('Error fetching reservations:', error);
        });
    },

    formatCreatedDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, options);
    },

    showCancelButton(status) {
      const statusesToHide = ['accepted', 'declined', 'picked_up'];
      return !statusesToHide.includes(status);
    },

    cancelReservation(reservationId) {
      this.dialog = false; // Close the dialog before showing the confirmation
      Swal.fire({
        title: 'Are you sure?',
        text: "Do you really want to cancel the reservation?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, cancel it!',
        cancelButtonText: 'No, go back'
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`/reservations/${reservationId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('auth_token')}`
            }
          })
          .then(response => {
            this.fetchReservations();
            Swal.fire(
              'Cancelled!',
              'Your reservation has been cancelled.',
              'success'
            );
          })
          .catch(error => {
            console.error('Error cancelling reservation:', error);
            Swal.fire(
              'Error!',
              'Failed to cancel reservation.',
              'error'
            );
          });
        } else {
          this.dialog = true; // Reopen the dialog if the user chooses not to cancel
        }
      });
    },

    getStatusClass(status) {
      switch (status.toLowerCase()) {
        case 'pending':
          return 'status-pending';
        case 'accepted':
          return 'status-accepted';
        case 'declined':
          return 'status-declined';
        case 'picked_up':
          return 'status-picked-up';
        default:
          return '';
      }
    },

    displayStatus(status) {
      switch (status.toLowerCase()) {
        case 'picked_up':
          return 'PICKED UP';
        default:
          return status.toUpperCase();
      }
    },
  },
};
</script>

<style>
.v-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Ensures content is spaced properly */
}
/* 
.v-card:hover {
  background-color: #f0f0f0; 
} */

.headers {
  font-weight: bold;
}

.productPic {
  height: 280px;
  object-fit: cover;
}

.reservation-btn {
  background-color: #B3D9E6 !important;
  color: white !important;
  font-weight: bold !important;
}

.reservation-text {
  font-weight: bold;
  color: black !important;
}

.reservation-btn .v-icon {
  margin-right: 8px; /* Add spacing between icon and text */
  color: black;
}

.cancel-btn {
  background-color: rgb(209, 19, 19) !important;
  color: white !important;
  font-weight: bold !important;
}

.status-pending {
  color: blue;
  text-transform: uppercase;
}

.status-accepted {
  color: green;
  text-transform: uppercase;
}

.status-declined {
  color: red;
  text-transform: uppercase;
}

.status-picked-up {
  color: rgb(162, 154, 4);
  text-transform: uppercase;
}

.product-name {
  overflow-wrap: break-word; /* Ensures long text wraps to the next line */
  word-wrap: break-word;
  hyphens: auto; /* Adjust card title font size */
}
@media (max-width: 960px) {
  .product-name {
    overflow-wrap: break-word; /* Ensures long text wraps to the next line */
    word-wrap: break-word;
    hyphens: auto; /* Adjust card title font size */
  }
  .headers {
    display: none;
  }

  .search-bar {
    max-width: 100%; /* Make search bar full width on small screens */
    margin-left: -80px;
  }

  .productPic {
    height: 100px; /* Adjust image height on small screens */
  }

  .v-card {
    margin-bottom: 16px; /* Add space between cards */
  }
  
  .reservation-btn {
    font-size: 0.8rem; /* Adjust button font size */
  }
  
  .reservation-text {
    display: none;
  }
  .product-description{
    font-size: 1px;
  }
  .product-name {
   font-size: 1rem;
  }
  
  .v-card-text {
    font-size: 0.9rem; /* Adjust card text size */
  }
  .productBox{
    margin-top: 10px;
    max-height: 400px;
    flex: 1 1 48%; /* Two items per row on mobile screens with some space in between */
    width: 50%;
  }
}
</style>
