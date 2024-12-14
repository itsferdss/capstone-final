<template>
    <v-container>
        <div>
        </div>
        <v-data-table :search="search" :headers="headers" :items="glasses"
            :sort-by="[{ key: 'product_id', order: 'asc' }]">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="text-uppercase grey--text productTitle">
                        <v-icon left>mdi-package-variant</v-icon>
                            {{ title }}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>

                    <v-text-field v-model="search" class="w-auto mr-4" density="compact" label="Search Product"
                        prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details single-line
                        style="max-width: 300px;"></v-text-field>


                    <v-btn @click="dialog = true" class="calendarIcon">
                        <v-icon>mdi-calendar</v-icon>
                    </v-btn>


                </v-toolbar>
            </template>

            <template v-slot:body="{ items }">
                <tr v-for="item in items" :key="item.id">
                    <td>{{ item.patient_id}}</td>
                    <td>
                        <span v-if="item.product_id">{{ item.product.product_name }}</span>
                        <span v-else>{{ item.custom_frame }}</span>
                    </td>
                    <td>
                        <span v-if="item.lens_id">{{ item.lens.product_name }}</span>
                        <span v-else>{{ item.custom_lens }}</span>
                    </td>
                    <td>{{ item.date }}</td>
                    <td>
                        <span class="price">{{ item.price | currency }}</span>
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


    </v-container>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ref, onMounted } from 'vue';

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
            productTypes: ['Low Stock', 'High Stock', 'Frames', 'Lens', 'Contact Lenses', 'Accessories'],
            search: '',
            headers: [
                { title: 'Patient', align: 'center', key: 'supplier' },
                { title: 'Frame', align: 'center', key: 'product_name' },
                { title: 'Lens', align: 'center', key: 'supplier' },
                { title: 'Date Sold', align: 'center' },
                { title: 'Price', align: 'center' },
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
    },
    mounted() {
        this.fetchProducts();
        this.fetchGlasses();
    },
    methods: {

        getQuantityClass(quantity) {
            return quantity <= 5 ? 'low-stock' : 'high-stock';
        },

        exportProductPDF() {
            try {
                const doc = new jsPDF('landscape');  // Set to landscape orientation
                const logoImage = '../assets/MVC_logo.png'; // Path to logo

                // Constants for layout
                const marginTop = 20;
                const marginLeft = 15;
                const marginRight = 15;
                const pageHeight = doc.internal.pageSize.height;
                const pageWidth = doc.internal.pageSize.width;
                const lineHeight = 10;
                const cellPadding = 6;
                const headerFontSize = 14;
                const tableFontSize = 10;
                const currentDate = new Date();
                const formattedDate = currentDate.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                });

                // Filter products based on selectedType
                const filteredProducts = this.products.filter(product =>
                    this.selectedType ? product.type === this.selectedType : true
                );

                // Set title font and add logo
                doc.setFontSize(headerFontSize);
                doc.addImage(logoImage, 'PNG', marginLeft + 35, 20, 200, 25);
                doc.text('MVC Optical Clinic', pageWidth / 2, marginTop + 30, { align: 'center' });
                doc.setFontSize(12);
                doc.text('Mauricio Bldg, Brgy. San Antonio, Cabangan, Zambales', pageWidth / 2, marginTop + 40, { align: 'center' });
                doc.text('Product Report', pageWidth / 2, marginTop + 50, { align: 'center' });

                // Add Report Generation Date
                doc.setFontSize(10);
                doc.text(`Report Generated: ${formattedDate}`, pageWidth / 2, marginTop + 60, { align: 'center' });

                // Prepare table
                const headers = ['Product Name', 'Supplier', 'Type', 'Color', 'Stock', 'Sold', 'Restock Qty', 'Status'];
                const columnWidths = [40, 40, 30, 30, 30, 30, 30, 30];
                let currentY = marginTop + 70;

                // Table Header with bold font and background color
                doc.setFont('helvetica', 'bold');
                let headerX = marginLeft;
                headers.forEach((header, i) => {
                    doc.setFontSize(tableFontSize);
                    doc.rect(headerX, currentY, columnWidths[i], lineHeight, 'S'); // Draw rectangle with only stroke
                    doc.text(header, headerX + cellPadding, currentY + 7);
                    headerX += columnWidths[i];
                });
                currentY += lineHeight;

                // Table Content
                filteredProducts.forEach((product) => {
                    let colorStockArray = product.color_stock;

                    // Check if color_stock is a string and parse if necessary
                    if (typeof colorStockArray === 'string') {
                        colorStockArray = JSON.parse(colorStockArray);
                    }

                    const soldPerColor = product.sold_per_color || {};

                    colorStockArray.forEach((colorStock, index) => {
                        if (currentY + lineHeight > pageHeight - marginTop - 30) { // Reserve space for footer
                            doc.addPage();
                            currentY = marginTop;

                            // Reprint headers
                            headerX = marginLeft;
                            headers.forEach((header, i) => {
                                doc.setFontSize(tableFontSize);
                                doc.rect(headerX, currentY, columnWidths[i], lineHeight, 'S');
                                doc.text(header, headerX + cellPadding, currentY + 7);
                                headerX += columnWidths[i];
                            });
                            currentY += lineHeight;
                        }

                        const row = [
                            index === 0 ? product.product_name : '',
                            index === 0 ? product.supplier : '',
                            index === 0 ? product.type : '',
                            colorStock.color,
                            colorStock.stock,
                            soldPerColor[colorStock.color] || 0,
                            colorStock.restockQuantity,
                            colorStock.stock <= 5 ? 'Low Stock' : 'High Stock',
                        ];

                        let cellX = marginLeft;
                        row.forEach((cell, i) => {
                            doc.setFontSize(8);
                            doc.text(String(cell), cellX + cellPadding, currentY + 7);
                            cellX += columnWidths[i];
                        });

                        headerX = marginLeft;
                        row.forEach((_, i) => {
                            doc.rect(headerX, currentY, columnWidths[i], lineHeight, 'S');
                            headerX += columnWidths[i];
                        });

                        currentY += lineHeight;
                    });
                });

                // Add footer for Date Issued
                if (currentY + 20 > pageHeight - marginTop) {
                    doc.addPage();
                    currentY = marginTop;
                }
                doc.setFontSize(10);
                doc.text(`Date Issued: ${formattedDate}`, pageWidth - marginRight, currentY + 10, { align: 'right' });

                // Add page number
                const pageCount = doc.internal.pages.length;
                doc.text(`Page ${doc.internal.pages.indexOf(doc.internal.pageSize) + 1} of ${pageCount}`, pageWidth - marginRight, pageHeight - 10, { align: 'right' });

                // Save the PDF
                doc.save('Product_Report.pdf');
            } catch (error) {
                console.error('Error exporting PDF:', error);
            }
        },

        async exportProductExcel() {
            try {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Product Report');
                const imagePath = '../assets/MVC_logo.png';
                const imageBuffer = await fetch(imagePath).then(res => res.arrayBuffer());

                const imageId = workbook.addImage({
                    buffer: imageBuffer,
                    extension: 'png',
                });

                worksheet.addImage(imageId, {
                    tl: { col: 2, row: 0 },
                    ext: { width: 650, height: 100 },
                });

                const currentDate = new Date();
                const formattedDate = currentDate.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                });

                const selectedProducts = this.products.filter(product => product.type === this.selectedType);

                worksheet.mergeCells('C6:E6');
                worksheet.getCell('C6').value = 'MVC Optical Clinic';
                worksheet.getCell('C6').font = { size: 16, bold: true };

                worksheet.addRow(['Product Name', 'Supplier', 'Type', 'Quantity', 'Sold', 'New Stocks', 'Color Stock', 'Status']);

                selectedProducts.forEach(product => {
                    let colorStockText = '';
                    try {
                        const colorStock = (typeof product.color_stock === 'string')
                            ? JSON.parse(product.color_stock)
                            : product.color_stock;

                        colorStockText = Array.isArray(colorStock)
                            ? colorStock.map(item => `${item.color}: ${item.stock}`).join(', ')
                            : '';
                    } catch (error) {
                        console.error('Error parsing color_stock:', error);
                        colorStockText = 'Invalid color_stock data';
                    }

                    const row = [
                        product.product_name,
                        product.supplier,
                        product.type,
                        product.quantity,
                        product.total_sold,
                        product.new_stock_added,
                        colorStockText,
                        product.quantity <= this.lowStockThreshold ? 'Low Stock' : 'High Stock',
                    ];

                    worksheet.addRow(row);
                });

                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/octet-stream' });
                saveAs(blob, 'Product_Inventory_Report.xlsx');
                console.log('Excel file created successfully!');
            } catch (error) {
                console.error('Error exporting Excel:', error);
            }
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

            // Fetch glasses based on the updated date range
            await this.fetchGlasses();
        },

        async fetchGlasses() {
            try {
                const response = await axios.get('/glasses'); // Await the API response
                const glasses = response.data;

                // Parse and filter glasses based on the selected date range
                const start = this.startDate ? new Date(this.startDate) : null;
                const end = this.endDate ? new Date(this.endDate) : null;

                if (end) {
                    // Set end date time to 23:59:59 to include the entire day
                    end.setHours(23, 59, 59, 999);
                }

                const filteredGlasses = glasses.filter(glass => {
                    const glassDate = new Date(glass.date); // Ensure this matches the backend date format (YYYY-MM-DD)

                    if (start && end) {
                        return glassDate >= start && glassDate <= end;
                    } else if (start) {
                        return glassDate >= start;
                    } else if (end) {
                        return glassDate <= end;
                    }
                    return true; // Include all if no range is selected
                });

                // Update glasses and calculate total revenue
                this.glasses = filteredGlasses;
                this.totalRevenue = filteredGlasses.reduce((sum, glass) => {
                    return sum + parseFloat(glass.price); // Ensure price is a number
                }, 0);
            } catch (error) {
                console.error('Error fetching glasses:', error);
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
