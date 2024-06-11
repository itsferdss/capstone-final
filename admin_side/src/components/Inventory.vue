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

   <v-dialog v-model="dialog" max-width="750px" enctype="multipart/form-data">
  <template v-slot:activator="{ props }">
    <v-btn @click="openDialog" color="#35623D" dark v-bind="props" style="font-weight: bold;">Add new Product</v-btn>
  </template>
    
  <!-- DIALOG FOR NEW PRODUCT -->
  <v-card>
    <v-card-title>
      <span class="text-h6 m-2">New Product</span>
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
          <v-col cols="6">
            <v-text-field v-model="editedItem.quantity" label="Quantity" prepend-icon="mdi-counter" required></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="editedItem.price" label="Price" prepend-icon="mdi-cash" required></v-text-field>
          </v-col>
          <!-- Image Upload -->
          <v-col cols="12">
            <v-file-input v-model="editedItem.image" label="Product Image" accept="image/*"></v-file-input>
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
            <td>{{ item.id }}</td>
            <td>{{ item.product_name }}</td>
            <td>{{ item.supplier }}</td>
            <td>{{ item.quantity }}</td>
            <td>₱{{ item.price }}</td>
            <td>
            <v-icon size="small" style="color: #2F3F64" @click="openEditItem(item)">mdi-pencil</v-icon>
            <v-icon size="small" style="color: #2F3F64" @click="deleteProduct(item)">mdi-delete</v-icon>
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
<v-dialog v-model="editItemDialog" max-width="750px">
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
                <v-col cols="6">
                    <v-text-field v-model="editedItem.quantity" label="Quantity" prepend-icon="mdi-counter" required></v-text-field>
                </v-col>
                <v-col cols="6">
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
    import swal from 'sweetalert';
    import axios from 'axios';

    export default {
    data() {
        return {
        editItemDialog: false,
        dialog: false,
        editedItem: {
        product_image: '',
        product_id: '',
        product_name: '',
        supplier: '',
        quantity: '',
        price: '', // Add price property
        image: '',
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
        products: [],
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
    mounted() {
        this.fetchProducts();
    },
    methods: {
        fetchProducts() {
            axios.get('http://127.0.0.1:8000/api/products')
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
       saveNewProduct() {
            const formData = new FormData();

            formData.append('product_name', this.editedItem.product_name);
            formData.append('supplier', this.editedItem.supplier);
            formData.append('quantity', this.editedItem.quantity);
            formData.append('price', this.editedItem.price);
            formData.append('product_image', this.editedItem.image);

            axios.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                swal('Success!', 'Product saved successfully.', 'success');

                this.editedItem.product_name = '';
                this.editedItem.supplier = '';
                this.editedItem.quantity = '';
                this.editedItem.price = '';
                this.editedItem.image = null; 

                this.closeDialog();

              
                this.fetchProducts();
            })
            .catch(error => {
                console.error('Error saving product:', error);
                swal('Oops...', 'Something went wrong!', 'error');
            });
        },
        saveEditedProduct() {
            axios.put(`/products/${this.editedItem.id}`, this.editedItem)
                .then(response => {
                    swal('Success!', 'Product updated successfully.', 'success');
                    this.fetchProducts(); // Fetch updated product list
                    this.closeEditItemDialog();
                })
                .catch(error => {
                    console.error('Error updating product:', error);
                    swal('Oops...', 'Something went wrong!', 'error');
                });
        },
        deleteProduct(item) {
        swal({
            title: 'Are you sure?',
            text: 'You will not be able to recover this product!',
            icon: 'warning',
            buttons: ['Cancel', 'Delete'],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                axios.delete(`/products/${item.id}`)
                    .then(response => {
                        swal('Deleted!', 'Product has been deleted.', 'success');
                        this.fetchProducts(); // Fetch updated product list
                    })
                    .catch(error => {
                        console.error('Error deleting product:', error);
                        swal('Oops...', 'Something went wrong!', 'error');
                    });
            } else {
                swal('Cancelled', 'Your product is safe :)', 'info');
            }
        });
    },



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

        openEditItem(item) {
            // Create a shallow copy of the item
            this.editedItem = { ...item };
            // Open the editItemDialog
            this.editItemDialog = true;
        },

        closeEditItemDialog() {
            this.editItemDialog = false;
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
