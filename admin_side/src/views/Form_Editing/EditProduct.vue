<template>
    <main class="edit-product">
        <h1 class="edit-title">Edit {{ editedItem.product_name }}</h1>
        <div class="edit-form-container">
            <div class="edit-form-box">
                <form @submit.prevent="saveEditedProduct">
                    <div class="edit-form-group">
                        <label for="quantity">Quantity</label>
                        <input type="number" v-model="editedItem.quantity" id="quantity" class="edit-input" disabled />
                    </div>

                    <div class="edit-form-group">
                        <label for="price">Price</label>
                        <input type="number" step="0.01" v-model="editedItem.price" id="price" class="edit-input"
                            required placeholder="Enter price" />
                    </div>

                    <div class="edit-form-group" v-if="editedItem.color_stock.length > 0">
                        <label for="colorStock">Color Stock</label>
                        <div class="edit-color-stock">
                            <div v-for="(colorStock, index) in editedItem.color_stock" :key="index" class="color-row">
                                <input type="text" v-model="colorStock.color" placeholder="Color" class="edit-input"
                                    required />
                                <input type="number" v-model.number="colorStock.stock" @input="updateQuantity"
                                    placeholder="Stock" class="edit-input" required />
                                <input type="number" v-model.number="colorStock.restockQuantity" placeholder="Restock"
                                    class="edit-input restock-input" />
                                <button type="button" class="btn restock-btn" @click="restockQuantity(index)">
                                    Restock
                                </button>
                                <button type="button" class="btn remove-btn" @click="removeColorStock(index)">
                                    Remove
                                </button>
                            </div>
                        </div>
                        <button type="button" class="btn add-btn" @click="addColorStock">Add Color Stock</button>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn save-btn">Save Product</button>
                        <button type="button" class="btn cancel-btn" @click="goBack">Back</button>
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
                product_name: '',
                quantity: 0,
                price: '',
                color_stock: [{ color: '', stock: 0, restockQuantity: 0 }]
            },
        };
    },
    mounted() {
        const productId = this.$route.query.id;
        if (productId) {
            this.fetchProducts(productId);
        }
    },
    methods: {
        fetchProducts(productId) {
            axios.get(`/viewProduct/${productId}`)
                .then(response => {
                    const productData = response.data;
                    this.editedItem = {
                        product_id: productData.id,
                        product_name: productData.product_name,
                        quantity: productData.quantity,
                        price: productData.price,
                        color_stock: JSON.parse(productData.color_stock).map(item => ({ ...item, restockQuantity: 0 }))
                    };
                    this.removeEmptyColorStocks();
                })
                .catch(error => {
                    console.error('Error fetching product:', error);
                });
        },
        addColorStock() {
            this.editedItem.color_stock.push({ color: '', stock: 0, restockQuantity: 0 });
        },
        removeColorStock(index) {
            this.editedItem.color_stock.splice(index, 1);
            this.updateQuantity();
        },
        removeEmptyColorStocks() {
            this.editedItem.color_stock = this.editedItem.color_stock.filter(colorStock => colorStock.stock > 0);
        },
        updateQuantity() {
            this.removeEmptyColorStocks();
            this.editedItem.quantity = this.editedItem.color_stock.reduce((sum, item) => sum + item.stock, 0);
        },
        restockQuantity(index) {
            const colorStock = this.editedItem.color_stock[index];
            colorStock.stock += colorStock.restockQuantity || 0;
            this.updateQuantity();
            colorStock.restockQuantity = 0;
        },
        saveEditedProduct() {
            axios.put(`/products/${this.editedItem.product_id}`, this.editedItem)
                .then(() => {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Product updated successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    this.goBack();
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
.edit-product {
    padding: 20px;
}

.edit-title {
    text-align: center;
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
}

.edit-form-container {
    display: flex;
    justify-content: center;
    margin-top: 50px;
}

.edit-form-box {
    background-color: #fff;
    padding: 30px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    width: 100%;
    max-width: 600px;
}

.edit-form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #444;
}

.edit-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.3s ease;
}

.edit-input:focus {
    border-color: #3EB489;
    outline: none;
}

.color-row {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.restock-input {
    width: 100px;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    margin-top: 20px;
}

/* Buttons */
.btn {
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn:hover {
    transform: translateY(-2px);
}

.save-btn {
    background-color: #3EB489;
    color: white;
}

.cancel-btn {
    background-color: #A82946;
    color: white;
}

.add-btn {
    background-color: #007BFF;
    color: white;
}

.restock-btn {
    background-color: #01944d;
    color: white;
}

.remove-btn {
    background-color: #940601;
    color: white;
}

/* Media Queries */
@media (max-width: 768px) {
    .edit-form-box {
        padding: 20px;
        width: 100%;
    }

    .color-row {
        flex-direction: column;
    }

    .form-actions {
        flex-direction: column;
    }
}

@media (max-width: 480px) {
    .edit-title {
        font-size: 20px;
    }

    .edit-input {
        font-size: 14px;
        padding: 8px;
    }
}
</style>
