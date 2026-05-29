<script setup>
import { ref } from 'vue'
import axios from 'axios'
import PlantWidget from '../components/PlantWidget.vue'

const quote = ref({ content: 'Setiap tanaman memiliki cerita.', author: 'Pria Solo' })
const status = ref('idle')
const errorMessage = ref('')

const fallbackQuotes = [
  { content: 'Setiap tanaman memiliki cerita.', author: 'Pria Solo' },
  { content: 'Tapi disini saya akan katakan saya akan tanam.', author: 'Si Petani Handal' },
]
let fallbackIndex = 0

const fetchFromAPI = async () => {
  const response = await axios.get('/api/quote')
  if (response.data && response.data[0]) {
    return { content: response.data[0].q, author: response.data[0].a }
  }
  throw new Error('Invalid response')
}

const fetchQuoteWithRetry = async () => {
  if (status.value === 'loading') return

  status.value = 'loading'
  errorMessage.value = ''

  try {
    const result = await fetchFromAPI()
    quote.value = result
    fallbackIndex = 0
    status.value = 'success'
  } catch (err) {
    errorMessage.value = '❌ Gagal mengambil quotes dari perpustakaan negara'
    status.value = 'error'

    await new Promise((resolve) => setTimeout(resolve, 2000))

    quote.value = fallbackQuotes[fallbackIndex]
    fallbackIndex = (fallbackIndex + 1) % fallbackQuotes.length
    status.value = 'success'
    errorMessage.value = ''
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
    <div class="text-center mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-green-700">🌱 Tanamanku</h1>
      <p class="text-gray-500 text-sm sm:text-base">Rawat setiap hari, lihat dia tumbuh</p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <PlantWidget />
      </div>
      <!-- Kartu kutipan -->
      <div class="bg-white rounded-2xl shadow-md p-4 h-fit">
        <div class="flex justify-between items-center mb-2">
          <h3 class="font-semibold text-gray-700">📖 Inspirasi Alam</h3>
          <button
            @click="fetchQuoteWithRetry"
            class="text-gray-400 hover:text-green-600 transition-all duration-200 hover:scale-110 focus:outline-none"
            :disabled="status === 'loading'"
          >
            <span v-if="status !== 'loading'">🔄</span>
            <span v-else class="inline-block animate-spin">⏳</span>
          </button>
        </div>

        <div v-if="status === 'loading'" class="flex justify-center py-4">
          <div
            class="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"
          ></div>
        </div>
        <div v-else-if="status === 'error'" class="py-2">
          <div class="text-red-600 bg-red-50 rounded p-2 text-center text-sm">
            {{ errorMessage }}
          </div>
        </div>
        <div v-else-if="status === 'success'">
          <p class="text-gray-600 italic text-sm">"{{ quote.content }}"</p>
          <p class="text-right text-xs text-gray-400 mt-2">— {{ quote.author }}</p>
        </div>
        <div v-else>
          <p class="text-gray-600 italic text-sm">"{{ quote.content }}"</p>
          <p class="text-right text-xs text-gray-400 mt-2">— {{ quote.author }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
