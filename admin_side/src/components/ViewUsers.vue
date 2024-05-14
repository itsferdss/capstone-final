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
      <span class="text-h6 m-2">New User and Prescription</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row dense>
          <v-col cols="12">
            <v-text-field v-model="editedItem.user_id" label="User ID*" prepend-icon="mdi-account" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="editedItem.full_name" label="Patient Name*" prepend-icon="mdi-account" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="editedItem.address" label="Address" prepend-icon="mdi-map-marker" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="editedItem.contact_number" label="Contact Number" prepend-icon="mdi-phone" required></v-text-field>
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
          <td :colspan="headers.length + 1">
            <v-row justify="space-between">
              <v-col cols="6">
                <v-btn @click="openDialogPatientHistory(item)" block>
                  View Patient's History
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn @click="openChildUpdateDialog(item)" block>
                  Add New Prescription
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
    <v-card-title>User's Information and Prescriptions</v-card-title>
    <v-card-text>
      <!-- Parent's Information -->
      <v-card class="mb-4">
        <v-card-title>Patient's Information</v-card-title>
        <v-card-text>
          <v-col cols="12" md="3">
            <strong>Name:</strong> {{ item.full_name}} 
          </v-col>
          <v-col cols="12" md="3">
            <strong>Contact Number:</strong> {{ item.contact_number }}
          </v-col>
        </v-card-text>
      </v-card>

    <v-card class="mb-4">
  <v-card-title>Patient's History</v-card-title>
  <v-card-text>
    <v-row>
      <v-col cols="3" md="12">
        <strong>Date Updated:</strong> {{ item.prescription[0].date_updated }}
      </v-col>
      <v-col cols="3" md="3">
        <strong>Left Eye Sphere:</strong> {{ item.prescription[0].left_eye_sphere }}
      </v-col>
      <v-col cols="3" md="3">
        <strong>Left Eye Cylinder:</strong> {{ item.prescription[0].left_eye_cylinder }}
      </v-col>
      <v-col cols="3" md="4">
        <strong>Left Eye Axis:</strong> {{ item.prescription[0].left_eye_axis }}
      </v-col>
      <v-col cols="3" md="3">
        <strong>Right Eye Sphere:</strong> {{ item.prescription[0].right_eye_sphere }}
      </v-col>
      <v-col cols="3" md="3">
        <strong>Right Eye Cylinder:</strong> {{ item.prescription[0].right_eye_cylinder }}
      </v-col>
      <v-col cols="3" md="4">
        <strong>Right Eye Axis:</strong> {{ item.prescription[0].right_eye_axis }}
      </v-col>
      <v-col cols="3" md="3">
        <strong>PD:</strong> {{ item.prescription[0].PD }}
      </v-col>
    </v-row>
  </v-card-text>
</v-card>

<v-btn @click="openChildUpdateDialog" color="#35623D" dark style="font-weight: bold;">Add Prescription</v-btn>
<span>&nbsp;</span>
<v-btn color="error" @click="closeDialogPatientHistory">Cancel</v-btn>
    </v-card-text>
    
  </v-card>

</v-dialog>



      <!--DIALOG FOR CHILD UPDATE-->
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
              <v-text-field v-model="editedItem.left_eye_sphere" label="Left Eye Sphere" type="number"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="editedItem.right_eye_sphere" label="Right Eye Sphere" type="number"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="editedItem.left_eye_cylinder" label="Left Eye Cylinder" type="number"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="editedItem.right_eye_cylinder" label="Right Eye Cylinder" type="number"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="editedItem.left_eye_axis" label="Left Eye Axis" type="number"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field v-model="editedItem.right_eye_axis" label="Right Eye Axis" type="number"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field v-model="editedItem.PD" label="PD" ></v-text-field>
            </v-col>
            <v-col cols="12">
               <v-text-field v-model="editedItem.dateUpdated" label="Date Updated" outlined readonly></v-text-field>
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
  
      child:[
          {
             childUpdateDialog: false,
             updatedWeight: null,
             updatedHeight: null,
             updatedAge: null,
          }

          ],
      prescription: [
            { id: 1, 
              left_eye_sphere: -1.4,
              left_eye_cylinder: -2.00,
              left_eye_axis: 50,

              right_eye_sphere: -1.4,
              right_eye_cylinder: -2.00,
              right_eye_axis: 50,

              PD: 50.5,
              date_updated: 'November 26, 2024',
            },

          ],

      

      vaccine: [
            { id: 1,
              vaccine_name: 'Vaccine 1',
              date_taken: 'November 26, 2024',
              status: true,
            }
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
      user.prescriptions.splice(index, 1);
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

  // Push the new prescription to the editedItem's prescriptions array
  this.editedItem.prescriptions.push(newPrescription);

  // Close the child update dialog
  this.childUpdateDialog = false;

  // Optionally, you can add code here to save the new prescription to the database
},
    

     closeChildUpdateDialog() {
      this.updatedWeight = null;
      this.updatedHeight = null;
      this.updatedAge = null;
      this.dateUpdated = '';
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
