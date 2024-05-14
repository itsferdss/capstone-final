  <template>
   <div class="container">
      <div class="logo">
        <img src="C:\Users\Ferdinand\Documents\codes\capstone-final\admin_side\src\assets\logo.png">  
      </div>

      <div class="login-form-container">
            <div id="login">
              <h1 class="title">Login as Admin</h1>
              <p class="subtitle">Sign in to continue</p>
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
                console.log("Redirecting to /viewusers");
                this.$router.push('/viewusers'); // Use router.push to navigate
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
    justify-content: space-between; /* Align children with space between them */
    align-items: center;
    padding: 0 200px; /* Add padding to the container */
  }

  .login-form-container {
    max-width: 500px; /* Adjust the max-width as needed */
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0.4, 0.4, 0.4, 0.4); /* Add a box shadow for depth */
    margin-left: 100px; 
  }

  .input-group {
      margin-bottom: 20px; 
  }
  label {
      display: block;
      margin-bottom: 5px;
  }
  input[type="text"],
  input[type="password"] {
    width: 100%; /* Adjust the width as needed */
    height: 35px;
    padding: 10px;
    border: 1px solid #ccc;
    background-color: #86C291;
  }
  button {
    width: 100%; /* Adjust the width as needed */
    background-color: #56845E;
    color: #1C2120;
    border: none;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-weight: bold;
    font-size: 20px;
    transition: background-color 0.3s;
  }
  button:hover {
      background-color: #39573F;
      color: #DEE1DF;
  }
  .subtitle {
    color: #8F8E8E;
    margin: 0;
    font-size: 15px;
    text-align: center;
  }
  .logo{
      flex: 0 0 auto; 
  }
  .inputTitle{
      color: #8F8E8E;
      text-align: left; 
      margin-left: 0px;
  }
  .title{
      font-weight: bold;
      margin: 0;
      font-size: 40px;
      color: black;
      text-align: center;
  }

  .trapezoid {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 70px;
      background-color: #35623D;
      align-items: center;
  }
  </style>
