<template>
    <header class="header">
        <h2 class="sna-label">Saint Nicholas Academy School Management System</h2>
        
    </header>
</template>

<script>
export default {
    name: 'Header'
}
</script>

<style lang="scss" scoped>
.header {
    display: flex;
    background: #ffff;
    height: var(--header-height);
    width: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    
    .sna-label{
        flex: 1;
        color: var(--dark);
        align-self: center;
        margin-left: 1rem;
    }
 
}

</style>