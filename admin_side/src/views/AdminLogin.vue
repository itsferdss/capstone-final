<template>
  <div class="container">
    <div class="login-form-container">
      <div id="login">
        <v-img src="../assets/MVC_logo.png" class="mvcLogo"></v-img>
        <p class="subtitle">Sign in as Admin</p>
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
  </div>
</template>

<script>
import axios from 'axios';
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
      axios.post('/authlogin', { // Update this line to use '/authlogin' instead of '/login'
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
          this.$router.push('/dashboard'); // Redirect to home after successful login
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
.container {
  margin-top: 170px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 200px;
}

.login-form-container {
  max-width: 500px;
  padding: 20px;
  background-color: #E3F1F8;
  border-radius: 10px;
  box-shadow: 0 10px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  margin-left: 300px;
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
  padding: 5px;
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
  color: rgb(53, 53, 53);
  margin: 0;
  font-size: 15px;
  text-align: center;
}

.inputTitle {
  color: rgb(53, 53, 53);
  text-align: left;
  margin-left: 0px;
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
  left: 0;
  width: 100%;
  height: 70px;
  background-color: #B3D9E6;
  align-items: center;
}

.mvcLogo {
  width: 400px;
  height: 80px;
}

.eye-icon{
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
  
  .eye-icon{
    margin-top: 30px
  }
}

@media (max-width: 600px) {
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
    height: 50px;
  }
}
</style>