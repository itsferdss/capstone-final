import axios from 'axios';

// Set up the base URL for the API
const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Define your service functions
const getUser = (userId) => {
    return apiClient.get(`/users/${userId}`);
};

const createUser = (userData) => {
    return apiClient.post('/users', userData);
};

const updateUser = (userId, userData) => {
    return apiClient.put(`/users/${userId}`, userData);
};

const deleteUser = (userId) => {
    return apiClient.delete(`/users/${userId}`);
};

// Export the functions to use them in your components
export { getUser, createUser, updateUser, deleteUser };