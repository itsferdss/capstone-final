<template>
    <main>
        <div class="title-container">
            <h1 class="ghostTitle">Products</h1>
            <div class="dash">
                <span class="material-icons">inventory</span>
                <span class="text">View Products</span>
            </div>
        </div>
        <hr class="divider">
        <div class="tab-content">
            <button class="buttons" @click="handleTabClick('Inventory')"
                :class="{ active: activeTab === 'Inventory' }">All
                Products</button>
            <!-- <button @click="handleTabClick('FollowUp')" :class="{ active: activeTab === 'FollowUp' }">Serious Cases</button> -->
            <button class="buttons" @click="handleTabClick('Frame')"
                :class="{ active: activeTab === 'Frame' }">Frames</button>
            <button class="buttons" @click="handleTabClick('Lens')"
                :class="{ active: activeTab === 'Lens' }">Lenses</button>
            <button class="buttons" @click="handleTabClick('Contacts')"
                :class="{ active: activeTab === 'Contacts' }">Contact
                Lens</button>
            <button class="buttons" @click="handleTabClick('Accessories')"
                :class="{ active: activeTab === 'Accessories' }">Accessories</button>
            <button class="noButtons" @click="handleTabClick('noStock')"
                :class="{ active: activeTab === 'noStock' }">Stashed Products</button>
        </div>
        <div class="main-content">
            <div v-if="activeTab === 'Inventory'">
                <div class="inventory">
                    <Inventory />
                </div>
            </div>
            <div v-if="activeTab === 'Frame'">
                <div class="frame">
                    <Frame />
                </div>
            </div>
            <div v-if="activeTab === 'Lens'">
                <div class="lens">
                    <Lens />
                </div>
            </div>
            <div v-if="activeTab === 'Contacts'">
                <div class="contacts">
                    <Contacts />
                </div>
            </div>
            <div v-if="activeTab === 'Accessories'">
                <div class="accessories">
                    <Accessories />
                </div>
            </div>
            <div v-if="activeTab === 'noStock'">
                <div class="outStock">
                    <noStock />
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import Inventory from '../components/Inventory.vue';
import Frame from '../components/InventoryComponents/Frame.vue';
import Lens from '../components/InventoryComponents/Lens.vue';
import Contacts from '../components/InventoryComponents/ContactLens.vue';
import Accessories from '../components/InventoryComponents/Accessories.vue';
import noStock from '../components/InventoryComponents/noStock.vue';

export default {
    data() {
        return {
            activeTab: 'Inventory'
        };
    },
    methods: {
        handleTabClick(tab) {
            this.activeTab = tab; // Update active tab
            this.$emit('tab-clicked', tab); // Emit event with tab name
        }
    },
    components: {
        Inventory,
        Frame,
        Lens,
        Contacts,
        Accessories,
        noStock
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

    .inventory,
    .frame,
    .lens,
    .contacts,
    .accessories,
    .outStock {
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

.noButtons{
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

    .inventory,
    .frame,
    .lens,
    .contacts,
    .accessories,
    .outStock {
        padding: 0.20rem;
        margin-bottom: 5px;
    }

    .noButtons{
        margin-left: 0%;
    }
}
</style>
