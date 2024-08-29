<template>
  <div class="container">
    <div class="login-form-container">
      <div id="login">
        <v-img src="src/assets/MVC_logo.png" class="mvcLogo"></v-img>
        <p class="subtitle">Sign in as ADMIN</p>
        <div class="input-group">
          <label class="inputTitle" for="username">Name</label>
          <input type="text" id="username" v-model="username" required>
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

<script scoped>
export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    login() {
      console.log("Clicked login button");
      console.log("Username:", this.username);
      console.log("Password:", this.password);

      if (this.username === 'admin' && this.password === '123') {
        console.log("Redirecting to /dashboard");
        this.$router.push('/dashboard'); // Use router.push to navigate
      } else {
        console.log("Invalid username or password");
        this.errorMessage = 'Invalid username or password';
      }
    }
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