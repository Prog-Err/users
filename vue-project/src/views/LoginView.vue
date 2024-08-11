<template>
  <div class="d-flex justify-content-center">
    <div class="card p-4" style="width: 500px;">
      <h1 class="text-left mb-4">Авторизация</h1>
      <div>
        <div class="mb-3">
          <label for="username" class="form-label">Пользователь</label>
          <input type="text" id="username" v-model="form.username" :class="{ 'is-invalid': $v.username.$error }"
            class="form-control" placeholder="Введите ваше имя пользователя" />
          <div v-if="$v.username.$error" class="invalid-feedback">
            <div v-if="$v.username.required && form.username.length == 0">Имя пользователя обязательно.</div>
            <div v-if="$v.username.minLength && form.username.length < 3">Имя пользователя должно содержать не менее 3
              символов.</div>
          </div>
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Пароль</label>
          <input type="password" id="password" v-model="form.password" :class="{ 'is-invalid': $v.password.$error }"
            class="form-control" placeholder="Введите свой пароль" />
          <div v-if="$v.password.$error" class="invalid-feedback">
            <div v-if="$v.password.required && form.password.length == 0">Пароль обязателен.</div>
            <div v-if="$v.password.minLength && form.password.length < 4">Пароль должен содержать не менее 4 символов.
            </div>
          </div>
          <div v-if="loginError" class="text-danger mt-2">
            {{ loginError }}
          </div>
        </div>

        <LoadingButton  :loading="loading" button-class="btn-primary w-100" loading-text="Вход..." @click="login()">
          Вход
        </LoadingButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import useVuelidate from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import LoadingButton from "@/components/LoadingButton.vue";

// Инициализация формы
const form = ref({
  username: '',
  password: '',
});

// Определение правил валидации для полей формы
const rules = {
  username: { required, minLength: minLength(3) },
  password: { required, minLength: minLength(4) },
};

// Инициализация валидации
const $v = useVuelidate(rules, form);

const authStore = useAuthStore();
const router = useRouter();
const loginError = ref('');
const loading = ref(false);
const login = async () => {
  $v.value.$touch(); // Отметить все поля как "тронутые" для отображения ошибок валидации
  if ($v.value.$invalid) return;
  loginError.value = ''
  loading.value = true;
  try {
    const success = await authStore.login(form.value.username, form.value.password);
    if (success) {
      router.push({ name: 'Home' });
    }
  } catch (error) {
    loginError.value = 'Неверное имя пользователя или пароль';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped></style>
