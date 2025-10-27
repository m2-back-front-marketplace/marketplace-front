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
        <p class="hint">
          Vous n'avez pas de compte ?
          <NuxtLink to="/auth/register">S’inscrire</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppNavbar from '~/components/layout/AppNavbar.vue'

const email = ref('')
const password = ref('')
</script>

<style scoped>
.page-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 3rem;
}

.form-card {
  background-color: #fff;
  padding: 3rem 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.form-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  text-align: center;
  color: #1f2937;
}

.input-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}
.input-group label {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #333;
}

:deep(.p-inputtext) {
  font-size: 1rem;
  padding: 0.9rem 1rem;
}

.button {
  margin-top: 1rem;
  color: #fff;
  background-color: #2f55d4;
  width: 100%;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 1rem;
  border-radius: 10px;
  transition: background-color 0.2s ease;
}
.button:hover {
  background-color: #2443b7;
}

.hint {
  text-align: center;
  margin-top: 1rem;
  font-size: 1rem;
  color: #6b7280;
}

/* Responsive  */
@media (max-width: 480px) {
  .form-card {
    padding: 2rem 1.5rem;
    max-width: 90%;
  }
  .form-title {
    font-size: 1.6rem;
  }
  .button {
    font-size: 1rem;
  }
}
</style>
