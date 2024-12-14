<template>
    <div class="mb-3 card mini-statistics-card">
        <div class="p-3 card-body">
            <div class="d-flex align-items-center">
                <!-- Icon representing sales -->
                <div class="icon-container text-center shadow icon icon-shape" :style="{
                    backgroundColor: icon.background,
                    borderRadius: icon.shape === 'rounded-circle' ? '50%' : '4px',
                }">
                    <v-icon :style="{ color: icon.color + ' !important' }">
                        mdi-cart
                    </v-icon>
                </div>

                <!-- Card content showing the title and sales information -->
                <div :class="classContent" class="ms-3">
                    <div class="numbers">
                        <p class="mb-0 text-sm text-uppercase font-weight-bold">
                            {{ title }}
                        </p>
                        <h5 class="mb-0 font-weight-bolder">
                            {{ `₱${totalRevenue.toLocaleString()}` }}
                        </h5>

                        <router-link v-if="link" :to="link" class="mt-2 mb-0 text-muted d-block plain-link">
                            {{ description }}
                        </router-link>
                        <p v-else class="mt-2 mb-0 text-muted">
                            {{ description }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Button to open date range picker -->
            <v-btn @click="dialog = true" class="calendarIcon">
                <v-icon>mdi-calendar</v-icon>
            </v-btn>

            <!-- Date Range Dialog -->
            <v-dialog v-model="dialog" max-width="600px">
                <v-card>
                    <v-card-title>Select a Date Range</v-card-title>

                    <v-card-text>
                        <v-row>
                            <v-col cols="6">
                                <v-menu v-model="startMenu" :close-on-content-click="false" offset-y>
                                    <template v-slot:activator="{ props }">
                                        <v-text-field v-model="startDate" label="Start Date" readonly v-bind="props" />
                                    </template>
                                    <v-date-picker v-model="startDate" :max="today" @input="startMenu = false" />
                                </v-menu>
                            </v-col>

                            <v-col cols="6">
                                <v-menu v-model="endMenu" :close-on-content-click="false" offset-y>
                                    <template v-slot:activator="{ props }">
                                        <v-text-field v-model="endDate" label="End Date" readonly v-bind="props" />
                                    </template>
                                    <v-date-picker v-model="endDate" :max="today" @input="endMenu = false" />
                                </v-menu>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="updateTitle" color="green">Confirm</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const dialog = ref(false);
const startDate = ref(null);
const endDate = ref(null);
const startMenu = ref(false);
const endMenu = ref(false);
const title = ref("Overall Sales");
const link = ref('/viewusers');
const description = ref('See Patients');
const totalRevenue = ref(0); // Initialize totalRevenue

const icon = {
    component: 'mdi-cart',
    background: '#FFEB3D',
    shape: 'rounded-circle',
    color: '#fff',
};

onMounted(() => {
    fetchGlasses();
});

const classContent = ref('');

const today = new Date().toISOString().split('T')[0];

const updateTitle = () => {
    if (startDate.value && endDate.value) {
        const formattedStartDate = new Date(startDate.value).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        });
        const formattedEndDate = new Date(endDate.value).toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        });
        title.value = `Sales from ${formattedStartDate} to ${formattedEndDate}`;
    }
    dialog.value = false;

    // Fetch glasses based on the updated date range
    fetchGlasses();
};


const fetchGlasses = async () => {
    try {
        const response = await axios.get('/glasses');
        const glasses = response.data;

        // Parse and filter glasses based on the selected date range
        const start = startDate.value ? new Date(startDate.value) : null;
        const end = endDate.value ? new Date(endDate.value) : null;

        if (end) {
            // Set end date time to 23:59:59 to include the entire day
            end.setHours(23, 59, 59, 999);
        }

        const filteredGlasses = glasses.filter(glass => {
            const glassDate = new Date(glass.date); // Ensure this is in the correct format (YYYY-MM-DD)

            if (start && end) {
                return glassDate >= start && glassDate <= end;
            } else if (start) {
                return glassDate >= start;
            } else if (end) {
                return glassDate <= end;
            }
            return true; // Include all if no range is selected
        });

        console.log('Start Date:', start);
        console.log('End Date:', end);

        // Calculate total revenue from filtered glasses
        totalRevenue.value = filteredGlasses.reduce((sum, glass) => {
            return sum + parseFloat(glass.price); // Ensure price is a number
        }, 0);
    } catch (error) {
        console.error('Error fetching glasses:', error);
    }
};



</script>

<style scoped>
.mini-statistics-card {
    border: 1px solid #000000;
    border-radius: 8px;
    background-color: #ffffff;
    transition: box-shadow 0.3s ease;
    box-shadow: 0 10px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.mini-statistics-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.icon-container {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.numbers p {
    color: #333333;
}

.numbers h5 {
    color: #333333;
}

.plain-link {
    text-decoration: none;
    color: inherit;
}

.plain-link:hover {
    text-decoration: none;
}

.calendarIcon {
    margin-left: 180px;
    color: #000000;
}
</style>
