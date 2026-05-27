<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuth()
const router = useRouter()
const userEmail = auth.userEmail.value
const isLoggedIn = computed(() => auth.isLoggedIn.value)

const logout = () => {
  auth.logout()
  router.push('/')
}
</script>
<template>
  <nav class="bg-white shadow-sm sticky top-0 z-40">
    <!-- z-40 lebih rendah dari modal (z-50) -->
    <div class="container mx-auto px-4 py-3 flex justify-between items-center flex-wrap gap-2">
      <RouterLink to="/" class="text-2xl font-bold text-primary">🌿 NurtureNest</RouterLink>
      <div class="flex items-center gap-3 flex-wrap">
        <RouterLink to="/" class="text-gray-600 hover:text-primary">Home</RouterLink>
        <RouterLink to="/profile" class="text-gray-600 hover:text-primary">Profile</RouterLink>
        <div v-if="isLoggedIn" class="flex items-center gap-2">
          <span class="text-sm text-gray-500">{{ userEmail }}</span>
          <span class="bg-gray-100 rounded-full px-2 py-0.5 text-xs">🌿 Free</span>
          <button @click="logout" class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
            Logout
          </button>
        </div>
        <div v-else class="text-sm text-gray-400">(Please login)</div>
      </div>
    </div>
  </nav>
</template>
