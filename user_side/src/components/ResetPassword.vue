<template>
    <v-container class="my-5" fluid>
        <v-row justify="center">
            <v-col cols="12" sm="6" md="5" class="background-image">
                <img src="../assets/ResetPassword.jpg" alt="Forgot Password" class="img-fluid">
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-card elevation="5" class="rounded-lg">
                    <v-card-title class="text-center">
                        <v-icon large>mdi-lock-reset</v-icon>
                        <h2 class="ml-2">Reset Password</h2>
                    </v-card-title>
                    <v-card-text>
                        <p class="text-center mb-4">We understand that forgetting your password can be frustrating.
                            Please enter a new password that you'll remember.</p>
                        <form @submit.prevent="resetPassword">
                            <input type="hidden" v-model="token" />
                            <input type="hidden" v-model="email" />

                            <v-text-field label="New Password" id="password" v-model="password"
                                :type="showPassword ? 'text' : 'password'" required outlined
                                placeholder="Enter your new password"
                                :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append="togglePasswordVisibility('new')"></v-text-field>

                            <v-text-field label="Confirm Password" id="password_confirmation"
                                v-model="password_confirmation" :type="showConfirmPassword ? 'text' : 'password'"
                                required outlined placeholder="Confirm your new password"
                                :append-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                @click:append="togglePasswordVisibility('confirm')"></v-text-field>

                            <v-btn type="submit" color="primary" block class="mt-4 rounded-lg">
                                Reset Password
                            </v-btn>
                        </form>
                        <v-alert v-if="message" :type="message.includes('Error') ? 'error' : 'success'"
                            class="mt-3 rounded-lg">
                            {{ message }}
                        </v-alert>
                    </v-card-text>
                </v-card>
                <p class="text-center mt-4" style="font-size: 0.9em; color: gray;">
                    Remember your password? <router-link to="/login">Log in here</router-link>
                </p>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            token: this.$route.query.token,
            email: this.$route.query.email,
            password: '',
            password_confirmation: '',
            message: '',
            showPassword: false, // For New Password field
            showConfirmPassword: false, // For Confirm Password field
        };
    },
    methods: {
        async resetPassword() {
            try {
                const response = await axios.post('/password/reset', {
                    token: this.token,
                    email: this.email,
                    password: this.password,
                    password_confirmation: this.password_confirmation,
                });
                this.message = response.data.message; // Display success message
            } catch (error) {
                // Improved error handling
                if (error.response) {
                    this.message = error.response.data.message || 'Error resetting password.';
                } else if (error.request) {
                    this.message = 'No response was received from the server.';
                } else {
                    this.message = 'Error: ' + error.message;
                }
            }
        },
        togglePasswordVisibility(field) {
            if (field === 'new') {
                this.showPassword = !this.showPassword; // Toggle New Password visibility
            } else if (field === 'confirm') {
                this.showConfirmPassword = !this.showConfirmPassword; // Toggle Confirm Password visibility
            }
        }
    }
};
</script>

<style scoped>
.background-image {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 250px;
}

.background-image img {
    max-width: 100%;
    height: auto;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
}

.v-card {
    margin-top: 130px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
}

/* Media queries for mobile responsiveness */
@media (max-width: 768px) {
    .background-image {
        margin-right: 0; /* Remove margin for smaller screens */
        margin-bottom: 20px; /* Add some space below the image */
        height: 250px;
        margin-top: auto;
    }

    .v-card {
        margin-top: 20px; /* Reduce margin for smaller screens */
    }

    h2 {
        font-size: 1.5em; /* Adjust font size */
    }

    p {
        font-size: 0.9em; /* Adjust paragraph font size */
    }

    .v-btn {
        font-size: 0.9em; /* Adjust button font size */
    }
}
</style>
