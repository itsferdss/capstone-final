<template>
  <v-container>
    <v-row class="d-flex justify-space-between align-items-center">
      <v-col class="d-flex align-items-center" cols="6">
        <v-avatar size="32" class="mr-2">
          <v-icon dark>mdi-account-circle</v-icon>
        </v-avatar>
        <v-card-title class="patient-info-card-title">
          Patient's Information
        </v-card-title>
      </v-col>
      <v-col class="text-left" cols="6">
        <v-btn @click="openReservation" color="primary" dark class="showRes">
          <v-icon left>mdi-cart</v-icon>
          <div class="resText"> See Your Reservations</div>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Patient's information card -->
    <v-card class="patient-info-card mb-4" elevation="2">
      <v-card-text>
        <v-row class="patient-info-row">
          <v-col cols="12" md="6">
            <strong>Full Name:</strong> {{ patient.full_name }}
          </v-col>
          <v-col cols="12" md="6">
            <strong>Address:</strong> {{ patient.address }}
          </v-col>
          <v-col cols="12" md="6">
            <strong>Contact Number:</strong> {{ patient.contact }}
          </v-col>
          <v-col cols="12" md="6">
            <strong>Email:</strong> {{ patient.email }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Button to open update dialog -->


    <v-container>
      <v-card class="mt-4 d-flex flex-column" elevation="2">
        <v-card-text class="agreement-reminder-text">
          "Thank you for agreeing to our Terms and Conditions. Rest assured that your information is encrypted and
          stored securely to protect your privacy. We prioritize your security and confidentiality at every step. Our
          data protection measures comply with industry standards, ensuring that your personal details are safeguarded
          against unauthorized access. Should you have any concerns or require assistance, our support team is available
          to address your inquiries promptly. Your trust is important to us, and we are committed to maintaining the
          highest level of security and transparency."
        </v-card-text>
        <v-spacer></v-spacer> <!-- Spacer to push icon to the bottom -->
        <v-btn @click="openUpdateParentDialog" color="primary" dark class="updateBtn">Update
          Information</v-btn>
      </v-card>
    </v-container>

    <!-- Dialog for updating parent information -->
    <v-dialog v-model="updateParentDialog" max-width="750px">
      <v-card>
        <v-card-title class="stockTitle">
          <span class="update-dialog-title">Update Your Information</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row dense>
              <v-col cols="12">
                <v-text-field v-model="patient.address" label="Address" :prepend-icon="isMobile ? '' : 'mdi-map-marker'"
                  class="update-dialog-textfield" :class="{'mobile-text-field': isMobile}" outlined></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="patient.contact" label="Contact Number"
                  :prepend-icon="isMobile ? '' : 'mdi-phone'" class="update-dialog-textfield"
                  :class="{'mobile-text-field': isMobile}" outlined></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="patient.email" label="Email" :prepend-icon="isMobile ? '' : 'mdi-email'"
                  class="update-dialog-textfield" :class="{'mobile-text-field': isMobile}" outlined></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="password" :type="showPassword ? 'text' : 'password'" label="Current Password"
                  class="update-dialog-textfield" :class="{'mobile-text-field': isMobile}" outlined
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="password-field">
                <v-text-field v-model="newPassword" :type="showNewPassword ? 'text' : 'password'" label="New Password"
                  class="update-dialog-textfield" :class="{'mobile-text-field': isMobile}" outlined
                  :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showNewPassword = !showNewPassword"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="password-field">
                <v-text-field v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                  label="Confirm New Password" class="update-dialog-textfield" :class="{'mobile-text-field': isMobile}"
                  outlined :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showConfirmPassword = !showConfirmPassword"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black" text @click="closeUpdateParentDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveUpdatedParent">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default {
  data() {
    return {
      updateParentDialog: false,
      showPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      patient: {
        full_name: '',
        address: '',
        contact: '',
        email: '',
      },
      password: '',
      newPassword: '',
      confirmPassword: '',
    };
  },
  computed: {
    ...mapState({
      patientId: state => state.patientId || localStorage.getItem('patientId'),
    }),
    isMobile() {
      return window.innerWidth <= 600;
    },
  },
  mounted() {
    const token = sessionStorage.getItem('token'); // Check if token exists
    if (!token) {
      // Show login dialog if not logged in
      this.loginDialog = true;
      return; // Prevent fetching data if not logged in
    }
    if (this.patientId) {
      this.fetchPatientData(this.patientId);
    } else {
      console.error('Patient ID is not available.');
    }
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.$forceUpdate();
    },
    openUpdateParentDialog() {
      this.updateParentDialog = true;
      // Reset password fields when dialog is opened
      this.password = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.showPassword = false;
      this.showNewPassword = false;
      this.showConfirmPassword = false;
    },
    closeUpdateParentDialog() {
      this.updateParentDialog = false;
      // Reset password fields when dialog is closed
      this.password = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.showPassword = false;
      this.showNewPassword = false;
      this.showConfirmPassword = false;
    },
    fetchPatientData(id) {
      axios.get(`/patients/${id}`)
        .then(response => {
          const patientData = response.data;
          this.patient = {
            full_name: patientData.full_name,
            address: patientData.address,
            contact: patientData.contact,
            email: patientData.email,
          };
        })
        .catch(error => {
          console.error('Error fetching patient data:', error);
        });
    },
    saveUpdatedParent() {
      // Prepare data to send
      const data = {
        address: this.patient.address,
        contact: this.patient.contact,
        email: this.patient.email,
        password: this.password,
        newPassword: this.newPassword,
      };

      // Validate if newPassword is provided
      if (this.newPassword && this.newPassword !== this.confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'New Password and Confirm New Password must match!',
        });
        return;
      }

      // Send update request to backend
      axios.put(`/patients/${this.patientId}`, data)
        .then(response => {
          // Handle success
          Swal.fire({
            icon: 'success',
            title: 'Information Updated',
            text: 'Patient information has been updated successfully!',
          });
          // Optionally reset form or close dialog
          this.closeUpdateParentDialog();
        })
        .catch(error => {
          this.updateParentDialog = false;
          console.error('Error updating patient information:', error);
          let errorMessage = 'Failed to update patient information. Please try again later.';
          if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          }
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: errorMessage,
          });
        });
    },
    openReservation() {
      const patientId = this.patientId;

      if (patientId) {
        // Navigate to the viewReservation route with the patient ID as a query parameter
        this.$router.push({
          path: '/viewReservation',
          query: { patient_id: patientId } // Add patient_id as a query parameter
        });
      } else {
        console.error('Patient ID is not available.');
      }
    },
  },
};
</script>

