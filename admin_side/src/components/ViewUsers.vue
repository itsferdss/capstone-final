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
                    <v-text-field v-model="editedItem.user_name" label="User Name*" prepend-icon="mdi-account" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.user_email" label="Email*" prepend-icon="mdi-email" required></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field v-model="editedItem.address" label="Address" prepend-icon="mdi-map-marker" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.contact_number" label="Contact Number" prepend-icon="mdi-phone" required></v-text-field>
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

    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.user_id }}</td>
        <td>{{ item.user_name }}</td>
        <td>{{ item.contact_number }}</td>
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
          <v-card-title>{{ selectedUser.user_name }}'s Past Prescriptions</v-card-title>
          <v-card-text>
            <v-btn @click="openChildUpdateDialog" color="#35623D" dark style="font-weight: bold;">Add Prescription</v-btn>
            <span>&nbsp;</span>
            <v-btn color="primary" @click="closeDialogPatientHistory">Close</v-btn>
            
            <v-card v-for="(prescription, index) in selectedUserPrescriptions" :key="index" class="mb-4">
              <v-card-title v-if="prescription.user_id === selectedUser.user_id">Prescription Date: {{ prescription.date_updated }}</v-card-title>
              <v-card-text v-if="prescription.user_id === selectedUser.user_id">
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
                  <v-btn color="error" @click="deletePrescription(index)">Delete</v-btn>
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


      


      <!--DONE NA YUNG TAAS-->

          
      <!--DIALOG FOR PATIENT GLASSES-->
      <template>
        <v-dialog v-model="dialogPatientGlassesInformation" max-width="1300px">
          <v-card>
            <v-card-title>{{ selectedUser.user_name }}'s Spectacles Information</v-card-title>
            <v-card-text>
              <v-btn @click="openChildGlassesDialog" color="#35623D" dark style="font-weight: bold;">Add Spectacles</v-btn>
              <span>&nbsp;</span>
              <v-btn color="primary" @click="closePatientGlassesInformation">Close</v-btn>

              <v-card v-for="(glasses, index) in selectedUserGlasses" :key="index" class="mb-4">
                <v-card-title v-if="glasses.user_id === selectedUser.user_id">Date Updated: {{ glasses.glasses_date_updated }}</v-card-title>
                <v-card-text v-if="glasses.user_id === selectedUser.user_id">
                  <v-row>
                    <v-col cols="3" md="3">
                      <strong>Frame:</strong> {{ glasses.frame }}
                    </v-col>
                    <v-col cols="3" md="3">
                      <strong>Type of Lens:</strong> {{ glasses.type_of_lens }}
                    </v-col>
                    <v-col cols="4" md="4">
                      <strong>Remarks:</strong> {{ glasses.remarks }}
                    </v-col>
                    <v-col cols="2" md="12">
                      <v-btn color="error" @click="deleteGlasses(index)">Delete</v-btn>
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
                    <v-text-field v-model="editedItem.frame" label="Brand" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.type_of_lens" label="Frame" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.remarks" label="Lens" required></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#35623D" @click="saveChildGlasses">Save</v-btn>
            <v-btn color="error" @click="closeChildGlassesDialog">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--DIALOG FOR MORE HISTORY-->
      <v-dialog v-model="dialogMoreHistory" max-width="1300px">
        <v-card>
          <v-card-title>{{ selectedUser.user_name }}'s Medical History</v-card-title>
          <v-card-text>
            <v-btn @click="openChildHistoryDialog" color="#35623D" dark style="font-weight: bold;">Add Medical History</v-btn>
            <span>&nbsp;</span>
            <v-btn color="primary" @click="closeMoreHistoryDialog">Close</v-btn>

            <v-card v-for="(history, index) in selectedUserHistory" :key="index" class="mb-4">
              <v-card-title>Date: {{ history.date_updated }}</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="3" md="3">
                    <strong>Medical Condition:</strong> {{ history.medical_condition }}
                  </v-col>
                  <v-col cols="3" md="3">
                    <strong>Notes:</strong> {{ history.notes }}
                  </v-col>
                  <v-btn color="error" @click="deleteHistory(selectedUser, index)">Delete</v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!--DIALOG FOR HISTORY UPDATE-->
      <v-dialog v-model="childHistoryDialog" max-width="500px">
        <v-card>
          <v-card-title>New Medical History</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.medical_condition" label="Medical Condition" required></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field v-model="editedItem.notes" label="Notes" required></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#35623D" @click="saveChildHistory">Save</v-btn>
            <v-btn color="error" @click="closeChildHistoryDialog">Cancel</v-btn>
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
      search: '',
      dialog: false,
      dialogDelete: false,
      dialogPatientHistory: false,
      childUpdateDialog: false,
      dialogPatientGlassesInformation: false,
      childGlassesDialog: false,
      dialogMoreHistory: false,
      childHistoryDialog: false,
      editedItem: {
        user_id: '',
        user_name: '',
        user_email: '',
        user_address: '',
        user_contact_number: '',
        user_birthdate: '',
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
        date_updated: '',
        frame: '',
        type_of_lens: '',
        remarks: '',
        glasses_date_updated: '',
        medical_condition: '',
        notes: '',
      },
       headers: [
        { title: 'User ID', align: 'start', key: 'user_id' },
        { title: 'Parent Name', align: 'start', key: 'user_full_name' },
        { title: 'Contact Number', key: 'user_contact_number' },
        { title: 'Address', key: 'address' }, 
        { title: 'Actions', sortable: false },
      ],
      displayedUsers: [
        {
          user_id: '1',
          user_name: 'John Doe',
          contact_number: '1234567890',
          address: '123 Main St, Cityville',
          showPrescriptions: false,
        },
        {
          user_id: '2',
          user_name: 'Jane Smith',
          contact_number: '0987654321',
          address: '456 Elm St, Townsville',
          showPrescriptions: false,
        },
      ],
      
  
      selectedUser: null,
      selectedUserPrescriptions: [
        {
          date_updated: '2024-05-13',

          user_id: '1',
          left_eye_sphere: '13',
          left_eye_cylinder: '12',
          left_eye_axis: '10',

          right_eye_sphere: '12',
          right_eye_cylinder: '10',
          right_eye_axis: '9',

          reading_add: '20',
          best_visual_acuity: '20/20',
          PD: 10,
        },
        {
          date_updated: '2024-05-22',

          user_id: '2',
          left_eye_sphere: '42',
          left_eye_cylinder: '64',
          left_eye_axis: '34',

          right_eye_sphere: '76',
          right_eye_cylinder: '23',
          right_eye_axis: '4',

          reading_add: '12',
          best_visual_acuity: '20/13',
          PD: 10,
        },
      ],
      
      selectedUserGlasses: [
        {
          user_id: '1',
          glasses_date_updated: '05/31/2020',

          frame: 'brownline',
          type_of_lens: 'photocromic',
          remarks: 'Very high contras',
        },
        {
          user_id: '2',
          glasses_date_updated: '11/26/2020',

          frame: 'wood',
          type_of_lens: 'thick',
          remarks: 'Very high astigmatism',
        },
        
      ],
      selectedUserHistory: [],
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.resetEditedItem();
    },
    saveNewUser() {
  // Add the new user to the displayedUsers array
      this.displayedUsers.push({ ...this.editedItem, user_id: this.displayedUsers.length + 1 });
      this.closeDialog();
    },
    viewPrescriptions(user) {
      user.showPrescriptions = !user.showPrescriptions;
    },
    deleteUser(user) {
      this.selectedUser = user;
      this.dialogDelete = true;
    },
    deleteUserConfirm() {
      const index = this.displayedUsers.indexOf(this.selectedUser);
      if (index > -1) {
        this.displayedUsers.splice(index, 1);
      }
      this.dialogDelete = false;
      this.selectedUser = null;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    openDialogPatientHistory(user) {
      this.selectedUser = user;
      this.dialogPatientHistory = true;
        
    },
    closeDialogPatientHistory() {
      this.dialogPatientHistory = false;
      this.selectedUser = null;
    },
    deletePrescription(index) {
      this.selectedUserPrescriptions.splice(index, 1);
    },
    openChildUpdateDialog(prescription) {
      this.editedItem = { ...prescription };
      this.childUpdateDialog = true;
    },
    closeChildUpdateDialog() {
      this.childUpdateDialog = false;
      this.resetEditedItem();
    },
    savePrescription() {
       const newPrescription = {
          date_updated: new Date().toISOString().slice(0, 10),
          user_id: this.selectedUser.user_id,
          left_eye_sphere: this.editedItem.left_eye_sphere,
          right_eye_sphere: this.editedItem.right_eye_sphere,
          left_eye_cylinder: this.editedItem.left_eye_cylinder,
          right_eye_cylinder: this.editedItem.right_eye_cylinder,
          left_eye_axis: this.editedItem.left_eye_axis,
          right_eye_axis: this.editedItem.right_eye_axis,
          reading_add: this.editedItem.reading_add,
          best_visual_acuity: this.editedItem.best_visual_acuity,
          PD: this.editedItem.PD,
        };

        
        this.selectedUserPrescriptions.unshift(newPrescription);
        this.childUpdateDialog = false;
      },
    openDialogPatientGlassesInformation(user) {
       this.selectedUser = user;
       this.dialogPatientGlassesInformation = true;
    },
    closePatientGlassesInformation() {
      this.dialogPatientGlassesInformation = false;
      this.selectedUser = null;
    },
    openChildGlassesDialog() {
      this.childGlassesDialog = true;
    },
    closeChildGlassesDialog() {
      this.childGlassesDialog = false;
      this.reseteditedGlasses();
    },
    saveChildGlasses() {
      this.selectedUserGlasses.push({ ...this.editedGlasses });
      this.closeChildGlassesDialog();
    },
    deleteGlasses(user, index) {
      user.selectedUserGlasses.splice(index, 1);
    },
    openDialogMoreHistory(user) {
      this.selectedUser = user;
      this.dialogMoreHistory = true;
      // Fetch medical history for the selected user
      this.selectedUserHistory = this.fetchMedicalHistory(user.user_id);
    },
    closeMoreHistoryDialog() {
      this.dialogMoreHistory = false;
      this.selectedUser = null;
    },
    openChildHistoryDialog() {
      this.childHistoryDialog = true;
    },
    closeChildHistoryDialog() {
      this.childHistoryDialog = false;
      this.resetEditedItem();
    },
    saveChildHistory() {
      this.selectedUserHistory.push({ ...this.editedItem });
      this.closeChildHistoryDialog();
    },
    deleteHistory(user, index) {
      user.selectedUserHistory.splice(index, 1);
    },
    fetchPrescriptions(userId) {
      // Fetch prescriptions from the backend or other source
      return [];
    },
    fetchGlasses(userId) {
      // Fetch glasses information from the backend or other source
      return [];
    },
    fetchMedicalHistory(userId) {
      // Fetch medical history from the backend or other source
      return [];
    },
    resetEditedItem() {
      this.editedItem = {
        user_name: '',
        user_email: '',
        user_address: '',
        user_contact_number: '',
        user_birthdate: '',
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
        brand: '',
        frame: '',
        lens: '',
        medical_condition: '',
        notes: '',
      };
    },
  },
};
</script>

<style>
</style>
