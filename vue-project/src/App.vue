<script setup lang="ts">
import { RouterView } from 'vue-router';
import Navbar from '@/components/Navbar.vue';

</script>

<template>
  <header>
    <Navbar/>
  </header>

  <div class="container mt-4">
    <RouterView />
  </div>
</template>

<style scoped>
/* Добавьте стили по желанию */
</style>
