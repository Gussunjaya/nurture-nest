<script setup>
import MainNavbar from './components/layout/MainNavbar.vue'
import MainFooter from './components/layout/MainFooter.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <MainNavbar />
    <main class="flex-1">
      <RouterView />
    </main>
    <MainFooter />
  </div>
</template>
