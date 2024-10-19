<template>
  <main>
    <h1 class="bg-title">Enter Reservation Information</h1>
    <div class="form-container">
      <div class="form-box">
        <form @submit.prevent="saveNewUser">
          <div class="form-group">
            <label for="patient">Patient Name</label>
            <input type="text" v-model="search" @input="filterPatients" @focus="showSuggestions = true"
              class="form-input" required placeholder="Type to search for a patient..." />
            <ul v-if="filteredPatients.length > 0" class="suggestions">
              <li v-for="patient in filteredPatients" :key="patient.id" @click="selectPatient(patient)">
                {{ patient.full_name }}
              </li>
            </ul>
          </div>
          <div class="form-group">
            <label for="product">Product Name</label>
            <input type="text" v-model="searchProduct" @input="filterProducts" class="form-input" required
              placeholder="Type to search for a product..." />
            <ul v-if="filteredProducts.length > 0" class="suggestions">
              <li v-for="product in filteredProducts" :key="product.id" @click="selectProduct(product)">
                {{ product.product_name }}
              </li>
            </ul>
          </div>
          <div class="form-row">
            <div class="form-column">
              <div class="form-group">
                <label for="quantity">Quantity</label>
                <input type="number" v-model="editedItem.quantity" id="quantity" class="form-input" required />
              </div>
              <div class="form-group">
                <label for="date">Date</label>
                <input type="date" v-model="editedItem.created_at" id="date" class="form-input" required />
              </div>
            </div>
            <div class="form-column">
              <div class="form-group">
                <label for="color">Color</label>
                <select v-model="editedItem.color" id="color" class="form-input" required>
                  <option v-for="color in parsedColorStock" :key="color.color" :value="color.color">
                    {{ color.color }} (Stock: {{ color.stock }})
                  </option>
                </select>
              </div>
            </div>
          </div>
          <hr />
          <div class="form-buttons">
            <v-btn type="submit" :style="{ backgroundColor: '#3EB489', color: 'white' }" @click="addReservation">
              Add Reservation
            </v-btn>
            <v-btn class="close" type="button" :style="{ backgroundColor: '#A82946', color: 'white' }" @click="goBack">
              Back
            </v-btn>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';

export default {
  data() {
    return {
      selectedPatient: null,
      filteredProducts: [],
      patients: [],
      filteredPatients: [],
      products: [],
      searchProduct: '',
      selectedProduct: null,
      search: '',
      parsedColorStock: [],
      editedItem: {
        product_name: '',
        product_id: '',
        quantity: '',
        created_at: '',
        color: '',
      },
    };
  },
  mounted() {
    this.fetchPatients();
    this.fetchProducts();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    fetchProducts() {
      axios.get('/products')
        .then((response) => {
          this.products = response.data;
          this.filteredProducts = response.data;
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
        });
    },
    filterProducts() {
      if (!this.products) return;
      this.filteredProducts = this.products.filter(product =>
        product.product_name.toLowerCase().includes(this.searchProduct.toLowerCase())
      );
    },
    selectProduct(product) {
      this.selectedProduct = product;
      this.searchProduct = product.product_name;
      this.editedItem.product_id = product.id; // Set the product ID
      this.filteredProducts = [];
      this.editedItem.color = '';

      // Parse the color_stock JSON string
      try {
        this.parsedColorStock = JSON.parse(product.color_stock);
      } catch (error) {
        console.error('Error parsing color_stock:', error);
        this.parsedColorStock = [];
      }
    },
    fetchPatients() {
      axios.get('/patients')
        .then((response) => {
          this.patients = response.data;
          this.filteredPatients = response.data;
        })
        .catch((error) => {
          console.error('Error fetching patients:', error);
        });
    },
    filterPatients() {
      if (!this.patients) return;
      this.filteredPatients = this.patients.filter(patient =>
        patient.full_name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
    selectPatient(patient) {
      this.selectedPatient = patient;
      this.search = patient.full_name;
      this.filteredPatients = [];
    },
    addReservation() {
      if (!this.selectedPatient) {
        Swal.fire('Error', 'Please select a patient.', 'error');
        return;
      }

      const reservationData = {
        user_id: this.selectedPatient.id,
        product_id: this.editedItem.product_id,
        quantity: this.editedItem.quantity,
        product_name: this.editedItem.product_name,
        // created_at: this.editedItem.created_at,
        color: this.editedItem.color,
      };

      axios.post('/adminReserve', reservationData)
        .then(response => {
          Swal.fire('Success', 'Reservation added successfully!', 'success');
        })
        .catch(error => {
          Swal.fire('Error', 'Failed to add reservation: ' + error.message, 'error');
        });
    },
  },
};
</script>
<style scoped>
.form-input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  /* Adjust border color */
  border-radius: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
}

.form-input:focus {
  border-color: #3EB489;
  /* Change border color on focus */
  outline: none;
  box-shadow: 0 0 8px rgba(62, 180, 137, 0.5);
}

.bg-title {
  background-color: #f0f4f7;
  padding: 1rem;
  text-align: center;
  color: #333;
  font-size: 1.75rem;
  font-weight: bold;
  border-bottom: 2px solid #e0e0e0;
}

.form-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.form-box {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 800px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.form-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
}

input:focus {
  border-color: #3EB489;
  outline: none;
  box-shadow: 0 0 8px rgba(62, 180, 137, 0.5);
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.v-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.v-btn:hover {
  transform: translateY(-2px);
}

.close {
  background-color: #A82946;
  color: #fff;
}

.close:hover {
  background-color: #93222b;
}

.select {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
}

.suggestions {
  border: 1px solid #ccc;
  max-height: 150px;
  overflow-y: auto;
  position: absolute;
  background: white;
  z-index: 1000;
  margin-top: 5rem;
  /* Add some spacing above */
  border-radius: 4px;
  /* Rounded corners */
}

.suggestions li {
  padding: 0.75rem;
  /* Add padding for better touch target */
  cursor: pointer;
  /* Change cursor to pointer */
  transition: background-color 0.2s;
  /* Smooth background transition */
}

.suggestions li:hover {
  background-color: #f0f0f0;
  /* Highlight on hover */
}

.select:focus {
  border-color: #3EB489;
  outline: none;
  box-shadow: 0 0 8px rgba(62, 180, 137, 0.5);
}

/* Media queries for smaller devices */

@media (max-width: 768px) {
  .form-box {
    padding: 1rem;
    max-width: 100%;
  }

  .form-row {
    flex-direction: column;
    gap: 0.5rem;
  }

  .v-btn {
    padding: 0.5rem 1rem;
    width: 100%;
  }

  .form-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .bg-title {
    font-size: 1.25rem;
    padding: 0.5rem;
  }

  .form-container {
    padding: 1rem;
  }

  input {
    font-size: 0.875rem;
    padding: 0.5rem;
  }

  .form-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
