<template>
  <div>
    <AppNavbar />
    <div class="page-wrapper">
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '~/components/layout/AppNavbar/index.vue'
import LoginForm from '~/components/auth/LoginForm/index.vue'
</script>

<style scoped>
.page-wrapper{
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background:rgba(0,0,0,.05);
  padding:3rem;
}
</style>
