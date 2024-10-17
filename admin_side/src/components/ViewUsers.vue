<template>
  <v-data-table :search="search" :headers="headers" :items="displayedPatients"
    :sort-by="[{ key: 'patient_id', order: 'asc' }]">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title class="listOfPat">
          <v-icon left>mdi-account-group</v-icon>
          LIST OF PATIENTS
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <!-- Search input -->
        <v-text-field v-model="search" class="w-auto mr-4" density="compact" label="Search User"
          prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details single-line
          style="max-width: 300px;"></v-text-field>

        <v-btn @click="openDialog" color="primary" dark class="styled-btn">
          <v-icon left>mdi-account-plus</v-icon>
          <span class="styled-btn-text">Add New Patient</span>
        </v-btn>

      </v-toolbar>
    </template>

    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.id }}</td>
        <td>{{ item.full_name }} </td>
        <td>{{ item.contact }}</td>
        <td>{{ item.email }}</td>
        <td>{{ item.address }}</td>
        <td>
          <v-icon class="me-2" size="small" style="color: #2F3F64"
            @click="viewPrescriptions(item)">mdi-information</v-icon>
          <v-icon size="small" style="color: #2F3F64" @click="deleteUser(item)">mdi-delete</v-icon>
        </td>
      </tr>

      <tr v-if="item.showPrescriptions">
        <td :colspan="headers.length + 5">
          <v-row justify="space-between">
            <v-col cols="4">
              <v-btn @click="openDialogPatientHistory(item)" block class="operationTxt">Prescriptions</v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn @click="openDialogPatientGlassesInformation(item)" block class="operationTxt">Spectacles</v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn @click="openMoreHistoryDialog(item)" block class="operationTxt">Medical History</v-btn>
            </v-col>
          </v-row>
        </td>
      </tr>

      <!--DIALOG FOR PATIENT HISTORY-->
      <v-dialog v-model="dialogPatientHistory" max-width="1300px">
        <v-card>
          <v-card-title class="presName">{{ selectedUser.full_name }}'s Past Prescriptions</v-card-title>
          <v-card-text>
            <v-btn @click="openChildUpdateDialog" color="#35623D" dark style="font-weight: bold;">Add
              Prescription</v-btn>
            <span>&nbsp;</span>
            <v-btn color="error" @click="closeDialogPatientHistory">Close</v-btn>

            <!-- Dropdown for Generate Report -->
            <v-row class="mt-4">
              <v-col>
                <v-menu offset-y>
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" class="mb-2 rounded-l generateBtn" dark color="primary">
                      <v-icon left>mdi-file-chart</v-icon>
                      Generate Report
                      <v-icon right>mdi-menu-down"></v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      @click="exportPrescriptionPDF(selectedUserPrescriptions, `${selectedUser.full_name}'s Prescription`)"
                      class="mb-2 rounded-l add-record-button">
                      <v-list-item-icon></v-list-item-icon>
                      <v-list-item-title>Generate PDF</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="exportPrescriptionExcel(selectedUserPrescriptions, `${selectedUser.full_name}'s Prescription`)"
                      class="mb-2 rounded-l add-record-button">
                      <v-list-item-icon></v-list-item-icon>
                      <v-list-item-title>Generate Excel</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>


            <!-- Loop through selectedUserPrescriptions -->
            <v-card v-for="(prescription, index) in sortedPrescriptions" :key="index"
              class="mb-4 prescription-table-container">
              <v-row class="align-center justify-space-between">
                <v-col>
                  <v-card-title class="font-weight-bold presDate">
                    Prescription Date: {{ formatPrescriptionDate(prescription.created_at) }}
                  </v-card-title>
                </v-col>
                <v-col class="text-right">
                  <v-btn color="error" @click="deletePrescription(selectedPatient.id, prescription.id)">
                    <v-icon left>mdi-delete</v-icon>
                    <div class="deleteText">Delete</div>
                  </v-btn>
                </v-col>
              </v-row>

              <v-card-text>
                <!-- Prescription Data -->
                <v-row class="text-center font-weight-bold prescriptionTitle" style="border-bottom: 1px solid black;">
                  <v-col cols="12" sm="1"></v-col>
                  <v-col cols="6" sm="3">Sphere</v-col>
                  <v-col cols="6" sm="3">Cylinder</v-col>
                  <v-col cols="6" sm="2">Axis</v-col>
                  <v-col cols="6" sm="3">Best Visual Acuity</v-col>
                </v-row>

                <!-- Right Eye -->
                <v-row class="text-center" style="border-bottom: 1px solid lightgray;">
                  <v-col cols="12" sm="1" class="font-weight-bold">Right Eye</v-col>
                  <v-col cols="6" sm="3">{{ prescription.right_eye_sphere }}</v-col>
                  <v-col cols="6" sm="3">{{ prescription.right_eye_cylinder }}</v-col>
                  <v-col cols="6" sm="2">{{ prescription.right_eye_axis }}</v-col>
                  <v-col cols="6" sm="3">{{ prescription.right_eye_best_visual_acuity }}</v-col>
                </v-row>

                <!-- Left Eye -->
                <v-row class="text-center" style="border-bottom: 1px solid lightgray;">
                  <v-col cols="12" sm="1" class="font-weight-bold">Left Eye</v-col>
                  <v-col cols="6" sm="3">{{ prescription.left_eye_sphere }}</v-col>
                  <v-col cols="6" sm="3">{{ prescription.left_eye_cylinder }}</v-col>
                  <v-col cols="6" sm="2">{{ prescription.left_eye_axis }}</v-col>
                  <v-col cols="6" sm="3">{{ prescription.left_eye_best_visual_acuity }}</v-col>
                </v-row>

                <!-- Reading Add & PD -->
                <v-row class="text-center" style="border-bottom: 1px solid lightgray;">
                  <v-col cols="6" sm="6"><strong>Reading Add:</strong> {{ prescription.reading_add }}</v-col>
                  <v-col cols="6" sm="6"><strong>PD:</strong> {{ prescription.PD }}</v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!--DIALOG FOR PATIENT GLASSES-->
      <template>
        <v-dialog v-model="dialogPatientGlassesInformation" max-width="1300px">
          <v-card>
            <v-card-title class="presName">{{ selectedUser.full_name }}'s Spectacles</v-card-title>
            <v-card-text>
              <v-btn @click="openChildGlassesDialog" color="#35623D" dark style="font-weight: bold;">Add
                Spectacles</v-btn>
              <span>&nbsp;</span>
              <v-btn color="primary" @click="closePatientGlassesInformation">Close</v-btn>
              <v-row class="mt-4">
                <v-col>
                  <v-menu offset-y>
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" class="mb-2 rounded-l generateBtn" dark color="primary">
                        <v-icon left>mdi-file-chart</v-icon>
                        Generate Report
                        <v-icon right>mdi-menu-down"></v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        @click="exportSpectaclesPDF(selectedUserGlasses, `${selectedUser.full_name}'s Spectacles`)"
                        class="mb-2 rounded-l add-record-button">
                        <v-list-item-icon></v-list-item-icon>
                        <v-list-item-title>Generate PDF</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        @click="exportSpecraclesExcel(selectedUserGlasses, `${selectedUser.full_name}'s Spectacles`)"
                        class="mb-2 rounded-l add-record-button">
                        <v-list-item-icon></v-list-item-icon>
                        <v-list-item-title>Generate Excel</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
              </v-row>
      <v-card v-for="(glasses, index) in sortedGlasses" :key="index" class="mb-4">
  <v-card-title class="glassDate">Updated At: {{ formatPrescriptionDate(glasses.created_at) }}</v-card-title>
  <v-card-text>
    <v-row class="text-center font-weight-bold" style="border-bottom: 1px solid black;">
      <v-col cols="12" sm="4" class="label-col"><strong>Frame:</strong></v-col>
      <v-col cols="12" sm="8">
        <span v-if="glasses.product_id">{{ glasses.product.product_name }}</span>
        <span v-else>{{ glasses.custom_frame }}</span>
      </v-col>
    </v-row>

    <v-row class="text-center" style="border-bottom: 1px solid lightgray;">
      <v-col cols="12" sm="4" class="label-col"><strong>Type of Lens:</strong></v-col>
      <v-col cols="12" sm="8">
        <span v-if="glasses.lens_id">{{ glasses.lens.product_name }}</span>
        <span v-else>{{ glasses.custom_lens }}</span>
      </v-col>
    </v-row>

    <v-row class="text-center" style="border-bottom: 1px solid lightgray;">
      <v-col cols="12" sm="4" class="label-col"><strong>Remarks:</strong></v-col>
      <v-col cols="12" sm="8">{{ glasses.remarks }}</v-col>
    </v-row>

    <v-row class="text-center" style="border-bottom: 1px solid lightgray;">
      <v-col cols="12" sm="4" class="label-col"><strong>Price:</strong></v-col>
      <v-col cols="12" sm="8">₱{{ glasses.price }}</v-col>
    </v-row>

    <!-- Delete Button -->
    <v-row class="text-right" style="border-bottom: 1px solid lightgray;">
      <v-col cols="12">
        <v-btn color="error" @click="deleteGlasses(selectedPatient.id, glasses.id)">
          <v-icon left>mdi-delete</v-icon>
          <div class="deleteText">Delete</div>
        </v-btn>
      </v-col>
    </v-row>
  </v-card-text>
