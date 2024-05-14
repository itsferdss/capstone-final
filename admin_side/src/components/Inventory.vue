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
        <span class="text-h6 m-2">New User and Prescription</span>
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
            <td>{{ item.stock }}</td>
            <td>
    
            <v-icon size="small" style="color: #2F3F64" @click="deleteUser(item)">mdi-pencil</v-icon>
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

        </template>
    </v-data-table>
    </template>
    <script>
    export default {
    data() {
        return {
        
        dialog: false,
        editedItem: {
            user_id: '',
            title: '',
            description: '',
        },

        search: '',
        dialogAddPrescription: false,
        newPrescription: {
            title: '',
            description: ''
        },

        headers: [
            { title: 'Product ID', align: 'start', key: 'product_id' },
            { title: 'Product Name', align: 'start', key: 'product_name' },
            { title: 'Supplier', key: 'supplier' },
            { title: 'quantity', key: 'stock' },
            { title: 'Actions', sortable: false },
        ],

        viewingRecords: false,
        products: [
            {
            product_id: '1',
            product_name: 'Ferdinand',
            supplier: 'Eye-wear PH',
            stock: '10',
            
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
                stock: this.editedItem.quantity, // Change 'stock' to match your data structure
            };

            // Push the new product into the products array
            this.products.push(newProduct);

            // Close the dialog
            this.dialog = false;
        },
        acceptAppointment(userId) {
        const user = this.pendingAppointments.find(u => u.user_id === userId);

        if (user) {
            const newUser = {
            user_id: user.user_id,
            first_name: user.first_name,
            middle_name: user.middle_name,
            last_name: user.last_name,
            extension: user.extension,
            contact_number: user.contact_number,
            formatted_appointment_date: user.formatted_appointment_date,
            appointment_time: user.appointment_time,
            // Add other appointment properties as needed
            };

            this.products.push(newUser);
            // Optionally, you can remove the accepted appointment from the pending appointments list
            const index = this.pendingAppointments.findIndex(appointment => appointment.user_id === userId);
            if (index !== -1) {
            this.pendingAppointments.splice(index, 1);
            }
        }

    // Check if the user ID already exists
    const existingUser = this.products.find((u) => u.user_id === newUser.user_id);

    if (existingUser) {
        // User already exists, show an alert
        alert('User ID already exists! Please use a different ID.');
    } else {
        // User does not exist, confirm and save the new user
        if (confirm('Are you sure you want to save this new user?')) {
        this.products.push(newUser);
        this.closeDialog();
        }
    }
    },

    saveRecord(user, prescription) {
    if (confirm('Are you sure you want to save this edited prescription?')) {
        prescription.editing = false;
        // Optionally, you can add code here to save the edited prescription to the database
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
