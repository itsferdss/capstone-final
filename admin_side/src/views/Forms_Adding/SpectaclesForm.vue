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
                  <span v-if="editedItem.type_of_lens === 'other'">
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

  <v-dialog v-model="showReceiptModal" max-width="600px">
    <v-card>
      <v-card-title class="receipt_title">
        <h2>Receipt Details</h2>
      </v-card-title>

      <v-card-text>
        <!-- Receipt Content to be Printed -->
        <div ref="printableArea">
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-card outlined class="printable pa-4">
                  <p><strong>Patient Name:</strong> {{ receiptDetails.patientName }}</p>
                  <p><strong>Order Date:</strong> {{ receiptDetails.orderDate }}</p>
                  <p><strong>Frame:</strong>
                    {{ receiptDetails.productId === 'other' ? receiptDetails.customFrame : receiptDetails.productId }}
                  </p>
                  <p><strong>Lens:</strong>
                    {{ receiptDetails.type_of_lens === 'other' ? receiptDetails.customLens : receiptDetails.type_of_lens
                    }}
                  </p>
                  <p><strong>Original Price:</strong> ₱{{ receiptDetails.originalPrice }}</p>
                  <p><strong>Discount:</strong> ₱{{ receiptDetails.discount }}</p>
                  <p><strong>Discounted Price:</strong> ₱{{ receiptDetails.discountedPrice }}</p>
                  <p><strong>Amount Received:</strong> ₱{{ receiptDetails.amountReceived }}</p>
                  <p><strong>Balance:</strong> ₱{{ receiptDetails.balance }}</p>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>

      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="printReceipt" class="ma-2" large>Print</v-btn>
        <v-btn color="grey" @click="showReceiptModal = false" class="ma-2" large>Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


</template>




<script>
import Swal from 'sweetalert2';
import axios from 'axios';

export default {
  data() {

    const today = new Date().toISOString().split('T')[0]; 

    return {
      showReceiptModal: false,
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
      receiptDetails: {
        patientName: '',
        orderDate: '',
        productName: '',
        productId: '',
        originalPrice: 0,
        discount: 0,
        discountedPrice: 0,
        amountReceived: 0,
        balance: 0,
        type_of_lens: '',
        frame: ''
      },
      frames: [], // Array to store frames fetched from API
      lenses: [],
      patient: {},
    };  
  },
  computed: {
    initialPrice() {
      let framePrice = 0;
      let lensPrice = 0;

      // Use custom frame price if provided, otherwise use the selected frame price
      if (this.editedItem.customFramePrice) {
        framePrice = parseFloat(this.editedItem.customFramePrice);
      } else if (this.selectedFramePrice) {
        framePrice = parseFloat(this.selectedFramePrice);
      }

      // Use custom lens price if provided, otherwise use the selected lens price
      if (this.editedItem.customLensPrice) {
        lensPrice = parseFloat(this.editedItem.customLensPrice);
      } else if (this.selectedLensPrice) {
        lensPrice = parseFloat(this.selectedLensPrice);
      }

      // Calculate and return the total price
      return (framePrice + lensPrice).toFixed(2);
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

      // Find the selected frame to check its stock
      const selectedFrame = this.frames.find(frame => frame.id === this.editedItem.frame);

      

      // Check if the stock is available
      if (selectedFrame && selectedFrame.quantity <= 0) {
        Swal.fire({
          title: 'No Stock Available',
          text: 'The selected frame is out of stock. Please choose another frame.',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
        return; // Stop execution if no stock is available
      }

      const selectedLens = this.lenses.find(lens => lens.id === this.editedItem.type_of_lens);
      if (selectedLens && selectedLens.quantity <= 0) {
        Swal.fire({
          title: 'No Stock Available',
          text: 'The selected lens is out of stock. Please choose another frame.',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
        return; // Stop execution if no stock is available
      }

      if (this.calculatedBalance > 0 && !this.dueDate) {
        Swal.fire({
          title: 'Missing Due Date',
          text: 'There is an outstanding balance. Please assign a due date.',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
        return;
      }

      const patientId = this.$route.query.patient_id;

      // Prepare the data to save
      const dataToSave = {
        patient_id: patientId,
        customFrame: this.editedItem.customFrame,
        frame: this.editedItem.frame,
        type_of_lens: this.editedItem.type_of_lens,
        customLens: this.editedItem.customLens,
        date: this.prescriptionDate,
        due_date: this.dueDate,
        discount: this.editedItem.discount,
        partial_payment: this.partialPayment,
        remarks: this.editedItem.remarks,
        balance: this.calculatedBalance,
        initial_price: this.initialPrice,
        price: this.finalAmount,
        custom_lens_price: this.editedItem.customLensPrice,
        custom_frame_price: this.editedItem.customFramePrice,
        product_id: this.editedItem.frame,
        lens_id: this.editedItem.type_of_lens,
      };

      axios.post(`/patients/${patientId}/glasses`, dataToSave)
        .then(response => {
          Swal.fire({
            title: 'Success',
            text: 'Glass information saved successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            // Populate receipt data
            this.showReceiptModal = true;
            this.receiptDetails = {
              patientName: this.patient.full_name,
              orderDate: this.prescriptionDate,
              productName: this.editedItem.customFrame,
              type_of_lens: this.editedItem.type_of_lens,
              productId: this.editedItem.frame,
              originalPrice: this.initialPrice,
              discount: this.editedItem.discount,
              discountedPrice: this.finalAmount,
              amountReceived: this.partialPayment,
              balance: this.calculatedBalance,
              customLens: this.editedItem.customLens,
              customFrame: this.editedItem.customFrame,
            };
            console.log(this.receiptDetails);
          });
        })
        .catch(error => {
          console.error('Error saving glasses:', error);
          Swal.fire({
            title: 'Error',
            text: 'There was an issue saving the glasses information.',
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
    updateFramePrice() {
      const selectedFrame = this.frames.find(frame => frame.id === this.editedItem.frame);
      if (selectedFrame) {
        this.selectedFramePrice = selectedFrame.price;
        this.selectedFrameStock = selectedFrame.quantity;
        console.log('Frame Stock:', this.selectedFrameStock);
      } else {
        this.selectedFramePrice = null;
        this.selectedFrameStock = null;
      }
    },

    updateLensPrice() {
      const selectedLens = this.lenses.find(lens => lens.id === this.editedItem.type_of_lens);
      if (selectedLens) {
        this.selectedLensPrice = selectedLens.price;
        this.selectedLensStock = selectedLens.quantity;
        console.log('Lens Stock:', this.selectedLensStock);
      } else {
        this.selectedLensPrice = null;
        this.selectedLensStock = null;
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
    printReceipt() {
      const printContent = this.$refs.printableArea;
      const printWindow = window.open("", "_blank");

      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              .logo { max-width: 100px; display: block; margin: 0 auto 10px; }
              h2 { text-align: center; margin-bottom: 20px; }
              .receipt-details { max-width: 400px; margin: 0 auto; }
              p { margin: 5px 0; }
              strong { font-weight: bold; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.print();
    }
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


.receipt_title {
  text-align: center;
  font-weight: bold;
  color: #1976D2;
  margin-top: 20px;
  margin-bottom: 0px;
}

.v-card {
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.v-btn {
  font-weight: bold;
}

.v-card p {
  font-size: 16px;
  line-height: 1.6;
}

.printable{
  width: 480px;
}
</style>
