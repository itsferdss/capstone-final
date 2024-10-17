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

      <div class="dropdown" @click="toggleDropdown">
        <button class="dropbtn">
          {{ selectedCategory ? selectedCategory : 'Filter by Gender' }}
          <i :class="isDropdownVisible ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
        </button>
        <div class="dropdown-content" v-if="isDropdownVisible">
          <a href="#" @click.prevent="filterByCategory('Men')">
            <i class="fas fa-male"></i> Men
          </a>
          <a href="#" @click.prevent="filterByCategory('Women')">
            <i class="fas fa-female"></i> Women
          </a>
          <a href="#" @click.prevent="filterByCategory('Unisex')">
            <i class="fas fa-venus-mars"></i> Unisex
          </a>
          <a href="#" @click.prevent="filterByCategory(null)">
            <i class="fas fa-circle"></i> All
          </a>
        </div>
      </div>
    </nav>



    <!-- FRAMES Section -->
    <section id="sunglasses" class="category-section">
      <h1 class="title">FRAMES</h1>
      <div class="product-grid">
        <div @click="viewProduct(product.id)" class="product-card" v-for="product in filteredFramesProducts"
          :key="product.id">
          <div class="new-badge" v-if="isNewProduct(product.created_at)">NEW!</div>
          <img :src="product.currentImage || defaultImage" :alt="product.name" class="main-image"
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
        <div @click="viewProduct(product.id)" class="product-card" v-for="product in lensesProducts" :key="product.id">
          <div class="new-badge" v-if="isNewProduct(product.created_at)">NEW!</div>
          <img :src="product.currentImage || defaultImage" :alt="product.name" class="main-image"
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
        <div @click="viewProduct(product.id)" class="product-card" v-for="product in contactLensesProducts"
          :key="product.id">
          <div class="new-badge" v-if="isNewProduct(product.created_at)">NEW!</div>
          <img :src="product.currentImage || defaultImage" :alt="product.name" class="main-image"
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
        <div @click="viewProduct(product.id)" class="product-card" v-for="product in accessoriesProducts"
          :key="product.id">
          <div class="new-badge" v-if="isNewProduct(product.created_at)">NEW!</div>
          <img :src="product.currentImage || defaultImage" :alt="product.name" class="main-image"
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
import logoImage from '../assets/MVC_logo.png';

export default {
  data() {
    return {
      products: [],
      activeSection: 'sunglasses',
      isDropdownVisible: false,
      selectedCategory: null,
      defaultImage: logoImage
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
      if (product.images && product.images.length > 1) {
        if (action === 'hover') {
          product.currentImage = product.images[1]; // Use second image on hover
        } else {
          product.currentImage = product.images[0]; // Use default image otherwise
        }
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
    isNewProduct(createdAt) {
      const createdDate = new Date(createdAt);
      const today = new Date();
      const diffTime = Math.abs(today - createdDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      console.log(diffDays); 
      return diffDays <= 14;
    },
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    filterByCategory(gender) {
      this.selectedCategory = gender ? gender : 'All'; 
      this.isDropdownVisible = false; 
    },
  },
  computed: {
    filteredFramesProducts() {
      if (this.selectedCategory && this.selectedCategory !== 'All') {
        return this.products.filter(product => product.type === 'Frames' && product.gender === this.selectedCategory);
      }
      return this.products.filter(product => product.type === 'Frames'); 
    },
    lensesProducts() {
      if (this.selectedCategory && this.selectedCategory !== 'All') {
        return this.products.filter(product => product.type === 'Lens' && product.gender === this.selectedCategory);
      }
      return this.products.filter(product => product.type === 'Lens');
    },
    contactLensesProducts() {
      if (this.selectedCategory && this.selectedCategory !== 'All') {
        return this.products.filter(product => product.type === 'Contact Lenses' && product.gender === this.selectedCategory);
      }
      return this.products.filter(product => product.type === 'Contact Lenses');
    },
    accessoriesProducts() {
      if (this.selectedCategory && this.selectedCategory !== 'All') {
        return this.products.filter(product => product.type === 'Accessories' && product.gender === this.selectedCategory);
      }
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
  padding: 50px;
  margin-right: 100px;
  margin-left: 100px;
  font-size: 20px;
  font-style: italic;
  font-family: Arial, Helvetica, sans-serif;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
.main-image {
  width: 100%; 
  height: auto;
  object-fit: contain; 
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

.new-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: green;
  color: white;
  padding: 5px;
  font-size: 12px;
  border-radius: 3px;
}

.dropdown {
  position: relative;
  display: inline-block;
  margin-left: -80%;
}

.dropbtn {
  background-color: #3498db;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s;
}

.dropbtn:hover {
  background-color: #2980b9;
}

.dropdown-content {
  display: none;
  position: absolute;
  left: 0; 
  background-color: #fff;
  min-width: 160px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  z-index: 1;
}

.dropdown-content a {
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}


@media (max-width: 960px) {
  .title{
    margin-left: 0px;
    width: 100%;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px; 
  }

  .product-name{
    font-size: 13px;
  }

  .product-card {
    height: 330px; 
  }

  .product-name {
    font-size: 13px;
  }

  .product-card img.main-image {
    height: 250px; 
  }

  .dropdown{
    margin-left: -200px;
    margin-top: 20px;
  }
}
</style>

