<template>
    <v-container>
        <v-data-table :search="search" :headers="headers" :items="displayedProducts"
            :sort-by="[{ key: 'product_id', order: 'asc' }]">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="text-uppercase grey--text productTitle">
                        <v-icon left>mdi-package-variant</v-icon>
                        Inventory
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-text-field v-model="search" class="w-auto mr-4" density="compact" label="Search Product"
                        prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details single-line
                        style="max-width: 300px;"></v-text-field>
                </v-toolbar>
            </template>

            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.product_name }}</td>
                    <td>{{ item.supplier }}</td>
                    <td>{{ item.type }}</td>
                    <td>
                        <span :class="getQuantityClass(item.quantity)">
                            {{ item.quantity }}
                        </span>
                    </td>
                    <td>
                        <span class="sold-quantity">-{{ item.total_sold }}</span>
                    </td>
                    <td>
                        <span class="new-stock">+{{ item.new_stock_added }}</span>
                    </td>
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
            </template>
        </v-data-table>

        <v-dialog v-model="stockDialog" max-width="800px">
            <v-card>
                <v-card-title class="headline">{{ editedItem.product_name }} Stocks</v-card-title>
                <v-card-text>
                    <v-table class="dialogTable">
                        <thead>
                            <tr>
                                <th style="text-align: center; padding: 10px;">Color</th>
                                <th style="text-align: center; padding: 10px;">Stock</th>
                                <th style="text-align: center; padding: 10px;">New Stock Added</th>
                                <th style="text-align: center; padding: 10px;">Sold</th>
                                <th style="text-align: center; padding: 10px;">Date of Restock</th>
                                <th style="text-align: center; padding: 10px;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(stock, index) in parsedColorStock" :key="index">
                                <td>{{ stock.color }}</td>
                                <td>{{ stock.stock }}</td>
                                <td>
                                    <span class="new-stock">+{{ stock.restockQuantity }}</span>
                                </td>
                                <td>
                                    <span class="sold-quantity">
                                        -{{ getSoldQuantity(stock.color, editedItem.sold_per_color) }}
                                    </span>
                                </td>
                                <td>{{ formatDate(editedItem.updated_at) }}</td>
                                <td>
                                    <span :class="getStockStatusClass(stock.stock)">
                                        {{ getStockStatus(stock.stock) }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>

                    </v-table>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDialog">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
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
            search: '',
            headers: [
                { title: 'Product Name', align: 'center', key: 'product_name' },
                { title: 'Supplier', align: 'center', key: 'supplier' },
                { title: 'Type', align: 'center', key: 'type' },
                { title: 'Quantity', align: 'center' },
                { title: 'Sold', align: 'center', key: 'quantity' },
                { title: 'New Stocks', align: 'center', key: 'quantity' },
                { title: 'Status', align: 'center' },
                { title: 'Actions', align: 'center', sortable: false },
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
            return this.products.filter((product) =>
                Object.values(product).some(
                    (value) =>
                        typeof value === 'string' && value.toLowerCase().includes(searchTerm)
                )
            );
        },
        parsedColorStock() {
            return this.editedItem.color_stock;  // Directly use the array
        },
    },
    mounted() {
        this.fetchProducts();
    },
    methods: {
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
            // Create a new Date object and format it as desired (e.g., 'MM/DD/YYYY HH:mm:ss')
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        }
    },
};
</script>

<style scoped>
.headers{
    text-align: center;
}

.sold-quantity{
    background-color: #ffcccc;
    color: #c0392b;
    padding: 5px 10px;
    border-radius: 4px;
}

.new-stock{
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

.dialogTable th, .dialogTable td {
    border: 1px solid #ddd; 
    padding: 10px;
    text-align: center; 
}

.dialogTable th {
    background-color: #f2f2f2; 
}

.headline{
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
