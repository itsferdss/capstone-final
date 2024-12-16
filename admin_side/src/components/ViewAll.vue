<template>
    <div class="form-container">
        <h1 class="title">Patient Information Form</h1>
        <form @submit.prevent="submitForm">
            <!-- Full Name -->
            <div class="form-row">
                <div class="form-group">
                    <label for="customer">Name *</label>
                    <input type="text" id="customer" v-model="patient.full_name" placeholder="First Name Last Name"
                        disabled />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="patient.email" placeholder="ex: myname@example.com"
                        disabled />
                </div>
            </div>

            <!-- Birth Date -->
            <div class="form-row">
                <label for="birthDate">Birth Date *</label>
                <input type="date" id="birthDate" :value="patient.birthdate" disabled />
            </div>

            <!-- Age Display -->
            <div class="form-row" v-if="patient.birthdate">
                <label for="age">Age</label>
                <input type="text" id="age" :value="age()" disabled />
            </div>

            <!-- Address -->
            <div class="form-group">
                <label for="address">Address *</label>
                <input type="text" id="address" v-model="patient.address" placeholder="Complete Address" disabled />
            </div>

            <!-- Contact Number -->
            <div class="form-group">
                <label for="contact">Contact Number *</label>
                <input type="tel" id="contact" v-model="patient.contact" placeholder="e.g., +1234567890"
                    pattern="[\+]?[0-9]{10,15}" />
            </div>

            <!-- Prescription Section -->
            <div class="form-container-group">
                <h3>Prescriptions</h3>
                <p v-if="form.prescription.date">Date: {{ form.prescription.date }}</p>

                <table class="prescription-table" v-if="form.prescription.date">
                    <thead>
                        <tr>
                            <th>Eye</th>
                            <th>Sphere (SPH)</th>
                            <th>Cylinder (CYL)</th>
                            <th>Axis</th>
                            <th>Best VA</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>OD</td>
                            <td><input type="text" v-model="form.prescription.rightSphere" placeholder="SPH" disabled />
                            </td>
                            <td><input type="text" v-model="form.prescription.rightCylinder" placeholder="CYL"
                                    disabled /></td>
                            <td><input type="text" v-model="form.prescription.rightAxis" placeholder="Axis" disabled />
                            </td>
                            <td><input type="text" v-model="form.prescription.rightVA" placeholder="Best VA" disabled />
                            </td>
                        </tr>
                        <tr>
                            <td>OS</td>
                            <td><input type="text" v-model="form.prescription.leftSphere" placeholder="SPH" disabled />
                            </td>
                            <td><input type="text" v-model="form.prescription.leftCylinder" placeholder="CYL"
                                    disabled /></td>
                            <td><input type="text" v-model="form.prescription.leftAxis" placeholder="Axis" disabled />
                            </td>
                            <td><input type="text" v-model="form.prescription.leftVA" placeholder="Best VA" disabled />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><input type="text" v-model="form.prescription.ReadingAd" placeholder="ReadingAd"
                                    disabled /></td>
                            <td></td>
                            <td><input type="text" v-model="form.prescription.pd" placeholder="PD" disabled /></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

                <!-- Pagination Buttons -->
                <div class="pagination-controls" v-if="form.prescription.date">
                    <button @click="prevPage" :disabled="currentIndex === 0">
                        <v-icon>mdi-chevron-left</v-icon>
                    </button>

                    <span>Page {{ currentIndex + 1 }} of {{ totalPages }}</span>

                    <button @click="nextPage" :disabled="currentIndex >= totalPages - 1">
                        <v-icon>mdi-chevron-right</v-icon>
                    </button>
                </div>

                <p v-else>No prescription available.</p>
            </div>



            <!-- Spectacles Section -->
            <div class="form-container-group">
                <h3>Spectacles Preferences</h3>
                <p v-if="form.date">Date: {{ form.date }}</p>

                <div v-if="form.frame">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="frame">Frame</label>
                            <!-- Dynamically replace the value based on conditions -->
                            <input type="text" id="frame" :value="getFrameDisplayValue" placeholder="Frame" disabled />
                        </div>

                        <div class="form-group">
                            <label for="lens">Lens</label>
                            <!-- Dynamically replace the value based on conditions -->
                            <input type="text" id="lens" :value="getLensDisplayValue" placeholder="Lens" disabled />
                        </div>

                    </div>
                </div>

                <p v-else>No spectacles preferences available.</p>

                <!-- Pagination Controls -->
                <div class="pagination-controls" v-if="selectedUserGlasses.length > 0">
                    <button @click="prevPageGlass" :disabled="currentIndexGlasses === 0">
                        <v-icon>mdi-chevron-left</v-icon>
                    </button>

                    <span>Page {{ currentIndexGlasses + 1 }} of {{ totalPagesGlasses }}</span>

                    <button @click="nextPageGlass" :disabled="currentIndexGlasses >= totalPagesGlasses - 1">
                        <v-icon>mdi-chevron-right</v-icon>
                    </button>
                </div>
            </div>




            <!-- Medical History -->
            <div class="form-container-group">
                <h3>Medical Records</h3>
                <p v-if="form.historyDate">Date: {{ form.historyDate }}</p>
                <div class="form-row" v-if="form.historyDate">
                    <div class="form-group">
                        <label for="rightEye">Ocular</label>
                        <input type="text" id="rightEye" v-model="form.Ocular" placeholder="Ocular History" disabled />
                    </div>
                    <div class="form-group">
                        <label for="MedicalHistory">Medical History</label>
                        <input type="text" id="MedicalHistory" v-model="form.Medical" placeholder="Medical History"
                            disabled />
                    </div>
                </div>

                <div class="pagination-controls" v-if="selectedUserHistory.length > 0">
                    <button @click="prevPageHistory" :disabled="currentIndexHistory === 0">
                        <v-icon>mdi-chevron-left</v-icon>
                    </button>

                    <span>Page {{ currentIndexHistory + 1 }} of {{ totalPagesHistory }}</span>

                    <button @click="nextPageHistory" :disabled="currentIndexHistory >= totalPagesHistory - 1">
                        <v-icon>mdi-chevron-right</v-icon>
                    </button>
                </div>

                <p v-else>No spectacles preferences available.</p>
            </div>



            <!-- Submit Button -->
            <img src="../assets/MVC_logo.png" alt="Submit Logo" class="submit-logo" />
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
        prescriptions: [], 
        selectedUserGlasses: [],
        selectedUserHistory: [],
        currentIndex: 0,   
        currentIndexGlasses: 0,
        currentIndexHistory: 0,
        itemsPerPage: 1,
        patient: {
            full_name: '',
            email: '',
            address: '',
            contact: '',
            email: '',
            birthdate: '',
            password: '',
        },
        form: {
            customer: "",
            email: "",
            birthDate: "",
            address: "",
            contact: "",
            password: "",
            prescription: { rightEye: "", leftEye: "" },
            spectacles: { frameType: "", lensType: "" },
            ocularHistory: [],
            familyHistory: [],
            agreeToTerms: false,
            agreeToPrivacy: false,
            prescription: {},

            frame: null, // Foreign key or 'other'
            custom_frame: null, // Custom frame value if 'other'
            type_of_lens: null, // Foreign key or 'other'
            custom_lens: null, // Custom lens value if 'other'
            product: {
                product_name: null 
            },

            Ocular: '',
            Medical: '',
            historyDate: '',


        },
        ocularHistory: ["No previous ocular issues", "Wears glasses", "Has had surgery", "Other"],
        familyHistory: ["Glaucoma", "Macular Degeneration", "Diabetic Retinopathy", "Other"],
    };
  },
    mounted() {
        this.fetchPrescriptions();
        this.fetchGlasses();
        this.fetchMedicalHistory();
        this.fetchPatientData();
    },
    computed: {
        totalPages() {
            return Math.ceil(this.prescriptions.length / this.itemsPerPage);
        },
        totalPagesGlasses() {
            return this.selectedUserGlasses.length;
        },
        totalPagesHistory() {
            return this.selectedUserHistory.length;
        },
        getFrameDisplayValue() {
            // Display 'custom_frame' if 'frame' is 'other', else use 'product_name' or the raw frame value
            if (this.form.frame === 'other') {
                return this.form.custom_frame || "Custom Frame";
            }
            return this.form.product?.product_name || this.form.frame || "Default Frame";
        },
        getLensDisplayValue() {
            // Display 'custom_lens' if 'type_of_lens' is 'other', else use 'product_name' or the raw lens value
            if (this.form.type_of_lens === 'other') {
                return this.form.custom_lens || "Custom Lens";
            }
            return this.form.lens?.product_name || this.form.type_of_lens || "Default Lens";
        },
    },

  methods: {
      age() {
          if (this.patient && this.patient.birthdate) {
              const birthDate = new Date(this.patient.birthdate);
              const today = new Date();
              let age = today.getFullYear() - birthDate.getFullYear();
              const monthDifference = today.getMonth() - birthDate.getMonth();

              // Adjust age if the birthdate hasn't yet occurred this year
              if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                  age -= 1;
              }
              return age;
          }
          return null;
      },

    openTermsModal() {
      // Logic to open terms modal
    },
    openPrivacyPolicyModal() {
      // Logic to open privacy policy modal
    },
    fetchPatientData() {
          const patientId = this.$route.query.patient_id;

          if (patientId) {
              axios.get(`/patients/${patientId}`)
                  .then(response => {
                      const patientData = response.data;

                      this.patient = {
                          full_name: patientData.full_name,
                          address: patientData.address,
                          contact: patientData.contact,
                          email: patientData.email,
                          birthdate: patientData.birthdate,  // Directly assign the birthdate string
                      };
                  })
                  .catch(error => {
                      console.error('Error fetching patient data:', error);
                  });
          } else {
              console.error('No patient_id found in query parameters');
          }
      },
      setCurrentPrescription() {
          const currentPrescription = this.prescriptions[this.currentIndex];
          if (currentPrescription) {
              this.form.prescription = {
                  rightSphere: currentPrescription.right_eye_sphere || '',
                  leftSphere: currentPrescription.left_eye_sphere || '',
                  rightCylinder: currentPrescription.right_eye_cylinder || '',
                  leftCylinder: currentPrescription.left_eye_cylinder || '',
                  rightAxis: currentPrescription.right_eye_axis || '',
                  leftAxis: currentPrescription.left_eye_axis || '',
                  ReadingAd: currentPrescription.reading_add || '',
                  rightVA: currentPrescription.right_eye_best_visual_acuity || '',
                  leftVA: currentPrescription.left_eye_best_visual_acuity || '',
                  date: currentPrescription.date || '',
                  pd: currentPrescription.PD || ''
              };
          }
        },
      async fetchPrescriptions() {
          const patientId = this.$route.query.patient_id;

          if (patientId) {
              try {
                  const response = await axios.get(`/patients/${patientId}/prescriptions`);
                  if (Array.isArray(response.data) && response.data.length > 0) {
                      // Sort by creation date (newest first)
                      this.prescriptions = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                      this.setCurrentPrescription();
                  } else {
                      console.error('No prescriptions found for this patient');
                  }
              } catch (error) {
                  console.error('Error fetching prescriptions:', error.message);
              }
          }
      },
      setCurrentSpectacles() {
          const currentSpectacles = this.selectedUserGlasses[this.currentIndexGlasses];
          if (currentSpectacles) {
              this.form.frame = currentSpectacles.frame;
              this.form.type_of_lens = currentSpectacles.type_of_lens;
              this.form.custom_frame = currentSpectacles.custom_frame || '';
              this.form.custom_lens = currentSpectacles.custom_lens || '';
              this.form.date = currentSpectacles.date || '';

              // Ensure `product` and `lens` objects exist
              this.form.product = this.form.product || {};
              this.form.lens = this.form.lens || {};

              this.form.product.product_name = currentSpectacles.product?.product_name || '';
              this.form.lens.product_name = currentSpectacles.lens?.product_name || '';
          }
      },    
      async fetchGlasses() {
          const patientId = this.$route.query.patient_id;

          if (patientId) {
              try {
                  const response = await axios.get(`/patients/${patientId}/glasses`);
                  if (Array.isArray(response.data) && response.data.length > 0) {
                      this.selectedUserGlasses = response.data;
                      this.setCurrentSpectacles();
                  } else {
                      console.log('No spectacles data found for the patient.');
                  }
              } catch (error) {
                  console.error('Error fetching spectacles data:', error);
              }
          } else {
              console.error('No patient_id found in query parameters.');
          }
      },
      fetchMedicalHistory() {
          const patientId = this.$route.query.patient_id;

          axios.get(`/patients/${patientId}/history`)
              .then(response => {
                  if (Array.isArray(response.data) && response.data.length > 0) {
                      this.selectedUserHistory = response.data;
                      this.setCurrentMedicalHistory(); // Load the first record
                  } else {
                      this.error = 'No medical history found for this patient';
                      this.clearForm();
                  }
              })
              .catch(error => {
                  this.error = 'Error fetching medical history: ' + error.message;
                  this.clearForm();
              });
      },
      setCurrentMedicalHistory() {
          const currentHistory = this.selectedUserHistory[this.currentIndexHistory];
          if (currentHistory) {
              this.form.Ocular = currentHistory.ocular_history || '';
              this.form.Medical = currentHistory.medical_history || '';
              this.form.historyDate = currentHistory.date || '';
          } else {
              this.clearForm();
          }
      },
      nextPage() {
          if (this.currentIndex < this.totalPages - 1) {
              this.currentIndex++;
              this.setCurrentPrescription();
          }
      },

      prevPage() {
          if (this.currentIndex > 0) {
              this.currentIndex--;
              this.setCurrentPrescription();
          }
      },
      prevPageGlass() {
          if (this.currentIndexGlasses > 0) {
              this.currentIndexGlasses--;
              this.setCurrentSpectacles();
          }
      },
      // Navigate to the next page of spectacles
      nextPageGlass() {
          if (this.currentIndexGlasses < this.totalPagesGlasses - 1) {
              this.currentIndexGlasses++;
              this.setCurrentSpectacles();
          }
      },
      prevPageHistory() {
          if (this.currentIndexHistory > 0) {
              this.currentIndexHistory--;
              this.setCurrentMedicalHistory();
          }
      },
      nextPageHistory() {
          if (this.currentIndexHistory < this.selectedUserHistory.length - 1) {
              this.currentIndexHistory++;
              this.setCurrentMedicalHistory();
          }
      },
      
  },
};
</script>




