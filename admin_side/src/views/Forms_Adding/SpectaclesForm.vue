<template>
  <main>
    <h1 class="bg-title">Enter {{ patient.full_name }}'s Spectacles</h1>
    <div class="form-container">
      <div class="form-box">
        <form @submit.prevent="saveChildGlasses">
          <div class="input-box-container">
            <label for="prescription_date" class="presDate">Prescription Date:</label>
            <input type="date" v-model="prescriptionDate" id="prescription_date" class="date-input" />
          </div>

          <div class="input-box-container">
            <label for="due_date" class="presDate">Due Date:</label>
            <input type="date" v-model="dueDate" id="due_date" class="date-input" />
          </div>

          <div class="form-row">
            <div class="form-column">
              <!-- Frame Selection -->
              <div class="form-group">
                <label for="frame">Frame</label>
                <select v-model="editedItem.frame" id="frame" class="select" @change="updateFramePrice">
                  <option disabled value="">Select a frame</option>
                  <option v-for="frame in frames" :key="frame.id" :value="frame.id">
                    {{ frame.product_name }}
                  </option>
                  <option value="other">Other</option>
                </select>
                <span v-if="editedItem.frame && selectedFramePrice !== null" class="price-display">
                  Price:
                  <span v-if="editedItem.frame === 'other' && editedItem.customFramePrice !== null">
                    ₱{{ editedItem.customFramePrice }}
                  </span>
                  <span v-else-if="selectedFramePrice !== null">
                    ₱{{ selectedFramePrice }}
                  </span>
                </span>

                <span v-if="editedItem.frame && selectedFrameStock !== null" class="price-display">
                  Stock:
                  <span v-if="editedItem.frame === 'other'">
                    Custom Frame (No stock available)
                  </span>
                  <span v-else>
                    {{ selectedFrameStock }}
                  </span>
                </span>
              </div>

              <!-- Custom Frame -->
              <div v-if="editedItem.frame === 'other'" class="form-group">
                <div class="form-row">
                  <!-- Custom Frame Name -->
                  <div class="form-column">
                    <label for="customFrame">Enter Custom Frame</label>
                    <input v-model="editedItem.customFrame" id="customFrame" type="text"
                      placeholder="Type the frame name" class="form-control" required />
                  </div>

                  <!-- Custom Frame Price -->
                  <div class="form-column">
                    <label for="customFramePrice">Custom Frame Price</label>
                    <input v-model.number="editedItem.customFramePrice" id="customFramePrice" type="number"
                      placeholder="Enter price" class="form-control" step="0.01" />
                  </div>
                </div>
              </div>

              <!-- Lens Selection -->
              <div class="form-group">
                <label for="lens">Lens</label>
                <select v-model="editedItem.type_of_lens" id="lens" class="select" @change="updateLensPrice">
                  <option disabled value="">Select a lens</option>
                  <option v-for="lens in lenses" :key="lens.id" :value="lens.id">
                    {{ lens.product_name }}
                  </option>
                  <option value="other">Other</option>
                </select>
                <span v-if="editedItem.type_of_lens && selectedLensPrice !== null" class="price-display">
                  Price:
                  <span v-if="editedItem.type_of_lens === 'other' && editedItem.customLensPrice !== null">
                    ₱{{ editedItem.customLensPrice }}
                  </span>
                  <span v-else-if="selectedLensPrice !== null">
                    ₱{{ selectedLensPrice }}
                  </span>
                </span>

                <span v-if="editedItem.type_of_lens && selectedLensStock !== null" class="price-display">
                  Stock:
                  <span v-if="editedItem.type_of_lens === 'other'">
                    Custom Lens (No stock available)
                  </span>
                  <span v-else>
                    {{ selectedLensStock }}
                  </span>
                </span>
              </div>

              <!-- Custom Lens -->
              <div v-if="editedItem.type_of_lens === 'other'" class="form-group">
                <div class="form-row">
                  <!-- Custom Lens Name -->
                  <div class="form-column">
                    <label for="customLens">Enter Custom Lens</label>
                    <input v-model="editedItem.customLens" id="customLens" type="text" placeholder="Type the lens name"
                      class="form-control" required />
                  </div>

                  <!-- Custom Lens Price -->
                  <div class="form-column">
                    <label for="customLensPrice">Custom Lens Price</label>
                    <input v-model.number="editedItem.customLensPrice" id="customLensPrice" type="number"
                      placeholder="Enter price" class="form-control" step="0.01" />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <div class="form-row">
                  <div class="form-column">
                    <label for="initialPrice">Initial Price</label>
                    <input type="number" step="0.01" :value="initialPrice" id="initialPrice" class="form-input"
                      placeholder="Total price" readonly />
                  </div>

                  <div class="form-column">
                    <label for="discount">Discount (optional)</label>
                    <input type="number" step="0.01" v-model.number="editedItem.discount" id="discount"
                      class="form-input" placeholder="Enter discount" @input="updateTotal" />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="finalAmount">Total Amount</label>
                <input type="number" step="0.01" :value="finalAmount" id="finalAmount" class="form-input"
                  placeholder="Total amount" readonly />
              </div>



              <!-- Remarks -->
              <div class="form-group">
                <label for="remarks">Remarks</label>
                <input type="text" v-model="editedItem.remarks" id="remarks" class="form-input" />
              </div>


              <div class="form-group">
                <div class="form-row">
                  <div class="form-column">
                    <label for="partialPayment">Partial Payment</label>
                    <input type="number" step="0.01" v-model.number="partialPayment" id="partialPayment"
                      class="form-input" placeholder="Enter partial payment" />
                  </div>

                  <div class="form-column">
                    <label for="balance">Balance</label>
                    <input type="number" step="0.01" :value="calculatedBalance" id="balance" class="form-input"
                      placeholder="Calculated balance" readonly />
                  </div>
                </div>
              </div>

              <!-- Price and Balance -->


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

    const today = new Date().toISOString().split('T')[0]; 

    return {
      selectedLensStock: null,
      selectedFrameStock: null,
      selectedFramePrice: null,
      selectedLensPrice: null,
      prescriptionDate: today,
      dueDate: null,
      partialPayment: 0,
      editedItem: {
        frame: '', // Dropdown to select frame
        type_of_lens: '',
        remarks: '',
        patient_id: '',
        price: '',
        customLens: '',
        customFrame: '',
        balance: '',
        customFramePrice: 0,
        customLensPrice: 0,
        discount: 0
      },
      frames: [], // Array to store frames fetched from API
      lenses: [],
      patient: {},
    };  
  },
  computed: {
    initialPrice() {
      // Calculate the sum of selected frames and lenses
      return (
        parseFloat(this.selectedFramePrice) +
        parseFloat(this.selectedLensPrice) +
        parseFloat(this.editedItem.customFramePrice) +
        parseFloat(this.editedItem.customLensPrice)
      ).toFixed(2);
    },
    finalAmount() {
      // Deduct the discount from the initial price
      const discount = parseFloat(this.editedItem.discount) || 0;
      return (parseFloat(this.initialPrice) - discount).toFixed(2);
    },
    calculatedBalance() {
      const initialPrice = parseFloat(this.initialPrice?._value || this.initialPrice) || 0;
      const discount = parseFloat(this.editedItem?.discount) || 0;
      const finalAmount = initialPrice - discount;
      const partialPayment = parseFloat(this.partialPayment) || 0;
      return finalAmount - partialPayment;
    },
  },
  methods: {
    fetchPatient() {
      const patientId = this.$route.query.patient_id;
      axios.get(`patients/${patientId}`)
        .then(response => {
          this.patient = response.data;
        })
        .catch(error => {
          console.error('Error fetching patient:', error);
        });
    },
    saveChildGlasses() {
      if (!this.editedItem) {
        console.error('Error: No glasses information available');
        return;
      }

      const patientId = this.$route.query.patient_id;

      // Check if the frame stock or lens stock is zero or less
      if (this.selectedFrameStock <= 0) {
        Swal.fire({
          title: 'Out of Stock',
          text: 'The selected frame has no stock. Please restock or change the product.',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
        return; // Prevent saving
      }

      if (this.selectedLensStock <= 0) {
        Swal.fire({
          title: 'Out of Stock',
          text: 'The selected lens has no stock. Please restock or change the product.',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
        return; // Prevent saving
      }

      // Parse initial price and discount as numbers
      const initialPrice = parseFloat(this.initialPrice?._value || this.initialPrice) || 0;
      const discount = parseFloat(this.editedItem.discount) || 0;
      const finalAmount = initialPrice - discount;

      const partialPayment = parseFloat(this.partialPayment) || 0;
      const balance = finalAmount - partialPayment;

      if (balance > 0 && !this.dueDate) {
        Swal.fire({
          title: 'Missing Due Date',
          text: 'There is an outstanding balance. Please assign a due date.',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
        return;
      }

      const glassesData = {
        patient_id: patientId,
        frame: this.editedItem.frame,
        product_id: this.editedItem.frame,
        type_of_lens: this.editedItem.type_of_lens,
        lens_id: this.editedItem.type_of_lens,
        remarks: this.editedItem.remarks,
        price: finalAmount,
        balance: balance,
        customLens: this.editedItem.customLens,
        customLensPrice: this.editedItem.customLensPrice,
        customFrame: this.editedItem.customFrame,
        customFramePrice: this.editedItem.customFramePrice,
        date: this.prescriptionDate,
        due_date: this.dueDate,
        discount: discount,
        initial_price: initialPrice,
        partial_payment: partialPayment,
      };

      console.log(glassesData);

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
    async updateFramePrice() {
      const selectedFrameId = this.editedItem.frame;

      if (selectedFrameId && this.frames.length > 0) {
        const selectedFrame = this.frames.find(frame => frame.id === selectedFrameId);

        if (selectedFrame) {
          this.selectedFramePrice = selectedFrame.price;
          this.selectedFrameStock = selectedFrame.quantity;  // Display the stock quantity
        }
      } else {
        this.selectedFramePrice = null;
        this.selectedFrameStock = null;
      }
    },
    async updateLensPrice() {
      const selectedLensId = this.editedItem.type_of_lens;
      const selectedLens = this.lenses.find(lens => lens.id === selectedLensId);

      if (selectedLens) {
        this.selectedLensPrice = selectedLens.price;
        this.selectedLensStock = selectedLens.quantity;  // Update stock info
      }
    },
    updateTotal() {
      // Updates the final amount whenever a discount is applied
      console.log('Discount applied:', this.editedItem.discount);
    },
    resetForm() {
      this.editedItem = {
        frame: '',
        type_of_lens: '',
        remarks: '',
        patient_id: '',
        price: '',
        balance: '',
      };
    },
    
    goBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.fetchProducts();
    this.fetchLens();
    this.fetchPatient();
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

.input-box-container{
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.presDate{
  margin-top: 10px;
  margin-right: 10px;
}

.price-display {
  font-weight: bold;
  color: #4CAF50;
  margin-left: 10px;
}
</style>
