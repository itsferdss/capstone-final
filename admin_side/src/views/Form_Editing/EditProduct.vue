<template>
    <main>
        <h1 class="bg-title">Edit {{ editedItem.product_name }} Information</h1>
        <div class="form-container">
            <div class="form-box">
                <form @submit.prevent="saveEditedProduct">
                    <div class="form-row">
                        <div class="form-column">
                            <div class="form-group">
                                <label for="quantity">Quantity</label>
                                <input type="number" v-model="editedItem.quantity" id="quantity" class="form-input"
                                    disabled />
                            </div>
                        </div>
                        <div class="form-column">
                            <div class="form-group">
                                <label for="price">Price</label>
                                <input type="number" step="0.01" v-model="editedItem.price" id="price"
                                    class="form-input" required placeholder="Enter price" />
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="colorStock">Color Stock</label>
                        <div v-for="(colorStock, index) in editedItem.color_stock" :key="index" class="form-row">
                            <input type="text" v-model="colorStock.color" placeholder="Color" class="form-input"
                                required />
                            <input type="number" v-model.number="colorStock.stock" @input="updateQuantity"
                                placeholder="Stock" class="form-input" required />
                            <button type="button" class="rmvBtn" @click="removeColorStock(index)">Remove</button>
                        </div>
                        <button type="button" class="addClr" @click="addColorStock">Add Color Stock</button>
                    </div>
                    <hr />
                    <div class="form-buttons">
                        <v-btn type="submit" :style="{ backgroundColor: '#3EB489', color: 'white' }">
                            Save Product
                        </v-btn>
                        <v-btn class="close" type="button" :style="{ backgroundColor: '#A82946', color: 'white' }"
                            @click="goBack">
                            Back
                        </v-btn>
                    </div>
                </form>
            </div>
        </div>
    </main>
</template>

<script>
import Swal from 'sweetalert2';
import axios from 'axios';

export default {
    data() {
        return {
            editedItem: {
                product_id: '',
                product_name: '', // Ensure this is included
                quantity: 0,
                price: '',
                color_stock: [{ color: '', stock: 0 }]
            },
        };
    },
    mounted() {
        const productId = this.$route.query.id;  // Access the `id` from query parameters
        if (productId) {
            this.fetchProducts(productId);  // Fetch the product data by ID
        }
    },
    methods: {
        fetchProducts(productId) {
            axios.get(`/viewProduct/${productId}`) // Use the productId in the URL
                .then(response => {
                    if (response.data) {
                        const productData = response.data;  // Use the single product data
                        this.editedItem = {
                            product_id: productData.id,
                            product_name: productData.product_name,
                            quantity: productData.quantity,
                            price: productData.price,
                            color_stock: JSON.parse(productData.color_stock) // Parse color_stock if it's a JSON string
                        };
                        this.removeEmptyColorStocks(); // Clean up empty color stocks
                    } else {
                        this.error = 'Product not found';
                    }
                })
                .catch(error => {
                    this.error = 'Error fetching product: ' + error.message;
                });
        },
        addColorStock() {
            this.editedItem.color_stock.push({ color: '', stock: 0 });
        },
        removeColorStock(index) {
            this.editedItem.color_stock.splice(index, 1);
            this.updateQuantity();
        },
        removeEmptyColorStocks() {
            this.editedItem.color_stock = this.editedItem.color_stock.filter(colorStock => colorStock.stock > 0);
        },
        updateQuantity() {
            this.removeEmptyColorStocks(); // Clean up color stocks with no stock
            const totalStock = this.editedItem.color_stock.reduce((sum, item) => sum + item.stock, 0);
            this.editedItem.quantity = totalStock;
        },
        saveEditedProduct() {
            axios.put(`/products/${this.editedItem.product_id}`, {
                product_name: this.editedItem.product_name, // Include product_name in the request
                supplier: this.editedItem.supplier, // Ensure supplier is included if needed
                quantity: this.editedItem.quantity,
                price: this.editedItem.price,
                color_stock: this.editedItem.color_stock // Include color_stock in the request
            })
                .then(response => {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Product updated successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    this.fetchProducts(); // Fetch updated product list
                    this.goBack(); // Navigate back after saving
                })
                .catch(error => {
                    console.error('Error updating product:', error);
                    Swal.fire({
                        title: 'Oops...',
                        text: 'Something went wrong!',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                });
        },
        goBack() {
            this.$router.go(-1);
        }
    }
};
</script>


<style scoped>
.bg-title {
    background-color: #f0f4f7;
    padding: 1rem;
    text-align: center;
    color: #333;
    font-size: 1.75rem;
    font-weight: bold;
    border-bottom: 2px solid #e0e0e0;
}

.form-container {
    display: flex;
    justify-content: center;
    padding: 2rem;
}

.form-box {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 100%;
    max-width: 800px;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.form-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

label {
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #333;
}

input {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    font-size: 1rem;
}

input:focus {
    border-color: #3EB489;
    outline: none;
    box-shadow: 0 0 8px rgba(62, 180, 137, 0.5);
}

select {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    font-size: 1rem;
}

select:focus {
    border-color: #3EB489;
    outline: none;
    box-shadow: 0 0 8px rgba(62, 180, 137, 0.5);
}

.form-buttons {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}

.v-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
}

.v-btn:hover {
    transform: translateY(-2px);
}

.close {
    background-color: #A82946;
    color: #fff;
}

.close:hover {
    background-color: #93222b;
}

.addClr{
    background-color: rgb(10, 126, 89);
    width: 30%;
    height: 40px;
    border-radius: 5px;
    margin-top: 20px;
    color: rgb(226, 226, 226);
    font-weight: bold;
}

.rmvBtn{
    background-color: #940601;
    height: 40px;
    width: 150px;
    border-radius: 5px;
    font-weight: bold;
    color: rgb(214, 213, 213);
}

@media (max-width: 768px) {
    .form-box {
        padding: 1rem;
        max-width: 100%;
    }

    .form-row {
        flex-direction: column;
        gap: 0.5rem;
    }

    .v-btn {
        padding: 0.5rem 1rem;
        width: 100%;
    }

    .form-buttons {
        flex-direction: column;
        gap: 0.5rem;
    }

    .addClr{
        height: 50px;
        width: 200px;
    }
}

@media (max-width: 480px) {
    .bg-title {
        font-size: 1.25rem;
        padding: 0.5rem;
    }

    .form-container {
        padding: 0rem;
    }

    input {
        font-size: 0.875rem;
        padding: 0.5rem;
    }

    .form-buttons {
        flex-direction: column;
        gap: 0.5rem;
    }
}
</style>
