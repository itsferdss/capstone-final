<template>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="displayedPatients"
    :sort-by="[{ key: 'patient_id', order: 'asc' }]"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-text-field
          v-model="search"
          class="w-auto mr-4"
          density="compact"
          label="Search User"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
          style="max-width: 300px;"
        ></v-text-field>

        <v-dialog v-model="dialog" max-width="1000px">
          <template v-slot:activator="{ props }">
            <v-btn @click="openDialog" color="#35623D" dark v-bind="props" style="font-weight: bold;">Add new Patient</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h6 m-2">New User</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row dense>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.full_name" label="User Name*" prepend-icon="mdi-account" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.email" label="Email*" prepend-icon="mdi-email" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.address" label="Address" prepend-icon="mdi-map-marker" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.contact" label="Contact Number" prepend-icon="mdi-phone" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.birthdate" label="Birthdate" type="date" prepend-icon="mdi-calendar" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="editedItem.password"
                      label="Password"
                      prepend-icon="mdi-lock"
                      :append-icon="editedItem.passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="editedItem.passwordVisible ? 'text' : 'password'"
                      @click:append="editedItem.passwordVisible = !editedItem.passwordVisible"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="editedItem.confirm_password"
                      label="Confirm Password"
                      prepend-icon="mdi-lock"
                      :append-icon="editedItem.confirmPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="editedItem.confirmPasswordVisible ? 'text' : 'password'"
                      @click:append="editedItem.confirmPasswordVisible = !editedItem.confirmPasswordVisible"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="black" text @click="closeDialog">Cancel</v-btn>
              <v-btn color="black" text @click="saveNewUser">Save User</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.id }}</td>
        <td>{{ item.full_name }} </td>
        <td>{{ item.contact }}</td>
        <td>{{ item.address }}</td>
        <td>
          <v-icon class="me-2" size="small" style="color: #2F3F64" @click="viewPrescriptions(item)">mdi-information</v-icon>
          <v-icon size="small" style="color: #2F3F64" @click="deleteUser(item)">mdi-delete</v-icon>
        </td>
      </tr>

      <tr v-if="item.showPrescriptions">
        <td :colspan="headers.length + 5">
          <v-row justify="space-between">
            <v-col cols="4">
              <v-btn @click="openDialogPatientHistory(item)" block>View Patient's Prescription History</v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn @click="openDialogPatientGlassesInformation(item)" block>View Patient's Spectacles</v-btn>
            </v-col>
            <v-col cols="4">
              <v-btn @click="openMoreHistoryDialog(item)" block>View Patient's Medical History</v-btn>
            </v-col>
          </v-row>
        </td>
      </tr>

      <!--DIALOG FOR DELETE USER-->
      <v-dialog v-model="dialogDelete" max-width="200px">
        <v-card>
          <v-card-title style="font-weight: bold; text-align: center;">Delete this user?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#35623D" variant="text" @click="closeDelete">Cancel</v-btn>
            <v-btn color="#35623D" variant="text" @click="deleteUserConfirm">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--DIALOG FOR PATIENT HISTORY-->
      <v-dialog v-model="dialogPatientHistory" max-width="1300px">
        <v-card>
          <v-card-title>{{ selectedUser.full_name }}'s Past Prescriptions</v-card-title>
          <v-card-text>
            <v-btn @click="openChildUpdateDialog" color="#35623D" dark style="font-weight: bold;">Add Prescription</v-btn>
            <span>&nbsp;</span>
            <v-btn color="primary" @click="closeDialogPatientHistory">Close</v-btn>
            
            <!-- Loop through selectedUserPrescriptions -->
             <v-card v-for="(prescription, index) in sortedPrescriptions" :key="index" class="mb-4">
              <!-- Display prescription information -->
              <v-card-title>Prescription Date: {{ formatPrescriptionDate(prescription.created_at) }}</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="3" md="3">
                    <strong>Left Eye Sphere:</strong> {{ prescription.left_eye_sphere }}
                  </v-col>
                  <v-col cols="3" md="3">
                    <strong>Left Eye Cylinder:</strong> {{ prescription.left_eye_cylinder }}
                  </v-col>
                  <v-col cols="3" md="4">
                    <strong>Left Eye Axis:</strong> {{ prescription.left_eye_axis }}
                  </v-col>
                  <v-col cols="3" md="3">
                    <strong>Right Eye Sphere:</strong> {{ prescription.right_eye_sphere }}
                  </v-col>
                  <v-col cols="3" md="3">
                    <strong>Right Eye Cylinder:</strong> {{ prescription.right_eye_cylinder }}
                  </v-col>
                  <v-col cols="3" md="4">
                    <strong>Right Eye Axis:</strong> {{ prescription.right_eye_axis }}
                  </v-col>
                  <v-col cols="3" md="3">
                    <strong>Reading Add:</strong> {{ prescription.reading_add }}
                  </v-col>
                  <v-col cols="3" md="3">
                    <strong>Best Visual Acuity:</strong> {{ prescription.best_visual_acuity }}
                  </v-col>
                  <v-col cols="4" md="6">
                    <strong>PD:</strong> {{ prescription.PD }}
                  </v-col>
                <v-btn color="error" @click="deletePrescription(selectedPatient.id, prescription.id)">Delete</v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-dialog>


      <!--DIALOG FOR EYE UPDATE/PRESCRIPTION-->
      <v-dialog v-model="childUpdateDialog" max-width="500px">
        <v-card>
          <v-card-title>New Prescription</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <v-text-field v-model="selectedPatient.id" label="Patient ID" readonly></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.left_eye_sphere" label="Left Eye Sphere" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.right_eye_sphere" label="Right Eye Sphere" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.left_eye_cylinder" label="Left Eye Cylinder" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.right_eye_cylinder" label="Right Eye Cylinder" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.left_eye_axis" label="Left Eye Axis" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.right_eye_axis" label="Right Eye Axis" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.reading_add" label="Reading Add" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.best_visual_acuity" label="Best Visual Acuity" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.PD" label="PD" required></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="closeChildUpdateDialog">Cancel</v-btn>
            <v-btn color="#35623D" @click="savePrescription">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--DIALOG FOR PATIENT GLASSES-->
      <template>
        <v-dialog v-model="dialogPatientGlassesInformation" max-width="1300px">
          <v-card>
            <v-card-title>{{ selectedUser.full_name }}'s Spectacles Information</v-card-title>
            <v-card-text>
              <v-btn @click="openChildGlassesDialog" color="#35623D" dark style="font-weight: bold;">Add Spectacles</v-btn>
              <span>&nbsp;</span>
              <v-btn color="primary" @click="closePatientGlassesInformation">Close</v-btn>

              <v-card v-for="(glasses, index) in sortedGlasses" :key="index" class="mb-4">
              <v-card-title>Updated At: {{ formatPrescriptionDate(glasses.created_at) }}</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="3" md="6">
                      <strong>Frame:</strong> {{ glasses.frame }}
                    </v-col>
                    <v-col cols="3" md="6">
                      <strong>Type of Lens:</strong> {{ glasses.type_of_lens }}
                    </v-col>
                    <v-col cols="4" md="12">
                      <strong>Remarks:</strong> {{ glasses.remarks }}
                    </v-col>
                    <v-col cols="2" md="12">
                      <v-btn color="error" @click="deleteGlasses(selectedPatient.id, glasses.id)">Delete</v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </v-dialog>
      </template>

      <!--DIALOG FOR GLASSES UPDATE-->
      <v-dialog v-model="childGlassesDialog" max-width="500px">
        <v-card>
          <v-card-title>New Glasses</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.frame" label="Frame" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.type_of_lens" label="Type of Lens" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="editedItem.remarks" label="Remarks" required></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="closeChildGlassesDialog">Cancel</v-btn>
                 <v-btn color="#35623D" @click="saveChildGlasses">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      


      <!--BACKEND DONE!!!-->






      <!--DIALOG FOR MORE HISTORY-->
      <v-dialog v-model="dialogMoreHistory" max-width="1300px">
        <v-card>
          <v-card-title>{{ selectedUser.full_name }}'s Medical History</v-card-title>
          <v-card-text>
            <v-btn @click="openChildHistoryDialog" color="#35623D" dark style="font-weight: bold;">Add Medical History</v-btn>
            <span>&nbsp;</span>
            <v-btn color="primary" @click="closeMoreHistoryDialog">Close</v-btn>

           <v-card v-for="(history, index) in sortedHistory" :key="index" class="mb-4">
             <v-card-title>Updated At: {{ formatPrescriptionDate(history.created_at) }}</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="3" md="12">
                    <strong>Medical History:</strong> {{ history.medical_history }}
                  </v-col>
                  <v-col cols="3" md="12">
                    <strong>Ocular History:</strong> {{ history.ocular_history }}
                  </v-col>
                  <v-btn color="error" @click="deleteHistory(selectedPatient.id, history.id)">Delete</v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-dialog>

      
      
      


      <!--DONE NA YUNG TAAS-->

          

      <!--DIALOG FOR HISTORY UPDATE-->
      <v-dialog v-model="childHistoryDialog" max-width="500px">
        <v-card>
          <v-card-title>New Medical History</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-textarea v-model="editedItem.medical_history" label="Medical History" required></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="editedItem.ocular_history" label="Ocular History" required></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#35623D" @click="saveNewHistory">Save</v-btn>
            <v-btn color="error" @click="closeChildHistoryDialog">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-data-table>
