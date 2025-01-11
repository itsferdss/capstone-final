<template>
    <div>
    <v-row class="mt-4">
      <v-col class="d-flex justify-end">
        <v-menu v-model="menu" offset-y>
          <!-- Activator slot for dropdown button -->
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="mb-2 rounded-l generateBtn" dark color="primary">
              Generate Report
              <v-icon right>mdi-menu-down</v-icon>
            </v-btn>
                    </template>

                    <v-card>
            <v-card-actions>
              <!-- Generate PDF button -->
              <v-btn text @click="exportProductPDF">Generate PDF</v-btn>
              <!-- Generate Excel button -->
              <v-btn text @click="exportProductExcel">Generate Excel</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-col>
    </v-row>
  </div>
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
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default {
    data() {
        return {
            editItemDialog: false,
            dialog: false,
            menu: false, 
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
                { title: 'Total Amount', align: 'center'},
                { title: 'Discount', align: 'center' },
                { title: 'Price', align: 'center' },
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
        
        async exportProductPDF() {
    try {
        const doc = new jsPDF('landscape');
        const logoImage = '../assets/MVC_logo.png'; // Ensure this path is correct
        const marginTop = 20;
        const marginLeft = 15;
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        const lineHeight = 10;
        const cellPadding = 6;
        const headerFontSize = 14;
        const tableFontSize = 10;
        const typeTitleFontSize = 16;  // Larger font size for product type title
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleString();

        // Get the filtered data (this.filteredData should already contain the filtered results)
        let filteredItems = this.filteredData;

        // Group items by product type
        const itemsByType = filteredItems.reduce((acc, item) => {
            if (!acc[item.type]) acc[item.type] = [];
            acc[item.type].push(item);
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
        const headers = ['Product Name', 'Lens', 'Date', 'Quantity', 'Price', 'Discount', 'Amount', 'Balance'];

        // Define custom column widths: Increase the width of 'Product Name' and 'Lens' columns
        const columnWidths = [60, 60, 30, 20, 20, 20, 20, 20];  // Width for each column: Adjust as needed

        Object.keys(itemsByType).forEach((type) => {
            // Add product type title with larger font size
            doc.setFontSize(typeTitleFontSize); // Larger font size for the type title
            doc.setFont('helvetica', 'bold');
            doc.text(type, marginLeft, currentY);
            currentY += lineHeight + 5;

            // Draw table header
            let headerX = marginLeft;
            doc.setFont('helvetica', 'bold');
            headers.forEach((header, i) => {
                doc.setFontSize(tableFontSize);
                doc.rect(headerX, currentY, columnWidths[i], lineHeight, 'S');
                doc.text(header, headerX + cellPadding, currentY + 7);
                headerX += columnWidths[i]; // Move the X coordinate based on column width
            });
            currentY += lineHeight;

            // Draw product rows for the current type
            itemsByType[type].forEach((item) => { 
            const productName = item.custom_frame || item.product?.product_name || 'N/A';  // Fallback for product name

            // Calculate Amount (Quantity * Price)
            const quantity = item.quantity != null ? item.quantity : 1;  // Default to 1 if quantity is null
            const price = parseFloat(item.product?.price || item.price || 0);  // Default to 0 if price is missing
            const amount = (quantity * price).toFixed(2);  // Calculate and format amount

            // Handle the date format and fallback
            const date = item.updated_at ? new Date(item.updated_at).toLocaleString() : ''; // Ensure valid date

            // Construct the row
            const row = [
                productName,                    // Custom frame or product name
                item.custom_lens || item.lens?.product_name || 'N/A',  // Custom lens or lens name
                date,                            // Date formatted
                quantity,                        // Quantity (fallback 1 if missing)
                price.toFixed(2),                // Price with 2 decimal places
                item.discount || 'N/A',          // Discount
                amount,                          // Amount (calculated Quantity * Price)
                item.balance || '0',             // Balance
            ];

                let cellX = marginLeft;
                row.forEach((cell, i) => {
                    doc.setFontSize(8);
                    doc.text(String(cell), cellX + cellPadding, currentY + 7);
                    cellX += columnWidths[i]; // Move the X coordinate based on column width
                });

                currentY += lineHeight + 2; // Adjust row height
                if (currentY > pageHeight - 30) {
                    doc.addPage();
                    currentY = 20; // Reset for next page
                }
            });

            currentY += 10; // Add space after each product type section
        });

        // Save PDF
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

        // Get the filtered data (this.filteredData should already contain the filtered results)
        const filteredItems = this.filteredData;

        // Group data by product type
        const dataByType = filteredItems.reduce((acc, item) => {
            if (!acc[item.type]) acc[item.type] = [];
            acc[item.type].push(item);
            return acc;
        }, {});

        if (filteredItems.length === 0) {
            Swal.fire('No data found', 'No records match the current filters.', 'warning');
            return;
        }

        // Add the logo to the top of the Excel sheet
        const logoImagePath = '../assets/MVC_logo.png'; // Ensure this path is correct
        const imageBuffer = await fetch(logoImagePath).then(res => res.arrayBuffer());
        const imageId = workbook.addImage({
            buffer: imageBuffer,
            extension: 'png',
        });

        // Loop through the grouped data and create a sheet for each product type
        Object.keys(dataByType).forEach((type) => {
            const worksheet = workbook.addWorksheet(type);  // Add a new sheet for each product type

            // Merge cells for the logo (position at top, centered)
            worksheet.mergeCells('A1:I4');
            worksheet.getCell('A1').value = '';
            worksheet.addImage(imageId, {
                tl: { col: 0, row: 0 },
                ext: { width: 808, height: 118 },
            });

            // Add title starting from row 7
            worksheet.mergeCells('A7:I7');
            worksheet.getCell('A7').value = `MVC Optical Clinic Sales Report`;
            worksheet.getCell('A7').font = { size: 16, bold: true };
            worksheet.getCell('A7').alignment = { horizontal: 'center' };

            // Add the date generated text below the title
            worksheet.mergeCells('A8:I8');
            worksheet.getCell('A8').value = `Report Generated: ${formattedDate}`;
            worksheet.getCell('A8').font = { size: 12, italic: true };
            worksheet.getCell('A8').alignment = { horizontal: 'center' };

            // Add headers for the table
            worksheet.addRow(['Frame/Product Name', 'Lens', 'Date', 'Quantity', 'Price', 'Discount', 'Amount', 'Balance']);
            worksheet.getRow(9).font = { size: 12, bold: true };

            // Set the columns width to fit content
            worksheet.getColumn(1).width = 12;
            worksheet.getColumn(2).width = 25;
            worksheet.getColumn(3).width = 25;
            worksheet.getColumn(4).width = 15;
            worksheet.getColumn(5).width = 10;
            worksheet.getColumn(6).width = 12;
            worksheet.getColumn(7).width = 12;
            worksheet.getColumn(8).width = 12;

            // Add rows for each item
            dataByType[type].forEach(item => {
                const productName = item.custom_frame || item.product?.product_name || 'N/A';

                // Calculate Amount (Quantity * Price)
                const quantity = item.quantity || 1;  // Default to 1 if quantity is missing
                const price = parseFloat(item.product?.price || item.price || 0);  // Convert price to number, default to 0 if missing
                const amount = quantity * price;  // Calculate Amount

                const row = [
                    productName,  // Use custom_frame or product_name, fallback to 'N/A'
                    item.custom_lens || item.lens?.product_name || 'N/A', // Use custom_lens or lens product name, fallback to 'N/A'
                    new Date(item.updated_at).toLocaleString() || '', // Date formatting
                    quantity,         // Quantity
                    price.toFixed(2),  // Price with 2 decimal places
                    item.discount || 'N/A', // Optional discount field
                    amount.toFixed(2),  // Amount (Quantity * Price)
                    item.balance || '0', // Optional balance field
                ];
                worksheet.addRow(row);
            });

            // Format the rows
            worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
                row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    if (rowNumber > 8) {
                        cell.alignment = { vertical: 'middle', horizontal: 'center' };
                    }
                });
            });
        });

        // Create a Blob from the workbook
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Create a download link for the Blob and trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Product_Report.xlsx'; // The name of the file to be downloaded
        link.click();

        Swal.fire('Success', 'Excel report has been generated successfully!', 'success');
    } catch (error) {
        console.error('Error exporting Excel:', error);
        Swal.fire('Error', 'An error occurred while exporting the Excel report.', 'error');
    }
},






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
