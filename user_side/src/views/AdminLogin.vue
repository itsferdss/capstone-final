<template>
  <div class="container">
    <div class="login-form-container">
      <div id="login">
        <v-img src="src/assets/MVC_logo.png" class="mvcLogo"></v-img>
        <p class="subtitle">Sign in to Continue</p>
        <div class="input-group">
          <label class="inputTitle" for="email">Email</label>
          <input type="text" id="email" v-model="email" required>
        </div>
        <div class="input-group">
          <label class="inputTitle" for="password">Password</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button @click="login">Log in</button>
        <p>{{ errorMessage }}</p>
      </div>
    </div>
    <div class="trapezoid"></div>
  </div>
</template>

<script>
import axios from 'axios'; // Adjust the path to your Axios instance
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    login() {
      axios.post('/login', {
        email: this.email,
        password: this.password
      })
      .then(response => {
        const token = response.data.token; // Assuming the token is returned in the response
        const id = response.data.id; 
        localStorage.setItem('patientId', id);
        sessionStorage.setItem('token', token); // Store the token in sessionStorage
        this.$store.commit('setPatientId', id); 
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome!',
        });
        this.$router.push('/home'); // Redirect to home after successful login
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid email or password',
        });
        console.error('Login failed:', error);
      });
    }
  }
};

</script>

<style scoped>
.container {
  margin-top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px; /* Adjusted padding */
  min-height: 513px; /* Make sure the container takes full height */
  position: relative; /* Relative positioning to keep the trapezoid inside */
  margin-right: 0px;
}

.login-form-container {
  max-width: 500px; /* Adjust the max-width as needed */
  padding: 20px;
  background-color: #E3F1F8; /* Light blue background */
  border-radius: 10px;
   box-shadow: 0 10px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  z-index: 1; /* Ensure it stays above the trapezoid */
  margin-right: 200px;
}

.input-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #B3D9E6; /* Light blue */
}

input[type="text"],
input[type="password"] {
  width: 100%; /* Adjust the width as needed */
  height: 35px;
  padding: 10px;
  border: 1px solid #B3D9E6; /* Light blue border */
  background-color: #E3F1F8; /* Light blue background */
}

button {
  width: 100%; /* Adjust the width as needed */
  background-color: #92d1e7; /* Light blue */
  color: black; /* White */
  border: none;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
  font-size: 20px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #207BA6; /* Darker blue on hover */
  color:white;
}

.subtitle {
  color: black; /* Light blue */
  margin: 0;
  font-size: 15px;
  text-align: center;
}

.inputTitle {
  color: rgb(53, 53, 53); /* Light blue */
  text-align: left;
  margin-left: 0px;
}

.title {
  font-weight: bold;
  margin: 0;
  font-size: 40px;
  color: rgb(53, 53, 53); /* Light blue */
  text-align: center;
}

.trapezoid {
  position: fixed;
  bottom: 0;
  width: 200%;
  height: 70px;
  background-color: #B3D9E6; /* Light blue */
  align-items: center;
}

.mvcLogo {
  width: 400px;
  height: 80px;
}
</style>
