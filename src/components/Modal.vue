<script setup>
import { setSubscriptionPlan, resetGame } from '@/stores/plant'

const props = defineProps({
  visible: Boolean,
  type: String, // 'subscription' atau 'reset'
  title: String,
  isFromProfile: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

const selectPlan = (plan) => {
  setSubscriptionPlan(plan)
  close()
}

const handleReset = () => {
  if (confirm('Apakah Anda yakin ingin mereset permainan? Semua kemajuan akan hilang.')) {
    resetGame()
    close()
  }
}
</script>
<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="close"
  >
    <div class="bg-white rounded-3xl max-w-lg w-full">
      <div class="p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold text-primary">{{ title }}</h2>
          <button @click="close" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        <!-- Konten untuk Game Over -->
        <div v-if="type === 'gameover'" class="text-center">
          <div class="text-6xl mb-3">💀</div>
          <p class="text-gray-600 mb-4">Tanamanmu telah layu. Mulai lagi?</p>
          <button
            @click="handleReset"
            class="bg-primary text-white px-6 py-2 rounded-full hover:bg-black transition"
          >
            Mulai Lagi
          </button>
        </div>

        <!-- Konten untuk Subscription -->
        <div v-else-if="type === 'subscription'">
          <p class="text-center text-gray-500 mb-6">
            Kamu telah menghabiskan semua aksi gratis! Upgrade ke Premium untuk perawatan tanpa
            batas.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border rounded-xl p-4 text-center">
              <h3 class="text-xl font-bold">🌿 Free</h3>
              <ul class="text-sm text-left mt-3 space-y-1">
                <li>✓ Hanya 3 aksi gratis</li>
                <li>✓ Tanaman dasar (Monstera)</li>
                <li>✓ Statistik & riwayat</li>
              </ul>
              <button
                v-if="isFromProfile"
                @click="selectPlan('free')"
                class="mt-4 w-full border py-1 rounded-full"
              >
                Tetap Free
              </button>
              <button v-else @click="close" class="mt-4 w-full border py-1 rounded-full">
                Tutup
              </button>
            </div>
            <div class="border-2 border-yellow-400 rounded-xl p-4 text-center relative">
              <span class="absolute -top-2 right-2 bg-yellow-400 text-xs px-2 rounded-full"
                >POPULER</span
              >
              <h3 class="text-xl font-bold text-yellow-600">⭐ Premium</h3>
              <ul class="text-sm text-left mt-3 space-y-1">
                <li>✓ Aksi tidak terbatas</li>
                <li>✓ Semua jenis tanaman</li>
                <li>✓ Ganti tanaman kapan saja</li>
              </ul>
              <button
                @click="selectPlan('premium')"
                class="mt-4 w-full bg-primary text-white py-1 rounded-full hover:bg-black transition"
              >
                Upgrade (Gratis)
              </button>
            </div>
          </div>
          <p class="text-center text-gray-400 text-xs mt-4">
            * Ini simulasi, tidak ada pembayaran nyata.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
