<template>
  <div class="container mt-4">
    <h1>{{ isEditMode ? "Редактирование пользователя" : "Добавление пользователя" }}</h1>
    <div>
      <div class="mb-3">
        <input
          v-model="user.username"
          type="text"
          class="form-control"
          placeholder="Имя пользователя"
          :class="{ 'is-invalid': $v.user.username.$error }"
          :disabled="loading"
        />
        <div v-if="$v.user.username.$error" class="invalid-feedback">
          Имя пользователя обязательно и должно содержать минимум 3 символа.
        </div>
      </div>
      <div class="mb-3">
        <input
          v-model="user.email"
          type="email"
          class="form-control"
          placeholder="Email"
          :class="{ 'is-invalid': $v.user.email.$error }"
          :disabled="loading"
        />
        <div v-if="$v.user.email.$error" class="invalid-feedback">
          Email обязателен и должен быть в правильном формате.
        </div>
      </div>
      <div class="mb-3">
        <input
          v-model="user.password"
          type="password"
          class="form-control"
          placeholder="Пароль"
          :class="{ 'is-invalid': $v.user.password.$error }"
          :disabled="loading"
        />
        <div v-if="$v.user.password.$error" class="invalid-feedback">
          Пароль обязателен и должен содержать минимум 4 символа.
        </div>
      </div>
      <div class="mb-3">
        <label>Роли:</label>
        <div v-for="role in availableRoles" :key="role" class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            :value="role"
            v-model="user.roles"
            :disabled="loading"
          />
          <label class="form-check-label">{{ role }}</label>
        </div>
        <div v-if="$v.user.roles.$error" class="text-danger">
          Должна быть выбрана как минимум одна роль.
        </div>
      </div>
      <LoadingButton
        :loading="loading"
        button-class="btn-primary"
        :loading-text="loadingText"
        @click="saveUser()"
      >
        {{ isEditMode ? "Обновить пользователя" : "Добавить пользователя" }}
      </LoadingButton>
      <LoadingButton
        v-if="isEditMode"
        :loading="loading"
        button-class="btn-danger ms-2"
        loading-text="Удалить пользователя"
        @click="deleteUser()"
      >
        Удалить пользователя
      </LoadingButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/axios-api";
import useVuelidate from "@vuelidate/core";
import { required, minLength, email } from "@vuelidate/validators";
import type { User } from "@/types/user";
import LoadingButton from "@/components/LoadingButton.vue"; 

const route = useRoute();
const router = useRouter();
const loading = ref(false); 
const loadingText = ref(""); 

const availableRoles = ref(["ROLE_ADMIN", "ROLE_USER"]);
// Оборачиваем данные пользователя в объект user
const user = ref<User>({ id: 0, username: "", email: "", password: "", roles: [] });
const isEditMode = computed(() => route.params.id !== "new");

// Определение правил валидации
const rules = {
  user: {
    username: { required, minLength: minLength(3) },
    email: { required, email },
    password: !isEditMode.value ? { required, minLength: minLength(4) } : {},
    roles:{required}
  },
};

// Инициализация валидации
const $v = useVuelidate(rules, { user: user });

const fetchUser = async (id: number) => {
  loading.value = true; 
  loadingText.value='Загрузка...'
  try {
    const response = await api.get(`/users/${id}`);
    if(response.data){
      user.value = response.data;
      $v.value.$reset();
    }else{
      throw new Error(response.data.error || 'Не удалось загрузить пользователя')
    }
    
  } catch (error) {
    console.error("Не удалось загрузить пользователя:", error);
  } finally {
    loading.value = false; 
  }
};

const saveUser = async () => {
  $v.value.$touch(); // Отметить все поля как "тронутые" для отображения ошибок
  if ($v.value.$invalid) return;

  loading.value = true; 
  loadingText.value='Сохранение...'

  try {
    if (isEditMode.value) {
      await api.put(`/users/${route.params.id}`, user.value);
    } else {
      const res = await api.post(`/users`, user.value);
      if (res.data) {
        router.push(`/user/${res.data}`)
      }else{
        throw new Error(res.data.error || 'Не удалось сохранить пользователя')
      }
    }
  } catch (error) {
    console.error("Не удалось сохранить пользователя:", error);
  } finally {
    loading.value = false;
  }
};

const deleteUser = async () => {
  loading.value = true; 
  try {
    const res =await api.delete(`/users/${route.params.id}`);
    if(res.data.status)
      router.push("/");
  } catch (error) {
    console.error("Не удалось удалить пользователя:", error);
  } finally {
    loading.value = false; 
  }
};

// Срабатывает при монтировании компонента
onMounted(() => {
  if (isEditMode.value && route.params.id) {
    fetchUser(Number(route.params.id));
  }
});

// Срабатывает при изменении маршрута (смене ID)
watch(
  () => route.params.id,
  (newId) => {
    if (isEditMode.value && newId) {
      fetchUser(Number(newId));
    }else{
      user.value= {
        username:'',
        password:'',
        roles:[],
        email:'',
        id:0
      }
    }
  }
);
</script>
