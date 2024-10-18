<template>
    <v-data-table :search="search" :headers="headers" :items="displayedProducts"
        :sort-by="[{ key: 'product_id', order: 'asc' }]">
        <template v-slot:top>
            <v-toolbar flat>
                <!-- Title with icon -->
                <v-toolbar-title class="text-uppercase grey--text productTitle">
                    <v-icon left>mdi-package-variant</v-icon> <!-- Icon added here -->
                    Inventory
                </v-toolbar-title>
                <v-spacer></v-spacer>

                <!-- Search input -->
                <v-text-field v-model="search" class="w-auto mr-4" density="compact" label="Search Product"
                    prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details single-line
                    style="max-width: 300px;"></v-text-field>

                <!-- Add new product button -->
                
            </v-toolbar>
        </template>

        <!-- Row for each product -->
        <template v-slot:item="{ item }">
            <tr>
                <td>{{ item.id }}</td>
                <td>{{ item.product_name }}</td>
                <td>{{ item.supplier }}</td>
                <td>{{ item.type }}</td>
                <td>{{ item.quantity }}</td>
                <td>₱{{ item.price }}</td>
                <td>
                    <span :class="getStockStatusClass(item.quantity)">
                        {{ getStockStatus(item.quantity) }}
                    </span>
                </td>
                <td>
                    <v-icon size="small" style="color: #2F3F64" @click="openInfoItem(item)">mdi-eye</v-icon>
                    <v-icon size="small" style="color: #2F3F64" @click="openEditItem(item)">mdi-pencil</v-icon>
                    <v-icon size="small" style="color: #2F3F64" @click="deleteProduct(item)">mdi-delete</v-icon>
                </td>
            </tr>

            <v-dialog v-model="infoDialog" max-width="750px">
                <v-card>
                    <v-card-title class="stockTitle">
                        <span class="text-h6 m-2">{{ editedItem.product_name }} Details</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container>
                            <v-row dense>
                                <!-- Product Image with navigation buttons -->
                                <v-col cols="12" class="d-flex justify-center align-center">
                                    <v-btn icon @click="prevImage" :disabled="currentImageIndex === 0">
                                        <v-icon>mdi-chevron-left</v-icon>
                                    </v-btn>

                                    <v-img :src="editedItem.images[currentImageIndex]" aspect-ratio="1.5"
                                        class="mb-4"></v-img>

                                    <v-btn icon @click="nextImage"
                                        :disabled="currentImageIndex === editedItem.images.length - 1">
                                        <v-icon>mdi-chevron-right</v-icon>
                                    </v-btn>
                                </v-col>

                                <!-- Product Name -->
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field v-model="editedItem.product_name" label="Product Name*"
                                        prepend-icon="mdi-package-variant-closed" disabled></v-text-field>
                                </v-col>

                                <!-- Supplier -->
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field v-model="editedItem.supplier" label="Supplier"
                                        prepend-icon="mdi-truck-delivery" disabled></v-text-field>
                                </v-col>

                                <!-- Quantity -->
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field v-model="editedItem.quantity" label="Quantity"
                                        prepend-icon="mdi-counter" disabled></v-text-field>
                                </v-col>

                                <!-- Price -->
                                <v-col cols="12" sm="12" md="6">
                                    <v-text-field v-model="editedItem.price" label="Price" prepend-icon="mdi-cash"
                                        disabled></v-text-field>
                                </v-col>

                                <!-- Type -->
                                <v-col cols="12" sm="12" md="6">
                                    <v-select v-model="editedItem.type"
                                        :items="['Frames', 'Sunglasses', 'Prescription Glasses']" label="Type"
                                        prepend-icon="mdi-glasses" disabled></v-select>
                                </v-col>

                                <v-col cols="12">
                                    <h4>Color Stock</h4>
                                    <v-row>
                                        <v-col v-for="(colorStock, index) in parsedColorStock" :key="index" cols="12"
                                            sm="4">
                                            <v-card outlined>
                                                <v-card-title>
                                                    <v-text-field :label="colorStock.color" :value="colorStock.color"
                                                        readonly></v-text-field>
                                                </v-card-title>
                                                <v-card-subtitle>
                                                    <v-text-field :label="'Stock for ' + colorStock.color"
                                                        v-model="colorStock.stock"></v-text-field>
                                                </v-card-subtitle>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="black" text @click="closeInfoItemDialog">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


        </template>
    </v-data-table>
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
                color_stock: [{ color: '', stock: 0 }],
            },
            search: '',
            dialogAddPrescription: false,
            headers: [
                { title: 'Product ID', align: 'center', key: 'product_id' },
                { title: 'Product Name', align: 'center', key: 'product_name' },
                { title: 'Supplier', align: 'center', key: 'supplier' },
                { title: 'Type', align: 'center', key: 'type' },
                { title: 'Sold', align: 'center', key: 'quantity' },
                { title: 'Price', align: 'center', key: 'price' },
                { title: 'Status', align: 'center', },
                { title: 'Actions', align: 'center', sortable: false },


            ],
            currentImageIndex: 0,
            viewingRecords: false,
            products: [],
            color_stock: [],
            dialogDelete: false,
            deleteRecordIndex: -1,
            lowStockThreshold: 5, // Define your low stock threshold here
        };
    },
    computed: {
        displayedProducts() {
            const searchTerm = this.search.toLowerCase();
            return this.products.filter((products) =>
                Object.values(products).some(
                    (value) =>
                        typeof value === 'string' && value.toLowerCase().includes(searchTerm)
                )
            );
        },
        parsedColorStock() {
            try {
                return JSON.parse(this.editedItem.color_stock);
            } catch (error) {
                console.error('Invalid color_stock format', error);
                return [];
            }
        },
    },
    mounted() {
        this.fetchProducts();
    },
    methods: {
        getStockStatus(quantity) {
            return quantity <= this.lowStockThreshold ? 'Low Stock' : 'High Stock'; // Determine stock status
        },
        getStockStatusClass(quantity) {
            return quantity <= this.lowStockThreshold ? 'low-stock' : 'high-stock'; // Return class based on stock status
        },
        updateQuantity() {
            const totalStock = this.editedItem.color_stock.reduce((sum, item) => sum + item.stock, 0);
            this.editedItem.quantity = totalStock;
        },
        nextImage() {
            if (this.currentImageIndex < this.editedItem.images.length - 1) {
                this.currentImageIndex++;
            }
        },
        prevImage() {
            if (this.currentImageIndex > 0) {
                this.currentImageIndex--;
            }
        },
        fetchProducts() {
            axios.get('/allProducts')
                .then(response => {
                    if (Array.isArray(response.data)) {
                        this.products = response.data;
                    } else {
                        this.error = 'Unexpected response format';
                    }
                })
                .catch(error => {
                    this.error = 'Error fetching products: ' + error.message;
                });
        },
        openDialog() {
            this.$router.push('/add/product');
        },
        closeDialog() {
            this.dialog = false;
        },
        openEditItem(item) {
            this.$router.push({ path: '/view/product', query: { id: item.id } });
        },
        openInfoItem(item) {
            this.editedItem = { ...item, images: item.images || [] };
            this.currentImageIndex = 0;
            this.infoDialog = true;
        },
        closeEditItemDialog() {
            this.editItemDialog = false;
        },
        closeInfoItemDialog() {
            this.infoDialog = false;
        },
        deleteProduct(item) {
            this.deleteRecordIndex = this.products.indexOf(item);
            this.dialogDelete = true;
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
    },
};
</script>

<style>
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

@media (max-width: 960px) {
    .add-text {
        display: none;
    }

    .productTitle {
        display: none;
    }
}
</style>
