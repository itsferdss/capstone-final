<template>
  <main>
    <h1 class="bg-title">Enter Product's Information</h1>
    <div class="form-container">
      <div class="form-box">
        <form @submit.prevent="saveNewProduct">
          <div class="form-group">
            <label for="product_name">Product Name</label>
            <input type="text" v-model="editedItem.product_name" id="product_name" class="form-input" required />
          </div>
          <div class="form-group">
            <label for="supplier">Supplier</label>
            <input type="text" v-model="editedItem.supplier" id="supplier" class="form-input" required />
          </div>

          <div class="form-row">
            <div class="form-column">
              <div class="form-group">
                <label for="quantity">Quantity</label>
                <input type="number" v-model.number="editedItem.quantity" id="quantity" class="form-input" />
              </div>
              <div class="form-group">
                <label for="type">Type</label>
                <select v-model="editedItem.type" id="type" class="form-input" required>
                  <option value="" disabled>Select Type</option>
                  <option value="Frames">Frames</option>
                  <option value="Lens">Lens</option>
                  <option value="Contact Lenses">Contact Lenses</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>
            <div class="form-column">
              <div class="form-group">
                <label for="price">Price</label>
                <input type="number" step="0.01" v-model.number="editedItem.price" id="price" class="form-input"
                  required placeholder="Enter price" />
              </div>
              <div class="form-group">
                <label for="gender">For Who</label>
                <select v-model="editedItem.gender" id="gender" class="form-input" required>
                  <option value="" disabled>Select Gender</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="images">Product Images</label>
            <input type="file" id="images" class="form-input" multiple @change="handleImageUpload" />
          </div>
          <div class="form-group" v-if="showColorStock">
            <label for="colorStock">Color Stock</label>
            <div v-for="(colorStock, index) in editedItem.color_stock" :key="index" class="form-row">
              <input type="text" v-model="colorStock.color" placeholder="Color" class="form-input" required />
              <input type="number" v-model.number="colorStock.stock" @input="updateQuantity" placeholder="Stock"
                class="form-input" required />
              <button type="button" @click="removeColorStock(index)">Remove</button>
            </div>
            <button type="button" @click="addColorStock">Add Color Stock</button>
          </div>
          <hr />
          <div class="form-buttons">
            <v-btn type="submit" :style="{ backgroundColor: '#3EB489', color: 'white' }">
              Add Product
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
      editedItem: {
        product_image: '',
        product_id: '',
        product_name: '',
        supplier: '',
        quantity: 0,
        price: '',
        image: [],
        type: '',
        gender: '',
        color_stock: [{ color: '', stock: 0 }]
      },
    };
  },
  computed: {
    showColorStock() {
      return ['Frames'].includes(this.editedItem.type);
    }
  },
  methods: {
    addColorStock() {
      this.editedItem.color_stock.push({ color: '', stock: 0 });
    },
    removeColorStock(index) {
      this.editedItem.color_stock.splice(index, 1);
      this.updateQuantity(); 
    },
    updateQuantity() {
      const totalStock = this.editedItem.color_stock.reduce((sum, item) => sum + item.stock, 0);
      this.editedItem.quantity = totalStock;
    },
    handleImageUpload(event) {
      this.editedItem.images = Array.from(event.target.files);
    },
    saveNewProduct() {
      // Check if the quantity is 0 or less
      if (this.editedItem.quantity <= 0) {
        Swal.fire({
          title: 'Error',
          text: 'Quantity must be greater than 0.',
          icon: 'error',
        });
        return; // Prevent form submission
      }

      const formData = new FormData();
      formData.append('product_name', this.editedItem.product_name);
      formData.append('supplier', this.editedItem.supplier);
      formData.append('quantity', this.editedItem.quantity);
      formData.append('price', this.editedItem.price);
      formData.append('type', this.editedItem.type);
      formData.append('gender', this.editedItem.gender);
      formData.append('color_stock', JSON.stringify(this.editedItem.color_stock)); // Add color stock

      if (this.editedItem.images && this.editedItem.images.length > 0) {
        this.editedItem.images.forEach(image => {
          formData.append('product_images[]', image);
        });
      }

      axios.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          Swal.fire({
            title: 'Success!',
            text: 'Product saved successfully.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
          this.resetForm();
        })
        .catch(error => {
          console.error('Error saving product:', error);
          Swal.fire({
            title: 'Oops...',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
          });
        });
    },
    resetForm() {
      this.editedItem = {
        product_image: '',
        product_id: '',
        product_name: '',
        supplier: '',
        quantity: 0,
        price: '',
        image: [],
        type: '',
        gender: '',
        color_stock: [{ color: '', stock: 0 }]
      };
    },
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>


<style scoped>
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

select{
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
}

select:focus {
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
    padding:0rem;
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
