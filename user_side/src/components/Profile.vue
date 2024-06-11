<template>
  <v-container>
    <!-- Parent's information -->
    <v-card class="mb-4">
      <v-card-title>Parent's Information</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <strong>First Name:</strong> {{ patient.full_name }}
          </v-col>
          <v-col cols="12" md="3">
            <strong>Middle Name:</strong> {{ patient.address }}
          </v-col>
          <v-col cols="12" md="3">
            <strong>Last Name:</strong> {{ patient.contact_number }}
          </v-col>
          <v-col cols="12" md="3">
            <strong>Suffix:</strong> {{ patient.email }}
          </v-col>
          <v-col cols="12">
            <strong>Address:</strong> {{ patient.password }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

  <v-btn @click="openUpdateParentDialog" color="#35623D" dark style="font-weight: bold;">Update Information</v-btn>

<!--Dialog for update parent profile-->
<v-dialog v-model="updateParentDialog" max-width="1000px">
  <v-card>
    <v-card-title>
      <span class="text-h6 m-2">Update your information</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row dense>
          <v-col cols="12">
            <v-text-field v-model="patient.full_name" label="Parent Name*" prepend-icon="mdi-account" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="patient.address" label="Address" prepend-icon="mdi-map-marker" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="patient.contact_number" label="Contact Number" prepend-icon="mdi-phone" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="patient.email" label="Email" prepend-icon="mdi-mail" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="patient.password" label="Password" prepend-icon="mdi-lock" :append-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'" :type="passwordVisible ? 'text' : 'password'" @click:append="passwordVisible = !passwordVisible" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="patient.confirm_password" label="Confirm Password" prepend-icon="mdi-lock" :append-icon="confirmPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'" :type="confirmPasswordVisible ? 'text' : 'password'" @click:append="confirmPasswordVisible = !confirmPasswordVisible" required></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="black" text @click="closeDialog">Cancel</v-btn>
      <v-btn color="black" text @click="saveUpdatedInfo">Update</v-btn>
    </v-card-actions>
  </v-card> 
</v-dialog>


  </v-container>
</template>

<script>

import axios from 'axios'; 

export default {
  data() {
    return {
      updateParentDialog: false,
      patient: {
        full_name: ' ',
        address: '',
        contact_number: '',
        email: '.',
        address: '',
        password: '',
      },
      passwordVisible: false,
      confirmPasswordVisible: false,
 
    };
  },
  mounted() {
    // Call the fetchUserData method when the component is mounted
    this.fetchPatientData();
  },
  methods:{
    openUpdateParentDialog() {
      this.updateParentDialog = true;
    },
    closeDialog() {
      this.updateParentDialog = false;
    },
    saveNewUser() {
      // Logic to save new user
    },
      fetchPatientData(id) {
      // Make an AJAX request to fetch patient data
      axios.get(`/patients/${id}`)
        .then(response => {
          // Assuming the response data is an object containing patient info
          const patientData = response.data;
          // Update the patient object with the fetched data
          this.patient = {
            full_name: patientData.full_name,
            address: patientData.address,
            contact_number: patientData.contact_number,
            email: patientData.email,
            password: patientData.password,
          };
        })
        .catch(error => {
          console.error('Error fetching patient data:', error);
        });
    },
  },
};
</script>

<style scoped>
/* Add custom styles if needed */
</style>