</v-card>
            </v-card-text>
          </v-card>
        </v-dialog>
      </template>

      <!--DIALOG FOR MORE HISTORY-->
      <v-dialog v-model="dialogMoreHistory" max-width="1300px">
        <v-card>
          <v-card-title class="presName">{{ selectedUser.full_name }}'s Medical History</v-card-title>
          <v-card-text>
            <v-btn @click="openChildHistoryDialog" color="#35623D" dark style="font-weight: bold;">Add Medical
              History</v-btn>
            <span>&nbsp;</span>
            <v-btn color="primary" @click="closeMoreHistoryDialog">Close</v-btn>
            <v-row class="mt-4">
              <v-col>
                <v-menu offset-y>
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" class="mb-2 rounded-l generateBtn" dark color="primary">
                      <v-icon left>mdi-file-chart</v-icon>
                      Generate Report
                      <v-icon right>mdi-menu-down"></v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      @click="exportHistoryPDF(selectedUserHistory, `${selectedUser.full_name}'s Medical History`)"
                      class="mb-2 rounded-l add-record-button">
                      <v-list-item-icon></v-list-item-icon>
                      <v-list-item-title>Generate PDF</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      @click="exportHistoryExcel(selectedUserHistory, `${selectedUser.full_name}'s Medical History`)"
                      class="mb-2 rounded-l add-record-button">
                      <v-list-item-icon></v-list-item-icon>
                      <v-list-item-title>Generate Excel</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>

            <v-card v-for="(history, index) in sortedHistory" :key="index" class="mb-4">
        <v-card-title class="historyDate">Updated At: {{ formatPrescriptionDate(history.created_at) }}</v-card-title>
        <v-card-text>
          <v-row class="text-center font-weight-bold" style="border-bottom: 1px solid lightgray;">
            <v-col cols="12" sm="4" class="label-col"><strong>Medical History:</strong></v-col>
            <v-col cols="12" sm="8">{{ history.medical_history }}</v-col>
          </v-row>

          <v-row class="text-center" style="border-bottom: 1px solid lightgray;">
            <v-col cols="12" sm="4" class="label-col"><strong>Ocular History:</strong></v-col>
            <v-col cols="12" sm="8">{{ history.ocular_history }}</v-col>
          </v-row>

          <!-- Delete Button -->
          <v-row class="text-right" style="border-bottom: 1px solid lightgray;">
            <v-col cols="12">
              <v-btn color="error" @click="deleteHistory(selectedPatient.id, history.id)">
                <v-icon left>mdi-delete</v-icon>
                <div class="deleteText">Delete</div>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
  </v-data-table>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default {
  data() {
    return {
      search: '',
      dialog: false,
      dialogDelete: false,
      dialogPatientHistory: false,
      childUpdateDialog: false,
      dialogPatientGlassesInformation: false,
      childGlassesDialog: false,
      dialogMoreHistory: false,
      childHistoryDialog: false,
      generateAll: false, 
      selectedPatient: null,
      startDate: null,
      endDate: null,
      selectedUserPrescriptions: [],
      selectedUser: { full_name: 'User Name' },
      editedItem: {
        id: '',
        full_name: '',
        email: '',
        address: '',
        contact: '',
        email: '',
        birthdate: '',
        password: '',
        confirm_password: '',
        passwordVisible: false,
        confirmPasswordVisible: false,

        left_eye_sphere: '',
        right_eye_sphere: '',
        left_eye_cylinder: '',
        right_eye_cylinder: '',
        left_eye_axis: '',
        right_eye_axis: '',
        reading_add: '',
        best_visual_acuity: '',
        PD: '',
        patient_id: '',
        prescription_id: '',

        frame: '',
        type_of_lens: '',
        remarks: '',
        lens: '',

        history_updated: '',
        medical_history: '',
        ocular_history: '',
      },
      headers: [
        { title: 'User ID', align: 'center', key: 'id' },
        { title: 'User Name', align: 'center', key: 'full_name' },
        { title: 'Contact Number', align: 'center', key: 'contact' },
        { title: 'Email', align: 'center', key: 'email' },
        { title: 'Address', align: 'center', key: 'address' }, 
        { title: 'Actions', align: 'center', sortable: false },
      ],
      patients: [],
      displayedPatients: [],
      selectedUserPrescriptions: [],
      selectedUserGlasses: [],
      selectedUserHistory: [],
    };
  },
  computed: {
  sortedPrescriptions() {
    return this.selectedUserPrescriptions.slice().sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
  },
  sortedGlasses() {
    return this.selectedUserGlasses.slice().sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
  },
  sortedHistory() {
    return this.selectedUserHistory.slice().sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
  },
  screenWidth() {
      return window.innerWidth;
  },
  
},
  mounted() {
    this.fetchPatients();
  },
  methods: {
    fetchPatients() {
      axios.get('/patients')
        .then(response => {
          if (Array.isArray(response.data)) {
            this.displayedPatients = response.data;
          } else {
            this.error = 'Unexpected response format';
          }
        })
        .catch(error => {
          this.error = 'Error fetching patients: ' + error.message;
        });
    },
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
    fetchGlasses(patient_id) {
          axios.get(`/patients/${patient_id}/glasses`)
              .then(response => {
                  if (Array.isArray(response.data)) {
                      this.selectedUserGlasses = response.data; // Update selectedUserGlasses
                  } else {
                      this.error = 'Unexpected response format';
                  }
              })
              .catch(error => {
                  this.error = 'Error fetching glasses: ' + error.message;
              });
      },
     fetchMedicalHistory(patient_id) {
        axios.get(`/patients/${patient_id}/history`)
          .then(response => {
            if (Array.isArray(response.data)) {
              this.selectedUserHistory = response.data; // Update medicalHistory state or variable
            } else {
              this.error = 'Unexpected response format';
            }
          })
          .catch(error => {
            this.error = 'Error fetching medical history: ' + error.message;
          });
      },
      setSelectedPatient(patient) {
        this.selectedPatient = patient;
      },
      
      formatPrescriptionDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
      },

    deletePrescription(patient_id, prescription_id) {
      console.log("Prescription ID:", prescription_id);
      
      this.dialogPatientHistory = false;

      Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this prescription!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`/patients/${patient_id}/prescriptions/${prescription_id}`)
            .then(response => {
              // Prescription deleted successfully
              console.log("Prescription deleted successfully:", response.data);

              Swal.fire(
                'Deleted!',
                'Prescription deleted successfully!',
                'success'
              );

              this.fetchPrescriptions(patient_id);
              
            })
            .catch(error => {
              // Error occurred while deleting the prescription
              console.error("Error deleting prescription:", error);

              // Provide feedback to the user
              Swal.fire(
                'Error',
                'Failed to delete prescription. Please try again later.',
                'error'
              );
            });
        } else {

          this.dialogPatientHistory = true;

          Swal.fire(
            'Cancelled',
            'Prescription not deleted!',
            'info'
          );
        }
      });
    },
    deleteHistory(patient_id, history_id) {
      console.log("History ID:", history_id);

      this.dialogMoreHistory = false;

      // Display a SweetAlert confirmation before deleting the history
      Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this medical history!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          // If the user confirms deletion, make a DELETE request to delete the medical history
          axios.delete(`/patients/${patient_id}/history/${history_id}`)
            .then(response => {
              // History deleted successfully
              console.log("History deleted successfully:", response.data);

              // Provide feedback to the user
              Swal.fire({
                title: "Success",
                text: "Medical history deleted successfully!",
                icon: "success",
                confirmButtonColor: "#3085d6"
              });
              this.fetchMedicalHistory(patient_id);
            })
            .catch(error => {
              // Error occurred while deleting the history
              console.error("Error deleting medical history:", error);

              // Provide feedback to the user
              Swal.fire({
                title: "Error",
                text: "Failed to delete medical history. Please try again later.",
                icon: "error",
                confirmButtonColor: "#3085d6"
              });
            });
        } else {
          // If the user cancels deletion, show a message indicating the history was not deleted
          Swal.fire({
            title: "Cancelled",
            text: "Medical history not deleted.",
            icon: "info",
            confirmButtonColor: "#3085d6"
          });

          this.dialogMoreHistory = true;
        }
      });
    },
    openDialog() {
      this.$router.push('/add/user')
    },
    closeDialog() {
      this.dialog = false;
      this.resetEditedItem();
    },
   
    deleteUser(user) {
      Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this patient!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(`/patients/${user.id}`)
            .then(() => {
              this.displayedPatients = this.displayedPatients.filter(u => u.patient_id !== user.patient_id);
              Swal.fire(
                'Deleted!',
                'Patient deleted successfully!',
                'success'
              );
            })
            .catch(error => {
              console.error('Error deleting patient', error);
              Swal.fire(
                'Error',
                'Failed to delete patient. Please try again later.',
                'error'
              );
            });
        } else {
          Swal.fire(
            'Cancelled',
            'Patient not deleted!',
            'info'
          );
        }
      });
    },

    openDialogPatientHistory(user) { 
      this.selectedUser = user;
      this.dialogPatientHistory = true;
      this.fetchPrescriptions(user.id); // Assuming user.id is the patient_id
    },

    closeDialogPatientHistory() {
      this.dialogPatientHistory = false;
      // Reset selectedUserPrescriptions array
      this.selectedUserPrescriptions = [];
    },

   viewPrescriptions(user) {
      user.showPrescriptions = !user.showPrescriptions;
      if (user.showPrescriptions) {
        this.selectedPatient = user;
        this.fetchPrescriptions(user.id);
        this.fetchGlasses(user.id);
        this.fetchMedicalHistory(user.id); // Assuming user.id is the patient_id
      } else {
        this.selectedPatient = null; // Clear selected patient when hiding prescriptions
      }
    },
   
    openChildUpdateDialog(prescription) {
      const patientId = this.selectedPatient.id; 
      console.log('Opening child update dialog with patient_id:', patientId);
      this.$router.push({ 
        path: '/add/prescription', 
        query: { patient_id: patientId } // Add patient_id as a query parameter
      });
    },
    closeChildUpdateDialog() {
      this.childUpdateDialog = false;
      this.resetEditedItem();
    },

    openDialogPatientGlassesInformation(user) {
      this.selectedUser = user;
      this.dialogPatientGlassesInformation = true;
      this.fetchGlasses(user.id) // Assuming user.id is the patient_id
    },
    closePatientGlassesInformation() {
      this.dialogPatientGlassesInformation = false;
      this.selectedUserGlasses = [];
    
    },
    openChildGlassesDialog(glasses) {
       const patientId = this.selectedPatient.id; 
      console.log('Opening child update dialog with patient_id:', patientId);
      this.$router.push({ 
        path: '/add/spectacles', 
        query: { patient_id: patientId } // Add patient_id as a query parameter
      });
    },
    closeChildGlassesDialog() {
      this.childGlassesDialog = false;
      this.resetEditedItem();
    },
   
    deleteGlasses(patient_id, glasses_id) {
      console.log("Glasses ID:", glasses_id);

      // Display a SweetAlert confirmation before deleting the glasses information
      Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this glasses information!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          // If the user confirms deletion, make a DELETE request to delete the glasses information
          axios.delete(`/patients/${patient_id}/glasses/${glasses_id}`)
            .then(response => {
              // Glasses information deleted successfully
              console.log("Glasses information deleted successfully:", response.data);

              // Provide feedback to the user
              Swal.fire(
                'Deleted!',
                'Glasses information deleted successfully!',
                'success'
              );

              // Fetch updated glasses information for the selected patient
              this.fetchGlasses(patient_id);
            })
            .catch(error => {
              // Error occurred while deleting the glasses information
              console.error("Error deleting glasses information:", error);

              // Provide feedback to the user
              Swal.fire(
                'Error',
                'Failed to delete glasses information. Please try again later.',
                'error'
              );
            });
        } else {
          // If the user cancels deletion, show a message indicating the glasses information was not deleted
          Swal.fire(
            'Cancelled',
            'Glasses information not deleted!',
            'info'
          );
        }
      });
    },
    openMoreHistoryDialog(user) {
      this.selectedUser = user;
      this.dialogMoreHistory = true;
    },
    closeMoreHistoryDialog() {
      this.dialogMoreHistory = false;
    
    },
    openChildHistoryDialog(history) {
      const patientId = this.selectedPatient.id; 
      console.log('Opening child update dialog with patient_id:', patientId);
      this.$router.push({ 
        path: '/add/history', 
        query: { patient_id: patientId } // Add patient_id as a query parameter
      });
    },
    closeChildHistoryDialog() {
      this.childHistoryDialog = false;
      this.resetEditedItem();
    },
     resetEditedItem() {
      this.editedItem = {
        fname: '',
        lname: '',
        mname: '',
        extension: '',
        email: '',
        address: '',
        contact: '',
        birthdate: '',
        password: '',
        confirm_password: '',
        passwordVisible: false,
        confirmPasswordVisible: false,
        left_eye_sphere: '',
        right_eye_sphere: '',
        left_eye_cylinder: '',
        right_eye_cylinder: '',
        left_eye_axis: '',
        right_eye_axis: '',
        reading_add: '',
        best_visual_acuity: '',
        PD: '',
        frame: '',
        type_of_lens: '',
        remarks: '',
        history_updated: '',
        medical_history: '',
        ocular_history: '',
      };
    },
    exportPrescriptionPDF(patients, title) {
      try {
        const doc = new jsPDF();
        const logoImage = '../assets/MVC_logo.png';
 // Constants for layout
        const marginTop = 10;
        const pageHeight = doc.internal.pageSize.height; // Get the height of the page
        const lineHeight = 60; // Height for each patient's section
        let currentY = 70; // Starting Y position on the page

        // Add logo
        doc.addImage(logoImage, 'PNG', 10, 5, 190, 25);

        // Add title and clinic information
        doc.setFontSize(14);
        doc.text('MVC Optical Clinic', 105, 40, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Mauricio Bldg, Brgy. San Antonio, Cabangan, Zambales', 105, 45, { align: 'center' });
        doc.text(title, 105, 55, { align: 'center' });

        patients.forEach((p, index) => {
// Check if there is enough space left on the current page
          if (currentY + lineHeight > pageHeight - marginTop) {
            // Add a new page if we run out of space
            doc.addPage();
            currentY = marginTop; // Reset Y position after adding a new page
          }

          const prescribedDate = new Date(p.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
 // Print Date Prescribed
          doc.setFontSize(18);
 doc.text(`Date Prescribed: ${prescribedDate}`, 10, currentY);
 // Print Right Eye Data
          doc.setFontSize(12);
doc.text('Right Eye:', 10, currentY + 10);
          doc.text(`Sphere: ${p.right_eye_sphere}`, 30, currentY + 10);
          doc.text(`Cylinder: ${p.right_eye_cylinder}`, 70, currentY + 10);
          doc.text(`Axis: ${p.right_eye_axis}`, 110, currentY + 10);
          doc.text(`Best Visual Acuity: ${p.right_eye_best_visual_acuity}`, 150, currentY + 10);

          // Print Left Eye Data
          doc.text('Left Eye:', 10, currentY + 20);
          doc.text(`Sphere: ${p.left_eye_sphere}`, 30, currentY + 20);
          doc.text(`Cylinder: ${p.left_eye_cylinder}`, 70, currentY + 20);
          doc.text(`Axis: ${p.left_eye_axis}`, 110, currentY + 20);
          doc.text(`Best Visual Acuity: ${p.left_eye_best_visual_acuity}`, 150, currentY + 20);
 doc.text(`Reading Add: ${p.reading_add}`, 10, currentY + 30);
          doc.text(`PD: ${p.PD}`, 70, currentY + 30);
    doc.text('-----------------------------------------------------------------------------------------------------------------------------------', 10, currentY + 40);

          // Move currentY for the next patient
          currentY += lineHeight;
        });
// Date Issued (Place it at the last page)
        const currentDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
 if (currentY + 20 > pageHeight - marginTop) {
          // If not enough space, add a new page for the date issued
          doc.addPage();
          currentY = marginTop;
        }
        doc.text(`Date Issued: ${currentDate}`, 195, currentY + 10, { align: 'right' });

        // Save the PDF
        doc.save(`${title}.pdf`);
      } catch (error) {
        console.error('Error exporting PDF:', error);
      }
    },
  exportSpectaclesPDF(patients, title) {
      try {
        const doc = new jsPDF();
        const logoImage = '../assets/MVC_logo.png';
  // Constants for layout
        const marginTop = 10;
        const pageHeight = doc.internal.pageSize.height; // Get the height of the page
        const lineHeight = 60; // Height for each patient's section
        let currentY = 70; // Starting Y position on the page

        // Add logo
        doc.addImage(logoImage, 'PNG', 10, 5, 190, 25);

        // Add title and clinic information
        doc.setFontSize(14);
        doc.text('MVC Optical Clinic', 105, 40, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Mauricio Bldg, Brgy. San Antonio, Cabangan, Zambales', 105, 45, { align: 'center' });
        doc.text(title, 105, 55, { align: 'center' });

        patients.forEach((p, index) => {
 // Check if there is enough space left on the current page
          if (currentY + lineHeight > pageHeight - marginTop) {
            // Add a new page if we run out of space
            doc.addPage();
            currentY = marginTop; // Reset Y position after adding a new page
          }

          const prescribedDate = new Date(p.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
// Print Date Prescribed
          doc.setFontSize(18);
 doc.text(`Date Updated: ${prescribedDate}`, 10, currentY);
// Print Right Eye Data
          doc.setFontSize(12);
 doc.text('Frame:', 10, currentY + 10);
          if (p.product_id) {
            doc.text(`${p.product.product_name}`, 50, currentY + 10);
          }
          else {
            doc.text(`${p.custom_frame}`, 50, currentY + 10);
          }
 // Print Left Eye Data
          doc.text('Type of Lens:', 10, currentY + 20);
          if (p.lens_id) {
            doc.text(`${p.lens.product_name}`, 50, currentY + 20);
          }
          else {
            doc.text(`${p.custom_lens}`, 50, currentY + 20);
          }

  doc.text('Remarks:', 10, currentY + 30);
          doc.text(`${p.remarks}`, 50, currentY + 30);

          doc.text('Price:', 10, currentY + 40);
          doc.text(`${p.price}`, 50, currentY + 40);
  doc.text('-----------------------------------------------------------------------------------------------------------------------------------', 10, currentY + 50);

          // Move currentY for the next patient
          currentY += lineHeight;
        });
  // Date Issued (Place it at the last page)
        const currentDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
 if (currentY + 20 > pageHeight - marginTop) {
          // If not enough space, add a new page for the date issued
          doc.addPage();
          currentY = marginTop;
        }
        doc.text(`Date Issued: ${currentDate}`, 195, currentY + 10, { align: 'right' });

        // Save the PDF
        doc.save(`${title}.pdf`);
      } catch (error) {
        console.error('Error exporting PDF:', error);
      }
    },
    exportHistoryPDF(patients, title) {
      try {
        const doc = new jsPDF();
        const logoImage = '../assets/MVC_logo.png';

        // Constants for layout
        const marginTop = 10;
        const pageHeight = doc.internal.pageSize.height; // Get the height of the page
        const lineHeight = 60; // Height for each patient's section
        let currentY = 70; // Starting Y position on the page

 // Add logo
        doc.addImage(logoImage, 'PNG', 10, 5, 190, 25);

        // Add title and clinic information
        doc.setFontSize(14);
        doc.text('MVC Optical Clinic', 105, 40, { align: 'center' });
        doc.setFontSize(12);
        doc.text('Mauricio Bldg, Brgy. San Antonio, Cabangan, Zambales', 105, 45, { align: 'center' });
        doc.text(title, 105, 55, { align: 'center' });

        patients.forEach((p, index) => {
    // Check if there is enough space left on the current page
          if (currentY + lineHeight > pageHeight - marginTop) {
            // Add a new page if we run out of space
            doc.addPage();
            currentY = marginTop; // Reset Y position after adding a new page
          }

          const prescribedDate = new Date(p.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
 // Print Date Updated
          doc.setFontSize(18);
  doc.text(`Date Updated: ${prescribedDate}`, 10, currentY);
 // Print Medical History
          doc.setFontSize(12);
 doc.text('Medical History:', 10, currentY + 10);
          doc.text(`${p.medical_history}`, 50, currentY + 10);
 // Print Ocular History
          doc.text('Ocular History:', 10, currentY + 20);
          doc.text(` ${p.ocular_history}`, 50, currentY + 20);
  doc.text('-----------------------------------------------------------------------------------------------------------------------------------', 10, currentY + 40);

          // Move currentY for the next patient
          currentY += lineHeight;
        });
 // Date Issued (Place it at the last page)
        const currentDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
 if (currentY + 20 > pageHeight - marginTop) {
          // If not enough space, add a new page for the date issued
          doc.addPage();
          currentY = marginTop;
        }
        doc.text(`Date Issued: ${currentDate}`, 195, currentY + 10, { align: 'right' });

        // Save the PDF
        doc.save(`${title}.pdf`);
      } catch (error) {
        console.error('Error exporting PDF:', error);
      }
    },
      async exportPrescriptionExcel(patients, title) {
      try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');
  const imagePath = '../assets/MVC_logo.png'; // Provide the correct path to your image
        const imageBuffer = await fetch(imagePath).then(res => res.arrayBuffer());
        
        const imageId = workbook.addImage({
          buffer: imageBuffer,
          extension: 'png',
        });

        // Add the image to the worksheet
        worksheet.addImage(imageId, {
          tl: { col: 2, row: 0 },
          ext: { width: 650, height: 100 },
        });

        // Define cells to merge
        const mergeCells = [
          { range: 'C6:E6', value: 'MVC Optical Clinic' },
          { range: 'C7:E7', value: 'Mauricio Bldg, Brgy. San Antonio, Cabangan, Zambales' },
          { range: 'C8:E8', value: `As of: ${new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: 'long', day: 'numeric'})}` },
          { range: 'C9:E9', value: title }
        ];

        // Merge cells and set their values
        mergeCells.forEach(cell => {
          if (!worksheet.getCell(cell.range).isMerged) {
            worksheet.mergeCells(cell.range);
            worksheet.getCell(cell.range).value = cell.value;
            worksheet.getCell(cell.range).font = { size: 14, bold: true };
            worksheet.getCell(cell.range).alignment = { horizontal: 'center', vertical: 'middle' };
          }
        });

        worksheet.getCell('C6').font.size = 16; // Make the title bigger
        worksheet.getCell('C9').font.size = 16;

        // Add column headers
        const headers = ['Date', 'Eye', 'Sphere', 'Cylinder', 'Axis', 'Best Visual Acuity'];
        worksheet.addRow(headers);

        // Set specific column widths to reduce cell size
        worksheet.getColumn('A').width = 15; 
        worksheet.getColumn('B').width = 15; 
        worksheet.getColumn('C').width = 10; 
        worksheet.getColumn('D').width = 10; 
        worksheet.getColumn('E').width = 10; 
        worksheet.getColumn('F').width = 20; 

        // Add data rows for each patient
        patients.forEach(p => {
          const date = new Date(p.created_at).toLocaleDateString('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: 'long', day: 'numeric' });

          worksheet.addRow([date, 'Right Eye', p.right_eye_sphere, p.right_eye_cylinder, p.right_eye_axis, p.best_visual_acuity]);
          worksheet.addRow(['', 'Left Eye', p.left_eye_sphere, p.left_eye_cylinder, p.left_eye_axis, p.best_visual_acuity]);
          worksheet.addRow(['', 'Reading Add', p.reading_add, '', '', 'PD: ' + p.PD]);
          worksheet.addRow([]);  // Empty row for spacing
        });

        this.autoAdjustColumns(worksheet);
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, `${title}.xlsx`);
        console.log('Excel file created successfully!');
      } catch (error) {
        console.error('Error exporting Excel:', error);
      }
  },
  async exportSpecraclesExcel(patients, title) {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');
  const imagePath = '../assets/MVC_logo.png'; // Provide the correct path to your image
    const imageBuffer = await fetch(imagePath).then(res => res.arrayBuffer());
    
    const imageId = workbook.addImage({
      buffer: imageBuffer,
      extension: 'png',
    });

    // Add the image to the worksheet
    worksheet.addImage(imageId, {
      tl: { col: 2, row: 0 },
      ext: { width: 650, height: 100 },
    });

    // Define cells to merge
    const mergeCells = [
      { range: 'C6:E6', value: 'MVC Optical Clinic' },
      { range: 'C7:E7', value: 'Mauricio Bldg, Brgy. San Antonio, Cabangan, Zambales' },
      { range: 'C8:E8', value: `As of: ${new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: 'long', day: 'numeric'})}` },
      { range: 'C9:E9', value: title }
    ];

    // Merge cells and set their values
    mergeCells.forEach(cell => {
      if (!worksheet.getCell(cell.range).isMerged) {
        worksheet.mergeCells(cell.range);
        worksheet.getCell(cell.range).value = cell.value;
        worksheet.getCell(cell.range).font = { size: 14, bold: true };
        worksheet.getCell(cell.range).alignment = { horizontal: 'center', vertical: 'middle' };
      }
    });

    worksheet.getCell('C6').font.size = 16; // Make the title bigger
    worksheet.getCell('C9').font.size = 16;

 const headers = ['Date', 'Frame', 'Type of Lens', 'Remarks', 'Price'];
    worksheet.addRow(headers);

    // Set specific column widths
    worksheet.getColumn('A').width = 15; // Date
    worksheet.getColumn('B').width = 20; // Frame
    worksheet.getColumn('C').width = 20; // Type of Lens
    worksheet.getColumn('D').width = 30; // Remarks
    worksheet.getColumn('E').width = 20; // Remarks

    // Add data rows for each patient
    patients.forEach(p => {
      const date = new Date(p.created_at).toLocaleDateString('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: 'long', day: 'numeric' });
  worksheet.addRow([
        date,
        p.product_id ? p.product.product_name : p.custom_frame, // Use product name if selected, otherwise custom frame
        p.lens_id ? p.lens.product_name : p.custom_lens,        // Use lens name if selected, otherwise custom lens
        p.remarks,
        p.price
      ]);
    });

    this.autoAdjustColumns(worksheet);
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, `${title}.xlsx`);
    console.log('Excel file created successfully!');
  } catch (error) {
    console.error('Error exporting Excel:', error);
  }
},

async exportHistoryExcel(patients, title) {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');
 const imagePath = '../assets/MVC_logo.png'; // Provide the correct path to your image
    const imageBuffer = await fetch(imagePath).then(res => res.arrayBuffer());
    
    const imageId = workbook.addImage({
      buffer: imageBuffer,
      extension: 'png',
    });

    // Add the image to the worksheet
    worksheet.addImage(imageId, {
      tl: { col: 2, row: 0 },
      ext: { width: 650, height: 100 },
    });

    // Define cells to merge
    const mergeCells = [
      { range: 'C6:E6', value: 'MVC Optical Clinic' },
      { range: 'C7:E7', value: 'Mauricio Bldg, Brgy. San Antonio, Cabangan, Zambales' },
      { range: 'C8:E8', value: `As of: ${new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: 'long', day: 'numeric'})}` },
      { range: 'C9:E9', value: title }
    ];

    // Merge cells and set their values
    mergeCells.forEach(cell => {
      if (!worksheet.getCell(cell.range).isMerged) {
        worksheet.mergeCells(cell.range);
        worksheet.getCell(cell.range).value = cell.value;
        worksheet.getCell(cell.range).font = { size: 14, bold: true };
        worksheet.getCell(cell.range).alignment = { horizontal: 'center', vertical: 'middle' };
      }
    });

    worksheet.getCell('C6').font.size = 16; // Make the title bigger
    worksheet.getCell('C9').font.size = 16;

    // Add column headers for Date, Frame, Type of Lens, and Remarks
    const headers = ['Date', 'Medical History', 'Ocular History'];
    worksheet.addRow(headers);

    // Set specific column widths
    worksheet.getColumn('A').width = 15; // Date
    worksheet.getColumn('B').width = 20; // Frame
    worksheet.getColumn('C').width = 20; // Type of Lens

    // Add data rows for each patient
    patients.forEach(p => {
      const date = new Date(p.created_at).toLocaleDateString('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: 'long', day: 'numeric' });
      worksheet.addRow([date, p.medical_history, p.ocular_history]);
    });

    this.autoAdjustColumns(worksheet);
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, `${title}.xlsx`);
    console.log('Excel file created successfully!');
  } catch (error) {
    console.error('Error exporting Excel:', error);
  }
},


autoAdjustColumns(worksheet) {
  worksheet.columns.forEach(column => {
    const maxLength = column.values.reduce((max, value) => {
      return Math.max(max, String(value).length);
    }, 0);
    column.width = Math.min(maxLength + 2, 30);
  });
}



  },

};
</script>

