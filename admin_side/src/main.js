
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'vuetify/dist/vuetify.min.css';
import axios from "axios";
import fontAwesomeApp from './fontAwesome.js';

window.axios = axios;
axios.defaults.withCredentials = false;

// Set base URL dynamically based on environment
let backendUrl = "http://" + window.location.hostname.toString() + ":8000/api";
axios.defaults.baseURL = backendUrl;

const app = createApp(App);
app.use(router).use(store).use(vuetify).component('font-awesome-icon', fontAwesomeApp.component('font-awesome-icon')).mount('#app');