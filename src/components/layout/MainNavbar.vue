<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../../stores/auth'
import { useRouter } from 'vue-router'
import { state } from '../../stores/plant'
import Modal from '../Modal.vue'

const auth = useAuth()
const router = useRouter()
const userEmail = auth.userEmail.value
const userName = auth.userName // asumsi ada di store
const isLoggedIn = computed(() => auth.isLoggedIn.value)
const subscriptionPlan = computed(() => state.subscriptionPlan)

// State untuk modal profile
const showProfileModal = ref(false)

// State untuk modal subscription (dari dalam modal profile)
const showSubscriptionModal = ref(false)

const openProfileModal = () => {
  showProfileModal.value = true
}

const closeProfileModal = () => {
  showProfileModal.value = false
}

const openSubscriptionModal = () => {
  showSubscriptionModal.value = true
}

const logout = () => {
  auth.logout()
  router.push('/')
  closeProfileModal()
}
</script>

<template>
  <nav class="bg-white shadow-sm sticky top-0 z-40">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center flex-wrap gap-2">
      <RouterLink to="/" class="text-2xl font-bold text-primary">🌿 NurtureNest</RouterLink>
      <div class="flex items-center gap-3 flex-wrap">
        <!-- Profile icon / button (hanya jika login) -->
        <div v-if="isLoggedIn" class="flex items-center gap-2">
          <button
            @click="openProfileModal"
            class="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 transition"
          >
            <span class="text-sm">{{ userEmail }}</span>
            <span class="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >👤</span
            >
          </button>
        </div>
        <div v-else class="text-sm text-gray-400">(Please login)</div>
      </div>
    </div>

    <!-- MODAL PROFILE (popup dengan blur background) -->
    <div
      v-if="showProfileModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click.self="closeProfileModal"
    >
      <!-- Backdrop blur -->
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <!-- Modal content -->
      <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8 z-10">
        <button
          @click="closeProfileModal"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
        >
          &times;
        </button>

        <div class="flex flex-col items-center">
          <div class="bg-gray-100 rounded-full p-4 text-5xl mb-4">👤</div>
          <h2 class="text-xl font-semibold text-primary">{{ userName || 'Pengguna' }}</h2>
          <p class="text-gray-500 text-sm">{{ userEmail }}</p>
          <div class="mt-2">
            <span class="bg-gray-100 rounded-full px-3 py-1 text-sm">
              <span v-if="subscriptionPlan === 'premium'" class="text-yellow-600">⭐ Premium</span>
              <span v-else class="text-gray-500">🌿 Free</span>
            </span>
          </div>
          <div class="w-full mt-6 border-t pt-4">
            <p class="text-sm text-gray-500">Bergabung: Mei 2026</p>
            <button
              @click="openSubscriptionModal"
              class="mt-4 w-full bg-gray-100 text-primary py-2 rounded-full hover:bg-gray-200 transition"
            >
              Kelola Langganan
            </button>
            <button
              @click="logout"
              class="mt-3 w-full bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition"
            >
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal subscription reusable (sama seperti sebelumnya) -->
    <Modal
      :visible="showSubscriptionModal"
      type="subscription"
      title="Langganan"
      :isFromProfile="true"
      @close="showSubscriptionModal = false"
    />
  </nav>
</template>
