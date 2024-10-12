<template>
    <v-container>
        <div class="title-container">

            <h1 class="ghostTitle">Reservations</h1>
            <div class="dash">
                <span class="material-icons">dashboard</span>
                <span class="text">Reservations</span>
            </div>
        </div>

        <button class="back-button" @click="goBack">
            <i class="fas fa-arrow-left"></i> <!-- Font Awesome Icon -->
            Back
        </button>

        <!-- Reservations table -->
        <v-card class="reservations-card" elevation="2">
            <v-card-title class="reservations-card-title">
                Reservation Details
            </v-card-title>
            <v-card-text>
                <v-data-table :headers="headers" :items="reservations" item-key="id" class="elevation-1">
                    <template v-slot:item.picked_up_date="{ item }">
                        {{ item.picked_up_date ? new Date(item.picked_up_date).toLocaleDateString() : 'Not picked up' }}
                    </template>
                    <template v-slot:item.product.product_name="{ item }">
                        {{ item.product.product_name }}
                    </template>
                    <template v-slot:item.product.supplier="{ item }">
                        {{ item.product.supplier }}
                    </template>
                    <template v-slot:item.color="{ item }">
                        <span :style="{ color: item.color, textTransform: 'uppercase' }">
                            {{ item.color }}
                        </span>
                    </template>
                    <template v-slot:item.status="{ item }">
                        <span :style="getStatusStyle(item.status)">{{ getStatusText(item.status) }}</span>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <v-btn v-if="item.status === 'pending' || item.status === 'accepted' " @click="updateStatus(item, 'canceled')" color="red"
                            text>
                            Cancel
                        </v-btn>
                    </template>
                </v-data-table>
                <v-alert v-if="!reservations.length" type="info" class="mt-3">
                    No reservations found.
                </v-alert>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';

export default {
    data() {
        return {
            reservations: [],
            headers: [
                { title: 'Product', align: 'center', value: 'product.product_name' },
                { title: 'Brand', align: 'center', value: 'product.supplier' },
                { title: 'Pickup Date', align: 'center', value: 'picked_up_date' },
                { title: 'Color', align: 'center', value: 'color' },
                { title: 'Status', align: 'center', value: 'status' },
                { title: 'Quantity', align: 'center', value: 'quantity' },
                { title: 'Actions', align: 'center', value: 'actions' }
            ]
        };
    },
    async mounted() {
        const patientId = this.$route.query.patient_id;

        if (patientId) {
            try {
                const response = await axios.get(`/reservations/${patientId}`);
                if (response.data && response.data.length > 0) {
                    this.reservations = response.data;
                }
            } catch (error) {
                console.error('Error fetching reservations:', error);
            }
        } else {
            console.error('Patient ID not found in query parameters.');
        }
    },
    methods: {
        getStatusText(status) {
            switch (status) {
                case 'pending':
                    return 'Pending';
                case 'canceled':
                    return 'Canceled';
                case 'picked_up':
                    return 'Picked Up';
                case 'accepted':
                    return 'Accepted';
                case 'declined':
                    return 'Declined';
                default:
                    return 'Unknown';
            }
        },
        getStatusStyle(status) {
            switch (status) {
                case 'pending':
                    return 'color: orange;';
                case 'canceled':
                    return 'color: red;';
                case 'picked_up':
                    return 'color: blue;';
                case 'accepted':
                    return 'color: green;';
                case 'declined':
                    return 'color: gray;';
                default:
                    return '';
            }
        },
        async updateStatus(item) {
            try {
                // Show SweetAlert2 confirmation dialog
                const result = await Swal.fire({
                    title: 'Are you sure?',
                    text: 'Are you sure to cancel this reservation?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, cancel it!',
                    cancelButtonText: 'No, keep it'
                });

                if (result.isConfirmed) {
                    // Proceed with deleting the reservation if confirmed
                    await axios.delete(`/reservations/${item.id}`);

                    // Update local reservations array to reflect the change
                    this.reservations = this.reservations.filter(reservation => reservation.id !== item.id);

                    // Show a success message
                    Swal.fire(
                        'Cancelled!',
                        'The reservation has been canceled.',
                        'success'
                    );
                }
            } catch (error) {
                // Handle errors
                console.error('Error updating reservation status:', error);
                Swal.fire(
                    'Error!',
                    'Failed to cancel reservation.',
                    'error'
                );
            }
        },
        goBack() {
            this.$router.go(-1);
        }
    }
}
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

.text {
    margin-left: 0.5rem;
    color: #151515;
    font-size: 2rem;
    font-weight: 600;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
.patient-info-card {
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    
}

.patient-info-card-title {
    font-size: 1.7rem;
    color: #333;
}

.reservations-card {
    margin-top: 20px;
    border-radius: 10px;
    border-width: 1px 1px 2px 4px;
    border-color: rgb(67, 100, 101);
    box-shadow: 0 10px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.reservations-card-title {
    font-size: 1.7rem;
    color: #333;
}

.v-data-table td {
    text-align: center;
}

.back-button{
    margin-left: 40px;
    margin-top: 20px;
    background-color: #007bff;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px;
    color: #fff;
}

.v-btn {
    text-transform: none;
}

@media (max-width: 960px) {
    .reservations-card-title{
        font-size: 18px;
    }

    .v-data-table {
        font-size: 13px;
    }
    .dash{
        margin-left: -10px;
        margin-bottom: -20px;
    }

    .title-container{
        height: 60px;
    }

    .material-icons{
        font-size: 28px;
    }

    .text{
        font-size: 25px;
    }
    

    .ghostTitle{
        font-size: 55px;
        margin-top: 30px;
    }

    .back-button{
        font-size: 12px;
        margin-left: 0px;
        margin-top: 50px;
    }
}
</style>
