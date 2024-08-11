<template>
  <div>
    <h1 class="mb-4">Пользователи</h1>
    <div class="d-flex justify-content-end mb-3" v-if="authStore.isAdmin" >
      <RouterLink to="/user/new" class="btn btn-primary">Добавить пользователя</RouterLink>
    </div>

    <!-- Таблица пользователей с индикатором загрузки -->
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th style="width: 30%;">Имя пользователя</th>
            <th style="width: 30%;">Email</th>
            <th style="width: 30%;">Роли</th>
            <th style="width: 10%;"></th>
          </tr>
        </thead>
        <tbody>
          <!-- Индикатор загрузки -->
          <tr v-if="loading">
            <td colspan="4" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Загрузка...</span>
              </div>
            </td>
          </tr>
          <!-- Данные пользователей -->
          <tr v-else v-for="user in users" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.roles.join(', ') }}</td>
            <td>
              <RouterLink :to="`/user/${user.id}`" class="btn btn-sm btn-secondary" v-if="authStore.isAdmin" >Редактировать</RouterLink>
            </td>
          </tr>
          <!-- Сообщение, если нет пользователей -->
          <tr v-if="!loading && users.length === 0">
            <td colspan="4" class="text-center">Нет пользователей </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/axios-api';
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/types/user';
const authStore = useAuthStore();


const users = ref<User[]>([]);
const loading = ref(false);

const fetchUsers = async () => {
  loading.value = true;

  try {
    const response = await api.get('/users');
    users.value = response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.table {
  color: #212529;
}

.table th,
.table td {
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}

.table tbody + tbody {
  border-top: 2px solid #dee2e6;
}

.spinner-border {
  width: 2rem;
  height: 2rem;
  border-width: 0.2em;
}
</style>
