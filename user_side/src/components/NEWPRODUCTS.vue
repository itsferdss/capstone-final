<template>
    <div class="sunglasses-page">
        <!-- Navigation Bar -->
        <nav class="category-nav">
            <ul>
                <li><a href="#" @click.prevent="scrollToSection('sunglasses')"
                        :class="{ active: activeSection === 'sunglasses' }">FRAMES</a></li>
                <li><a href="#" @click.prevent="scrollToSection('eyeglasses')"
                        :class="{ active: activeSection === 'eyeglasses' }">LENSES</a></li>
                <li><a href="#" @click.prevent="scrollToSection('prescription-sunglasses')"
                        :class="{ active: activeSection === 'prescription-sunglasses' }">CONTACT LENSES</a></li>
                <li><a href="#" @click.prevent="scrollToSection('readers')"
                        :class="{ active: activeSection === 'readers' }">ACCESSORIES</a></li>
            </ul>
        </nav>

        <!-- FRAMES Section -->
        <section id="sunglasses" class="category-section">
            <h1 class="title">FRAMES</h1>
            <div class="product-grid">
                <div @click="viewProduct(product.id)" class="product-card" v-for="product in framesProducts"
                    :key="product.id">
                    <div class="sale-badge" v-if="product.onSale">SALE</div>
                    <img :src="product.currentImage" :alt="product.name" class="main-image"
                        @mouseover="changeImage(product, 'hover')" @mouseleave="changeImage(product, 'default')">
                    <div class="product-details">
                        <span class="product-name">{{ product.product_name }}</span>
                        <span class="price">
                            <span v-if="product.onSale" class="original-price">{{ product.originalPrice }}</span>
                            <span class="sale-price">₱{{ product.price }}</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <!-- LENSES Section -->
        <section id="eyeglasses" class="category-section">
            <h1 class="title">LENSES</h1>
            <div class="product-grid">
                <div class="product-card" v-for="product in lensesProducts" :key="product.id">
                    <img :src="product.currentImage" :alt="product.name" class="main-image"
                        @mouseover="changeImage(product, 'hover')" @mouseleave="changeImage(product, 'default')">
                    <div class="product-details">
                        <span class="product-name">{{ product.product_name }}</span>
                        <span class="price">
                            <span v-if="product.onSale" class="original-price">{{ product.originalPrice }}</span>
                            <span class="sale-price">₱{{ product.price }}</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <!-- CONTACT LENSES Section -->
        <section id="prescription-sunglasses" class="category-section">
            <h1 class="title">CONTACT LENSES</h1>
            <div class="product-grid">
                <div class="product-card" v-for="product in contactLensesProducts" :key="product.id">
                    <img :src="product.currentImage" :alt="product.name" class="main-image"
                        @mouseover="changeImage(product, 'hover')" @mouseleave="changeImage(product, 'default')">
                    <div class="product-details">
                        <span class="product-name">{{ product.product_name }}</span>
                        <span class="price">
                            <span v-if="product.onSale" class="original-price">{{ product.originalPrice }}</span>
                            <span class="sale-price">₱{{ product.price }}</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ACCESSORIES Section -->
        <section id="readers" class="category-section">
            <h1 class="title">ACCESSORIES</h1>
            <div class="product-grid">
                <div class="product-card" v-for="product in accessoriesProducts" :key="product.id">
                    <img :src="product.currentImage" :alt="product.name" class="main-image"
                        @mouseover="changeImage(product, 'hover')" @mouseleave="changeImage(product, 'default')">
                    <div class="product-details">
                        <span class="product-name">{{ product.product_name }}</span>
                        <span class="price">
                            <span v-if="product.onSale" class="original-price">{{ product.originalPrice }}</span>
                            <span class="sale-price">₱{{ product.price }}</span>
                        </span>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>


<script>
import axios from 'axios';

export default {
    data() {
        return {
            products: [],
            activeSection: 'sunglasses'
        };
    },
    methods: {
        fetchProducts() {
            axios.get('/allProducts')
                .then(response => {
                    this.products = response.data.map(product => ({
                        ...product,
                        currentImage: product.images[0] // Set the default image
                    }));
                })
                .catch(error => {
                    console.error('Error fetching products:', error);
                });
        },
        changeImage(product, action) {
            if (action === 'hover' && product.images.length > 1) {
                product.currentImage = product.images[1]; // Use second image on hover
            } else {
                product.currentImage = product.images[0]; // Use default image otherwise
            }
        },
        scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                this.activeSection = sectionId;
            }
        },
        viewProduct(productId) {
            this.$router.push({ path: '/viewProduct', query: { id: productId } });
        },
    },
    computed: {
        framesProducts() {
            return this.products.filter(product => product.type === 'Frames');
        },
        lensesProducts() {
            return this.products.filter(product => product.type === 'Lens');
        },
        contactLensesProducts() {
            return this.products.filter(product => product.type === 'Contact Lenses');
        },
        accessoriesProducts() {
            return this.products.filter(product => product.type === 'Accessories');
        }
    },
    created() {
        this.fetchProducts();
    }
};
</script>

<style scoped>
.sunglasses-page {
    padding: 20px;
    text-align: center;
}

.category-nav ul {
    display: flex;
    justify-content: center;
    list-style: none;
    padding: 0;
    margin: 0;
}

.category-nav li {
    margin: 0 10px;
}

.category-nav a {
    text-decoration: none;
    color: #333;
}

.category-nav a.active {
    border-bottom: 2px solid #000;
}

.category-section {
    margin-top: 50px;
    padding-top: 20px;
    border-top: 1px solid #ddd;
}

.title {
    margin: 20px 0;
    background-color: #e4e1e1;
    padding: 50px;
    margin-right: 100px;
    margin-left: 100px;
    font-size: 35px;
    font-style: italic;
    font-family: Arial, Helvetica, sans-serif;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.product-card {
    position: relative;
    padding: 10px;
    text-align: center;
    border: none;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    transition: transform 0.2s;
}

.product-card:hover {
    transform: scale(1.03);
}

.product-card img.main-image {
    max-width: 100%;
    height: 300px;
    display: block;
    margin: 0 auto;
    border-radius: 8px;
}

.sale-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: red;
    color: white;
    padding: 5px;
    font-size: 12px;
    border-radius: 3px;
}

.product-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
}

.product-name {
    font-size: 16px;
    color: #333;
}

.price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.price .original-price {
    text-decoration: line-through;
    color: #999;
    margin-bottom: 5px;
}

.price .sale-price {
    color: #e74c3c;
    font-size: 18px;
}
</style>
