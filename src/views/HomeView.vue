<script setup>
import PlantWidget from '../components/PlantWidget.vue'
</script>
<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-primary">🌱 Tanamanku</h1>
      <p class="text-gray-500">Rawat setiap hari, lihat dia tumbuh</p>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <PlantWidget />
      </div>
      <!-- Tempat quote akan ditambahkan di sesi berikutnya -->
      <div class="bg-white rounded-2xl shadow-md p-4 h-fit">
        <p class="text-gray-400 text-center">Kutipan inspirasi akan muncul di sini</p>
      </div>
    </div>
  </div>
</template>
