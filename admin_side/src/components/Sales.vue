<template>
    <v-data-table :headers="headers" :items="filteredData" :sort-by="[{ key: 'date', order: 'asc' }]">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title class="text-uppercase grey--text">
                    <v-icon left>mdi-package-variant</v-icon>
                    {{ title }}
                </v-toolbar-title>
                <v-spacer></v-spacer>

                <!-- Search Bar -->
                <v-text-field v-model="search" label="Search Product or Appointment" prepend-inner-icon="mdi-magnify"
                    dense hide-details single-line style="max-width: 300px"></v-text-field>

                <v-btn @click="dialog = true" class="calendarIcon">
                    <v-icon>mdi-calendar</v-icon>
                </v-btn>
            </v-toolbar>
        </template>

        <template v-slot:body="{ items }">
            <tr v-for="item in items" :key="item.id">
                <td>{{ item.type }}</td>
                <td v-if="item.type === 'Glass'">
                    <span v-if="item.product_id">{{ item.product.product_name }}</span>
                    <span v-else>{{ item.custom_frame }}</span>
                </td>
                <td v-if="item.type === 'Reservation'">{{ item.product.product_name }}</td>
                <td v-if="item.type === 'Glass'">
                    <span v-if="item.product_id">{{ item.lens.product_name }}</span>
                    <span v-else>{{ item.custom_lens }}</span>
                </td>
                <td v-if="item.type === 'Reservation'">N/A</td>
                <td v-if="item.type === 'Glass'">
                    <span v-if="item.date">{{ item.date }}</span>
                    <span v-else>N/A</span>
                </td>
                <td v-if="item.type === 'Reservation'">{{ formatDate(item.created_at) }}</td>
                <td v-if="item.type === 'Reservation'">
                    <span v-if="item.quantity">{{ item.quantity }}</span>
                </td>
                <td v-if="item.type === 'Glass'">
                    <span v-if="item.date">1</span>
                </td>
                <td v-if="item.type === 'Glass'">
                    <span class="price" v-if="item.initial_price">₱ {{ item.initial_price | currency }}</span>
                    <span v-else>N/A</span>
                </td>
                <td v-if="item.type === 'Reservation'">
                    ₱ {{ (item.product.price * (item.quantity || 1)).toFixed(2) }}
                </td>
                <td v-if="item.type === 'Glass'">
                    <span class="price" v-if="item.discount">₱ {{ item.discount | currency }}</span>
                    <span v-else>N/A</span>
                </td>
                <td v-if="item.type === 'Reservation'">
                    N/A
                </td>
                <td v-if="item.type === 'Glass'">
                    <span class="price" v-if="item.price">₱ {{ item.price | currency }}</span>
                    <span v-else>N/A</span>
                </td>
                <td v-if="item.type === 'Reservation'">
                    N/A
                </td>
                <td v-if="item.type === 'Glass'">
                    <span class="price" v-if="item.balance">₱ {{ item.price | currency }}</span>
                    <span v-else>N/A</span>
                </td>
                <td v-if="item.type === 'Reservation'">
                    N/A
                </td>
            </tr>
        </template>
    </v-data-table>

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
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';