<style scoped>
.styled-btn {
  background-color: #B3D9E6 !important;
  color: white !important;
  font-weight: bold !important;
}

.styled-btn-text {
  font-weight: bold;
  color: black !important;
}

.styled-btn .v-icon {
  margin-right: 8px; /* Add spacing between icon and text */
  color: black;
}

.generateBtn{
  position: absolute;
  right: 0;
  top: 0;
  margin-top: 70px;
  margin-right: 25px;
}

td{
  text-align: center;
}

@media (max-width: 960px) {
  .operationTxt {
    font-size: 10px !important;
  }

  .styled-btn-text {
    display: none;
  }

  .listOfPat {
    display: none;
  }

  .v-data-table {
    font-size: 1px;
  }

  .prescriptionTitle {
    font-size: 10px;
  }

  .presName{
    font-size: 16px;
    text-align: center;
    background-color: rgb(155, 209, 239);
  }

  .presDate {
    font-size: 13px;
  }

  .prescription-table-container .v-card {
    width: 800px;
  }

  .v-row {
    font-size: 12px;
  }

  .v-btn {
    font-size: 12px;
    margin-bottom: 10px;
  }
  
  .deleteText{
    display: none;
  }
  
  .glassDate{
    font-size: 15px;
  }

  .historyDate{
    font-size: 15px;
  }

  .generateBtn {
    width: 100%; 
    margin-top: -30px;
    justify-content: center;
    position: relative;
  }
}
</style>

