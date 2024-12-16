<template>
    <div>
        <v-row class="mt-4">
            <v-col class="d-flex justify-end">
                <v-menu v-model="menu" offset-y>
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" class="mb-2 rounded-l generateBtn" dark color="primary">
                            Generate Report
                            <v-icon right>mdi-menu-down</v-icon>
                        </v-btn>
                    </template>

                    <v-card>

                        <v-card-actions>
                            <v-btn text @click="exportProductPDF">Generate PDF</v-btn>
                            <v-btn text @click="exportProductExcel">Generate Excel</v-btn>
                        </v-card-actions>

                        <v-card-text>
                            <!-- Date Range Pickers -->
                            <p>Start Date:</p>
                            <v-date-picker v-model="startDate" :max="endDate" @input="updateDateRange" />

                            <p>End Date:</p>
                            <v-date-picker v-model="endDate" :min="startDate" @input="updateDateRange" />
                        </v-card-text>


                    </v-card>
                </v-menu>
            </v-col>
        </v-row>
    </div>
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


                <v-select v-model="selectedType" :items="productTypes" label="Filter Products" clearable class="mr-4"
                    density="compact" solo></v-select>


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
                    <span class="sold-quantity">{{ item.total_sold }}</span>
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
                <!-- Loop through each color and display its own table -->
                <div v-for="(colorStock, index) in parsedColorStock" :key="index" class="color-section">
                    <!-- Display the color outside the table -->
                    <h3 class="color-header" style="text-align: center; margin: 20px 0;">
                        {{ colorStock.color }}
                    </h3>
                    <v-table class="dialogTable">
                        <thead>
                            <tr>
                                <th style="text-align: center; padding: 10px;">Stock</th>
                                <th style="text-align: center; padding: 10px;">New Stock Added</th>
                                <th style="text-align: center; padding: 10px;">Sold</th>
                                <th style="text-align: center; padding: 10px;">Last Updated</th>
                                <th style="text-align: center; padding: 10px;">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{{ colorStock.stock }}</td>
                                <td>
                                    <span class="new-stock">+{{ colorStock.restockQuantity }}</span>
                                </td>
                                <td>
                                    <span class="sold-quantity">
                                        {{ getSoldQuantity(colorStock.color, editedItem.sold_per_color) }}
                                    </span>
                                </td>
                                <td>{{ formatDate(editedItem.updated_at) }}</td>
                                <td>
                                    <span :class="getStockStatusClass(colorStock.stock)">
                                        {{ getStockStatus(colorStock.stock) }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDialog">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default {
    data() {
        return {
            editItemDialog: false,
            dialog: false,
            infoDialog: false,
            stockDialog: false,
            selectedType: '',
            menu: false,
            startDate: null,
            endDate: null,
            products: [],
            selectedType: '',  // Filter type (optional)
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
            productTypes: ['Low Stock', 'High Stock', 'Frames', 'Lens', 'Contact Lenses', 'Accessories'],
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
        parsedColorStock() {
            return this.editedItem.color_stock;  // Directly use the array
        },
    },
    mounted() {
        this.fetchProducts();
        this.fetchHistories();
    },
    methods: {
        updateDateRange() {
            console.log(`Start Date: ${this.startDate}, End Date: ${this.endDate}`);
        },

        async exportProductPDF() {
            try {
                const doc = new jsPDF('landscape');
                const logoImage = '../src/assets/MVC_logo.png'; // Ensure this is the correct path
                const marginTop = 20;
                const marginLeft = 15;
                const pageHeight = doc.internal.pageSize.height;
                const pageWidth = doc.internal.pageSize.width;
                const lineHeight = 10;
                const cellPadding = 6;
                const headerFontSize = 14;
                const tableFontSize = 10;
                const typeTitleFontSize = 16;  // Increase font size for product type title
                const currentDate = new Date();
                const formattedDate = currentDate.toLocaleString();

                // Filter the products based on the selected type and stock level (Low Stock or High Stock)
                let filteredProducts = this.products;

                if (this.selectedType === 'Low Stock') {
                    filteredProducts = filteredProducts.filter(product => product.quantity <= 5);
                } else if (this.selectedType === 'High Stock') {
                    filteredProducts = filteredProducts.filter(product => product.quantity > 5);
                } else if (this.selectedType && this.selectedType !== 'Low Stock' && this.selectedType !== 'High Stock') {
                    filteredProducts = filteredProducts.filter(
                        product => product.type === this.selectedType
                    );
                }

                // Group products by type
                const productsByType = filteredProducts.reduce((acc, product) => {
                    if (!acc[product.type]) acc[product.type] = [];
                    acc[product.type].push(product);
                    return acc;
                }, {});

                // Add logo and title to the PDF
                doc.setFontSize(headerFontSize);
                doc.addImage(logoImage, 'PNG', marginLeft + 35, 20, 200, 25);
                doc.text('MVC Optical Clinic', pageWidth / 2, marginTop + 30, { align: 'center' });
                doc.setFontSize(12);
                doc.text('Product Report', pageWidth / 2, marginTop + 50, { align: 'center' });
                doc.setFontSize(10);
                doc.text(`Report Generated: ${formattedDate}`, pageWidth / 2, marginTop + 60, { align: 'center' });

                // Iterate through each product type and generate a table
                let currentY = marginTop + 70;
                const headers = ['Product Name', 'Supplier', 'Type', 'Updated At', 'Quantity', 'Status'];

                Object.keys(productsByType).forEach((type) => {
                    // Add title for product type with larger font size
                    doc.setFontSize(typeTitleFontSize); // Set larger font size for the type title
                    doc.setFont('helvetica', 'bold');
                    doc.text(type, marginLeft, currentY);
                    currentY += lineHeight + 5;

                    // Draw table header
                    let headerX = marginLeft;
                    doc.setFont('helvetica', 'bold');
                    headers.forEach((header, i) => {
                        doc.setFontSize(tableFontSize);
                        doc.rect(headerX, currentY, 40, lineHeight, 'S');
                        doc.text(header, headerX + cellPadding, currentY + 7);
                        headerX += 40;
                    });
                    currentY += lineHeight;

                    // Draw product rows
                    productsByType[type].forEach((product) => {
                        const row = [
                            product.product_name,
                            product.supplier,
                            product.type,
                            new Date(product.updated_at).toLocaleString(),
                            product.quantity,
                            product.quantity <= 5 ? 'Low Stock' : 'High Stock',
                        ];

                        let cellX = marginLeft;
                        row.forEach((cell) => {
                            doc.setFontSize(8);
                            doc.text(String(cell), cellX + cellPadding, currentY + 7);
                            cellX += 40;
                        });

                        currentY += lineHeight + 2; // Adjust the row height
                        if (currentY > pageHeight - 30) {
                            doc.addPage();
                            currentY = 20; // Reset for next page
                        }
                    });

                    currentY += 10; // Add space after each table
                });

                doc.save('Product_Report.pdf');
            } catch (error) {
                console.error('Error exporting PDF:', error);
                Swal.fire('Error', 'An error occurred while exporting the PDF report.', 'error');
            }
        },


        async exportProductExcel() {
            try {
                const workbook = new ExcelJS.Workbook();
                const currentDate = new Date();
                const formattedDate = currentDate.toLocaleString();

                // Ensure valid startDate and endDate
                const startDate = this.startDate ? new Date(this.startDate) : null;
                const endDate = this.endDate ? new Date(this.endDate) : null;

                // Filter the products based on the selected type and stock level (Low Stock or High Stock)
                let filteredProducts = this.products;

                if (this.selectedType === 'Low Stock') {
                    filteredProducts = filteredProducts.filter(product => product.quantity <= 5);
                } else if (this.selectedType === 'High Stock') {
                    filteredProducts = filteredProducts.filter(product => product.quantity > 5);
                } else if (this.selectedType && this.selectedType !== 'Low Stock' && this.selectedType !== 'High Stock') {
                    filteredProducts = filteredProducts.filter(
                        product => product.type === this.selectedType
                    );
                }

                // Apply date range filter
                filteredProducts = filteredProducts.filter(product => {
                    const productUpdatedAt = new Date(product.updated_at);
                    const isAfterStart = !startDate || productUpdatedAt >= startDate;
                    const isBeforeEnd = !endDate || productUpdatedAt <= endDate;
                    return isAfterStart && isBeforeEnd;
                });

                if (filteredProducts.length === 0) {
                    Swal.fire('No products found', 'No products match the selected filters and date range.', 'warning');
                    return;
                }

                // Group products by type
                const productsByType = filteredProducts.reduce((acc, product) => {
                    if (!acc[product.type]) acc[product.type] = [];
                    acc[product.type].push(product);
                    return acc;
                }, {});

                // Add the logo to the top of the sheet (row 1 to row 4)
                const logoImagePath = '../src/assets/MVC_logo.png'; // Ensure this is the correct path
                const imageBuffer = await fetch(logoImagePath).then(res => res.arrayBuffer());
                const imageId = workbook.addImage({
                    buffer: imageBuffer,
                    extension: 'png',
                });

                // Loop through the grouped products and create a sheet for each product type
                Object.keys(productsByType).forEach((type) => {
                    const worksheet = workbook.addWorksheet(type);  // Add a new sheet for each product type

                    // Merge cells for the logo (position at top, centered)
                    worksheet.mergeCells('A1:F4');
                    worksheet.getCell('A1').value = '';
                    worksheet.addImage(imageId, {
                        tl: { col: 0, row: 0 },
                        ext: { width: 808, height: 118 },
                    });

                    // Add the title starting from row 7
                    worksheet.mergeCells('A7:F7');
                    worksheet.getCell('A7').value = `MVC Optical Clinic Product Report`;
                    worksheet.getCell('A7').font = { size: 16, bold: true };
                    worksheet.getCell('A7').alignment = { horizontal: 'center' };

                    // Add the date generated text below the title
                    worksheet.mergeCells('A8:F8');
                    worksheet.getCell('A8').value = `Report Generated: ${formattedDate}`;
                    worksheet.getCell('A8').font = { size: 12, italic: true };
                    worksheet.getCell('A8').alignment = { horizontal: 'center' };

                    // Add headers for product data (start from row 9)
                    worksheet.addRow(['Product Name', 'Supplier', 'Type', 'Updated At', 'Quantity', 'Status']);
                    worksheet.getRow(9).font = { size: 12, bold: true };

                    // Set the columns width to fit content
                    worksheet.getColumn(1).width = 25;
                    worksheet.getColumn(2).width = 20;
                    worksheet.getColumn(3).width = 15;
                    worksheet.getColumn(4).width = 25;
                    worksheet.getColumn(5).width = 12;
                    worksheet.getColumn(6).width = 15;

                    // Add product rows starting from row 10
                    productsByType[type].forEach(product => {
                        const row = [
                            product.product_name,
                            product.supplier,
                            product.type,
                            new Date(product.updated_at).toLocaleString(), // Format updated_at as a string
                            product.quantity,
                            product.quantity <= 5 ? 'Low Stock' : 'High Stock',
                        ];

                        worksheet.addRow(row);
                    });
                });

                // Save the Excel file
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/octet-stream' });
                saveAs(blob, 'Product_Report.xlsx');
            } catch (error) {
                console.error('Error exporting Excel:', error);
                Swal.fire('Error', 'An error occurred while exporting the Excel report.', 'error');
            }
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
            axios.get('allProducts')
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
        fetchHistories() {
            axios.get('/productHistory')
                .then(response => {
                    // Handle successful response
                    console.log('Product histories fetched:', response.data);
                    this.histories = response.data.data; // Assuming you have a data property `histories` in your component
                })
                .catch(error => {
                    // Handle error
                    console.error('Error fetching product histories:', error);
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
            axios.delete('api/product/' + productToDelete.id)
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
