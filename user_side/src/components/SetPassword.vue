<template>
    <main>
        <h1 class="bg-title">Set Your Password</h1>
        <div class="form-container">
            <div class="form-box">
                <form @submit.prevent="setPassword">
                    <div class="form-group">
                        <label for="password">New Password</label>
                        <input type="password" v-model="password" id="password" class="form-input"
                            placeholder="Enter new password" required />
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" v-model="confirmPassword" id="confirmPassword" class="form-input"
                            placeholder="Confirm new password" required />
                    </div>

                    <div v-if="passwordMismatch" class="error">
                        <span>Passwords do not match. Please try again.</span>
                    </div>

                    <div class="form-buttons">
                        <v-btn type="submit" :style="{ backgroundColor: '#3EB489', color: 'white' }">
                            Set Password
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
            password: '',
            confirmPassword: '',
            passwordMismatch: false,
        };
    },

    methods: {
        async setPassword() {
            const token = this.$route.query.token;
            const email = this.email;

            try {
                await axios.post('/set-password', {
                    token,
                    email,
                    password: this.password
                });

                Swal.fire({
                    title: 'Success',
                    icon: 'success',
                    text: 'Password has been updated!'
                });

                this.$router.push('/login');

            } catch (err) {
                Swal.fire({
                    title: 'Oops',
                    icon: 'error',
                    text: err.message
                });
            }
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
    font-weight: bold;
    font-size: 1.75rem;
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
    max-width: 500px;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
}

label {
    font-weight: bold;
    color: #333;
}

input[type="password"] {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}

input[type="password"]:focus {
    border-color: #3EB489;
    outline: none;
    box-shadow: 0 0 8px rgba(62, 180, 137, 0.5);
}

.form-buttons {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}

.v-btn {
    padding: 0.75rem 2rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
}

.v-btn:hover {
    background-color: #2e9f80;
}

.error {
    color: #d32f2f;
    font-weight: bold;
    text-align: center;
}
</style>
