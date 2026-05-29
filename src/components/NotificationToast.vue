<script setup>
import { useNotification } from '../composables/useNotification'
const { toasts } = useNotification()
</script>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
</style>

<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg max-w-xs animate-slide-in text-sm"
    >
      <strong>{{ toast.title }}</strong
      ><br />{{ toast.body }}
    </div>
  </div>
</template>