export default {
    data() {
        return {
            editItemDialog: false,
            dialog: false,
            infoDialog: false,
            stockDialog: false,
            selectedType: '',
            dialog: false,
            startDate: null,
            endDate: null,
            startMenu: false,
            endMenu: false,
            search: '',
            today: new Date().toISOString().substr(0, 10),
            title: ("Overall Sales"),
            editedItem: {
                product_image: '',
                product_id: '',
                product_name: '',
                supplier: '',
                quantity: '',
                price: '',
                image: '',
                type: '',
                images: [],
                color_stock: [],
            },
            glasses: [],
            pickedUpAppointments: [],
            combinedData: [],

            productTypes: ['Low Stock', 'High Stock', 'Frames', 'Lens', 'Contact Lenses', 'Accessories'],
            search: '',
            headers: [
                { title: 'Type', align: 'center' },
                { title: 'Frame', align: 'center'},
                { title: 'Lens', align: 'center' },
                { title: 'Date', align: 'center'},
                { title: 'Quantity', align: 'center' },
                { title: 'Price', align: 'center'},
                { title: 'Discount', align: 'center' },
                { title: 'Amount', align: 'center' },
                { title: 'Balance', align: 'center' },
            ],
            currentImageIndex: 0,
            products: [],
            dialogDelete: false,
            deleteRecordIndex: -1,
            lowStockThreshold: 5,
        };
    },
    computed: {
        displayedProducts() {
            const searchTerm = this.search.toLowerCase();

            // Filter by type if selectedType is chosen
            let filteredProducts = this.products;

            if (this.selectedType === 'Low Stock') {
                filteredProducts = filteredProducts.filter(product => product.quantity <= 5);
            } else if (this.selectedType === 'High Stock') {
                filteredProducts = filteredProducts.filter(product => product.quantity > 5);
            } else if (this.selectedType && this.selectedType !== 'Low Stock' && this.selectedType !== 'High Stock') {
                // Filter by type if selectedType is a product type
                filteredProducts = filteredProducts.filter(
                    product => product.type === this.selectedType
                );
            }
            // Apply search filter on the filtered products
            return filteredProducts.filter((product) =>
                Object.values(product).some(
                    (value) =>
                        typeof value === 'string' && value.toLowerCase().includes(searchTerm)
                )
            );
        },
        filteredData() {
            if (this.search) {
                return this.combinedData.filter(item => {
                const searchTerm = this.search.toLowerCase();

                // Check if any of these properties contain the search term
                return (
                    item.type.toLowerCase().includes(searchTerm) ||
                    (item.product?.product_name?.toLowerCase()?.includes(searchTerm)) ||
                    (item.custom_frame?.toLowerCase()?.includes(searchTerm)) ||
                    (item.date?.toLowerCase()?.includes(searchTerm)) ||
                    (item.quantity?.toString()?.includes(searchTerm))
                );
                });
            }
            return this.combinedData;
            }
    },
    mounted() {
        this.fetchProducts();
        this.fetchGlasses();
    },
    methods: {
        getQuantityClass(quantity) {
            return quantity <= 5 ? 'low-stock' : 'high-stock';
        },
        async updateTitle() {
            if (this.startDate && this.endDate) {
                const formattedStartDate = new Date(this.startDate).toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                });
                const formattedEndDate = new Date(this.endDate).toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                });
                this.title = `Sales from ${formattedStartDate} to ${formattedEndDate}`;
            }

            this.dialog = false;

            // Fetch glasses and reservations based on the updated date range
            await this.fetchGlasses();
        },

        async fetchGlasses() {
            try {
                // Fetch glasses
                const glassesResponse = await axios.get('/glasses');
                const glasses = glassesResponse.data;

                // Fetch reservations
                const pickedUpResponse = await axios.get('/reservations/picked_up');
                const pickedUpAppointments = pickedUpResponse.data;

                // Parse start and end dates
                const start = this.startDate ? new Date(this.startDate) : null;
                const end = this.endDate ? new Date(this.endDate) : null;

                if (end) {
                    end.setHours(23, 59, 59, 999);
                }

                // Filter glasses based on the selected date range
                const filteredGlasses = glasses.filter(glass => {
                    const glassDate = new Date(glass.date);
                    return (!start || glassDate >= start) && (!end || glassDate <= end);
                });

                // Filter reservations based on the selected date range
                const filteredPickedUpAppointments = pickedUpAppointments.filter(appointment => {
                    const appointmentDate = new Date(appointment.created_at);
                    return (!start || appointmentDate >= start) && (!end || appointmentDate <= end);
                });

                // Combine glasses and reservations into a single array with types
                this.combinedData = [
                    ...filteredGlasses.map(glass => ({
                        ...glass,
                        type: 'Glass',
                    })),
                    ...filteredPickedUpAppointments.map(appointment => ({
                        ...appointment,
                        type: 'Reservation',
                    })),
                ];

                // Calculate total revenue for glasses
                this.totalRevenue = filteredGlasses.reduce((sum, glass) => {
                    return sum + parseFloat(glass.price || 0);
                }, 0);

            } catch (error) {
                console.error('Error fetching glasses or reservations:', error);
            }
        },
        // Optional: Add a currency formatter for prices
        currency(value) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(value);
        },
        parsedColorStock() {
            return this.editedItem.color_stock; // Directly use the array
        },
        getQuantityClass(quantity) {
            return quantity <= this.lowStockThreshold ? 'low-stock' : 'high-stock';
        },
        getStockStatus(quantity) {
            return quantity <= this.lowStockThreshold ? 'Low Stock' : 'High Stock';
        },
        getStockStatusClass(quantity) {
            return quantity <= this.lowStockThreshold ? 'low-stock' : 'high-stock';
        },
        fetchProducts() {
            axios.get('/allProducts')
                .then(response => {
                    if (Array.isArray(response.data)) {
                        this.products = response.data.map(product => {
                            const colorStock = JSON.parse(product.color_stock || '[]');
                            const newStockPerColor = product.new_stock_added / colorStock.length; // Distributing evenly

                            // Map over color stock to add new stock info
                            const updatedColorStock = colorStock.map(color => ({
                                ...color,
                                new_stock_added: newStockPerColor // Add new stock for each color
                            }));

                            return {
                                ...product,
                                color_stock: updatedColorStock, // Use the updated color stock
                            };
                        });
                    } else {
                        this.error = 'Unexpected response format';
                    }
                })
                .catch(error => {
                    this.error = 'Error fetching products: ' + error.message;
                });
        },

        openInfoItem(item) {
            this.editedItem = { ...item };
            this.stockDialog = true;
        },
        closeDialog() {
            this.stockDialog = false; // Close the dialog
        },
        deleteProduct(item) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Proceed with deletion if confirmed
                    const productToDelete = item;
                    axios.delete('/products/' + productToDelete.id)
                        .then(() => {
                            // Remove product from the array
                            const index = this.products.indexOf(productToDelete);
                            this.products.splice(index, 1);

                            // Show success message
                            Swal.fire({
                                icon: 'success',
                                title: 'Deleted!',
                                text: 'Product has been deleted.',
                                confirmButtonText: 'Ok',
                            });
                        })
                        .catch(error => {
                            // Handle error
                            console.error('Delete failed:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Error deleting product!',
                                confirmButtonText: 'Ok',
                            });
                        });
                }
            });
        },
        confirmDelete() {
            const productToDelete = this.products[this.deleteRecordIndex];
            axios.delete('/product/' + productToDelete.id)
                .then(() => {
                    this.products.splice(this.deleteRecordIndex, 1);
                    this.dialogDelete = false;
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Product has been deleted.',
                        confirmButtonText: 'Ok',
                    });
                })
                .catch(error => {
                    console.error('Delete failed:', error);
                    this.dialogDelete = false;
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Error deleting product!',
                        confirmButtonText: 'Ok',
                    });
                });
        },
        totalSoldForColor(color) {
            // Find the total sold for the specific color from the main products
            const item = this.products.find(product => product.product_id === this.editedItem.product_id);
            return item ? item.total_sold : 0; // Return the total sold for this product
        },
        newStockAdded(color) {
            const item = this.products.find(product => product.product_id === this.editedItem.product_id);
            return item ? item.new_stock_added : 0;
        },
        openEditItem(item) {
            this.$router.push({ path: '/view/product', query: { id: item.id } });
        },
        getSoldQuantity(color, soldPerColor) {
            // Ensure soldPerColor exists and has a value for the specific color
            return soldPerColor && soldPerColor[color] ? soldPerColor[color] : 0;
        },
        formatDate(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
    },
};
</script>

