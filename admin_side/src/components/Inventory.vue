    <template>
    <v-data-table
        :search="search"
        :headers="headers"
        :items="displayedProducts"  
        :sort-by="[{ key: 'product_id', order: 'asc' }]"
    >
    
        <template v-slot:top>
        <v-toolbar flat>
            <v-text-field
            v-model="search"
            class="w-auto mr-4"
            density="compact"
            label="Search Products"
            prepend-inner-icon="mdi-magnify"
            variant="solo-filled"
            flat
            hide-details
            single-line
            style="max-width: 300px;"
            ></v-text-field>

    <v-dialog v-model="dialog" max-width="1000px">
    <template v-slot:activator="{ props }">
        <v-btn @click="openDialog"  color="#35623D" dark v-bind="props" style="font-weight: bold;">Add new Product</v-btn>
    </template>
    
    <!--DIALOG FOR NEW USER-->
    <v-card>
        <v-card-title>
        <span class="text-h6 m-2">New Product</span>
        </v-card-title>
        <v-card-text>
        <v-container>
        <v-row dense>
                <v-col cols="6">
                    <v-text-field v-model="editedItem.product_id" label="Product ID*" prepend-icon="mdi-barcode-scan" required></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="editedItem.product_name" label="Product Name*" prepend-icon="mdi-package-variant-closed" required></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="editedItem.supplier" label="Supplier" prepend-icon="mdi-truck-delivery" required></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field v-model="editedItem.quantity" label="Quantity" prepend-icon="mdi-counter" required></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field v-model="editedItem.price" label="Price" prepend-icon="mdi-cash" required></v-text-field>
                </v-col>
                </v-row>
        </v-container>
        </v-card-text>

        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="black" text @click="closeDialog">Cancel</v-btn>
        <v-btn color="black" text @click="saveNewProduct">Save Product</v-btn>
        </v-card-actions>
    </v-card> 
    </v-dialog>

        </v-toolbar>
        </template>

    <template v-slot:item="{ item }">
        <tr>
            <td>{{ item.product_id }}</td>
            <td>{{ item.product_name }}</td>
            <td>{{ item.supplier }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.price }}</td>
            <td>
            <v-icon size="small" style="color: #2F3F64" @click="openEditItem(item)">mdi-pencil</v-icon>
            <v-icon size="small" style="color: #2F3F64" @click="deleteUser(item)">mdi-delete</v-icon>
            </td>
        </tr>
        
        

        <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
            <v-card-title style="font-weight: bold; text-align: center;">Are you sure you want to delete this schedule?</v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color=#35623D variant="text" @click="closeDelete">Cancel</v-btn>
                <v-btn color=#35623D variant="text" @click="deleteUserConfirm">OK</v-btn>
                <v-spacer></v-spacer>
            </v-card-actions>
            </v-card>
        </v-dialog>

<!--DIALOG FOR EDIT PRODUCT -->
<v-dialog v-model="editItemDialog" max-width="800px">
    <v-card>
        <v-card-title>
        <span class="text-h6 m-2">Edit Product</span>
        </v-card-title>
        <v-card-text>
        <v-container>
        <v-row dense>
                <v-col cols="6">
                    <v-text-field v-model="editedItem.product_name" label="Product Name*" prepend-icon="mdi-package-variant-closed" required></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="editedItem.supplier" label="Supplier" prepend-icon="mdi-truck-delivery" required></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field v-model="editedItem.quantity" label="Quantity" prepend-icon="mdi-counter" required></v-text-field>
                </v-col>
                <v-col cols="3">
                    <v-text-field v-model="editedItem.price" label="Price" prepend-icon="mdi-cash" required></v-text-field>
                </v-col>
                </v-row>
        </v-container>
        </v-card-text>

        <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="black" text @click="closeEditItemDialog">Cancel</v-btn>
        <v-btn color="black" text @click="saveEditedProduct">Save Product</v-btn>
        </v-card-actions>
    </v-card> 
    </v-dialog>

        </template>
    </v-data-table>
    </template>
    <script>
    export default {
    data() {
        return {

        editItemDialog: false,
        
        dialog: false,
        editedItem: {
        product_id: '',
        product_name: '',
        supplier: '',
        quantity: '',
        price: '', // Add price property
      },

        search: '',
        dialogAddPrescription: false,
        

        headers: [
            { title: 'Product ID', align: 'start', key: 'product_id' },
            { title: 'Product Name', align: 'start', key: 'product_name' },
            { title: 'Supplier', key: 'supplier' },
            { title: 'Quantity', key: 'quantity' },
            { title: 'Price', key: 'price' },
            { title: 'Actions', sortable: false },
        ],

        viewingRecords: false,
        products: [
            {
            product_id: '1',
            product_name: 'Ferdinand',
            supplier: 'Eye-wear PH',
            quantity: '10',
            price: '102',
            
            },
        ],
        dialogDelete: false,
        deleteRecordIndex: -1,
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
    },
    methods: {
        openDialog() {
        this.dialog = true;
    },
        closeDialog() {
        this.dialog = false;
    },
        viewPrescriptions(user) { 
        user.showPrescriptions = !user.showPrescriptions;
        },
        togglePrescriptionEdit(user, prescription) {
        prescription.editing = !prescription.editing;
        },
        deletePrescription(user, index) {
        user.prescriptions.splice(index, 1);
        },

        deleteUser(item) {
        // Set the deleteRecordIndex and open the delete confirmation dialog
        this.deleteRecordIndex = this.products.indexOf(item);
        this.dialogDelete = true;
        },

        deleteUserConfirm() {
        if (this.deleteRecordIndex !== -1) {
            // Remove the user at deleteRecordIndex
            this.products.splice(this.deleteRecordIndex, 1);
            this.dialogDelete = false;
            this.deleteRecordIndex = -1;
        }
        },

        closeDelete() {
        this.dialogDelete = false;
        this.deleteRecordIndex = -1;
        },

        openAddPrescriptioDialog() {
        this.dialogAddPrescription = true;
        },

        cancelAddPrescription() {
        this.dialogAddPrescription = false;
        },

        saveNewProduct() {
            const newProduct = {
                product_id: this.editedItem.product_id,
                product_name: this.editedItem.product_name,
                supplier: this.editedItem.supplier,
                quantity: this.editedItem.quantity, // Change 'stock' to match your data structure
                price: this.editedItem.price,
            };

            // Push the new product into the products array
            this.products.push(newProduct);

            // Close the dialog
            this.dialog = false;
        },

        openEditItem(item) {
            // Create a shallow copy of the item
            this.editedItem = { ...item };
            // Open the editItemDialog
            this.editItemDialog = true;
        },

        closeEditItemDialog() {
            this.editItemDialog = false;
        },

       saveEditedProduct() {
            const index = this.products.findIndex(product => product.product_id === this.editedItem.product_id);
            if (index !== -1) {
                // Update the product at the found index with the edited data
                this.products[index] = {
                product_id: this.editedItem.product_id,
                product_name: this.editedItem.product_name,
                supplier: this.editedItem.supplier,
                quantity: this.editedItem.quantity, 
                price: this.editedItem.price, // Include price
                };
                // Close the editItemDialog
                this.editItemDialog = false;
            } else {
                // Handle error: Product not found
                console.error('Product not found for editing.');
            }
        },
    },


    };
    </script>

    <style>
    .v-card:hover {
    background-color: #f0f0f0; /* Set the hover color here */
    }

    headers{
    font-weight: bold;
    }
    </style>
