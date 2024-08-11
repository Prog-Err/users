<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" to="/">Home</RouterLink>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item" v-if="authStore.isAdmin" >
              <RouterLink  class="nav-link" to="/user/new">Новый пользователь</RouterLink>
            </li>
          </ul>
          <div class="row align-items-center col-auto " v-if="authStore.user">
            <div class="col-auto pe-1 d-flex align-items-center"> <img src='@/assets/user.png'  width="16" height="16" /></div>
            <div class="col-auto ps-1 text-h6 ">{{ authStore.user.username }}</div>
            <div class="col-auto ps-0 me-2 text-primary " v-if="authStore.user.roles.length > 0">{{ authStore.user.roles.join(', ') }}</div>
          </div>
          <button class="btn btn-danger" @click="handleLogout">Выйти</button>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup lang="ts">
  import { RouterLink } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  
  const authStore = useAuthStore();
  

  const handleLogout = () => {
    authStore.logout();
  };
  </script>
  
  <style scoped>
  /* Дополнительные стили */
  </style>
  