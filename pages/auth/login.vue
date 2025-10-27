<template>
  <div>
    <AppNavbar />
    <div class="page-wrapper">
      <div class="form-card">
        <h2 class="form-title">Connexion</h2>

        <div class="input-group">
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-user" />
            </InputGroupAddon>
            <InputText v-model="email" placeholder="Email" />
          </InputGroup>
        </div>

        <div class="input-group">
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-lock" />
            </InputGroupAddon>
            <InputText v-model="password" placeholder="Mot de passe" type="password" />
          </InputGroup>
        </div>

        <Button class="button" label="Connexion" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '~/components/layout/AppNavbar.vue'
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