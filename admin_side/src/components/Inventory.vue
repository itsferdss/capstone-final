<template>
  <v-data-table :search="search" :headers="headers" :items="displayedProducts"
    :sort-by="[{ key: 'product_id', order: 'asc' }]">
    <template v-slot:top>
      <v-toolbar flat>
        <!-- Title with icon -->
        <v-toolbar-title class="text-uppercase grey--text">
          <v-icon left>mdi-package-variant</v-icon> <!-- Icon added here -->
          List of Products
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <!-- Search input -->
        <v-text-field v-model="search" class="w-auto mr-4" density="compact" label="Search Product"
          prepend-inner-icon="mdi-magnify" variant="solo-filled" flat hide-details single-line
          style="max-width: 300px;"></v-text-field>

        <!-- Add new product button -->
        <v-btn @click="openDialog('pending')" class="mb-2 mr-4 rounded-l add-btn" elevation="2">
          <v-icon left>mdi-plus</v-icon>
          <span class="add-text">Add New Product</span>
        </v-btn>
      </v-toolbar>
    </template>

    <!-- Row for each product -->
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

      <!-- Dialog for delete product -->
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title style="font-weight: bold; text-align: center;">Are you sure you want to delete this
            product?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="#35623D" variant="text" @click="closeDelete">Cancel</v-btn>
            <v-btn color="#35623D" variant="text" @click="deleteProductConfirm">OK</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Dialog for edit product -->
      <v-dialog v-model="editItemDialog" max-width="750px">
        <v-card>
          <v-card-title>
            <span class="text-h6 m-2">Edit Product</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row dense>
                <v-col cols="6">
                  <v-text-field v-model="editedItem.product_name" label="Product Name*"
                    prepend-icon="mdi-package-variant-closed"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="editedItem.supplier" label="Supplier"
                    prepend-icon="mdi-truck-delivery"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="editedItem.quantity" label="Quantity"
                    prepend-icon="mdi-counter"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="editedItem.price" label="Price" prepend-icon="mdi-cash"></v-text-field>
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
        { title: 'Stock', key: 'quantity' },
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

      // Append each image file to the FormData object
      if (this.editedItem.images && this.editedItem.images.length > 0) {
        for (let i = 0; i < this.editedItem.images.length; i++) {
          formData.append('product_images[]', this.editedItem.images[i]);
        }
      }

      axios.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          swal('Success!', 'Product saved successfully.', 'success');

          // Reset form data
          this.editedItem.product_name = '';
          this.editedItem.supplier = '';
          this.editedItem.quantity = '';
          this.editedItem.price = '';
          this.editedItem.images = null;

          this.closeDialog();

          // Fetch updated product list
          this.fetchProducts();
        })
        .catch(error => {
          console.error('Error saving product:', error);
          swal('Oops...', 'Something went wrong!', 'error');
        });
    },
    saveEditedProduct() {
      axios.put(`http://127.0.0.1:8000/api/products/${this.editedItem.id}`, {
        product_name: this.editedItem.product_name,
        supplier: this.editedItem.supplier,
        quantity: this.editedItem.quantity,
        price: this.editedItem.price,
      })
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
      this.$router.push('/add/product')
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
  background-color: #f0f0f0;
  /* Set the hover color here */
}

.add-btn {
  background-color: #B3D9E6 !important;
  /* Customize the background color */
  color: white !important;
  font-weight: bold !important;
}

.add-text {
  font-weight: bold;
  color: black !important;
}

.add-btn .v-icon {
  margin-right: 8px;
  /* Add spacing between icon and text */
  color: black;
}
</style>
