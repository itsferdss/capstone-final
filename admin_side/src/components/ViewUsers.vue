<template>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="displayedUsers"  
    :sort-by="[{ key: 'userId', order: 'asc' }]"
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
        
        <!--Dialog for new users-->
<v-dialog v-model="dialog" max-width="1000px">
  <template v-slot:activator="{ props }">
    <v-btn @click="openDialog"  color="#35623D" dark v-bind="props" style="font-weight: bold;">Add new Patient</v-btn>
  </template>
  
  <!--DIALOG FOR NEW USER-->
 <v-card>
    <v-card-title>
        <span class="text-h6 m-2">New User</span>
    </v-card-title>
    <v-card-text>
        <v-container>
            <v-row dense>
                <v-col cols="12">
                    <v-text-field v-model="editedItem.user_name" label="User Name*" prepend-icon="mdi-account" required></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field v-model="editedItem.user_email" label="Email*" prepend-icon="mdi-email" required></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field v-model="editedItem.user_address" label="Address" prepend-icon="mdi-map-marker" required></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="editedItem.user_contact_number" label="Contact Number" prepend-icon="mdi-phone" required></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="editedItem.user_birthdate" label="Birthdate" type="date" prepend-icon="mdi-calendar" required></v-text-field>
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

    <!--HEADER OF TABLE-->
<template v-slot:item="{ item }">
      <tr>
        <td>{{ item.user_id }}</td>
        <td>{{ item.first_name }} {{ item.middle_name }} {{ item.last_name }} {{ item.extension }}</td>
        <td>{{ item.contact_number }}</td>
        <td>{{ item.address }}</td>
        <td>
          <v-icon class="me-2" size="small" style="color: #2F3F64" @click="viewPrescriptions(item)">mdi-information</v-icon>

          <v-icon size="small" style="color: #2F3F64" @click="deleteUser(item)">mdi-delete</v-icon>
        </td>
      </tr>

        <!--Add Prescription Bellow the name-->
          <tr v-if="item.showPrescriptions">
          <td :colspan="headers.length + 5">
            <v-row justify="space-between">
              <v-col cols="4">
                <v-btn @click="openDialogPatientHistory(item)" block>
                  View Patient's Prescription History
                </v-btn>
              </v-col>
              <v-col cols="4">
                <v-btn @click="openPatientGlassesInformation(item)" block>
                  View Patient's Spectacles
                </v-btn>
              </v-col>
              <v-col cols="4">
                <v-btn @click="openMoreHistoryDialog(item)" block>
                  View Patient's Medical History
                </v-btn>
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
            <v-btn color=#35623D variant="text" @click="closeDelete">Cancel</v-btn>
            <v-btn color=#35623D variant="text" @click="deleteUserConfirm">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>



      <!--Dialog for Patient HIstory-->
<v-dialog v-model="dialogPatientHistory" max-width="1300px">
  <v-card>
    <v-card-title>{{ item.first_name }}'s Past Prescriptions</v-card-title>
    <v-card-text>
      <v-btn @click="openChildUpdateDialog" color="#35623D" dark style="font-weight: bold;">Add Prescription</v-btn>
      <span>&nbsp;</span>
      <v-btn color="primary" @click="closeDialogPatientHistory">Close</v-btn>

      <!--PRESCRIPTIONS-->
      <!-- Sort prescriptions from latest to oldest -->
      <v-card v-for="(prescription, index) in item.prescription.slice().reverse()" :key="index" class="mb-4">
        <v-card-title>Prescription Date: {{ prescription.date_updated }}</v-card-title> <!-- Changed title here -->
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
            <v-btn color="error" @click="deletePrescription(item, index)">Delete</v-btn>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- New Box for Prescriptions -->
      <v-card class="mb-4">
        <v-card-title>New Prescription</v-card-title>
        <v-card-text>
          <!-- Content for adding a new prescription goes here -->
          <!-- You can use your existing dialog and form components here -->
          <!-- Example: <v-btn @click="openChildUpdateDialog" color="#35623D" dark>Add Prescription</v-btn> -->
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</v-dialog>



      <!--DIALOG FOR EYE UPDATE-->
