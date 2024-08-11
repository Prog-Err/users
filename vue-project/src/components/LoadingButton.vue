<template>
    <button
      :type="type"
      :class="['btn', buttonClass]"
      :disabled="loading || disabled"
      @click="handleClick"
    >
      <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span v-if="loading">{{ loadingText }}</span>
      <span v-else><slot /></span>
    </button>
  </template>
  
  <script setup lang="ts">
  // Определение входных параметров (props)
  const props = defineProps({
    type: {
      type: String as () => 'button' | 'submit' | 'reset',
      default: 'button'
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    buttonClass: {
      type: String,
      default: 'btn-primary'
    },
    loadingText: {
      type: String,
      default: 'Загрузка...'
    }
  });
  
  // Определение событий, которые может излучать компонент
  const emit = defineEmits(['click']);
  
  // Обработчик клика
  const handleClick = (event: Event) => {
    if (!props.loading) {
      emit('click', event);
    }
  };
  </script>
  
  <style scoped>
  .spinner-border {
    margin-right: 5px;
  }
  </style>
  