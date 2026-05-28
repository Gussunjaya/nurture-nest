<script setup>
import { ref, computed } from 'vue'
import MainNavbar from './components/layout/MainNavbar.vue'
import MainFooter from './components/layout/MainFooter.vue'
import { useAuth } from './stores/auth'
import NotificationToast from './components/NotificationToast.vue'
import { useRouter } from 'vue-router'
import AuthModal from './components/common/AuthModal.vue'
import { RouterView } from 'vue-router'

const auth = useAuth()
const router = useRouter()

const isLoggedIn = computed(() => auth.isLoggedIn.value)
const onAuthSuccess = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <AuthModal :visible="!isLoggedIn" @close="onAuthSuccess" />
    <NotificationToast />
    <!-- Navbar dan Footer hanya tampil jika bukan halaman login/register -->
    <MainNavbar v-if="isLoggedIn" />
    <main class="flex-1">
      <RouterView />
    </main>
    <MainFooter />
  </div>
</template>
