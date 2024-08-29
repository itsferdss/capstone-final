<template>
  <main>
    <h1 class="bg-title">Blank's Prescription</h1>
    <div class="form-container">
      <div class="form-box">
        <form @submit.prevent="savePrescription">
          <div class="form-row">
            <div class="form-column">
              <div class="form-group">
                <label for="left_eye_sphere">Left Eye Sphere</label>
                <input
                  type="text"
                  v-model="editedItem.left_eye_sphere"
                  id="left_eye_sphere"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label for="left_eye_cylinder">Left Eye Cylinder</label>
                <input
                  type="text"
                  v-model="editedItem.left_eye_cylinder"
                  id="left_eye_cylinder"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label for="left_eye_axis">Left Eye Axis</label>
                <input
                  type="text"
                  v-model="editedItem.left_eye_axis"
                  id="left_eye_axis"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label for="reading_add">Reading Add</label>
                <input
                  type="text"
                  v-model="editedItem.reading_add"
                  id="reading_add"
                  class="form-input"
                  required
                />
              </div>
            </div>
            <div class="form-column">
              <div class="form-group">
                <label for="right_eye_sphere">Right Eye Sphere</label>
                <input
                  type="text"
                  v-model="editedItem.right_eye_sphere"
                  id="right_eye_sphere"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label for="right_eye_cylinder">Right Eye Cylinder</label>
                <input
                  type="text"
                  v-model="editedItem.right_eye_cylinder"
                  id="right_eye_cylinder"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label for="right_eye_axis">Right Eye Axis</label>
                <input
                  type="text"
                  v-model="editedItem.right_eye_axis"
                  id="right_eye_axis"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <label for="best_visual_acuity">Best Visual Acuity</label>
                <input
                  type="text"
                  v-model="editedItem.best_visual_acuity"
                  id="best_visual_acuity"
                  class="form-input"
                  required
                />
              </div>
            </div>
          </div>
          <div class="form-group">
            <label for="PD">PD</label>
            <input
              type="text"
              v-model="editedItem.PD"
              id="PD"
              class="form-input"
              required
            />
          </div>
          <hr />
          <div class="form-buttons">
            <v-btn type="submit" :style="{ backgroundColor: '#3EB489', color: 'white' }">
              Add Prescription
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
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      editedItem: {
        left_eye_sphere: '',
        right_eye_sphere: '',
        left_eye_cylinder: '',
        right_eye_cylinder: '',
        left_eye_axis: '',
        right_eye_axis: '',
        reading_add: '',
        best_visual_acuity: '',
        PD: '',
        patient_id: '4', // Static patient ID for testing
        prescription_id: '',
      },
    };
  },
  mounted() {
    this.fetchPrescriptions();
  },
  methods: {
    fetchPrescriptions(patient_id) {
      axios.get(`/patients/${patient_id}/prescriptions`)
        .then(response => {
          if (Array.isArray(response.data)) {
            this.selectedUserPrescriptions = response.data; // Update selectedUserPrescriptions
          } else {
            this.error = 'Unexpected response format';
          }
        })
        .catch(error => {
          this.error = 'Error fetching prescriptions: ' + error.message;
        });
    },
    resetForm() {
      this.editedItem = {
        left_eye_sphere: '',
        right_eye_sphere: '',
        left_eye_cylinder: '',
        right_eye_cylinder: '',
        left_eye_axis: '',
        right_eye_axis: '',
        reading_add: '',
        best_visual_acuity: '',
        PD: '',
        patient_id: '4', // Reset static patient ID for testing
        prescription_id: '',
      };
    },
    goBack() {
      this.$router.go(-1);
    }
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
</style>
