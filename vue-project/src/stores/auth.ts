import { defineStore } from 'pinia';
import axios from 'axios';
import type { User } from '@/types/authUser'; // Импортируйте тип
 // Импортируйте тип
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('User')as string) as User | null, 
  }),
  getters: {
    isAdmin(state) {
      // Проверка наличия роли ROLE_ADMIN
      return state.user?.roles.includes('ROLE_ADMIN') || false;
    },
  },
  actions: {
    async login(username: string, password: string): Promise<boolean> {
      try {
        // Отправка POST запроса на сервер для аутентификации
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, { username, password });
    
        // Проверка наличия токена в ответе
        if (response.data && response.data.token) {
          this.token = response.data.token;
    
          // Сохранение токена в localStorage
          localStorage.setItem('token', this.token);
    
          const arr_rt = this.token.split('.');
          const decodedToken = JSON.parse(atob(arr_rt[1]))
          this.user={
            username:decodedToken.username,
            roles:decodedToken.roles
          }
          localStorage.setItem('User', JSON.stringify(this.user));

          // Успешный вход
          return true;
        } else {
          // Токен отсутствует в ответе
          throw new Error(response.data.error || 'Failed to login');

        }
      } catch (error) {
        // Обработка ошибок при запросе
        console.error('Failed to login:', error);
        throw error;
      }
    },
    async logout() {
      this.token = '';
      this.user = null  ;
      localStorage.removeItem('token');
      localStorage.removeItem('User');
      axios.defaults.headers.common['Authorization'] = ''; // Удалить заголовок авторизации
      window.location.href = '/login';
    },
    
  },
});
