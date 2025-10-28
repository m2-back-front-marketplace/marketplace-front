<template>
  <div>
    <AppNavbar />
    <div class="page-wrapper">
      <RegisterForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '~/components/layout/AppNavbar.vue'
import RegisterForm from '~/components/auth/RegisterForm/index.vue'
</script>

<style scoped>
.page-wrapper{
  min-height:100vh; display:flex; align-items:center; justify-content:center;
  background:rgba(0,0,0,.05); padding:3rem;
}
</style>
