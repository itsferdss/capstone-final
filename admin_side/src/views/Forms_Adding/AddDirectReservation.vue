<template>
    <main>
      <h1 class="bg-title">Enter Patient's Information</h1>
      <div class="form-container">
        <div class="form-box">
          <form @submit.prevent="saveNewUser">
            <div class="form-group">
              <label for="patient">Patient Name</label>
              <input type="text" v-model="editedItem.user_id" id="user_id" class="form-input" required />
            </div>
            <div class="form-group">
              <label for="product">Product Name</label>
              <input type="text" v-model="editedItem.product_id" id="product" class="form-input" required />
            </div>
            <div class="form-row">
              <div class="form-column">
                <div class="form-group">
                  <label for="quantity">Quantity</label>
                  <input type="number" v-model="editedItem.quantity" id="quantity" class="form-input" required />
                </div>         
                <div class="form-group">
                  <label for="date">Date</label>
                  <input type="date" v-model="editedItem.created_at" id="date" class="form-input" required />
                </div>

              </div>
              <div class="form-column">
                <div class="form-group">
                  <label for="color">Color</label>
                  <input type="tel" v-model="editedItem.color" id="color" class="form-input" required />
                </div>

              </div>
            </div>
            <hr />
            <div class="form-buttons">
              <v-btn type="submit" :style="{ backgroundColor: '#3EB489', color: 'white' }">
                Add Reservation
              </v-btn>
              <v-btn class="close" type="button" :style="{ backgroundColor: '#A82946', color: 'white' }" @click="goBack">
                Back
              </v-btn>
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
          user_id: '',
          product_id: '',
          quantity: '',
          created_at: '',
          color: '',
        },
      };
    },  
    methods: {
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
  
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
  
  /* Media queries for smaller devices */
  
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
  }
  
  @media (max-width: 480px) {
    .bg-title {
      font-size: 1.25rem;
      padding: 0.5rem;
    }
  
    .form-container {
      padding: 1rem;
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
  