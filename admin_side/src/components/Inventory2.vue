<template>
    <v-container>
        <div>
            <v-row class="mt-4">
                <v-col class="d-flex justify-end">
                    <v-menu offset-y>
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" class="mb-2 rounded-l generateBtn" dark color="primary">
                                <v-icon left>mdi-file-chart</v-icon>
                                Generate Report
                                <v-icon right>mdi-menu-down</v-icon>
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="exportProductPDF" class="mb-2 rounded-l add-record-button">
                                <v-list-item-icon></v-list-item-icon>
                                <v-list-item-title>Generate PDF</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="exportProductExcel" class="mb-2 rounded-l add-record-button">
                                <v-list-item-icon></v-list-item-icon>
                                <v-list-item-title>Generate Excel</v-list-item-title>
                            </v-list-item>
                        </v-list>
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


                    <v-select v-model="selectedType" :items="productTypes" label="Filter by Type" clearable class="mr-4"
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
                                <th style="text-align: center; padding: 10px;">Last Updated</th>
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
            productTypes: ['Frames', 'Lens', 'Contact Lenses', 'Accessories'],
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

            if (this.selectedType) {
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
    },
    methods: {
        exportProductPDF() {
            try {
                const doc = new jsPDF('landscape');  // Set to landscape orientation
                const logoImage = '../src/assets/MVC_logo.png'; // Path to logo

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

                // Set title font and add logo
                doc.setFontSize(headerFontSize);
                doc.addImage(logoImage, 'PNG', marginLeft, 10, 50, 25);
                doc.text('MVC Optical Clinic', pageWidth / 2, marginTop + 5, { align: 'center' });
                doc.setFontSize(12);
                doc.text('Mauricio Bldg, Brgy. San Antonio, Cabangan, Zambales', pageWidth / 2, marginTop + 15, { align: 'center' });
                doc.text('Product Report', pageWidth / 2, marginTop + 25, { align: 'center' });

                // Add Report Generation Date
                doc.setFontSize(10);
                doc.text(`Report Generated: ${formattedDate}`, pageWidth / 2, marginTop + 35, { align: 'center' });

                // Prepare table
                const headers = ['Product Name', 'Supplier', 'Type', 'Color', 'Stock', 'Sold', 'Restock Qty', 'Status'];
                const columnWidths = [40, 40, 30, 30, 30, 30, 30, 30];
                let currentY = marginTop + 45;

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
                this.products.forEach((product) => {
                    let colorStockArray = product.color_stock;

                    // Check if color_stock is a string and parse if necessary
                    if (typeof colorStockArray === 'string') {
                        colorStockArray = JSON.parse(colorStockArray);
                    }

                    const soldPerColor = product.sold_per_color || {}; // Handle sold_per_color safely

                    colorStockArray.forEach((colorStock, index) => {
                        if (currentY + lineHeight > pageHeight - marginTop - 30) { // Reserve space for footer
                            // Add a new page if not enough space
                            doc.addPage();
                            currentY = marginTop;

                            // Reprint headers
                            headerX = marginLeft;
                            headers.forEach((header, i) => {
                                doc.setFontSize(tableFontSize);
                                doc.rect(headerX, currentY, columnWidths[i], lineHeight, 'S'); // Draw rectangle with only stroke
                                doc.text(header, headerX + cellPadding, currentY + 7);
                                headerX += columnWidths[i];
                            });
                            currentY += lineHeight;
                        }

                        // Fill product details only on the first row for the product
                        const row = [
                            index === 0 ? product.product_name : '',
                            index === 0 ? product.supplier : '',
                            index === 0 ? product.type : '',
                            colorStock.color,
                            colorStock.stock,
                            soldPerColor[colorStock.color] || 0,
                            colorStock.restockQuantity,
                            colorStock.stock <= 10 ? 'Low Stock' : 'High Stock',
                        ];

                        let cellX = marginLeft;
                        row.forEach((cell, i) => {
                            doc.setFontSize(8);
                            doc.text(String(cell), cellX + cellPadding, currentY + 7);
                            cellX += columnWidths[i];
                        });

                        // Draw the borders around each cell
                        headerX = marginLeft;
                        row.forEach((_, i) => {
                            doc.rect(headerX, currentY, columnWidths[i], lineHeight, 'S'); // Draw rectangle with only stroke
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
                const imagePath = '../src/assets/MVC_logo.png'; // Your image path
                const imageBuffer = await fetch(imagePath).then(res => res.arrayBuffer());

                const imageId = workbook.addImage({
                    buffer: imageBuffer,
                    extension: 'png',
                });

                // Add the image to the worksheet
                worksheet.addImage(imageId, {
                    tl: { col: 2, row: 0 },
                    ext: { width: 650, height: 100 },
                });

                // Merge cells and set their values
                const mergeCells = [
                    { range: 'C6:E6', value: 'MVC Optical Clinic' },
                    { range: 'C7:E7', value: 'Mauricio Bldg, Brgy. San Antonio, Cabangan, Zambales' },
                    { range: 'C8:E8', value: `As of: ${new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: 'long', day: 'numeric' })}` },
                    { range: 'C9:E9', value: 'Product Inventory Report' }
                ];

                // Add report generated date/time
                const currentDate = new Date();
                const formattedDate = currentDate.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                });

                worksheet.mergeCells('C10:E10');
                worksheet.getCell('C10').value = `Report Generated: ${formattedDate}`;
                worksheet.getCell('C10').font = { size: 12, italic: true };
                worksheet.getCell('C10').alignment = { horizontal: 'center', vertical: 'middle' };

                // Merge cells and set their values
                mergeCells.forEach(cell => {
                    if (!worksheet.getCell(cell.range).isMerged) {
                        worksheet.mergeCells(cell.range);
                        worksheet.getCell(cell.range).value = cell.value;
                        worksheet.getCell(cell.range).font = { size: 14, bold: true };
                        worksheet.getCell(cell.range).alignment = { horizontal: 'center', vertical: 'middle' };
                    }
                });

                worksheet.getCell('C6').font.size = 16; // Make the title bigger
                worksheet.getCell('C9').font.size = 16;

                // Add column headers
                const headers = ['Product Name', 'Supplier', 'Type', 'Quantity', 'Sold', 'New Stocks', 'Color Stock', 'Status'];
                worksheet.addRow(headers);

                // Set specific column widths
                worksheet.getColumn('A').width = 30;
                worksheet.getColumn('B').width = 20;
                worksheet.getColumn('C').width = 20;
                worksheet.getColumn('D').width = 10;
                worksheet.getColumn('E').width = 10;
                worksheet.getColumn('F').width = 10;
                worksheet.getColumn('G').width = 20; // Adjusted width for Color Stock
                worksheet.getColumn('H').width = 15;

                // Add data rows for each product
                this.products.forEach(product => {
                    // Ensure color_stock is a valid JSON string before parsing
                    let colorStockText = '';
                    try {
                        // Check if color_stock is a string, if so, parse it; otherwise, use it as is
                        const colorStock = (typeof product.color_stock === 'string')
                            ? JSON.parse(product.color_stock)
                            : product.color_stock;

                        // Format the color_stock information
                        colorStockText = Array.isArray(colorStock)
                            ? colorStock.map(item => `${item.color}: ${item.stock}`).join(", ")
                            : '';
                    } catch (error) {
                        console.error('Error parsing color_stock:', error);
                        colorStockText = 'Invalid color_stock data';
                    }

                    // For each product, if it has multiple color stock items, we need to add them vertically
                    const colorStockEntries = colorStockText.split(", "); // Split into individual color-stock pairs

                    colorStockEntries.forEach((colorStockEntry, index) => {
                        // Prepare the row data
                        const row = [
                            index === 0 ? product.product_name : '', // Only show product name on the first entry
                            index === 0 ? product.supplier : '',     // Only show supplier on the first entry
                            index === 0 ? product.type : '',         // Only show type on the first entry
                            index === 0 ? product.quantity : '',     // Only show quantity on the first entry
                            index === 0 ? product.total_sold : '',   // Only show sold on the first entry
                            index === 0 ? product.new_stock_added : '', // Only show new stock on the first entry
                            colorStockEntry,  // This will be the individual color-stock entry
                            product.quantity <= this.lowStockThreshold ? 'Low Stock' : 'High Stock',  // Status
                        ];

                        // Add the row to the worksheet
                        const addedRow = worksheet.addRow(row);

                        // If the quantity is less than 10, make the font color red, else green
                        const quantityCell = addedRow.getCell(4); // Assuming quantity is in the 4th column (D)
                        if (quantityCell.value < 10) {
                            quantityCell.font = { color: { argb: 'FF0000' } }; // Red color
                        } else if (quantityCell.value > 10) {
                            quantityCell.font = { color: { argb: '00FF00' } }; // Green color
                        }
                    });
                });

                // Save the workbook as a buffer and trigger the download
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/octet-stream' });
                saveAs(blob, 'Product_Inventory_Report.xlsx');
                console.log('Excel file created successfully!');
            } catch (error) {
                console.error('Error exporting Excel:', error);
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
