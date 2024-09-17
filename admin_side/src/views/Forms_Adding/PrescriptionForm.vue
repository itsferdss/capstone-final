<template>
  <main>
    <h1 class="bg-title">Enter Patient's Prescription</h1>
    <div class="form-container">
      <div class="form-box">
        <form @submit.prevent="savePrescription">
          <table class="form-table">
            <thead>
              <tr>
                <th></th>
                <th>Sphere</th>
                <th>Cylinder</th>
                <th>Axis</th>
                <th>Best VA</th>
              </tr>
            </thead>
            <tbody>
              <!-- Row 1: Right Eye -->
              <tr>
                <td class="label-cell"><label for="right_eye_sphere">Right Eye</label></td>
                <td class="input-cell">
                  <input type="text" v-model="editedItem.right_eye_sphere" id="right_eye_sphere" class="form-input"
                    required />
                </td>
                <td class="input-cell">
                  <input type="text" v-model="editedItem.right_eye_cylinder" id="right_eye_cylinder" class="form-input"
                    required />
                </td>
                <td class="input-cell">
                  <input type="text" v-model="editedItem.right_eye_axis" id="right_eye_axis" class="form-input"
                    required />
                </td>
                <td class="input-cell">
                  <input type="text" v-model="editedItem.right_eye_best_visual_acuity" id="right_eye_best_visual_acuity"
                    class="form-input" />
                </td>
              </tr>

              <!-- Row 2: Left Eye -->
              <tr>
                <td class="label-cell"><label for="left_eye_sphere">Left Eye</label></td>
                <td class="input-cell">
                  <input type="text" v-model="editedItem.left_eye_sphere" id="left_eye_sphere" class="form-input"
                    required />
                </td>
                <td class="input-cell">
                  <input type="text" v-model="editedItem.left_eye_cylinder" id="left_eye_cylinder" class="form-input"
                    required />
                </td>
                <td class="input-cell">
                  <input type="text" v-model="editedItem.left_eye_axis" id="left_eye_axis" class="form-input"
                    required />
                </td>
                <td class="input-cell">
                  <input type="text" v-model="editedItem.left_eye_best_visual_acuity" id="left_eye_best_visual_acuity"
                    class="form-input" />
                </td>
              </tr>

              <!-- Row 3: Reading Ads and PD -->
              <tr>
                <td class="label-cell">
                  <label for="reading_add">Reading Add</label>
                </td>
                <td class="input-cell" colspan="2">
                  <!-- Add custom class for larger size -->
                  <input type="text" v-model="editedItem.reading_add" id="reading_add" class="form-input large-input"
                    required />
                </td>
                <td class="label-cell pd-label">
                  <label for="pd">PD</label>
                </td>
                <td class="input-cell">
                  <input type="text" v-model="editedItem.PD" id="pd" class="form-input pd-input" required />
                </td>
              </tr>
            </tbody>
          </table>

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
        right_eye_sphere: '',
        left_eye_sphere: '',
        right_eye_cylinder: '',
        left_eye_cylinder: '',
        right_eye_axis: '',
        left_eye_axis: '',
        left_eye_best_visual_acuity: '',
        right_eye_best_visual_acuity: '',
        reading_add: '',
        PD: '',
      },
    };
  },
  methods: {
    savePrescription() {
      const patientId = this.$route.query.patient_id;

      const prescriptionData = {
        patient_id: patientId,
        right_eye_sphere: this.editedItem.right_eye_sphere,
        left_eye_sphere: this.editedItem.left_eye_sphere,
        right_eye_cylinder: this.editedItem.right_eye_cylinder,
        left_eye_cylinder: this.editedItem.left_eye_cylinder,
        right_eye_axis: this.editedItem.right_eye_axis,
        left_eye_axis: this.editedItem.left_eye_axis,
        left_eye_best_visual_acuity: this.editedItem.left_eye_best_visual_acuity,
        right_eye_best_visual_acuity: this .editedItem.right_eye_best_visual_acuity,
        reading_add: this.editedItem.reading_add,
        PD: this.editedItem.PD,
      };

      axios.post(`/patients/${patientId}/prescriptions`, prescriptionData)
        .then(response => {
          Swal.fire({
            title: "Success",
            text: "Prescription saved successfully!",
            icon: "success",
          });
          this.resetForm();
        })
        .catch(error => {
          Swal.fire({
            title: "Error",
            text: "Failed to save prescription.",
            icon: "error",
          });
        });
    },
    resetForm() {
      this.editedItem = {
        right_eye_sphere: '',
        left_eye_sphere: '',
        right_eye_cylinder: '',
        left_eye_cylinder: '',
        right_eye_axis: '',
        left_eye_axis: '',
        reading_add: '',
        left_eye_best_visual_acuity: '',
        right_eye_best_visual_acuity: '',
        PD: '',
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
  max-width: 1000px;
}

.large-input {
  width: 90%;
}

.pd-input {
  width: 170%;
  margin-left: -120px;
}

.pd-label {
  padding-right: 5px;
}

.form-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #007BFF;
  color: white;
}

.label-cell {
  width: 10%;
  font-weight: bold;
  color: #333;
}

.input-cell {
  width: 15%;
}

input {
  width: 100%;
  padding: 0.5rem;
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

/* Media Queries for Responsiveness */
@media (max-width: 768px) {
  .form-box {
    padding: 1.5rem;
  }

  .form-table th, .form-table td {
    padding: 0.5rem;
  }

  .input-cell {
    width: 100%;
  }

  .large-input {
    width: 100%;
  }

  .pd-input {
    width: 100%;
    margin-left: 0;
  }

  .form-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }

  .v-btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .bg-title {
    font-size: 1.5rem;
    padding: 0.5rem;
  }

  .form-container {
    padding: 1rem;
  }

  .form-box {
    padding: 1rem;
  }

  .form-table th, .form-table td {
    font-size: 0.9rem;
  }

  .v-btn {
    padding: 0.5rem 1rem;
  }
}
</style>
