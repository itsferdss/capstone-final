<template>
  <main>
    <h1 class="bg-title">Enter {{ patient.full_name }}'s History</h1>
    <div class="form-container">
      <div class="form-box">
        <!-- Update form to call the correct method -->
        <form @submit.prevent="saveNewHistory">

          <div class="input-box-container">
            <label for="prescription_date" class="presDate">Prescription Date:</label>
            <input type="date" v-model="prescriptionDate" id="prescription_date" class="dateHis" />
          </div>

          <div class="form-row">
            <div class="form-column">
              <div class="form-group">
                <label for="medical_history">Medical History</label>
                <input type="text" v-model="editedItem.medical_history" id="medical_history" class="form-input"
                  required />
              </div>
              <div class="form-group">
                <label for="ocular_history">Ocular History</label>
                <input type="text" v-model="editedItem.ocular_history" id="ocular_history" class="form-input"
                  required />
              </div>
            </div>
          </div>
          <hr />
          <div class="form-buttons">
            <v-btn type="submit" :style="{ backgroundColor: '#3EB489', color: 'white' }">
              Add History
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
      prescriptionDate: today,
      editedItem: {
        history_updated: '',
        medical_history: '',
        ocular_history: '',
        patient_id: '',
      },
      selectedPatient: null, // Ensure that selectedPatient is defined
      patient: {},
    };
  },
  mounted() {
    this.fetchPatient();
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
    saveNewHistory() {
      // Check if editedItem contains all necessary data
      if (!this.editedItem) {
        console.error("Error: No medical history data available");
        return;
      }

      const patientId = this.$route.query.patient_id;

      // Extract medical history data from editedItem
      const historyData = {
        patient_id: patientId, // Populate patient_id with selectedPatient's id
        medical_history: this.editedItem.medical_history,
        ocular_history: this.editedItem.ocular_history,
        date: this.prescriptionDate,
      };

      // Make a POST request to save the new medical history
      axios
        .post(`/patients/${patientId}/history`, historyData)
        .then(response => {
          // Medical history saved successfully
          console.log("Medical history saved successfully:", response.data);

          this.resetForm();

          Swal.fire({
            title: "Success",
            text: "Medical Information saved successfully!",
            icon: "success",
          });

        })
        .catch(error => {
          // Error occurred while saving the medical history
          console.error("Error saving medical history:", error);

          // Provide feedback to the user
          Swal.fire({
            title: "Error",
            text: "Failed to save medical history. Please try again later.",
            icon: "error",
          });
        });
    },
    resetForm() {
      this.editedItem = {
        history_updated: '',
        medical_history: '',
        ocular_history: '',
        patient_id: '',
      };
    },
    goBack() {
      this.$router.go(-1);
    },
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
  margin-bottom: 1rem; /* Adds spacing between form groups */
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
  height: 5.5rem; /* Sets the height of the input boxes */
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

.dateHis{
  height: 45px;
}

.presDate{
  margin-top: 10px;
  margin-right: 10px;
}

.input-box-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}
</style>
