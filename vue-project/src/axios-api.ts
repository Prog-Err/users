import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const store = useAuthStore()

// Создаем экземпляр Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL+'/api', // Базовый URL API
});

// Добавляем перехватчик ответа
api.interceptors.response.use(
  response => response, // Возвращаем ответ, если он успешный
  error => {
    if (error.response && error.response.status === 401) {
      // Если пришел ответ с кодом 401, то logout
      store.logout();
    }
    return Promise.reject(error);
  }
);

export default api;
