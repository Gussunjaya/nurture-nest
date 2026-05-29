<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { state, water, giveLight, clean, changePlantType, resetGame } from '../stores/plant'

const stageMap = { seed: 'Bibit', sprout: 'Tunas', mature: 'Dewasa' }
const plantTypeNames = { sawit: 'Sawit', cactus: 'Kaktus', beringin: 'Beringin' }

// Tanaman aktif
const activePlant = computed(() => state.plants[state.currentPlantType])

// Emoji berdasarkan stage dan jenis tanaman
const plantEmoji = computed(() => {
  const stage = activePlant.value.stage
  const type = state.currentPlantType
  if (stage === 'seed') return '🌱'
  if (stage === 'sprout') return '🪴'
  if (stage === 'mature') {
    if (type === 'sawit') return '🌴'
    if (type === 'cactus') return '🌵'
    return '🌳'
  }
  return '🌱'
})

// Cooldown reset
const cooldownRemaining = ref(0)
let cooldownInterval = null

const isResetCooldown = computed(() => {
  return state.resetCooldownUntil && Date.now() < state.resetCooldownUntil
})

const updateCooldown = () => {
  if (state.resetCooldownUntil && Date.now() < state.resetCooldownUntil) {
    cooldownRemaining.value = Math.ceil((state.resetCooldownUntil - Date.now()) / 1000)
  } else {
    cooldownRemaining.value = 0
    if (cooldownInterval) {
      clearInterval(cooldownInterval)
      cooldownInterval = null
    }

    if (state.resetCooldownUntil && Date.now() >= state.resetCooldownUntil) {
      state.resetCooldownUntil = null
      state.resetCount = 0
    }
  }
}

onMounted(() => {
  updateCooldown()
  if (isResetCooldown.value) {
    cooldownInterval = setInterval(updateCooldown, 1000)
  }
})

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval)
})

watch(
  () => state.resetCooldownUntil,
  () => {
    updateCooldown()
    if (isResetCooldown.value && !cooldownInterval) {
      cooldownInterval = setInterval(updateCooldown, 1000)
    } else if (!isResetCooldown.value && cooldownInterval) {
      clearInterval(cooldownInterval)
      cooldownInterval = null
    }
  },
)

const handleReset = () => {
  if (isResetCooldown.value) return
  if (confirm('Yakin ingin mereset tanaman ini? Semua kemajuan untuk tanaman ini akan hilang.')) {
    resetGame()
  }
}

const stageName = computed(() => stageMap[activePlant.value.stage] || 'Bibit')
const plantTypeName = computed(() => plantTypeNames[state.currentPlantType] || 'Tanaman')
</script>

<style scoped>
/* Scrollbar untuk riwayat perawatan */
.history-scroll {
  max-height: 180px;
  overflow-y: auto;
  scrollbar-width: bold;
}
.history-scroll::-webkit-scrollbar {
  width: 4px;
}
.history-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.history-scroll::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}
.history-scroll::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Animasi bounce */
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

/* Efek tooltip mouse */
.cursor-not-allowed {
  cursor: not-allowed;
}
</style>

<template>
  <div class="bg-white rounded-2xl shadow-md p-4 sm:p-6 relative">
    <!-- Tombol reset (hanya premium) -->
    <button
      v-if="state.subscriptionPlan === 'premium'"
      @click="handleReset"
      :disabled="isResetCooldown"
      :class="[
        'absolute top-2 right-2 rounded-full p-2 w-8 h-8 flex items-center justify-center transition-all duration-200',
        isResetCooldown
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-gray-100 hover:bg-red-500 text-gray-600 hover:text-white hover:scale-105 active:scale-95',
      ]"
      :title="
        isResetCooldown ? `Sabar ya bos ${cooldownRemaining} detik lagi` : 'Reset tanaman ini'
      "
    >
      🔄
    </button>

    <!-- Indikator cooldown di samping tombol -->
    <div
      v-if="isResetCooldown && state.subscriptionPlan === 'premium'"
      class="absolute top-2 right-12 text-xs text-red-500 font-medium"
    >
      ⏱️ {{ cooldownRemaining }}s
    </div>

    <!-- Area tanaman -->
    <div class="text-center">
      <div class="text-6xl sm:text-7xl md:text-8xl animate-bounce">
        {{ plantEmoji }}
      </div>
      <p class="mt-2 text-gray-500 capitalize text-sm sm:text-base">
        {{ stageName }} • {{ plantTypeName }}
      </p>
    </div>

    <!-- Status langganan dan sisa aksi -->
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
          <span>💧 Kelembaban</span><span>{{ activePlant.moisture }}%</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-blue-500 rounded-full transition-all duration-500"
            :style="{ width: activePlant.moisture + '%' }"
          ></div>
        </div>
      </div>
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span>☀️ Cahaya</span><span>{{ activePlant.light }}%</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-yellow-400 rounded-full transition-all duration-500"
            :style="{ width: activePlant.light + '%' }"
          ></div>
        </div>
      </div>
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span>🧹 Kebersihan</span><span>{{ activePlant.cleanliness }}%</span>
        </div>
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-green-500 rounded-full transition-all duration-500"
            :style="{ width: activePlant.cleanliness + '%' }"
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

    <!-- Pemilih jenis tanaman (hanya premium) -->
    <div v-if="state.subscriptionPlan === 'premium'" class="mt-6 pt-4 border-t">
      <p class="text-sm text-gray-500 mb-2">🌿 Ganti jenis tanaman</p>
      <div class="flex flex-wrap gap-2">
        <button
          @click="changePlantType('sawit')"
          :class="[
            'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
            state.currentPlantType === 'sawit'
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
            state.currentPlantType === 'cactus'
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
            state.currentPlantType === 'beringin'
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

    <!-- Riwayat perawatan dengan scrollbar tipis -->
    <div class="mt-6 pt-4 border-t">
      <h3 class="font-semibold text-gray-700 mb-2">📜 Riwayat Perawatan</h3>
      <div v-if="activePlant.history.length === 0" class="text-gray-400 text-sm text-center py-2">
        Belum ada riwayat
      </div>
      <ul class="history-scroll space-y-1 pr-1">
        <li
          v-for="(item, idx) in activePlant.history"
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
