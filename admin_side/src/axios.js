import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://26.135.189.53:8000',
});

export default instance;