<style scoped>
.headers {
    text-align: center;
}

.sold-quantity {
    background-color: #ffcccc;
    color: #c0392b;
    padding: 5px 10px;
    border-radius: 4px;
}

.new-stock {
    background-color: #d4edda;
    color: #155724;
    padding: 5px 10px;
    border-radius: 4px;
}

.low-stock {
    background-color: #ffcccc;
    color: #c0392b;
    padding: 5px 10px;
    border-radius: 4px;
}

.high-stock {
    background-color: #d4edda;
    color: #155724;
    padding: 5px 10px;
    border-radius: 4px;
}

.v-card:hover {
    background-color: #f0f0f0;
}

.add-btn {
    background-color: #B3D9E6 !important;
    color: white !important;
    font-weight: bold !important;
}

.add-text {
    font-weight: bold;
    color: black !important;
}

td {
    text-align: center;
}

.add-btn .v-icon {
    margin-right: 8px;
    color: black;
}

.stockTitle {
    text-align: center;
    background-color: rgb(189, 226, 240);
}

.main-content {
    display: flex;
    flex-direction: column;
    margin-left: 30px;
    margin-right: 30px;
}

.inventory2 {
    border-radius: 5px;
    background-color: #f0f0f0;
    padding: 0.5rem;
    height: 100%;
    border: 1px solid #ccc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-color: rgb(178, 177, 177);
    margin-bottom: 10px;
}

.dialogTable {
    border-collapse: collapse;
    width: 100%;
}

.dialogTable th,
.dialogTable td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: center;
}

.dialogTable th {
    background-color: #f2f2f2;
}

.headline {
    background-color: #B3D9E6;
    text-align: center;
}


@media (max-width: 960px) {
    .add-text {
        display: none;
    }

    .productTitle {
        display: none;
    }
}
</style>
