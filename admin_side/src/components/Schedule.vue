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

        <div class="badge-container">
          <v-btn @click="openDialogPr('pending')" class="mb-2 mr-4 rounded-l pending-btn" elevation="2">
            <v-icon left>mdi-clock-outline</v-icon>
            <span class="pending-text">Pending</span>
          </v-btn>

          <v-badge :content="pendingAppointments.length" color="green" overlap class="notif"></v-badge>
        </div>


        <!-- Picked Up Reservations Dialog -->
        <v-btn @click="openDialogPu('pickedUp')" class="mb-2 rounded-l picked-up-btn" elevation="2" v-bind="props">
          <v-icon left>mdi-check-outline</v-icon>
          <span class="picked-up-text">Picked Up</span>
        </v-btn>

        <v-btn @click="openDialogDeclined('pickedUp')" class="mb-2 rounded-l picked-up-btn" elevation="2" v-bind="props"
          style="margin-left: 16px;">
          <v-icon left>mdi-cancel</v-icon>
          <span class="picked-up-text">Declined</span>
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
        <td>{{ formatPrescriptionDate(appointments.deadline) }}</td>
        <td>
          <v-icon size="small" style="color: teal" @click="seeItem(appointments.id)">mdi-eye</v-icon>
          <v-icon size="small" style="color: #d33" @click="declineAppointment(appointments.id)">mdi-cancel</v-icon>
          <v-icon size="small" style="color: #2F3F64" @click="pickedUp(appointments)">mdi-truck</v-icon>
        </td>
      </tr>
    </template>

  </v-data-table>

  <v-dialog v-model="dialog" max-width="700px">
    <v-card elevation="10" class="pa-4">
      <!-- Dialog Title -->
      <v-card-title class="headline font-weight-bold">
        {{ selectedItem?.patient.full_name }}'s Reservation
      </v-card-title>

      <!-- Divider for a cleaner layout -->
      <v-divider></v-divider>

      <!-- Dialog Content -->
      <v-card-text>
        <v-container>
          <v-row>
            <!-- Product Image Section -->
            <v-col cols="12" sm="6">
              <v-img :src="selectedItem?.image" aspect-ratio="1.5" class="rounded-lg mb-4" max-width="100%"></v-img>
            </v-col>

            <!-- Product Details Section -->
            <v-col cols="12" sm="6">
              <v-row class="mb-2">
                <v-col>
                  <strong>Product Name:</strong>
                  <span>{{ selectedItem?.product.product_name }}</span>
                </v-col>
              </v-row>
              <v-row class="mb-2">
                <v-col>
                  <strong>Color:</strong>
                  <span>{{ selectedItem?.color }}</span>
                </v-col>
              </v-row>
              <v-row class="mb-2">
                <v-col>
                  <strong>Stock Quantity:</strong>
                  <span>{{ selectedItem?.stockQuantity }}</span>
                </v-col>
              </v-row>
              <v-row class="mb-2">
                <v-col>
                  <strong>Price:</strong>
                  <span>₱{{ selectedItem?.product.price }}</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <strong>Reservation Date:</strong>
                  <span>{{ formatPrescriptionDate(selectedItem?.created_at) }}</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <!-- Dialog Actions -->
      <v-divider></v-divider>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="primary" dark @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


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
        { title: 'Deadline Date', align: 'center', key: 'quantity' },
        { title: 'Actions', align: 'center', sortable: false },
      ],
      appointments: [],
      pendingAppointments: [],
      dialogDelete: false,
      deleteRecordIndex: -1,
      dialog: false, 
    };
  },
  computed: {
    pendingCount() {
      return this.pendingAppointments.length;
    },
  },
  created() {
    this.fetchAppointments();
    this.fetchPendingAppointments();
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
    fetchPendingAppointments() {
      axios.get('/reservations/pending')
        .then(response => {
          this.pendingAppointments = response.data;
          console.log('Pending Appointments:', this.pendingAppointments);
        })
        .catch(error => {
          console.error('Error fetching pending appointments:', error);
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
    openDialogDeclined() {
      this.$router.push('/view/declined')
    },
  formatPrescriptionDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  },
    declineAppointment(id) {
      // Show confirmation dialog
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to undo this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, decline it!',
        cancelButtonText: 'No, cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          // If the user confirms, proceed with the decline
          axios.put(`/reservations/${id}/decline`)
            .then(response => {
              // Remove the declined appointment from acceptedAppointments
              const index = this.acceptedAppointments.findIndex(appointment => appointment.id === id);
              if (index !== -1) {
                this.acceptedAppointments.splice(index, 1);
              }

              Swal.fire({
                icon: 'success',
                title: 'Reservation Declined',
                text: 'The reservation has been declined successfully!',
              });
              this.fetchAppointments();
            })
            .catch(error => {
              console.error('Error declining reservation:', error);
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Failed to decline the reservation. Please try again later.',
              });
            });
        }
      });
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
    seeItem(id) {
      const item = this.acceptedAppointments.find(appointment => appointment.id === id);
      if (item) {

        // Safely parse color_stock
        const colorStockArray = item.product.color_stock ? JSON.parse(item.product.color_stock) : [];
        const colorData = colorStockArray.find(colorItem => colorItem.color === item.color);

        // Prepend the base URL (127.0.0.1) to each color stock image only if needed
        const colorStockImages = colorStockArray.map(color =>
          color.image && !color.image.startsWith('http') ? `https://opticare.fun/${color.image}` : color.image
        );

        // Safely parse item.product.images and prepend the base URL
        const productImages = item.product.image ? JSON.parse(item.product.image) : []; // Parse JSON string
        const allImages = [
          ...productImages.map(image =>
            image.startsWith('http') ? image : `https://opticare.fun/${image}`
          ),
          ...colorStockImages
        ].filter(Boolean);

        // Determine the image source
        let imageUrl = '';

        if (colorData && colorData.image) {
          // Use color stock image if available
          imageUrl = colorData.image.startsWith('http') ? colorData.image : `https://opticare.fun/${colorData.image}`;
        } else if (allImages.length > 0) {
          // Use the first image from all images if no color stock image is available
          imageUrl = allImages[0];
        } else {
          // Use a fallback image if no image is found
          imageUrl = `/path/to/fallback-image.jpg`;
        }

        // Setting selected item for dialog
        this.selectedItem = {
          ...item,
          stockQuantity: colorData ? colorData.stock : 'N/A',
          image: imageUrl,
          images: allImages // Store all images for potential future use
        };

        this.dialog = true; // Open the dialog
      } else {
        console.error('Item not found:', id); // Log if the item is not found
      }
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

.headline{
  background-color: rgb(174, 204, 240);
  text-align: center;
}

.badge-container {
  position: relative;
  display: inline-block;
}

.notif {
  position: absolute;
  top: 0px; /* Adjusts how high above the button the badge appears */
  right: 15px; /* Adjusts horizontal overflow; modify as needed */
  z-index: 100;
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
  