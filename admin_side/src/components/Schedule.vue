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
    <v-btn @click="openDialog" class="mb-2 rounded-l" color="#35623D" dark v-bind="props" style="font-weight: bold;">See Pending Schedules</v-btn>
  </template>
  
  <v-card>
      <v-card-title>
        <span class="text-h6 m-2">List of Pending Appointments</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-data-table
                :headers="headers"
                :items="pendingAppointments"
                item-key="user_id"
                class="elevation-1"
              >
                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ item.user_id }}</td>
                    <td>{{ item.first_name }} {{ item.middle_name }} {{ item.last_name }} {{ item.extension }}</td>
                    <td>{{ item.contact_number }}</td>
                    <td>{{ item.formatted_appointment_date }}</td>
                    <td>{{ item.appointment_time }}</td>
                    <td>
                      <v-icon @click="acceptAppointment(item.user_id)">mdi-check</v-icon>
                      <v-icon @click="declineAppointment(item.user_id)">mdi-close</v-icon>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="black" text @click="closeDialog">Cancel</v-btn>
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
        <td>{{ item.formatted_appointment_date }}</td>
        <td>{{ item.appointment_time }}</td>
        <td>
 
          <v-icon size="small" style="color: #2F3F64" @click="deleteUser(item)">mdi-delete</v-icon>
        </td>
      </tr>
       
    

      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title style="font-weight: bold; text-align: center;">Are you sure you want to delete this schedule?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color=#35623D variant="text" @click="closeDelete">Cancel</v-btn>
            <v-btn color=#35623D variant="text" @click="deleteUserConfirm">OK</v-btn>
            <v-spacer></v-spacer>
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
        { title: 'Appointment Date', key: 'formatted_appointment_date' }, 
        { title: 'Appointment Time', key: 'appointment_time' },
        { title: 'Actions', sortable: false },
      ],

        dialog: false,
          pendingAppointments: [], // Data holder for pending appointments
          headers: [
            { title: 'User ID', align: 'start', key: 'user_id' },
            { title: 'Parent Name', align: 'start', key: 'full_name' },
            { title: 'Contact Number', key: 'contact_number' },
            { title: 'Appointment Date', key: 'formatted_appointment_date' }, 
            { title: 'Appointment Time', key: 'appointment_time' },
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
          appointment_date: new Date('May 13, 2003'),
          formatted_appointment_date: new Date('May 13, 2003').toDateString(), 
          child_age: '20',
          appointment_time: '10:30 am',


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
        },
      ],
       pendingAppointments: [
      {
        user_id: '2',
        first_name: 'John',
        middle_name: 'Doe',
        last_name: '',
        extension: '',
        contact_number: '123456789',
        appointment_date: new Date('2024-05-09'),
        formatted_appointment_date: new Date('2024-05-09').toDateString(), 
        appointment_time: '2:00 pm',
      },
      // Add more pending appointment objects as needed
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

    saveNewPrescription() {
      const newPrescription = {
        title: this.editedItem.title,
        description: this.editedItem.description,
      };
    },
     acceptAppointment(userId) {
      const user = this.pendingAppointments.find(u => u.user_id === userId);

      if (user) {
        const newUser = {
          user_id: user.user_id,
          first_name: user.first_name,
          middle_name: user.middle_name,
          last_name: user.last_name,
          extension: user.extension,
          contact_number: user.contact_number,
          formatted_appointment_date: user.formatted_appointment_date,
          appointment_time: user.appointment_time,
          // Add other appointment properties as needed
        };

         this.users.push(newUser);
        // Optionally, you can remove the accepted appointment from the pending appointments list
        const index = this.pendingAppointments.findIndex(appointment => appointment.user_id === userId);
        if (index !== -1) {
        this.pendingAppointments.splice(index, 1);
         }
      }

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
