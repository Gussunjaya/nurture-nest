<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import MainNavbar from './components/layout/MainNavbar.vue'
import MainFooter from './components/layout/MainFooter.vue'
import { useAuth } from './stores/auth'
import NotificationToast from './components/NotificationToast.vue'
import Modal from './components/Modal.vue'
import { useRouter } from 'vue-router'
import AuthModal from './components/common/AuthModal.vue'
import { RouterView } from 'vue-router'
import { state } from './stores/plant'

const auth = useAuth()
const router = useRouter()

const isLoggedIn = computed(() => auth.isLoggedIn.value)
const onAuthSuccess = () => {
  router.push('/')
}

const showGameOverModal = ref(false)
const showSubscriptionModal = ref(false)

watch(
  () => state.isGameOver,
  (val) => {
    if (val) showGameOverModal.value = true
  },
)

const handleShowSubscription = () => {
  showSubscriptionModal.value = true
}
const handleGameOver = () => {
  console.log('Gameover muncul')
  showGameOverModal.value = true
}

onMounted(() => {
  const activePlant = state.plants[state.currentPlantType]
  if (activePlant && activePlant.isGameOver) {
    showGameOverModal.value = true
  }
  window.addEventListener('show-subscription-modal', handleShowSubscription)
  window.addEventListener('show-gameover-modal', handleGameOver)
})

onUnmounted(() => {
  window.removeEventListener('show-subscription-modal', handleShowSubscription)
  window.removeEventListener('show-gameover-modal', handleGameOver)
})
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <AuthModal :visible="!isLoggedIn" @close="onAuthSuccess" />
    <!-- Navbar dan Footer hanya tampil jika bukan halaman login/register -->
    <MainNavbar v-if="isLoggedIn" />
    <NotificationToast />
    <Modal
      :visible="showGameOverModal"
      type="gameover"
      title="Game Over"
      @close="showGameOverModal = false"
    />
    <Modal
      :visible="showSubscriptionModal"
      type="subscription"
      title="Upgrade ke Premium"
      @close="showSubscriptionModal = false"
    />
    <main class="flex-1">
      <RouterView />
    </main>
    <MainFooter />
  </div>
</template>
