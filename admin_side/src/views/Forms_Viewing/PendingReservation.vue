<template>
    <div class="title-container">
        <h1 class="ghostTitle">Pending Reservation</h1>
        <div class="dash">
            <span class="material-icons">inventory</span>
            <span class="text">Pending Reservations</span>
        </div>
    </div>
    <hr class="divider">
    <v-btn @click="goBack()" class="mb-2 mr-4 rounded-l add-btn" elevation="2">
        <v-icon left>mdi-chevron-left</v-icon>
        <span class="add-text">Back</span>
    </v-btn>
    <v-container class="content">
        <v-card>
            <v-card-title>
                <v-toolbar-title class="text-uppercase grey--text pendText">
                    <v-icon left>mdi-clock-outline</v-icon> <!-- Icon added here -->
                    Pending Reservations
                </v-toolbar-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search Appointments" single-line
                    hide-details></v-text-field>
            </v-card-title>

            <v-data-table :headers="headers" :items="pendingAppointments" :search="search" class="elevation-1"
                no-data-text="No pending appointments found">
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ item.id }}</td>
                        <td>{{ item.patient.full_name}}</td>
                        <td>{{ formatPrescriptionDate(item.created_at) }}</td>
                        <td>{{ item.product.product_name }}</td>
                        <td>
                            <span :style="{ color: item.color, textTransform: 'uppercase' }">
                                {{ item.color }}
                            </span>
                        </td>
                        <td>{{ item.product.quantity }}</td>
                        <td>₱{{ item.product.price }}</td>
                        <td>{{ item.quantity }}</td>
                        <td>
                            <v-icon size="small" style="color: green"
                                @click="acceptAppointment(item.id)">mdi-check</v-icon>
                            <v-icon size="small" style="color: red"
                                @click="declineAppointment(item.id)">mdi-delete</v-icon>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-card>
    </v-container>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export default {
    data() {
        return {
            search: '',
            pendingAppointments: [],
            headers: [
                { title: 'ID', align: 'center'},
                { title: 'Name', align: 'center' },
                { title: 'Date', align: 'center' },
                { title: 'Product Name', align: 'center' },
                { title: 'Color', align: 'center' },
                { title: 'Stock', align: 'center' },
                { title: 'Price', align: 'center' },
                { title: 'Quantity', align: 'center' },
                { title: 'Actions', align: 'center', sortable: false },
            ],
        };
    },
    created() {
        this.fetchPendingAppointments();
    },
    methods: {
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
        acceptAppointment(id) {
            axios.put(`/reservations/${id}/accept`)
                .then(response => {
                    const updatedAppointment = response.data;

                    // Remove the accepted appointment from pendingAppointments
                    const index = this.pendingAppointments.findIndex(appointment => appointment.id === id);
                    if (index !== -1) {
                        this.pendingAppointments.splice(index, 1);
                    }

                    // Show success alert
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: 'The reservation has been accepted successfully.',
                    });
                })
                .catch(error => {
                    console.error('Error accepting reservation:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Failed to accept the reservation. Please try again later.',
                    });
                });
        },

        goBack() {
            this.$router.push('/schedule');
        },
        declineAppointment(id) {
            axios.put(`/reservations/${id}/decline`)
                .then(response => {
                    // Remove the declined appointment from pendingAppointments
                    const index = this.pendingAppointments.findIndex(appointment => appointment.id === id);
                    if (index !== -1) {
                        this.pendingAppointments.splice(index, 1);
                    }

                    Swal.fire({
                        icon: 'error',
                        title: 'Reservation Declined',
                        text: 'The reservation has been declined successfully!',
                    });
                })
                .catch(error => {
                    console.error('Error declining reservation:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Failed to decline the reservation. Please try again later.',
                    });
                });
        },
        formatPrescriptionDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString(undefined, options);
        },
    },
};
</script>

<style scoped>
.ghostTitle {
    position: absolute;
    z-index: -1;
    opacity: 0.1;
    top: 0px;
    right: 50px;
    font-size: 120px;
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    color: #848484;
}

.title-container {
    display: flex;
    align-items: center;
    padding: 1rem;
    background-color: #ffffff;
    position: relative;
    z-index: 1;
}

.dash {
    flex: 1;
    display: flex;
    align-items: center;
    margin-left: 20px;
}

.material-icons {
    color: #1a1a1a;
    font-size: 2.5rem;
}

.add-btn {
    background-color: #B3D9E6 !important;
    color: white !important;
    font-weight: bold !important;
    width: 100px;
    margin-left: 50px;
}

.add-text {
    font-weight: bold;
    color: black !important;
}

.add-btn .v-icon {
    margin-right: 8px;
    /* Add spacing between icon and text */
    color: black;
}

.content{
    border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100%;
        border: 1px solid #ccc; 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
        border-width: 2px 1px 2px 4px;
        border-color: rgb(43, 75, 105);
        margin-bottom: 20px;
}

.text {
    margin-left: 0.5rem;
    color: #151515;
    font-size: 2rem;
    font-weight: 600;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.v-card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

td{
    text-align: center;
}

@media (max-width: 960px) {
    .v-data-table {
        font-size: 12px;
   }

   .pendText{
    display: none;
   }

   .dash {
       margin-left: -10px;
       margin-bottom: -20px;
   }

   .title-container {
       height: 60px;
   }

   .material-icons {
       font-size: 28px;
   }

   .text {
       font-size: 25px;
   }


   .ghostTitle {
       display: none;
   }
    
}
</style>
