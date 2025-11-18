<template>
  <div class="seller-layout">
    <Sidebar />
    <div class="seller-main">
      <NuxtPage />
    </div>
  </div>
</template>

<script setup>
import Sidebar from "~/components/seller/Sidebar.vue";
</script>

<style scoped>
.seller-layout {
  display: flex;
  min-height: 100vh;
}

.seller-main {
  flex: 1;
  padding: 2rem;
  background: var(--surface-ground);
  overflow-x: auto;
}
</style>
