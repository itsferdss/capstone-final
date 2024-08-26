<template>
  <v-data-table
    :search="search"
    :headers="headers"
    :items="acceptedAppointments"
    :sort-by="[{ key: 'user_id', order: 'asc' }]"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title class="text-uppercase grey--text">
          <v-icon left>mdi-calendar-clock</v-icon>
          Reservations
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <!-- Search input -->
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

        <!-- Pending Reservations Dialog -->
        <v-dialog v-model="dialogPending" max-width="1200px">
          <template v-slot:activator="{ props }">
            <v-btn @click="openDialog('pending')" class="mb-2 mr-4 rounded-l pending-btn" elevation="2" v-bind="props">
              <v-icon left>mdi-clock-outline</v-icon>
              <span class="pending-text">Pending Reservations</span>
            </v-btn>
          </template>
          
          <v-card>
            <v-card-title>
              <span class="text-h6 m-2">List of Pending Reservations</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-data-table
                      :headers="pendingHeaders"
                      :items="pendingAppointments"
                      item-key="id"
                      class="elevation-1"
                    >
                      <template v-slot:item="{ item: pendingAppointments }">
                        <tr>
                          <td>{{ pendingAppointments.user_id }}</td>
                          <td>{{ pendingAppointments.patient.full_name }}</td>
                          <td>{{ pendingAppointments.patient.contact }}</td>
                          <td>{{ formatPrescriptionDate(pendingAppointments.created_at) }}</td>
                          <td>{{ pendingAppointments.product_id }}</td>
                          <td>{{ pendingAppointments.product.product_name }}</td>
                          <td>
                            <v-icon @click="acceptAppointment(pendingAppointments.id)">mdi-check</v-icon>
                            <v-icon @click="declineAppointment(pendingAppointments.id)">mdi-close</v-icon>
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
              <v-btn color="black" text @click="closeDialog('pending')">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Picked Up Reservations Dialog -->
        <v-dialog v-model="dialogPickedUp" max-width="1200px">
          <template v-slot:activator="{ props }">
            <v-btn @click="openDialog('pickedUp')" class="mb-2 rounded-l picked-up-btn" elevation="2" v-bind="props">
              <span class="picked-up-text">Picked Up Reservations</span>
            </v-btn>
          </template>
          
          <v-card>
            <v-card-title>
              <span class="text-h6 m-2">List of Picked Up Reservations</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-data-table
                      :headers="doneHeaders"
                      :items="pickedUpAppointments"
                      item-key="user_id"
                      class="elevation-1"
                    >
                      <template v-slot:item="{ item: pickedUpAppointments }">
                        <tr>
                          <td>{{ pickedUpAppointments.user_id }}</td>
                          <td>{{ pickedUpAppointments.patient.full_name }}</td>
                          <td>{{ pickedUpAppointments.patient.contact }}</td>
                          <td>{{ formatPrescriptionDate(pickedUpAppointments.created_at) }}</td>
                          <td>{{ pickedUpAppointments.product_id }}</td>
                          <td>{{ pickedUpAppointments.product.product_name }}</td>
                          <td>{{ formatPrescriptionDate(pickedUpAppointments.picked_up_date) }}</td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="black" text @click="closeDialog('pickedUp')">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-toolbar>
    </template>

    <!-- Main Table Body -->
    <template v-slot:item="{ item: appointments }">
      <tr>
        <td>{{ appointments.user_id }}</td>
        <td>{{ appointments.patient.full_name }}</td>
        <td>{{ appointments.patient.contact }}</td>
        <td>{{ formatPrescriptionDate(appointments.created_at) }}</td>
        <td>{{ appointments.product_id }}</td>
        <td>{{ appointments.product.product_name }}</td>
        <td>
          <v-icon size="small" style="color: #2F3F64" @click="pickedUp(appointments)">mdi-truck</v-icon>
        </td>
      </tr>
    </template>

  </v-data-table>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default {
  data() {
    return {
      search: '',
      dialogPending: false,
      dialogPickedUp: false,
      pendingHeaders: [
        { title: 'User ID', align: 'start', key: 'user_id' },
        { title: 'User Name', align: 'start', key: 'full_name' },
        { title: 'Contact Number', key: 'contact_number' },
        { title: 'Appointment Date', key: 'formatted_appointment_date' },
        { title: 'Product ID', key: 'product_id' },
        { title: 'Product Name', key: 'product_name' },
        { title: 'Actions', sortable: false },
      ],
      doneHeaders: [
        { title: 'User ID', align: 'start', key: 'user_id' },
        { title: 'User Name', align: 'start', key: 'full_name' },
        { title: 'Contact Number', key: 'contact_number' },
        { title: 'Appointment Date', key: 'formatted_appointment_date' },
        { title: 'Product ID', key: 'product_id' },
        { title: 'Product Name', key: 'product_name' },
        { title: 'Picked Up Date', key: 'picked_up_date' },
      ],
      headers: [
        { title: 'User ID', align: 'start', key: 'user_id' },
        { title: 'User Name', align: 'start', key: 'full_name' },
        { title: 'Contact Number', key: 'contact_number' },
        { title: 'Appointment Date', key: 'formatted_appointment_date' },
        { title: 'Product ID', key: 'product_id' },
        { title: 'Product Name', key: 'product_name' },
        { title: 'Actions', sortable: false },
      ],

      appointments: [],
      pendingAppointments: [],
      pickedUpAppointments: [],
    
      dialogDelete: false,
      deleteRecordIndex: -1,
    };
  },
  created() {
    // Fetch all appointments when component is created
    this.fetchAppointments();
    this.fetchPendingAppointments();
    this.fetchPickedUpAppointments();
  },
  methods: {
    fetchAppointments() {
      axios.get('/reservations')
        .then(response => {
          // Filter only accepted appointments
          this.appointments = response.data.filter(appointment => appointment.status === 'accepted');
        })
        .catch(error => {
          console.error('Error fetching appointments:', error);
        });
    },
    fetchPendingAppointments() {
      axios.get('/reservations/pending') // Update the URL to match Laravel route
        .then(response => {
          this.pendingAppointments = response.data;
          console.log('Pending Appointments:', this.pendingAppointments);
        })
        .catch(error => {
          console.error('Error fetching pending appointments:', error);
        });
    },
    fetchPickedUpAppointments() {
      axios.get('/reservations/picked_up') // Update the URL to match Laravel route
        .then(response => {
          this.pickedUpAppointments = response.data;
          console.log('Picked Up Appointments:', this.pickedUpAppointments);
        })
        .catch(error => {
          console.error('Error fetching picked up appointments:', error);
        });
    },
    acceptAppointment(id) {
      axios.put(`/reservations/${id}/accept`)
        .then(response => {
          const updatedAppointment = response.data;

          // Add the updated appointment to appointments
          this.appointments.push(updatedAppointment);

          // Remove the accepted appointment from pendingAppointments
          const index = this.pendingAppointments.findIndex(appointment => appointment.id === id);
          if (index !== -1) {
            this.pendingAppointments.splice(index, 1);
          }

          this.dialogPending = false;
          
          this.fetchAppointments();

          Swal.fire({
            icon: 'success',
            title: 'Reservation Accepted',
            text: 'The reservation has been accepted successfully!',
            customClass: {
              popup: 'swal-popup',
              title: 'swal-title',
              text: 'swal-text',
              confirmButton: 'swal-confirm-button',
              cancelButton: 'swal-cancel-button'
            }
          });
        })
        .catch(error => {
          console.error('Error accepting reservation:', error);
          this.dialogPending = false;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to accept the reservation. Please try again later.',
            customClass: {
              popup: 'swal-popup',
              title: 'swal-title',
              text: 'swal-text'
            }
          });
        });
    },

    
    declineAppointment(id) {
      axios.put(`/reservations/${id}/decline`)
        .then(response => {
          // Handle success if needed
          const index = this.pendingAppointments.findIndex(appointment => appointment.id === id);
          if (index !== -1) {
            this.pendingAppointments.splice(index, 1);
          }

          this.dialogPending = false;

          // Show SweetAlert success message
          Swal.fire({
            icon: 'error',
            title: 'Reservation Declined',
            text: 'The reservation has been declined successfully!',
          });
        })
        .catch(error => {
          console.error('Error declining reservation:', error);

          // Show SweetAlert error message
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to decline the reservation. Please try again later.',
          });
        });
    },
    
    openDialog(type) {
      if (type === 'pending') {
        this.dialogPending = true;
      } else if (type === 'pickedUp') {
        this.dialogPickedUp = true;
      }
    },
    closeDialog(type) {
      if (type === 'pending') {
        this.dialogPending = false;
      } else if (type === 'pickedUp') {
        this.dialogPickedUp = false;
      }
    },

    openDialog(type) {
      if (type === 'pending') {
        this.dialogPending = true;
        this.fetchPendingAppointments();
      } else if (type === 'pickedUp') {
        this.dialogPickedUp = true;
      }
    },
    closeDialog(type) {
      if (type === 'pending') {
        this.dialogPending = false;
      } else if (type === 'pickedUp') {
        this.dialogPickedUp = false;
      }
    },
  formatPrescriptionDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  },

  pickedUp(appointment) {
  Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to mark this reservation as picked up?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, mark as picked up!',
    cancelButtonText: 'No, cancel',
    customClass: {
      popup: 'swal-popup',
      title: 'swal-title',
      text: 'swal-text',
      confirmButton: 'swal-confirm-button',
      cancelButton: 'swal-cancel-button'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      axios.put(`/reservations/${appointment.id}/picked_up`)
        .then(response => {
          console.log('Response from server:', response);

          const updatedAppointment = response.data.reservation;

          // Update the appointment status locally
          appointment.status = 'picked_up';

          // Find the appointment in the appointments array and update the product stock
          const appointmentIndex = this.appointments.findIndex(app => app.id === appointment.id);
          if (appointmentIndex !== -1) {
            const productIndex = this.appointments[appointmentIndex].product.id === appointment.product_id;
            if (productIndex !== -1) {
              this.appointments[appointmentIndex].product.stock -= 1;
            }
          }

          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Reservation Picked Up',
            text: 'The reservation has been marked as picked up and the product stock has been updated!',
            customClass: {
              popup: 'swal-popup',
              title: 'swal-title',
              text: 'swal-text'
            }
          });

          // Refresh picked up appointments
          this.fetchPickedUpAppointments();
        })
        .catch(error => {
          console.error('Error picking up reservation:', error.response ? error.response.data : error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to mark the reservation as picked up. Please try again later.',
            customClass: {
              popup: 'swal-popup',
              title: 'swal-title',
              text: 'swal-text'
            }
          });
        });
    }
  });
},

  },
   computed: {
    acceptedAppointments() {
      return this.appointments.filter(appointment => appointment.status === 'accepted');
    },
  },
};
</script>

<style>
.pending-btn {
  background-color: #B3D9E6 !important; /* Customize the background color */
  color: white !important;
  font-weight: bold !important;
}

.pending-text {
  font-weight: bold;
  color: black !important;
}

.pending-btn .v-icon {
  margin-right: 8px; /* Add spacing between icon and text */
  color: black;
}

.picked-up-btn {
  background-color: #B3D9E6 !important; /* Customize the background color */
  color: white !important;
  font-weight: bold !important;
}

.picked-up-text {
  font-weight: bold;
  color: black !important;
}

.picked-up-btn .v-icon {
  margin-right: 8px; /* Add spacing between icon and text */
  color: black;
}

.swal-text {
  color: white !important;
}

.swal-confirm-button, .swal-cancel-button {
  color: white !important;
}

@media (max-width: 960px) {
  
}
</style>
  