<style scoped>
/* Existing styles here */

.form-group {
  margin-bottom: 15px;
}

input[type="tel"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.form-container {
  width: 800px;
  margin: 0 auto;
  padding: 20px;  
  background-color: #f4f4f4;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1, h3 {
  color: #333;
  margin-bottom: 10px;
}

.form-group, .form-row {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input[type="checkbox"] {
  width: auto;
  margin-right: 10px;
}

.form-checkboxes {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
}

.checkbox-item input[type="checkbox"] {
  margin-left: 0;
}

.terms-checkbox {
  display: flex;
  align-items: center;
}

.form-container-group {
  background-color: #e9ecef;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.submit-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #0056b3;
}

.error-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 80%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close-button {
  padding: 10px 15px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.close-button:hover {
  background-color: #d32f2f;
}


.terms-modal, .privacy-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 80%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close-button {
  padding: 10px 15px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.close-button:hover {
  background-color: #d32f2f;
}

.prescription-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.prescription-table th,
.prescription-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
  vertical-align: middle; /* Ensures inputs align properly within the table cells */
}

.prescription-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.prescription-table input {
  width: calc(100% - 10px); /* Ensures inputs stay within their cell's boundaries */
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box; /* Prevents inputs from exceeding their container */
  background-color: #f9f9f9;
}

.submit-logo {
  width: 300px; /* Adjust size */
  height: auto;
  cursor: pointer;
  display: block;
  margin: 0 auto; /* Centers horizontally */
  text-align: center; /* Ensures it's centered within its container */
}

.title{
    text-align: center;
}


</style>