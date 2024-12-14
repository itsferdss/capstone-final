<template>
    <main class="edit-product">
        <h1 class="edit-title">Edit {{ editedItem.product_name }}</h1>
        <div class="edit-form-container">
            <div class="edit-form-box">
                <form @submit.prevent="saveEditedProduct">
                    <div class="edit-form-group">
                        <label for="quantity">Total Quantity</label>
                        <input type="number" v-model="editedItem.quantity" id="quantity" class="edit-input" disabled />
                    </div>

                    <div class="edit-form-group">
                        <label for="price">Price</label>
                        <input type="number" step="0.01" v-model="editedItem.price" id="price" class="edit-input"
                            required placeholder="Enter price" />
                    </div>

                    <div class="edit-form-group" v-if="editedItem.color_stock.length > 0">
                        <label>Color Stock</label>
                        <div class="edit-color-stock">
                            <div v-for="(colorStock, index) in editedItem.color_stock" :key="index" class="color-row">
                                <div class="color-preview" :style="{ backgroundColor: colorStock.color }"></div>
                                <input type="text" v-model="colorStock.color" placeholder="Color (e.g., #ff0000 or red)"
                                    class="color-input" required />
                                <input type="number" v-model.number="colorStock.stock" @input="updateQuantity"
                                    placeholder="Stock" class="stock-input" required />
                                <input type="number" v-model.number="colorStock.restockQuantity"
                                    :disabled="colorStock.isRestocked" placeholder="Restock" class="restock-input" />

                                <button type="button" class="btn restock-btn" @click="restock(index)"
                                    :disabled="colorStock.isRestocking">
                                    <span v-if="colorStock.isRestocking">Loading...</span>
                                    <span v-else>{{ colorStock.isRestocked ? 'Restocked' : 'Restock' }}</span>
                                </button>
                                <button type="button" class="btn remove-btn"
                                    @click="removeColorStock(index)">Remove</button>

                                <div>
                                    <div class="image-container" v-if="colorStock.image">
                                        <img :src="colorStock.image" alt="Color Stock Image"
                                            class="color-stock-image" />
                                    </div>
                                    <input type="file" class="edit-input file-input" @change="handleFileChange($event, index)" />

                                </div>
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
            baseURL: 'https://opticare.fun/',
            editedItem: {
                product_id: '',
                product_name: '',
                quantity: 0,
                price: '',
                color_stock: [{
                    color: '',
                    stock: 0,
                    restockQuantity: 0,
                    isRestocked: false,
                    isRestocking: false,
                    file: null
                }] // Added isRestocking
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

                    // Parse color_stock JSON string into an array and prepend baseURL to image paths
                    const colorStock = JSON.parse(productData.color_stock || "[]").map(item => ({
                        ...item,
                        restockQuantity: 0,
                        isRestocked: false,
                        isRestocking: false, // Initialize isRestocking
                        image: this.formatImage(item.image)  // Format images consistently
                    }));

                    // Set the product data with images and color stock
                    this.editedItem = {
                        product_id: productData.id,
                        product_name: productData.product_name,
                        quantity: productData.quantity,
                        price: productData.price,
                        color_stock: colorStock, // Store the parsed color stock with updated images
                    };

                    this.removeEmptyColorStocks();
                })
                .catch(error => {
                    console.error('Error fetching product:', error);
                });
        },
        formatImage(image) {
            if (image && !image.startsWith('http')) {
                return `${this.baseURL}/${image}`;  // For relative paths, prepend the base URL
            }
            return image;  // If it's already a full URL, return as is
        },
        addColorStock() {
            this.editedItem.color_stock.push({ color: '', stock: 0, restockQuantity: 0, isRestocked: false, isRestocking: false });
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
        restock(index) {
            const colorStock = this.editedItem.color_stock[index];

            if (colorStock.isRestocking) return;

            colorStock.isRestocking = true;

            setTimeout(() => {
                colorStock.stock += colorStock.restockQuantity || 0;
                this.updateQuantity();
                colorStock.isRestocked = true;
                colorStock.isRestocking = false;
            }, 1000);
        },
        handleFileChange(event, index) {
            const file = event.target.files[0];
            if (file) {
                // Create a FormData object to send the file to the backend
                const formData = new FormData();
                formData.append('image', file);

                // Send the image to the server and get the URL
                axios.post('/upload-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                    .then(response => {
                        // Update the image property for the corresponding color stock with the returned URL
                        this.editedItem.color_stock[index].image = response.data.imageUrl; // Assuming your server responds with the image URL
                    })
                    .catch(error => {
                        console.error('Error uploading image:', error);
                        Swal.fire({
                            title: 'Error',
                            text: 'There was an error uploading the image.',
                            icon: 'error',
                        });
                    });
            }
        },
        saveEditedProduct() {
            // Verify color stock content
            console.log("Color stock before sending:", this.editedItem.color_stock);

            // Prepare payload with color_stock as a direct object
            const payload = {
                product_id: this.editedItem.product_id,
                product_name: this.editedItem.product_name,
                quantity: this.editedItem.quantity,
                price: this.editedItem.price,
                color_stock: this.editedItem.color_stock.map(item => ({
                    ...item,
                    // Ensure image is a valid string or leave empty if it's a file
                    image: typeof item.image === 'string' ? item.image : ''
                }))
            };

            // Use axios to send JSON data (no need for multipart/form-data)
            axios.put(`/products/${this.editedItem.product_id}`, payload, {
                headers: {
                    'Content-Type': 'application/json', // Default content type for JSON
                },
            })
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
                    console.error('Error updating product:', error.response?.data || error);
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
    max-width: 1000px;
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

.color-input{
    width: 50%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.3s ease;
}

.stock-input{
    width: 50%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.3s ease;
}

.restock-input{
    width: 20%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.3s ease;
}

.color-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
}

.color-preview {
    width: 25px;
    height: 25px;
    border-radius: 4px;
    border: 1px solid #ddd;
}

.file-input {
    padding: 5px;
    widows: 2000px;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    margin-top: 20px;
}

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
    color: black;
}

.restock-btn {
    background-color: #01944d;
    color: white;
}

.remove-btn {
    background-color: #940601;
    color: white;
}

.image-container {
    margin-top: 10px;
}

.color-stock-image {
    width: 220px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #ddd;
}

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
