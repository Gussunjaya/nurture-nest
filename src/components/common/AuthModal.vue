<script setup>
import { ref } from 'vue'
import { useAuth } from '@/stores/auth'

const props = defineProps({
  visible: Boolean,
})
const emit = defineEmits(['close'])

const auth = useAuth()

// Mode: true = login, false = register
const isLoginMode = ref(true)

// Form data
const loginEmail = ref('')
const loginPassword = ref('')
const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')
const registerConfirmPassword = ref('')

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  // Reset form
  loginEmail.value = ''
  loginPassword.value = ''
  registerName.value = ''
  registerEmail.value = ''
  registerPassword.value = ''
  registerConfirmPassword.value = ''
}

const handleLogin = () => {
  if (auth.login(loginEmail.value, loginPassword.value)) {
    // requestPermission()
    emit('close')
  } else {
    alert('Akun tidak ditemukan atau password salah')
  }
}

const handleRegister = () => {
  if (registerPassword.value !== registerConfirmPassword.value) {
    alert('Passwords do not match')
    return
  }
  if (auth.register(registerName.value, registerEmail.value, registerPassword.value)) {
    // requestPermission()
    emit('close')
  } else {
    alert('Email sudah terdaftar atau data tidak lengkap')
  }
}

// Tutup modal jika klik overlay
const close = () => {
  emit('close')
}
</script>
<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center p-4"
    style="background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px)"
  >
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8">
      <header class="text-center mb-6">
        <div class="text-5xl mb-2">{{ isLoginMode ? '🌿' : '🌱' }}</div>
        <h2 class="text-2xl font-semibold text-primary">
          {{ isLoginMode ? 'Welcome Back' : 'Create Account' }}
        </h2>
        <p class="text-gray-400 text-sm mt-1">
          {{ isLoginMode ? 'Sign in to continue' : 'Start caring for your virtual plant' }}
        </p>
      </header>

      <!-- Form Login -->
      <form v-if="isLoginMode" @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-600 text-sm mb-1">Email</label>
          <input
            v-model="loginEmail"
            type="email"
            class="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            placeholder="you@example.com"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-600 text-sm mb-1">Password</label>
          <input
            v-model="loginPassword"
            type="password"
            class="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            placeholder="any password"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-primary text-white font-semibold py-3 rounded-xl shadow-md hover:bg-secondary hover:shadow-lg transition duration-200"
        >
          Sign In
        </button>
      </form>

      <!-- Form Register -->
      <form v-else @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-gray-600 text-sm mb-1">Full Name</label>
          <input
            v-model="registerName"
            type="text"
            class="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-600 text-sm mb-1">Email</label>
          <input
            v-model="registerEmail"
            type="email"
            class="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-600 text-sm mb-1">Password</label>
          <input
            v-model="registerPassword"
            type="password"
            class="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-600 text-sm mb-1">Confirm Password</label>
          <input
            v-model="registerConfirmPassword"
            type="password"
            class="w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-primary text-white font-semibold py-3 rounded-xl shadow-md hover:bg-secondary hover:shadow-lg transition duration-200"
        >
          Sign Up
        </button>
      </form>

      <footer class="text-center mt-6">
        <button
          @click="toggleMode"
          class="text-primary text-sm hover:underline focus:outline-none transition"
        >
          {{ isLoginMode ? "Don't have an account? Sign up" : 'Already have an account? Sign in' }}
        </button>
        <p class="text-gray-300 text-xs mt-4">* Dummy: any email & password works</p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* Memastikan warna teks pada button submit terlihat jelas */
button[type='submit'] {
  color: black !important;
  font-weight: 600;
  letter-spacing: 0.5px;
}

button[type='submit']:hover {
  color: black !important;
}

button[type='submit']:focus {
  color: black !important;
}

/* Pastikan teks toggle button juga terlihat */
.text-primary {
  color: #2d6a4f !important;
}
</style>
