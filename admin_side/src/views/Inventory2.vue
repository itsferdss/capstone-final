<template>
    <main>
        <div class="title-container">
            <h1 class="ghostTitle">Inventory</h1>
            <div class="dash">
                <span class="material-icons card-icon">inventory</span>
                <span class="text">Inventory</span>
            </div>
        </div>
        <hr class="divider">

        <!-- Button to minimize or expand cards -->
        <div class="minimize-button">
            <v-btn @click="toggleCards" color="primary">
                {{ cardsMinimized ? 'See Reports' : 'Minimize Reports' }}
            </v-btn>
        </div>

        <div class="cards-container" v-if="!cardsMinimized">
            <v-row>
                <v-col cols="12" sm="4">
                    <v-card class="pa-4 inventCard" style="height: 180px;">
                        <v-card-title>
                            <div class="icon-circle">
                                <span class="material-icons">inventory</span>
                            </div>
                            Top 3 Products (Most Sold)
                        </v-card-title>
                        <v-card-text>
                            <ul>
                                <li v-for="(product, index) in topThreeProducts" :key="index">
                                    {{ product.product_name }} - Sold: {{ product.total_sold }}
                                </li>
                            </ul>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-card class="pa-4 inventCard" style="height: 180px;">
                        <v-card-title>
                            <div class="icon-circle">
                                <span class="material-icons">shopping_cart</span>
                            </div>
                            Total Sold
                        </v-card-title>
                        <v-card-text class="sold">{{ totalSold }}</v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-card class="pa-4 inventCard" style="height: 180px;">
                        <v-card-title>
                            <div class="icon-circle">
                                <span class="material-icons">attach_money</span>
                            </div>
                            Total Reservation Revenue
                        </v-card-title>
                        <v-card-text class="rev">₱{{ totalRevenue }}</v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </div>

        <div class="main-content">
            <div class="inventory2">
                <Inventory2 />
            </div>
        </div>
    </main>
</template>


<script>
import Inventory2 from '../components/Inventory2.vue';

export default {
    data() {
        return {
            activeTab: 'Inventory2',
            products: [],
            cardsMinimized: false, // New data property to manage card visibility
        };
    },
    computed: {
        topThreeProducts() {
            return [...this.products]
                .sort((a, b) => b.total_sold - a.total_sold)
                .slice(0, 3);
        },
        totalSold() {
            return this.products.reduce((total, product) => {
                const sold = Number(product.total_sold) || 0;
                return total + sold;
            }, 0);
        },
        totalRevenue() {
            return this.products.reduce((total, product) => total + (product.total_sold * product.price), 0);
        }
    },
    mounted() {
        this.fetchProducts();
    },
    methods: {
        handleTabClick(tab) {
            this.activeTab = tab;
            this.$emit('tab-clicked', tab);
        },
        fetchProducts() {
            axios.get('/allProducts')
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
        toggleCards() {
            this.cardsMinimized = !this.cardsMinimized; // Toggle the minimized state
        },
    },
    components: {
        Inventory2,
    }
};
</script>


<style lang="scss" scoped>
.minimize-button {
    margin: 20px 30px; // Adjust margin as needed
    text-align: center; // Center the button
}

.ghostTitle {
    position: absolute;
    z-index: -1;
    opacity: 0.1;
    top: 0px;
    right: 50px;
    font-size: 120px;
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    color: #848484;
}

.title-container {
    display: flex;
    align-items: center;
    padding: 1rem;
    background-color: #ffffff;
    position: relative;
    z-index: 1;
}

.dash {
    flex: 1;
    display: flex;
    align-items: center;
    margin-left: 20px;
}

.material-icons {
    color: #1a1a1a;
    font-size: 2.5rem;
}

.card-icon {
    font-size: 2rem;
    /* Adjust the size of the icons in the card */
    margin-right: 8px;
    /* Space between icon and text */
}

.text {
    margin-left: 0.5rem;
    color: #151515;
    font-size: 2rem;
    font-weight: 600;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.main-content {
    display: flex;
    flex-direction: column;
    margin-left: 30px;
    margin-right: 30px;

    .inventory2 {
        border-radius: 5px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100%;
        border: 1px solid #ccc;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border-color: rgb(178, 177, 177);
        margin-bottom: 10px;
    }
}

.cards-container {
    margin: 20px 30px;

    /* Ensure card heights are the same and responsive */
    v-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        /* Ensure cards fill the column */
    }
}

.inventCard {
    border-width: 1px 1px 2px 4px;
    border-color: rgb(67, 100, 101);
}

.icon-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px; 
    border-radius: 50%; 
    background-color: #aeeaaf; 
    margin-right: 10px; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); 
}

.icon-circle .material-icons {
    color: #2c7438;
    font-size: 1.5rem; 
}

/* Main icon color */
.material-icons {
    color: #1a1a1a;
    font-size: 2.5rem;
}

.text {
    margin-left: 0.5rem;
    color: #151515;
    font-size: 2rem;
    font-weight: 600;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.rev{
    font-size: 25px;
    margin-left: 10px;
}

.sold{
    font-size: 25px;
    margin-left: 10px;
}

@media (max-width: 960px) {
    .v-data-table {
        font-size: 12px;
    }

    .main-content {
        margin-left: 0;
        margin-right: 0;
    }

    .dash {
        margin-left: -10px;
        margin-bottom: -20px;
    }

    .title-container {
        height: 60px;
    }

    .material-icons {
        font-size: 28px;
    }

    .text {
        font-size: 25px;
    }

    .ghostTitle {
        font-size: 65px;
        margin-top: 30px;
    }

    .cards-container {
        margin: 10px 0; // Adjust spacing for smaller screens
    }

    .inventory2 {
        padding: 0.20rem;
        margin-bottom: 5px;
    }
}
</style>

