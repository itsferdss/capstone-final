import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css';
import axios from "axios";
import '@fortawesome/fontawesome-free/css/all.min.css';


window.axios = axios
axios.defaults.withCredentials = false

// Set base URL dynamically based on environment
// axios.defaults.baseURL = 'https://opticare.fun/api';

axios.defaults.baseURL = 'https://opticare.fun/api';

createApp(App).use(router).use(store).use(vuetify).mount('#app')

