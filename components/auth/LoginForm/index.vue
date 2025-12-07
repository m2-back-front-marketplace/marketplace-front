<template>
  <form class="form-card" @submit.prevent="onSubmit">
    <h2 class="form-title">Connexion</h2>

    <div class="input-group">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-user" /></InputGroupAddon>
        <InputText v-model="email" placeholder="Email" type="email" required />
      </InputGroup>
    </div>

    <div class="input-group">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-lock" /></InputGroupAddon>
        <InputText
          v-model="password"
          placeholder="Mot de passe"
          type="password"
          required
        />
      </InputGroup>
    </div>

    <Button
      class="button"
      :label="loading ? 'Connexion…' : 'Connexion'"
      :disabled="loading"
      type="submit"
    />
    <p v-if="error" class="error">{{ error }}</p>

    <p class="hint">
      Vous n'avez pas de compte ?
      <NuxtLink to="/auth/register">S’inscrire</NuxtLink>
    </p>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";

const { login, loading, error } = useAuth();

const email = ref("");
const password = ref("");

const onSubmit = async () => {
  if (!email.value || !password.value) return;
  await login({ email: email.value.trim(), password: password.value });
};
</script>

<style scoped src="./style.css" />
