import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

const HomeView = () =>import('../views/HomeView.vue')
const LoginView = () =>import('../views/LoginView.vue')
const UserView = () =>import('../views/UserView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name:'Login',
      component: LoginView
    },
    {
      path: '/user/:id',
      name:'User',
      component: UserView,
      meta: { requiresAuth: true, admin:true}
    },
  ]
})
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.token) {
    // Если маршрут требует авторизации и токен отсутствует, перенаправляем на страницу логина
    next({ name: 'Login' });
  } else {
    // Если маршрут требует авторизации, но токен есть, проверяем его
    next();
  }
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.admin && !authStore.isAdmin) {
    next('/');
  } else {
    next();
  }
})

export default router
