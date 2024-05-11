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
    <v-btn @click="openDialog" class="mb-2 rounded-l" color="#35623D" dark v-bind="props" prepend-icon="mdi-plus" style="font-weight: bold;">Add new User</v-btn>
  </template>
  
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
            <v-text-field v-model="editedItem.full_name" label="Parent Name*" prepend-icon="mdi-account" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="editedItem.address" label="Address" prepend-icon="mdi-map-marker" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="editedItem.contact_number" label="Contact Number" prepend-icon="mdi-phone" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="editedItem.child_name" label="Child Name" prepend-icon="mdi-account-child" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="editedItem.child_age" label="Child Age" type="number" prepend-icon="mdi-calendar" required></v-text-field>
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
          <v-col cols="12">
            <v-textarea v-model="editedItem.description" label="Enter Prescription" prepend-icon="mdi-file-document-edit" required></v-textarea>
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
        <td>{{ item.user_id }}</td>
        <td>{{ item.first_name }} {{ item.middle_name }} {{ item.last_name }} {{ item.extension }}</td>
        <td>{{ item.contact_number }}</td>
        <td>{{ item.address }}</td>
        <td>{{ item.child_name }}</td>
        <td>{{ item.child_age }}</td>
        <td>
          <v-icon class="me-2" size="small" style="color: #2F3F64" @click="viewPrescriptions(item)">mdi-eye</v-icon>
          <v-icon size="small" style="color: #2F3F64" @click="deleteUser(item)">mdi-delete</v-icon>
        </td>
      </tr>

        <!--Add Prescription Bellow the name-->
          <tr v-if="item.showPrescriptions">
          <td :colspan="headers.length + 1">
            <v-row justify="space-between">
              <v-col cols="4">
                <v-btn @click="openPrescriptionDialog(item)" block>
                  Prescription
                </v-btn>
              </v-col>
              <v-col cols="4">
                <v-btn @click="openChildUpdateDialog(item)" block>
                  Child Update
                </v-btn>
              </v-col>
              <v-col cols="4">
                <v-btn @click="openVaccinationDialog(item)" block>
                  Vaccination
                </v-btn>
              </v-col>
            </v-row>
          </td>
        </tr>

        <!--DIALOG FOR DELETE USER-->
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title style="font-weight: bold; text-align: center;">Are you sure you want to delete this user?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color=#35623D variant="text" @click="closeDelete">Cancel</v-btn>
            <v-btn color=#35623D variant="text" @click="deleteUserConfirm">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--DIalog for Add Prescription-->
      <v-dialog v-model="dialogAddPrescription" max-width="800px">
        <v-card>
          <v-card-title class="text-h5">Add Prescription</v-card-title>
            <v-card-text>
              <!-- Prescription Form -->
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="newPrescription.title" label="Title"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="newPrescription.description" label="Description"></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- Save Prescription Button -->
              <v-btn color="blue" text @click="saveNewPrescription">Save Prescription</v-btn>
              <!-- Cancel Button -->
              <v-btn color="blue" text @click="cancelAddPrescription">Cancel</v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>


      <!--Dialog for prescription-->
      <v-dialog v-model="dialogOpenPrescription" max-width="800px">
        <v-card>
          <v-card-title class="text-h5">Past Prescriptions</v-card-title>
          <v-card-text>
            <!-- List of past prescriptions -->
            <v-list>
              <v-list-item v-for="(prescription, index) in selectedItem.prescriptions" :key="index">
                <v-list-item-content>
                  <div>{{ prescription.title }}</div>
                  <div>{{ prescription.description }}</div>
                  <div>{{ prescription.date }}</div>
                </v-list-item-content>
                <!-- Optionally, add a delete button for each prescription -->
                <v-list-item-action>
                  <v-btn icon @click="deletePrescription(selectedItem, index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <!-- Button to add a new prescription -->
            <v-btn color="primary" @click="openAddPrescriptioDialog">Add Prescription</v-btn>
            <v-btn color="blue darken-1" text @click="closePrescriptionDialog">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>



      <!--DIALOG FOR CHILD UPDATE-->
      <v-dialog v-model="childUpdateDialog" max-width="500px">
        <v-card>
          <v-card-title>
            Update Child Information
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="updatedWeight" label="Weight (kg)" type="number"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="updatedHeight" label="Height (cm)" type="number"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="updatedAge" label="Age (years)" type="number"></v-text-field>
                  </v-col>
                  <v-col cols="12">
                   <v-text-field v-model="dateUpdated" label="Date Updated" outlined readonly></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="updateChildInfo">Update</v-btn>
            <v-btn color="error" @click="closeChildUpdateDialog">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


     
  <!-- Vaccination Dialog -->
