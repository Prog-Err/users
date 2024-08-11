import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios';
import { useAuthStore } from './stores/auth';

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Настройка Axios
const authStore = useAuthStore();

// Функция для обновления заголовков по умолчанию
const updateAxiosHeaders = () => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;
};

// Обновление заголовков при каждом изменении токена
authStore.$subscribe(() => {
  updateAxiosHeaders();
});

// Обновление заголовков при загрузке приложения
updateAxiosHeaders();

app.mount('#app')
