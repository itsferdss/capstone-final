<template>
    <main>
        <div class="title-container">
            <h1 class="ghostTitle">Sales</h1>
            <div class="dash">
                <span class="material-icons">shopping_cart</span>
                <span class="text">Sales</span>
            </div>
        </div>
        <hr class="divider">
        <div class="main-content" :class="{ 'mini-variant': miniVariant }">
            <div class="sales">
                <Sales />
            </div>
        </div>
    </main>
</template>

<script>
import Sales from '../components/Sales.vue';

export default {
    components: {
        Sales,
    },
    data() {
        return {
            isSmallScreen: false,
            miniVariant: false, // State to manage sidebar visibility
        };
    },
    created() {
        this.checkScreenSize();
        window.addEventListener('resize', this.checkScreenSize);
    },
    destroyed() {
        window.removeEventListener('resize', this.checkScreenSize);
    },
    methods: {
        checkScreenSize() {
            this.isSmallScreen = window.innerWidth <= 960;
        },
        toggleSidebar() {
            this.$emit('toggle-mini-variant');
        },
    },
};
</script>

<style lang="scss">
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

    .sales {
        border-radius: 5px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100%;
        border: 1px solid #ccc;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border-color: rgb(0, 0, 0);
        margin-bottom: 10px;
    }
}



@media (max-width: 960px) {
    .main-content {
        margin-left: 0;
        max-width: 100%;
        margin-right: 0;

        .dashboard {
            padding: 0.5rem;
            height: 100%;
        }
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
        font-size: 60px;
        margin-top: 30px;
    }
}
</style>