<style scoped>
.patient-info-card {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  margin-top: 10px;
}

.patient-info-card-title {
  font-size: 1.7rem;
  color: #333;
}

.patient-info-row {
  margin-bottom: 10px;
  font-size: 1.0rem;
}

.update-dialog-title {
  font-size: 1.2rem;
  color: #333;
}

.update-dialog-textfield {
  width: 100%;
}

.mobile-text-field {
  font-size: 0.8rem; /* Adjust input font size for mobile */
}

.agreement-reminder-text {
  font-size: 1rem;
  line-height: 1.5;
  font-style: italic;
}

.secured-icon {
  font-size: 1.5rem; /* Adjust icon size */
  color: #0d0e0d; /* Optional: Change color to green for security */
  margin: 16px; /* Adjust spacing as needed */
  align-self: flex-end; /* Align icon to the end of the container */
}

.updateBtn{
  width: 250px;
  margin-top: 20px;
  margin-left: 850px;
  margin-bottom: 30px;
}

.showRes{
  margin-left: 300px;
}

.stockTitle {
  text-align: center;
  background-color: rgb(189, 226, 240);
}

@media (max-width: 600px) {
  .patient-info-card-title {
    font-size: 1rem;
    margin-left: -30px;
  }
  .patient-info-row {
    margin-top: -20px;
    margin-bottom: -20px;
    font-size: 0.8rem;
    margin-left: -30px;
    margin-right: -30px;
  }
  .update-dialog-title {
    font-size: 1rem;
  }
  .v-btn {
    font-size: 0.7rem;
  }

  .showRes{
    margin-left: 85px;
  }

  .resText{
    display: none;
  }

  .updateBtn{
      margin-left: 0px;
      width: 100%;
  }

}


</style>
