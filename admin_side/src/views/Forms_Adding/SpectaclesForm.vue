<template>
  <main>
    <h1 class="bg-title">Enter Patient's Spectacles</h1>
    <div class="form-container">
      <div class="form-box">
        <!-- Update form to call correct method -->
        <form @submit.prevent="saveChildGlasses">
          <div class="form-row">
            <div class="form-column">
              <div class="form-group">
                <label for="frame">Frame</label>
                <select v-model="editedItem.frame" id="frame" class="select" required>
                  <option disabled value="">Select a frame</option>
                  <option v-for="frame in frames" :key="frame.id" :value="frame.id">
                    {{ frame.product_name }}
                  </option>
                  <option value="other">Other</option> <!-- Option for custom input -->
                </select>
              </div>

              <!-- Conditionally render input field when "Other" is selected -->
              <div v-if="editedItem.frame === 'other'" class="form-group">
                <label for="customFrame">Enter custom frame</label>
                <input v-model="editedItem.customFrame" id="customFrame" type="text" placeholder="Type the frame here"
                  class="form-control" required />
              </div>

              <div class="form-group">
                <label for="lens">Lens</label>
                <select v-model="editedItem.type_of_lens" id="lens" class="select" required>
                  <option disabled value="">Select a lens</option>
                  <option v-for="lens in lenses" :key="lens.id" :value="lens.id">
                    {{ lens.product_name }}
                  </option>
                  <option value="other">Other</option> <!-- Option for custom input -->
                </select>
              </div>

              <!-- Conditionally render input field when "Other" is selected -->
              <div v-if="editedItem.type_of_lens === 'other'" class="form-group">
                <label for="customLens">Enter custom lens</label>
                <input v-model="editedItem.customLens" id="customLens" type="text" placeholder="Type the lens here"
                  class="form-control" required />
              </div>

              <div class="form-group">
                <label for="remarks">Remarks</label>
                <input type="text" v-model="editedItem.remarks" id="remarks" class="form-input" required />
              </div>
              <div class="form-group">
                <label for="price">Price</label>
                <input type="number" step="0.01" v-model.number="editedItem.price" id="price" class="form-input"
                  required placeholder="Enter price" />
              </div>
            </div>
          </div>
          <hr />
          <div class="form-buttons">
            <v-btn type="submit" :style="{ backgroundColor: '#3EB489', color: 'white' }">
              Add Spectacles
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
        frame: '', // Dropdown to select frame
        type_of_lens: '',
        remarks: '',
        patient_id: '',
        price: '',
        customLens: '',
        customFrame: '',
      },
      frames: [], // Array to store frames fetched from API
      lenses: [],
    };  
  },
  methods: {
    saveChildGlasses() {
      if (!this.editedItem) {
        console.error('Error: No glasses information available');
        return;
      }

      const patientId = this.$route.query.patient_id;

      const glassesData = {
        patient_id: patientId,
        frame: this.editedItem.frame,
        product_id: this.editedItem.frame,
        type_of_lens: this.editedItem.type_of_lens,
        lens_id: this.editedItem.type_of_lens,
        remarks: this.editedItem.remarks,
        price: this.editedItem.price,
        customLens: this.editedItem.customLens,
        customFrame: this.editedItem.customFrame,
      };

      axios.post(`/patients/${patientId}/glasses`, glassesData)
        .then((response) => {
          console.log('Glasses information saved successfully:', response.data);

          Swal.fire({
            title: 'Success',
            text: 'Glasses information saved successfully! Also reduced stocks.',
            icon: 'success',
            confirmButtonText: 'OK',
          });

          this.childGlassesDialog = false;
        })
        .catch((error) => {
          console.error('Error saving glasses information:', error);

          Swal.fire({
            title: 'Error',
            text: 'Failed to save glasses information. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        });
    },
    fetchProducts() {
      axios.get('/products')
        .then((response) => {
          if (Array.isArray(response.data)) {
            // Filter products to get only frames
            this.frames = response.data.filter((product) => product.type === 'Frames');
          } else {
            this.error = 'Unexpected response format';
          }
        })
        .catch((error) => {
          this.error = 'Error fetching products: ' + error.message;
        });
    },
    fetchLens() {
      axios.get('/products')
        .then(response => {
          if (Array.isArray(response.data)) {
            // Filter products where type is 'Frames'
            this.lenses = response.data.filter((product) => product.type === 'Lens');
          } else {
            this.error = 'Unexpected response format';
          }
        })
        .catch(error => {
          this.error = 'Error fetching products: ' + error.message;
        });
    },
    resetForm() {
      this.editedItem = {
        frame: '',
        type_of_lens: '',
        remarks: '',
        patient_id: '',
        price: '',
      };
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.fetchProducts();
    this.fetchLens();
  },
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

.select{
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
}
.select:focus {
  border-color: #3EB489;
  outline: none;
  box-shadow: 0 0 8px rgba(62, 180, 137, 0.5);
}
</style>
