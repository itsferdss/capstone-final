import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify'; // Make sure vuetify is properly set up in this file
import 'vuetify/styles';  // Import Vuetify styles
import axios from "axios";
import fontAwesomeApp from './fontAwesome.js';

window.axios = axios;
axios.defaults.withCredentials = false;

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';  // Adjust if needed

const app = createApp(App);

// Use Vuetify, router, store, and FontAwesome
app.use(router)
    .use(store)
    .use(vuetify)  // Ensure Vuetify plugin is used correctly
    .component('font-awesome-icon', fontAwesomeApp.component('font-awesome-icon'))
    .mount('#app');
