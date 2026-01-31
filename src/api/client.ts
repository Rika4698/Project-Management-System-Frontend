import axios from 'axios';
import { store } from '../store';
import { logout, setCredentials } from '../store/authSlice';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, 
});

// Request Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        //  not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
           
                const { data } = await api.post('/auth/refresh-token'); 

                // Update local storage and redux
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                store.dispatch(setCredentials({ user, token: data.data.accessToken }));

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                return api(originalRequest);
            } catch (err) {
                store.dispatch(logout());
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
