<template>
  <v-data-table :search="search" :headers="headers" :items="acceptedAppointments"
    :sort-by="[{ key: 'user_id', order: 'asc' }]">
    <template v-slot:top>
      <v-toolbar flat>

        <v-btn @click="openAddRes" class="mb-2 mr-4 rounded-l pending-btn" elevation="2">
          <v-icon left>mdi-plus</v-icon>
          <span class="pending-text">Add Direct Reservation</span>
        </v-btn>

        <v-spacer></v-spacer>
        <!-- Search input -->
        <v-text-field v-model="search" class="w-auto mr-4 searchBar" density="compact" label="Search Patients"
          prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details single-line
          style="max-width: 300px;"></v-text-field>

        <!-- Pending Reservations Dialog -->
        <v-btn @click="openDialogPr('pending')" class="mb-2 mr-4 rounded-l pending-btn" elevation="2">
          <v-icon left>mdi-clock-outline</v-icon>
          <span class="pending-text">Pending Reservations</span>
        </v-btn>

        <!-- Picked Up Reservations Dialog -->
        <v-btn @click="openDialogPu('pickedUp')" class="mb-2 rounded-l picked-up-btn" elevation="2" v-bind="props">
          <v-icon left>mdi-check-outline</v-icon>
          <span class="picked-up-text">Picked Up Reservations</span>
        </v-btn>
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
          <span :style="{ color: appointments.color, textTransform: 'uppercase' }">
            {{ appointments.color }}
          </span>
        </td>
        <td>{{ appointments.quantity }}</td>
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
      headers: [
        { title: 'User ID', align: 'center', key: 'user_id' },
        { title: 'User Name', align: 'center', key: 'full_name' },
        { title: 'Contact Number', align: 'center', key: 'contact_number' },
        { title: 'Appointment Date', align: 'center', key: 'formatted_appointment_date' },
        { title: 'Product ID', align: 'center', key: 'product_id' },
        { title: 'Product Name', align: 'center', key: 'product_name' },
        { title: 'Color', align: 'center', key: 'color' },
        { title: 'Quantity', align: 'center', key: 'quantity' },
        { title: 'Actions', align: 'center', sortable: false },
      ],
      appointments: [],
      dialogDelete: false,
      deleteRecordIndex: -1,
    };
  },
  created() {
    this.fetchAppointments();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchAppointments();
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.fetchAppointments();
    next();
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
    openDialogPr() {
      this.$router.push('/view/pending')
    },
    openAddRes() {
      this.$router.push('/add/reservation')
    },

    openDialogPu() {
      this.$router.push('/view/pickedup')
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

td{
  text-align: center;
}

.addBtn {
  background-color: #B3D9E6 !important;
  color: white !important;
  font-weight: bold !important;
  margin-left: 0px;
}

.addBtn .v-icon {
  margin-right: 8px; 
  color: black;
}


@media (max-width: 960px) {
  .pending-text{
    display: none;
  }

  .picked-up-text{
    display: none;
  }

  .reservationTitle{
    display: none;
  }
}
</style>
  