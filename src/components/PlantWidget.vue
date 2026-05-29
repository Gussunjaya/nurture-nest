<script setup>
import { computed } from 'vue'
import { state, water, giveLight, clean, changePlantType, resetGame } from '../stores/plant'

const stageMap = { seed: 'Bibit', sprout: 'Tunas', mature: 'Dewasa' }
const plantTypeNames = { sawit: 'Sawit', cactus: 'Kaktus', beringin: 'Beringin' }

const plantEmoji = computed(() => {
  if (state.stage === 'seed') return '🌱'
  if (state.stage === 'sprout') return '🪴'
  if (state.stage === 'mature') {
    if (state.plantType === 'sawit') return '🌴'
    if (state.plantType === 'cactus') return '🌵'
    return '🌳'
  }
})

const handleReset = () => {
  if (confirm('Apakah Anda yakin ingin mereset permainan? Semua kemajuan akan hilang.')) {
    resetGame()
  }
}

const stageName = computed(() => stageMap[state.stage] || 'Bibit')
const plantTypeName = computed(() => plantTypeNames[state.plantType] || 'Kaktus')
</script>

<style scoped>
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
  <div class="bg-white rounded-2xl shadow-md p-4 sm:p-6 relative">
    <!-- Tombol reset hanya untuk premium -->
    <button
      v-if="state.subscriptionPlan === 'premium'"
      @click="handleReset"
      class="absolute top-2 right-2 bg-gray-100 hover:bg-red-500 text-gray-600 hover:text-white rounded-full p-2 w-8 h-8 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
      title="Reset Tanaman"
    >
      🔄
    </button>

    <div class="text-center">
      <div class="text-6xl sm:text-7xl md:text-8xl animate-bounce">
        {{ plantEmoji }}
      </div>
      <p class="mt-2 text-gray-500 capitalize text-sm sm:text-base">
        {{ stageName }} • {{ plantTypeName }}
      </p>
    </div>

    <!-- Indikator sisa aksi -->
    <div v-if="state.subscriptionPlan === 'free'" class="text-center mt-2">
      <span class="text-xs sm:text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
        ✨ Sisa aksi gratis: {{ state.freeActionsLeft }} / 3
      </span>
    </div>
    <div v-else class="text-center mt-2">
      <span class="text-xs sm:text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
        ⭐ Premium - Aksi tidak terbatas
      </span>
    </div>

    <!-- Progress bars -->
    <div class="space-y-4 my-6">
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span>💧 Kelembaban</span><span>{{ state.moisture }}%</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-blue-500 rounded-full transition-all duration-500"
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
            class="h-full bg-yellow-400 rounded-full transition-all duration-500"
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
            class="h-full bg-green-500 rounded-full transition-all duration-500"
            :style="{ width: state.cleanliness + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Tombol aksi -->
    <div class="flex flex-col sm:flex-row gap-3 justify-center mt-4">
      <button
        @click="water"
        class="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg font-medium"
      >
        💧 Siram
      </button>
      <button
        @click="giveLight"
        class="w-full sm:w-auto bg-yellow-500 text-white px-5 py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-yellow-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg font-medium"
      >
        ☀️ Cahaya
      </button>
      <button
        @click="clean"
        class="w-full sm:w-auto bg-green-600 text-white px-5 py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-green-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg font-medium"
      >
        🧹 Bersihkan
      </button>
    </div>

    <!-- Pemilih jenis tanaman (premium) -->
    <div v-if="state.subscriptionPlan === 'premium'" class="mt-6 pt-4 border-t">
      <p class="text-sm text-gray-500 mb-2">🌿 Ganti jenis tanaman</p>
      <div class="flex flex-wrap gap-2">
        <button
          @click="changePlantType('sawit')"
          :class="[
            'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
            state.plantType === 'sawit'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
        >
          Sawit
        </button>
        <button
          @click="changePlantType('cactus')"
          :class="[
            'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
            state.plantType === 'cactus'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
        >
          Kaktus
        </button>
        <button
          @click="changePlantType('beringin')"
          :class="[
            'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
            state.plantType === 'beringin'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
        >
          Beringin
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
          class="text-sm border-b border-gray-100 py-1 flex justify-between flex-wrap gap-1"
        >
          <span>{{ item.action }}</span>
          <span class="text-gray-400 text-xs">{{ item.time }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
