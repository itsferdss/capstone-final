<template>
    <v-container class="my-5" fluid>
        <v-row justify="center">
            <v-col cols="12" sm="6" md="5" class="background-image"
                style="display: flex; align-items: center; justify-content: center;">
                <img src="../assets/ForgotPassword.jpg" alt="Forgot Password" class="img-fluid">
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-card elevation="5" class="rounded-lg">
                    <v-card-title class="text-center">
                        <v-icon large>mdi-lock-reset</v-icon>
                        <h2 class="ml-2">Forgot Password</h2>
                    </v-card-title>
                    <v-card-text>
                        <p class="text-center mb-4">
                            Enter your email address below and we'll send you a link to reset your password.
                            If you have any issues, feel free to contact our support team for assistance.
                        </p>
                        <v-form @submit.prevent="sendResetLink" ref="form">
                            <v-text-field label="Email" v-model="email" type="email" required outlined
                                :rules="[emailRules]" prepend-icon="mdi-email" placeholder="Enter your email">
                            </v-text-field>
                            <v-btn type="submit" color="primary" block class="mt-4 rounded-lg" :disabled="loading">
                                <v-icon left>mdi-email-send</v-icon>
                                <span v-if="loading">Sending...</span>
                                <span v-else>Send Password Reset Link</span>
                            </v-btn>
                            <v-alert v-if="message" :type="alertType" class="mt-3 rounded-lg">
                                <v-icon left
                                    :icon="alertType === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'"></v-icon>
                                {{ message }}
                            </v-alert>
                            <v-progress-circular v-if="loading" indeterminate color="primary"
                                class="mt-2"></v-progress-circular>
                        </v-form>
                    </v-card-text>
                </v-card>
                <p class="text-center mt-4" style="font-size: 0.9em; color: gray;">
                    Don't have an Account? <router-link to="/register">Sign up here</router-link>
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
            email: '',
            message: '',
            alertType: 'success',
            emailRules: [
                v => !!v || 'Email is required',
                v => /.+@.+\..+/.test(v) || 'Email must be valid'
            ],
            loading: false // Loading state
        };
    },
    methods: {
        async sendResetLink() {
            this.loading = true; // Set loading to true
            try {
                const response = await axios.post('/password/email', { email: this.email });
                this.message = response.data.message;
                this.alertType = 'success';
            } catch (error) {
                this.message = error.response.data.message || 'An error occurred';
                this.alertType = 'error';
            } finally {
                this.loading = false; // Reset loading state
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

.v-card-title {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding: 16px;
}

.v-alert {
    border-radius: 8px;
    display: flex;
    align-items: center;
}

.text-center {
    text-align: center;
}

@media (max-width: 768px) {
    .background-image {
        margin-right: 0;
        margin-bottom: 20px;
        height: auto;
    }

    .v-card {
        margin-top: 10px;
    }

    .v-card-title h2 {
        font-size: 1.5rem;
    }

    .v-text-field,
    .v-btn {
        font-size: 1rem;
    }
}
</style>