<v-dialog v-model="childUpdateDialog" max-width="500px">
  <v-card>
    <v-card-title>
      New Prescription
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-container>
          <v-row>
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
            <v-col cols="12">
              <v-text-field v-model="editedItem.PD" label="PD" required></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="editedItem.reading_add" label="Reading Add" required></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="editedItem.best_visual_acuity" label="Best Visual Acuity" required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="editedItem.dateUpdated" label="Date Updated" type="date" required></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="saveNewPrescription">Save</v-btn>
      <v-btn color="error" @click="closeChildUpdateDialog">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!--DIALOG FOR DETAILED HISTORY-->
<template>
  <v-dialog v-model="MoreHistoryDialog" max-width="1200px">
    <v-card>
      <v-card-title>{{ item.first_name }}'s Medical History</v-card-title>
      <v-card-text>
        <v-btn color="#35623D" @click="MedicalHistoryDialog">Add New</v-btn>
        <span>&nbsp;</span>
        <v-btn color="error" @click="closeMoreHistoryDialog">Close</v-btn>
        <!-- FIRST CARD -->
        <v-card class="mb-12">
          <v-card-title>Patient's Information</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="3" md="3">
                <strong>Medical Health Record:</strong> {{ medicalHistory.user_medical_health }} 
              </v-col>
              <v-col cols="3" md="3">
                <strong>Ocular Health Record:</strong> {{ medicalHistory.user_ocular_health }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

      <!--GLASSES INFORMATION-->
     <v-dialog v-model="PatientGlassesInformation" max-width="1000px">
        <v-card>
          <v-card-title>{{ item.first_name }}'s Spectacles</v-card-title>
          <v-card-text>
            <v-btn @click="openGlassesUpdateDialog" color="#35623D" dark style="font-weight: bold;">Add New</v-btn>
              <span>&nbsp;</span>
            <v-btn color="primary" @click="closePatientGlassesInformation">Close</v-btn>

            <v-card v-for="(glasses, index) in item.glasses.slice().reverse()" :key="index" class="mb-4">
              <v-card-title>Updated at: {{ glasses.glasses_updated }}</v-card-title> <!-- Changed title here -->
              <v-card-text>
                <v-row>
                  <v-col cols="3" md="6">
                    <strong>Frame:</strong> {{ glasses.frame }}
                  </v-col>
                  <v-col cols="3" md="6">
                    <strong>Type of Lens:</strong> {{ glasses.type_lens }}
                  </v-col>
                  <v-col cols="12" md="12">
                    <strong>Remarks:</strong> {{ glasses.remarks }}
                  </v-col>
                  <v-btn color="error" @click="deleteGlasses(item, index)">Delete</v-btn>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- New Box for Glasses -->
            <v-card class="mb-4">
              <v-card-title>New Glasses Information</v-card-title>
              <v-card-text>
                <!-- Content for adding new glasses information goes here -->
                <!-- You can use your existing dialog and form components here -->
                <!-- Example: <v-btn @click="openChildUpdateDialog" color="#35623D" dark>Add Glasses Information</v-btn> -->
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-dialog>
      
      <!--DIALOG FOR GLASS UPDATE-->
      <v-dialog v-model="GlassesUpdateDialog" max-width="500px">
        <v-card>
          <v-card-title>
            Glass Update
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.frame" label="Frame"  required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.type_lens" label="Type of Lens"  required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.glasses_updated" label="Date Updated" type="date" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="editedItem.remarks" label="Remarks" required></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="saveGlassInformation">Save</v-btn>
            <v-btn color="error" @click="closeChildUpdateDialog">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--DIALOG FOR ADD MEDICAL HISTORY-->
      <v-dialog v-model="MedicalHistoryDialog" max-width="500px">
        <v-card>
          <v-card-title>
            Glass Update
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.frame" label="Frame"  required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.type_lens" label="Type of Lens"  required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.glasses_updated" label="Date Updated" type="date" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="editedItem.remarks" label="Remarks" required></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="saveGlassInformation">Save</v-btn>
            <v-btn color="error" @click="closeChildUpdateDialog">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-data-table>
</template>
<script>
export default {
  data() {
    return {
      dialogPatientHistory: false,
      childUpdateDialog: false,
      vaccinationDialog: false,
      detailedPrescription: false,
      MoreHistoryDialog: false,
      PatientGlassesInformation: false,
      GlassesUpdateDialog: false,
      MedicalHistoryDialog: false,
      childUpdateDialog: false,

      dialog: false,
      editedItem: {
        user_id: '',
        title: '',
        description: '',
      },

      search: '',
      dialogAddPrescription: false,
      newPrescription: {
        title: '',
        description: ''
      },

      headers: [
        { title: 'User ID', align: 'start', key: 'user_id' },
        { title: 'Parent Name', align: 'start', key: 'full_name' },
        { title: 'Contact Number', key: 'contact_number' },
        { title: 'Address', key: 'address' }, 
        { title: 'Actions', sortable: false },
      ],
      viewingRecords: false,
      users: [
        {
          user_id: '1',
          first_name: 'Ferdinand',
          middle_name: 'A',
          last_name: 'Espiritu',
          extension: '',
          contact_number: '09668109204',
          address: 'San Narciso, Zambales',
          full_name: 'Ferdinand Espiritu',
    


          email: 'sample@example.com',
          sex_at_birth: 'Male',
          birth_date: '2003-05-13',
  
             
          
      prescription: [
            { id: 1, 
              left_eye_sphere: -1.4,
              left_eye_cylinder: -2.00,
              left_eye_axis: 50,

              right_eye_sphere: -1.4,
              right_eye_cylinder: -2.00,
              right_eye_axis: 50,

              reading_add: +3.00,
              best_visual_acuity: 19,

              PD: 50.5,
              date_updated: '05/13/2003',
            },
          ],

      glasses: [
        { id: 1,
          
          frame: 'Brownline',
          type_lens: 'Bifocals',
          remarks: 'Very clear',

          glasses_updated: '12/31/2002'
        },
      ],

      medicalHistory: [
        { id: 1,

          user_medical_health: 'Had operation in the arms',
          user_ocular_health: 'Operation in the left eye',

          history_updated: '12/31/2024'
        },
        
      ],


        },
      ],
      dialogDelete: false,
      deleteRecordIndex: -1,
    };
    
  },
  computed: {
    displayedUsers() {
      const searchTerm = this.search.toLowerCase();
      return this.users.filter((users) =>
        Object.values(users).some(
          (value) =>
            typeof value === 'string' && value.toLowerCase().includes(searchTerm)
        )
      );
    },
    formattedBestVisualAcuity: {
      get() {
        return `20/${this.editedItem.best_visual_acuity}`;
      },
      set(value) {
        this.editedItem.best_visual_acuity = value.replace(/^20\//, '');
      }
    },

  },
  
  methods: {
    openDialog() {
    this.dialog = true;
  },
    closeDialog() {
    this.dialog = false;
  },
  
    viewPrescriptions(user) { 
      user.showPrescriptions = !user.showPrescriptions;
    },
    togglePrescriptionEdit(user, prescription) {
      prescription.editing = !prescription.editing;
    },
    deletePrescription(user, index) {
      if (confirm('Are you sure you want to delete this prescription?')) {
        user.prescription.splice(index, 1);
      }
    },

    deleteUser(item) {
      // Set the deleteRecordIndex and open the delete confirmation dialog
      this.deleteRecordIndex = this.users.indexOf(item);
      this.dialogDelete = true;
    },

    deleteUserConfirm() {
      if (this.deleteRecordIndex !== -1) {
        // Remove the user at deleteRecordIndex
        this.users.splice(this.deleteRecordIndex, 1);
        this.dialogDelete = false;
        this.deleteRecordIndex = -1;
      }
    },

    closeDelete() {
      this.dialogDelete = false;
      this.deleteRecordIndex = -1;
    },

    openChildUpdateDialog() {
    // Initialize fields for new prescription
    this.updatedLeftSphere = null;
    this.updatedRightSphere = null;
    this.updatedLeftCylinder = null;
    this.updatedRightCylinder = null;
    this.updatedLeftAxis = null;
    this.updatedRightAxis = null;
    this.updatePD = null;
    this.newPrescription.dateUpdated = new Date().toISOString().split('T')[0]

    // Show child update dialog
    this.childUpdateDialog = true;
  },
  
  openMoreHistoryDialog() {
    this.MoreHistoryDialog = true;
  },

  closeMoreHistoryDialog() {
    this.MoreHistoryDialog = false;
  },

  openPatientGlassesInformation(item) {

    this.PatientGlassesInformation = true;
  },

  openGlassesUpdateDialog() {
    this.GlassesUpdateDialog = true;
  },

  closePatientGlassesInformation() {
     this.PatientGlassesInformation = false;
  },

   closeGlassesUpdateDialog() {
      this.GlassesUpdateDialog = false;
    },

 saveGlassInformation() {
  const newGlassInformation = {
    reading_add: this.editedItem.reading_add,
    best_visual_acuity: this.editedItem.best_visual_acuity,
    frame: this.editedItem.frame,
    type_lens: this.editedItem.type_lens,
    remarks: this.editedItem.remarks,
    glasses_updated: new Date().toLocaleDateString(), // Set the current date automatically
  };

  const selectedUser = this.users[0]; // Assuming you want to add the information to the first user
  selectedUser.glasses.push(newGlassInformation);
 

  this.closeGlassesUpdateDialog();
},

  openMedicalHistoryDialog(item) {
    this.selectedItem = item;
    this.MoreHistoryDialog = true;
  },
  closeMoreHistoryDialog() {
      this.MoreHistoryDialog = false;
      this.selectedItem = null; // Reset the selected item when the dialog is closed
    },

 



 saveNewPrescription() {
  // Create a new prescription object
  const newPrescription = {
    left_eye_sphere: this.editedItem.left_eye_sphere,
    right_eye_sphere: this.editedItem.right_eye_sphere,
    left_eye_cylinder: this.editedItem.left_eye_cylinder,
    right_eye_cylinder: this.editedItem.right_eye_cylinder,
    left_eye_axis: this.editedItem.left_eye_axis,
    right_eye_axis: this.editedItem.right_eye_axis,
    PD: this.editedItem.PD,
    date_updated: new Date().toLocaleDateString(), // Set the current date automatically
  };
      const selectedUser = this.users[0]; // Assuming you want to add the prescription to the first user
      selectedUser.prescription.push(newPrescription);

      // Close the dialog after saving the prescription
      this.closeChildUpdateDialog();
},
    

     closeChildUpdateDialog() {
      this.childUpdateDialog = false;
    },

    updateChildInfo() {
      
      this.closeChildUpdateDialog();
    },

    openVaccinationDialog(item) {
      this.vaccinationDialog = true;
      this.vaccines = item.vaccine;
    },

    closeVaccinationDialog() {
      this.vaccinationDialog = false;
    },

    openDialogPatientHistory(item) {
      this.dialogPatientHistory = true;
    },

    closeDialogPatientHistory() {
      this.dialogPatientHistory = false;
    },  




    saveNewUser() {
      const newUser = {
        user_id: this.editedItem.user_id,
        first_name: this.editedItem.full_name,
        contact_number: this.editedItem.contact_number,
        address: this.editedItem.address,
        child_name: this.editedItem.child_name,
        child_age: this.editedItem.child_age,
        prescriptions: [],
      };

        // Check if the user ID already exists
      const existingUser = this.users.find((u) => u.user_id === newUser.user_id);

      if (existingUser) {
        // User already exists, show an alert
        alert('User ID already exists! Please use a different ID.');
      } else {
        // User does not exist, confirm and save the new user
        if (confirm('Are you sure you want to save this new user?')) {
          this.users.push(newUser);
          this.closeDialog();
        }
      }
    },

saveRecord(user, prescription) {
  if (confirm('Are you sure you want to save this edited prescription?')) {
    prescription.editing = false;
    // Optionally, you can add code here to save the edited prescription to the database
  }
},
  },


};
</script>

<style>
.v-card:hover {
  background-color: #f0f0f0; /* Set the hover color here */
}

</style>
