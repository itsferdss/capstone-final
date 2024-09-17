<template>
  <main>
    <h1 class="bg-title">Enter Patient's Information</h1>
    <div class="form-container">
      <div class="form-box">
        <form @submit.prevent="saveNewUser">
          <div class="form-group">
            <label for="full_name">Patient Name</label>
            <input type="text" v-model="editedItem.full_name" id="full_name" class="form-input" required />
          </div>
          <div class="form-group">
            <label for="address">Address</label>
            <input type="text" v-model="editedItem.address" id="address" class="form-input" required />
          </div>
          <div class="form-row">
            <div class="form-column">
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" v-model="editedItem.email" id="email" class="form-input" required />
              </div>
              <div class="form-group">
                <label for="birthdate">Birthdate</label>
                <input type="date" v-model="editedItem.birthdate" id="birthdate" class="form-input" required />
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" v-model="editedItem.password" id="password" class="form-input" required />
              </div>
            </div>
            <div class="form-column">
              <div class="form-group">
                <label for="contact">Contact Number</label>
                <input type="tel" v-model="editedItem.contact" id="contact" class="form-input" required />
              </div>
              <div class="form-group">
                <label for="age">Age</label>
                <input type="text" v-model="age" id="age" class="form-input" readonly />
              </div>
              <div class="form-group">
                <label for="confirm_password">Confirm Password</label>
                <input type="password" v-model="editedItem.confirm_password" id="confirm_password" class="form-input"
                  required />
              </div>
            </div>
          </div>
          <hr />
          <div class="form-buttons">
            <v-btn type="submit" :style="{ backgroundColor: '#3EB489', color: 'white' }">
              Add Patient
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
        full_name: '',
        email: '',
        address: '',
        contact: '',
        birthdate: '',
        password: '',
        confirm_password: '',
      },
      age: '', // New field for storing the calculated age
    };
  },
  watch: {
    'editedItem.birthdate'(newDate) {
      if (newDate) {
        const today = new Date();
        const birthDate = new Date(newDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        this.age = age;
      } else {
        this.age = '';
      }
    },
  },
  methods: {
    saveNewUser() {
      // Validate age
      if (this.age < 5) {
        Swal.fire({
          title: 'Error',
          text: 'The patient is too young for validation. Age must be at least 5 years old.',
          icon: 'error',
        });
        return; // Prevent form submission
      }

      // Validate password match
      if (this.editedItem.password !== this.editedItem.confirm_password) {
        Swal.fire({
          title: 'Error',
          text: 'Passwords do not match.',
          icon: 'error',
        });
        return;
      }

      // Send data to backend if validation passes
      axios.post('/patients', this.editedItem)
        .then(response => {
          this.resetForm();
          Swal.fire({
            title: 'Success',
            text: 'Patient created successfully!',
            icon: 'success',
          });
        })
        .catch(error => {
          console.error('Error creating patient', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to create patient. Please try again later.',
            icon: 'error',
          });
        });
    },
    resetForm() {
      this.editedItem = {
        full_name: '',
        email: '',
        address: '',
        contact: '',
        birthdate: '',
        password: '',
        confirm_password: '',
      };
      this.age = ''; // Reset the age
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
