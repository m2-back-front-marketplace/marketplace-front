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
  padding: 2rem; /* Adjusted padding for better responsiveness */
}

.form-card {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  width: 90%; /* Use percentage for better responsiveness */
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.form-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
}

.input-group {
  margin-bottom: 1.2rem;
}

.button {
  margin-top: 1rem;
  color: white;
  background-color: #007bff;
  width: 100%; /* Make the button take full width */
}

/* Add media queries for responsiveness */
@media (max-width: 768px) {
  .form-card {
    padding: 1.5rem; /* Reduce padding on smaller screens */
  }

  .form-title {
    font-size: 1.2rem; /* Adjust font size for smaller screens */
  }
}

@media (max-width: 480px) {
  .form-card {
    padding: 1rem; /* Further reduce padding for very small screens */
  }

  .form-title {
    font-size: 1rem; /* Further adjust font size */
  }

  .button {
    font-size: 0.9rem; /* Adjust button font size */
  }
}
</style>