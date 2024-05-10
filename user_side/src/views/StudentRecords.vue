<template>
    <main>
        <div class="main-content">
            <div class="studentrecords">
                <StudentRecords
                />
            </div>
        </div>
    </main>
</template>

<script>
import StudentRecords from '../components/StudentRecords.vue';

export default {
  components: {
    StudentRecords
  }
};
</script>

<style lang="scss" scoped>
.top-container{
    display: flex;
    margin: 0.5rem;
    .studentrecords{
        flex: 1;
        
        .material-icons{
            color: var(--dark);
            font-size: 2.5rem;
        }
        .text{
            position: relative;
            color: var(--dark);
            font-size: 1.5rem;
            font-weight: 900;
            bottom: 0.5rem;
        }
    }

} 

.main-content {
    display: flex;
    flex-direction: column;

    .appointment{
        border-radius: 10px;
        background-color: #f0f0f0;
        padding: 0.5rem;
        height: 100vh;
    }
}


</style>
