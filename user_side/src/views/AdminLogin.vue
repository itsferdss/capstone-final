<template>
  <div class="container">
    <div class="login-form-container">
      <div id="login">
        <v-img src="../assets/MVC_logo.png" class="mvcLogo"></v-img>
        <p class="subtitle">Sign in to Continue</p>
        <div class="input-group">
          <label class="inputTitle" for="email">Email</label>
          <input type="text" id="email" v-model="email" required>
        </div>
        <div class="input-group">
          <label class="inputTitle" for="password">Password</label>
          <input :type="passwordType" id="password" v-model="password" required>
          <i class="eye-icon" @click="togglePasswordVisibility">
            <v-icon>{{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
          </i>
        </div>
        <button @click="login">Log in</button>
        <p>{{ errorMessage }}</p>
      </div>
    </div>
    <div class="trapezoid"></div>
    <div class="circle circle-1"></div>
    <div class="circle circle-2">
      <img class="graphics" src="../assets/graphics.png" alt="Graphics" />
      <img class="logo mobile-position" src="../assets/newlogo.png" alt="New Logo" />
      <img class="echode_logo mobile-position" src="../assets/echode_logo.png" alt="EchoDE Logo" />
    </div>
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
      errorMessage: '',
      showPassword: false,
    };
  },
  computed: {
    passwordType() {
      return this.showPassword ? 'text' : 'password';
    },
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
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  }
};

</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  /* Prevent scrolling */
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;  
  padding: 0 20px;
  height: 100vh;
  box-sizing: border-box;
  position: fixed;
  
}

.login-form-container {
  max-width: 500px;
  padding: 20px;
  background-color: #E3F1F8;
  border-radius: 10px;
  box-shadow: 0 10px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  z-index: 1;
  position: relative;
  margin-top: 150px;
  margin-left: 1200px;
  animation: slideInFromBottom 1s ease-out forwards;
  transform: translateY(100%);
}

.input-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #B3D9E6;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  height: 35px;
  padding: 10px;
  border: 1px solid #B3D9E6;
  background-color: #E3F1F8;
}

button {
  width: 100%;
  background-color: #92d1e7;
  color: black;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
  font-size: 20px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #207BA6;
  color: white;
}

.subtitle {
  color: black;
  margin: 0;
  font-size: 15px;
  text-align: center;
}

.inputTitle {
  color: rgb(53, 53, 53);
  text-align: left;
}

.title {
  font-weight: bold;
  margin: 0;
  font-size: 40px;
  color: rgb(53, 53, 53);
  text-align: center;
}

.trapezoid {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 70px;
  background-color: #B3D9E6;
  z-index: 0;
  animation: slideUpFromBottom 1s ease-out forwards;
  transform: translateY(100%);
  margin-right: -200px;
}

.mvcLogo {
  width: 300px;
  height: 60px;
  margin-bottom: 20px;
}

.circle {
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  animation-duration: 1s;
  animation-timing-function: ease-out;
}

.circle-1 {
  top: -200px;
  left: -499px;
  width: 1350px;
  height: 1000px;
  background-color: #B3D9E6;
  animation-name: slideInCircle1;
}

.circle-2 {
  top: -200px;
  left: -500px;
  width: 1300px;
  height: 1000px;
  background-color: #016888;
  animation-name: slideInCircle2;
}

@keyframes slideInCircle1 {
  from {
    left: -1100px;
  }

  to {
    left: -38%;
  }
}

@keyframes slideInCircle2 {
  from {
    left: -1100px;
  }

  to {
    left: -38%;
  }
}

@keyframes slideInFromBottom {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

@keyframes slideUpFromBottom {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

.graphics {
  position: absolute;
  top: 25%;
  left: 40%;
  height: 60%;
  width: auto;
}

.logo {
  position: absolute;
  bottom: 17%;
  left: 108%;
  height: 100px;
  width: auto;
}

.echode_logo {
  position: absolute;
  bottom: 17%;
  left: 96%;
  height: 140px;
  width: auto;
}

.eye-icon {
  position: absolute;
  margin-top: 35px;
  right: 0;
  margin-right: 10px;
}
@media (max-width: 960px) {
  .container {
    flex-direction: column;
    margin-top: 20px;
    padding: 0 20px;
  }

  .login-form-container {
    margin-left: 0;
    width: 100%;
  }

  .mvcLogo {
    width: 100%;
    height: auto;
  }

  .eye-icon {
    margin-top: 30px
  }

  .graphics{
    display: none;
  }

  .login-form-container {
    margin-top: 150px;
    padding: 10px;
  }

  button {
    font-size: 16px;
    padding: 10px;
  }

  .subtitle {
    font-size: 12px;
  }

  .inputTitle {
    font-size: 14px;
  }

  .trapezoid {
    display: none;
  }

  @keyframes slideInCircle1 {
    from {
      left: -1100px;
    }

    to {
      left: -120%;
    }
  }

  @keyframes slideInCircle2 {
    from {
      left: -1100px;
    }

    to {
      left: -120%;
    }
  }

  .logo.mobile-position {
    position: relative; /* Adjust logo position */
    bottom: auto;
    left: 40%;
    width: auto; /* Make logo responsive */
    height: 100px;
    margin-top: 55%; /* Adjust margin */
  }

  .echode_logo.mobile-position {
    position: relative; /* Adjust EchoDE logo position */
    bottom: auto;
    left: 40%;
    width: auto; /* Make EchoDE logo responsive */
    height: 150px;
    margin-top: 55%; /* Adjust margin */
  }
}
</style>

