<script setup>
import { computed } from 'vue'
import { state, water, giveLight, clean, changePlantType } from '../stores/plant'

// Mapping stage ke nama dan jenis tanaman
const stageMap = { seed: 'Bibit', sprout: 'Tunas', mature: 'Dewasa', flowering: 'Berbunga' }
const plantTypeNames = { monstera: 'Monstera', cactus: 'Kaktus', lavender: 'Lavender' }

// Emoji berdasarkan stage dan jenis tanaman
const plantEmoji = computed(() => {
  if (state.stage === 'seed') return '🌱'
  if (state.stage === 'sprout') return '🌿'
  if (state.stage === 'mature') return state.plantType === 'cactus' ? '🌵' : '🌳'
  return '🌸'
})

const stageName = computed(() => stageMap[state.stage] || 'Bibit')
const plantTypeName = computed(() => plantTypeNames[state.plantType] || 'Monstera')
</script>

<style scoped>
/* Animasi bounce lembut untuk avatar */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
.animate-bounce {
  animation: bounce 2s infinite;
}
</style>
<template>
  <div class="bg-white rounded-2xl shadow-md p-6">
    <!-- Avatar tanaman dengan animasi bounce -->
    <div class="text-center">
      <div class="text-7xl md:text-8xl animate-bounce">
        {{ plantEmoji }}
      </div>
      <p class="mt-2 text-gray-500 capitalize">{{ stageName }} • {{ plantTypeName }}</p>
    </div>

    <!-- Indikator sisa aksi untuk user free -->
    <div v-if="state.subscriptionPlan === 'free'" class="text-center mt-2">
      <span class="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
        ✨ Sisa aksi gratis: {{ state.freeActionsLeft }} / 3
      </span>
    </div>
    <div v-else class="text-center mt-2">
      <span class="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
        ⭐ Premium - Aksi tidak terbatas
      </span>
    </div>

    <!-- Tiga progress bar -->
    <div class="space-y-4 my-6">
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span>💧 Kelembaban</span><span>{{ state.moisture }}%</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-blue-500 rounded-full"
            :style="{ width: state.moisture + '%' }"
          ></div>
        </div>
      </div>
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span>☀️ Cahaya</span><span>{{ state.light }}%</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-yellow-400 rounded-full"
            :style="{ width: state.light + '%' }"
          ></div>
        </div>
      </div>
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span>🧹 Kebersihan</span><span>{{ state.cleanliness }}%</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-green-500 rounded-full"
            :style="{ width: state.cleanliness + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Tombol aksi (responsive: full-width di mobile) -->
    <div class="flex flex-col sm:flex-row gap-3 justify-center mt-4">
      <button
        @click="water"
        class="w-full sm:w-auto bg-primary text-white px-5 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-secondary transition"
      >
        💧 Siram
      </button>
      <button
        @click="giveLight"
        class="w-full sm:w-auto bg-primary text-white px-5 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-secondary transition"
      >
        ☀️ Cahaya
      </button>
      <button
        @click="clean"
        class="w-full sm:w-auto bg-primary text-white px-5 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-secondary transition"
      >
        🧹 Bersihkan
      </button>
    </div>

    <!-- Pemilih jenis tanaman (hanya untuk premium) -->
    <div v-if="state.subscriptionPlan === 'premium'" class="mt-6 pt-4 border-t">
      <p class="text-sm text-gray-500 mb-2">🌿 Ganti jenis tanaman</p>
      <div class="flex gap-2 flex-wrap">
        <button
          @click="changePlantType('monstera')"
          :class="[
            'px-3 py-1 rounded-full text-sm',
            state.plantType === 'monstera' ? 'bg-primary text-white' : 'bg-gray-100',
          ]"
        >
          Monstera
        </button>
        <button
          @click="changePlantType('cactus')"
          :class="[
            'px-3 py-1 rounded-full text-sm',
            state.plantType === 'cactus' ? 'bg-primary text-white' : 'bg-gray-100',
          ]"
        >
          Kaktus
        </button>
        <button
          @click="changePlantType('lavender')"
          :class="[
            'px-3 py-1 rounded-full text-sm',
            state.plantType === 'lavender' ? 'bg-primary text-white' : 'bg-gray-100',
          ]"
        >
          Lavender
        </button>
      </div>
    </div>
    <div v-else class="mt-6 pt-4 border-t text-center text-sm text-gray-400">
      🔒 Upgrade ke Premium untuk mengganti jenis tanaman
    </div>

    <!-- Riwayat perawatan -->
    <div class="mt-6 pt-4 border-t">
      <h3 class="font-semibold text-gray-700 mb-2">📜 Riwayat Perawatan</h3>
      <div v-if="state.history.length === 0" class="text-gray-400 text-sm text-center py-2">
        Belum ada riwayat
      </div>
      <ul class="space-y-1 max-h-48 overflow-y-auto">
        <li
          v-for="(item, idx) in state.history"
          :key="idx"
          class="text-sm border-b border-gray-100 py-1 flex justify-between"
        >
          <span>{{ item.action }}</span>
          <span class="text-gray-400 text-xs">{{ item.time }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
