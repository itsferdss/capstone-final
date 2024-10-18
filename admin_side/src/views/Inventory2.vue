<template>
    <main>
        <div class="title-container">
            <h1 class="ghostTitle">Inventory</h1>
            <div class="dash">
                <span class="material-icons">inventory</span>
                <span class="text">Inventory</span>
            </div>
        </div>
        <hr class="divider">

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
            activeTab: 'Inventory2'
        };
    },
    methods: {
        handleTabClick(tab) {
            this.activeTab = tab; // Update active tab
            this.$emit('tab-clicked', tab); // Emit event with tab name
        }
    },
    components: {
        Inventory2,

    }
};
</script>

<style lang="scss" scoped>
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

    .inventory2{
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

.tab-content {
    display: flex;
    gap: 2rem; // Gap between buttons
    padding: 1rem;
    margin-left: 20px;
}

.tab-content button {
    position: relative;
    color: var(--dark);
    font-size: 1.2rem;
    font-weight: 600;
    border: none;
    background: none;
    cursor: pointer;
    padding-bottom: 0.5rem;
    border-bottom: 3px solid transparent;
    transition: border-bottom 0.2s;
}

.tab-content button:hover,
.tab-content button:active,
.tab-content button.active {
    border-bottom: 3px solid black;
}

.tab-content-display {
    margin-top: 2rem;
}

.noButtons {
    margin-left: 37%;
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

    .tab-content {
        display: flex;
        gap: 1rem;
        padding: 0.5rem;
        margin-left: 0px;
    }

    .tab-content button {
        position: relative;
        color: var(--dark);
        font-size: 0.7rem;
        font-weight: 600;
        border: none;
        background: none;
        cursor: pointer;
        padding-bottom: 0.25rem;
        border-bottom: 2px solid transparent;
        transition: border-bottom 0.2s;
    }

    .tab-content button:hover,
    .tab-content button:active,
    .tab-content button.active {
        border-bottom: 2px solid black;
    }

    .tab-content-display {
        margin-top: 1rem;
    }

    .inventory2{
        padding: 0.20rem;
        margin-bottom: 5px;
    }

    .noButtons {
        margin-left: 0%;
    }
}
</style>