<v-dialog v-model="vaccinationDialog" max-width="800px">
  <v-card>
    <v-card-title>
      Child Vaccination Records
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="4">
            <strong>Vaccine Name</strong>
          </v-col>
          <v-col cols="4">
            <strong>Status</strong>
          </v-col>
          <v-col cols="4">
            <strong>Date Taken</strong>
          </v-col>
        </v-row>
        <!-- Use v-for to iterate through the vaccines -->
        <v-row v-for="(vaccine, index) in vaccines" :key="index">
          <v-col cols="4">{{ vaccine.vaccine_name }}</v-col>
          <v-col cols="4">
            <v-checkbox v-model="vaccine.status" @change="updateVaccineStatus(index)">
              {{ vaccine.status ? 'Taken' : 'Not Taken' }}
            </v-checkbox>
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="vaccine.date_taken" label="Date Taken" type="date" readonly :disabled="!vaccine.status"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="updateChildVaccination">Update</v-btn>
      <v-btn color="error" @click="closeVaccinationDialog">Cancel</v-btn>
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
    
      dialogOpenPrescription: false,
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
        { title: 'Child Name', key: 'child_name' },
        { title: 'Child Age', key: 'child_age' },
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
          child_name: 'Ferdinand C. Espiritu II',
          child_age: '20',
          child_weight: '50.5kg',
          child_height: '3.5ft',


          email: 'sample@example.com',
          sex_at_birth: 'Male',
          birth_date: '2003-05-13',
          birth_place: '',
          civil_status: '',
          citizenship: '',
          religion: '',
          street: '',
          barangay: '',
          city: '',
          province: '',
          region: '',
          zip_code: '',
          full_name: 'Ferdinand A. Espiritu',
      child:[
          {
             childUpdateDialog: false,
             updatedWeight: null,
             updatedHeight: null,
             updatedAge: null,
          }

          ],
      prescriptions: [
            { id: 1, 
              title: 'Take this 3 times a day',
              date: '2024-04-30', 
              description: 'Ammoxicilin 1', 
              editing: false },
            { id: 2, 
              title: 'Prescription History', 
              date: '2024-04-30', 
              description: 'Ammoxicilin 1', 
              editing: false },
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

    openAddPrescriptioDialog() {
      this.dialogAddPrescription = true;
    },

    cancelAddPrescription() {
      this.dialogAddPrescription = false;
    },

     openPrescriptionDialog(item) {
      this.selectedItem = item; // Set the selected item for reference
      this.dialogOpenPrescription = true; // Open the dialog
    },

    closePrescriptionDialog() {
      this.dialogOpenPrescription = false; // Close the dialog
    },

    openChildUpdateDialog(item) {
       item.showPrescriptions = true;
      // Set the values for the child update dialog
      this.updatedWeight = parseFloat(item.child_weight); // Convert to float if necessary
      this.updatedHeight = parseFloat(item.child_height); // Convert to float if necessary
      this.updatedAge = parseInt(item.child_age); // Convert to integer if necessary
      this.childUpdateDialog = true;// Convert to integer if necessary
      this.dateUpdated = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
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






    saveNewPrescription() {
      const newPrescription = {
        title: this.editedItem.title,
        description: this.editedItem.description,
      };
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

headers{
  font-weight: bold;
}
</style>
