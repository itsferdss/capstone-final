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
                    <div class="form-group" v-if="editedItem.color_stock.length > 0">
                        <label for="colorStock">Color Stock</label>
                        <div v-for="(colorStock, index) in editedItem.color_stock" :key="index" class="form-row">
                            <input type="text" v-model="colorStock.color" placeholder="Color" class="form-input"
                                required />
                            <input type="number" v-model.number="colorStock.stock" @input="updateQuantity"
                                placeholder="Stock" class="form-input" required />
                            <button type="button" class="rmvBtn" @click="removeColorStock(index)">Remove</button>
                            <input type="number" v-model.number="colorStock.restockQuantity" placeholder="Restock"
                                class="form-input" style="width: 200px; margin-bottom: 20px;" />
                            <button type="button" class="restockBtn" @click="restockQuantity(index)">Restock</button>
                        </div>
                        <button type="button" class="addClr" @click="addColorStock">Add Color Stock</button>
                    </div>
                    <hr />
                    <div class="form-buttons">
                        <v-btn type="submit" :style="{ backgroundColor: '#3EB489', color: 'white' }">Save
                            Product</v-btn>
                        <v-btn class="close" type="button" :style="{ backgroundColor: '#A82946', color: 'white' }"
                            @click="goBack">Back</v-btn>
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

.addClr {
    background-color: rgb(10, 126, 89);
    width: 30%;
    height: 40px;
    border-radius: 5px;
    margin-top: 20px;
    color: rgb(226, 226, 226);
    font-weight: bold;
}

.rmvBtn {
    background-color: #940601;
    height: 40px;
    width: 150px;
    border-radius: 5px;
    font-weight: bold;
    color: rgb(214, 213, 213);
}

.restockBtn {
    background-color: #01944d;
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

    .addClr {
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
        padding: 0;
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
