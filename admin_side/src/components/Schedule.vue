<template>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="appointments"  
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
            <v-btn @click="openDialog" class="mb-2 rounded-l" color="#35623D" dark v-bind="props" style="font-weight: bold;">See Pending Reservations</v-btn>
          </template>
          
          <!--PENDING RESERVATIONS-->
          <v-card>
              <v-card-title>
                <span class="text-h6 m-2">List of Pending Reservations</span>
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
                            <td>{{ item.full_name }}</td>
                            <td>{{ item.contact_number }}</td>
                            <td>{{ item.formatted_appointment_date }}</td>
                            <td>{{ item.product_id }}</td>
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

    <!--BODY OF THE TABLE-->
<template v-slot:item="{ item }">
      <tr>
        <td>{{ item.user_id }}</td>
        <td>{{ item.full_name }}</td>
        <td>{{ item.contact_number }}</td>
        <td>{{ item.formatted_appointment_date }}</td>
         <td>{{ item.product_id }}</td>
        <td>
          <v-icon size="small" style="color: #2F3F64" @click="openReservationInfo(item)">mdi-eye</v-icon>
          <v-icon size="small" style="color: #2F3F64" @click="deleteUser(item)">mdi-delete</v-icon>
        </td>
      </tr>
       
    
<!--DIALOG FOR DELETION-->
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

      <!--DIALOG FOR RESERVATION INFO-->
      <v-dialog v-model="reservationInfo" max-width="800px">
        <v-card>
          <v-card-title>
            <span class="text-h6">{{ selectedProduct.product_name }}</span>
            <v-spacer></v-spacer>
          </v-card-title>
          <v-card-subtitle>Product ID: {{ selectedProduct.product_id }}</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="text-center">
                <v-img :src="selectedProduct.product_image" max-width="200" max-height="200"></v-img>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <strong>Product Name:</strong> {{ selectedProduct.product_price }}
              </v-col>
              <v-col cols="6">
                <strong>User Name:</strong> {{ selectedProduct.full_name }}
              </v-col>
              <v-col cols="6">
                <strong>Price:</strong> ${{ selectedProduct.product_price }}
              </v-col>
              <v-col cols="6">
                <strong>Stock:</strong> {{ selectedProduct.product_price }}
              </v-col>
              <v-col cols="6">
                <strong>Date of Reservation:</strong> {{ selectedProduct.product_stock }}
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="reservationInfo = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>








    </template>
  </v-data-table>
</template>
<script>
import ViewUsers from './ViewUsers.vue';
import productImage from '/src/assets/product1.jpg'; // Import the image using relative path

export default {
  components: { ViewUsers },
  data() {
    return {
      dialogAddPrescription: false,
      dialog: false, // Remove duplicate key
      reservationInfo: false,
      editedItem: {
        user_id: '',
        user_name: '',
        user_contact_number: '',
        appointment_date: '',
        product_id: '',
        product_name: '',
        product_price: '',
        product_image: '',
        product_description: '',
        appointment_id: '',
      },
      search: '',
      headers: [
        { title: 'User ID', align: 'start', key: 'user_id' },
        { title: 'User Name', align: 'start', key: 'full_name' },
        { title: 'Contact Number', key: 'user_contact_number' },
        { title: 'Appointment Date', key: 'appointment_date' },
        { title: 'Product ID', key: 'product_id' }, 
        { title: 'Actions', sortable: false },
      ],

      headers: [
        { title: 'User ID', align: 'start', key: 'user_id' },
        { title: 'User Name', align: 'start', key: 'full_name' },
        { title: 'Contact Number', key: 'contact_number' },
        { title: 'Appointment Date', key: 'formatted_appointment_date' }, 
        { title: 'Product ID', key: 'product_id' }, 
        { title: 'Actions', sortable: false },
      ],

      viewingRecords: false,
      appointments: [
        {
          user_id: '1',
          first_name: 'Ferdinand',
          middle_name: 'A',
          last_name: 'Espiritu',
          extension: '',
          contact_number: '09668109204',
          appointment_date: new Date('May 13, 2003'),
          formatted_appointment_date: new Date('May 13, 2003').toDateString(), 
          full_name: 'Ferdinand A. Espiritu',
          product_id: '2',
        },
      ],
      
      pendingAppointments: [
        {
          user_id: '2',
          full_name: 'Denmark Lobo',
          contact_number: '09668789762',
          appointment_date: new Date('May 12,2002'),
          formatted_appointment_date: new Date('May 12, 2002').toDateString(),
          product_id: '3',
        }
      ], 

      selectedProduct: {
        user_id: '1',
        full_name: 'Ferdinand',
        product_id: '2',
        product_name: 'Frame',
        product_price: '100',
        product_image: productImage, // Use imported image
        product_description: 'very nice',
      },
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
    openReservationInfo() {
      this.reservationInfo = true

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
