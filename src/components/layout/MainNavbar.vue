<script setup></script>
<template>
  <nav class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center flex-wrap gap-2">
      <router-link to="/" class="text-2xl font-bold text-primary">🌿 NurtureNest</router-link>
      <div class="flex items-center gap-3 flex-wrap">
        <router-link to="/" class="text-gray-600 hover:text-primary">Home</router-link>
        <router-link to="/profile" class="text-gray-600 hover:text-primary">Profile</router-link>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">guest@example.com</span>
          <span class="bg-gray-100 rounded-full px-2 py-0.5 text-xs">🌿 Free</span>
          <button class="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>