</template>

<script>
import swal from 'sweetalert';
import axios from 'axios';

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
      selectedPatient: null,
      editedItem: {
        id: '',
        full_name: '',
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
        patient_id: '',
        prescription_id: '',

        frame: '',
        type_of_lens: '',
        remarks: '',

        history_updated: '',
        medical_history: '',
        ocular_history: '',
      },
      headers: [
        { title: 'User ID',  key: 'id' },
        { title: 'User Name', key: 'full_name' },
        { title: 'Contact Number', key: 'contact' },
        { title: 'Address', key: 'address' }, 
        { title: 'Actions', sortable: false },
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
  
},
  mounted() {
    this.fetchPatients();
  },
  methods: {
    
    fetchPatients() {
      axios.get('http://127.0.0.1:8000/api/patients')
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

     saveNewUser() {
      axios.post('/patients', this.editedItem)
        .then(response => {
          this.displayedPatients.push(response.data);
          this.closeDialog();
          swal({
            title: "Success",
            text: "Patient created successfully!",
            icon: "success",
          });
        })
        .catch(error => {
          console.error('Error creating patient', error);
          swal({
            title: "Error",
            text: "Failed to create patient. Please try again later.",
            icon: "error",
          });
        });
    },
      resetForm(){
        this.editedItem = {
          full_name: '',
          email: '',
          address: '',
          contact: '',
          birthdate: '',
          password: '',
        };
      },
      savePrescription() {
        // Check if selectedPatient is valid
        if (!this.selectedPatient || !this.selectedPatient.id) {
          console.error("Error: No selected patient or patient ID");
          return;
        }

        // Check if editedItem contains all necessary data
        if (!this.editedItem) {
          console.error("Error: No prescription data available");
          return;
        }

        // Extract prescription data from editedItem
        const prescriptionData = {
          patient_id: this.selectedPatient.id, // Populate patient_id with selectedPatient's id
          left_eye_sphere: this.editedItem.left_eye_sphere,
          right_eye_sphere: this.editedItem.right_eye_sphere,
          left_eye_cylinder: this.editedItem.left_eye_cylinder,
          right_eye_cylinder: this.editedItem.right_eye_cylinder,
          left_eye_axis: this.editedItem.left_eye_axis,
          right_eye_axis: this.editedItem.right_eye_axis,
          reading_add: this.editedItem.reading_add,
          best_visual_acuity: this.editedItem.best_visual_acuity,
          PD: this.editedItem.PD
        };

        // Make a POST request to save the new prescription
       axios.post(`/patients/${this.selectedPatient.id}/prescriptions`, prescriptionData)
        .then(response => {
          // Prescription saved successfully
          console.log("Prescription saved successfully:", response.data);

          // Prepend the newly saved prescription to the beginning of the selectedUserPrescriptions array
          this.selectedUserPrescriptions.unshift(response.data);

          // Provide feedback to the user
          swal({
            title: "Success",
            text: "Prescription saved successfully!",
            icon: "success",
          });
          // Close the dialog after saving
          this.childUpdateDialog = false;
        })
        .catch(error => {
          // Error occurred while saving the prescription
          console.error("Error saving prescription:", error);

          // Provide feedback to the user
          swal({
            title: "Error",
            text: "Failed to save prescription. Please try again later.",
            icon: "error",
          });
        });
    },
       saveChildGlasses() {
          if (!this.selectedPatient || !this.selectedPatient.id) {
          console.error("Error: No selected patient or patient ID");
          return;
        }

        // Check if editedItem contains all necessary data
        if (!this.editedItem) {
          console.error("Error: No glasses information available");
          return;
        }

        // Extract glasses information from editedItem
        const glassesData = {
          patient_id: this.selectedPatient.id, // Populate patient_id with selectedPatient's id
          frame: this.editedItem.frame,
          type_of_lens: this.editedItem.type_of_lens,
          remarks: this.editedItem.remarks
        };

        // Make a POST request to save the new glasses information
        axios.post(`/patients/${this.selectedPatient.id}/glasses`, glassesData)
          .then(response => {
            // Glasses information saved successfully
            console.log("Glasses information saved successfully:", response.data);

            // Provide feedback to the user
            swal({
              title: "Success",
              text: "Glasses information saved successfully!",
              icon: "success",
            });

            // Close the dialog after saving
            this.childGlassesDialog = false;

            // Fetch glasses information for the selected patient
            this.fetchGlasses(this.selectedPatient.id);
          })
          .catch(error => {
            // Error occurred while saving the glasses information
            console.error("Error saving glasses information:", error);

            // Provide feedback to the user
            swal({
              title: "Error",
              text: "Failed to save glasses information. Please try again later.",
              icon: "error",
            });
          });
        },
        saveNewHistory() {
          // Check if selectedPatient is valid
          if (!this.selectedPatient || !this.selectedPatient.id) {
            console.error("Error: No selected patient or patient ID");
            return;
          }

          // Check if editedItem contains all necessary data
          if (!this.editedItem) {
            console.error("Error: No medical history data available");
            return;
          }

          // Extract medical history data from editedItem
          const historyData = {
            patient_id: this.selectedPatient.id, // Populate patient_id with selectedPatient's id
            medical_history: this.editedItem.medical_history,
            ocular_history: this.editedItem.ocular_history
          };

          // Make a POST request to save the new medical history
          axios.post(`/patients/${this.selectedPatient.id}/history`, historyData)
            .then(response => {
              // Medical history saved successfully
              console.log("Medical history saved successfully:", response.data);

              swal({
              title: "Success",
              text: "Medical Information saved successfully!",
              icon: "success",
            });
              // Close the dialog after saving
              this.childHistoryDialog = false;

              // Optionally, fetch updated patient data
              this.fetchMedicalHistory(this.selectedPatient.id);
            })
            .catch(error => {
              // Error occurred while saving the medical history
              console.error("Error saving medical history:", error);

              // Provide feedback to the user
                swal({
                title: "Error",
                text: "Failed to save glasses information. Please try again later.",
                icon: "error",
              });
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
    // Display a SweetAlert confirmation before deleting the prescription
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this prescription!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            // If the user confirms deletion, make a DELETE request to delete the prescription
            axios.delete(`/patients/${patient_id}/prescriptions/${prescription_id}`)
            .then(response => {
                // Prescription deleted successfully
                console.log("Prescription deleted successfully:", response.data);

                // Provide feedback to the user
                swal({
                    title: "Success",
                    text: "Prescription deleted successfully!",
                    icon: "success",
                });
                
                 this.fetchPrescriptions(patient_id);
                // Optionally, you may remove the deleted prescription from the list if needed
                // this.selectedUserPrescriptions = this.selectedUserPrescriptions.filter(prescription => prescription.id !== prescription_id);
            })
            .catch(error => {
                // Error occurred while deleting the prescription
                console.error("Error deleting prescription:", error);

                // Provide feedback to the user
                swal({
                    title: "Error",
                    text: "Failed to delete prescription. Please try again later.",
                    icon: "error",
                });
            });
        } else {
            // If the user cancels deletion, show a message indicating the prescription was not deleted
            swal("Prescription not deleted!");
        }
    });
},
  deleteHistory(patient_id, history_id) {
    console.log("History ID:", history_id);
    // Display a SweetAlert confirmation before deleting the history
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this medical history!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        // If the user confirms deletion, make a DELETE request to delete the medical history
        axios.delete(`/patients/${patient_id}/history/${history_id}`)
        .then(response => {
          // History deleted successfully
          console.log("History deleted successfully:", response.data);

          // Provide feedback to the user
          swal({
            title: "Success",
            text: "Medical history deleted successfully!",
            icon: "success",
          });

          this.fetchMedicalHistory(patient_id);

          // Optionally, you may fetch updated patient data or update the history list
          // this.fetchPatientData(patient_id);
          // this.fetchHistories(patient_id);
        })
        .catch(error => {
          // Error occurred while deleting the history
          console.error("Error deleting medical history:", error);

          // Provide feedback to the user
          swal({
            title: "Error",
            text: "Failed to delete medical history. Please try again later.",
            icon: "error",
          });
        });
      } else {
        // If the user cancels deletion, show a message indicating the history was not deleted
        swal("Medical history not deleted!");
      }
    });
  },



    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.resetEditedItem();
    },
   
    deleteUser(user) {
      swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this patient!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          axios.delete(`/patients/${user.id}`)
            .then(() => {
              this.displayedPatients = this.displayedPatients.filter(u => u.patient_id !== user.patient_id);
              swal("Patient deleted successfully!", {
                icon: "success",
              });
            })
    
            .catch(error => {
              console.error('Error deleting patient', error);
              swal("Error", "Failed to delete patient. Please try again later.", "error");
            });
        } else {
          swal("Patient not deleted!");
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
      this.editedItem = { ...prescription };
      this.childUpdateDialog = true;
      
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
      this.editedItem = { ...glasses };
      this.childGlassesDialog = true;
    },
    closeChildGlassesDialog() {
      this.childGlassesDialog = false;
      this.resetEditedItem();
    },
   
    deleteGlasses(patient_id, glasses_id) {
     console.log("Glasses ID:", glasses_id);
  
  // Display a SweetAlert confirmation before deleting the glasses information
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this glasses information!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      // If the user confirms deletion, make a DELETE request to delete the glasses information
      axios.delete(`/patients/${patient_id}/glasses/${glasses_id}`)
        .then(response => {
          // Glasses information deleted successfully
          console.log("Glasses information deleted successfully:", response.data);

          // Provide feedback to the user
          swal({
            title: "Success",
            text: "Glasses information deleted successfully!",
            icon: "success",
          });

          // Fetch updated glasses information for the selected patient
          this.fetchGlasses(patient_id);
        })
        .catch(error => {
          // Error occurred while deleting the glasses information
          console.error("Error deleting glasses information:", error);

          // Provide feedback to the user
          swal({
            title: "Error",
            text: "Failed to delete glasses information. Please try again later.",
            icon: "error",
          });
        });
    } else {
      // If the user cancels deletion, show a message indicating the glasses information was not deleted
      swal("Glasses information not deleted!");
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
      this.editedItem = { ...history};
      this.childHistoryDialog = true;
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
  },
};
</script>

<style>
</style>
