<template>
    <form class="form-card" @submit.prevent="onSubmit">
      <h2 class="form-title">Vous Êtes ?</h2>
  
      <!-- Toggle -->
      <div class="segmented">
        <button
          type="button"
          class="seg-btn"
          :class="{ active: userType === 'pro' }"
          @click="userType = 'pro'"
        >
          Un Professionnel
        </button>
        <button
          type="button"
          class="seg-btn"
          :class="{ active: userType === 'part' }"
          @click="userType = 'part'"
        >
          Un Particulier
        </button>
      </div>
  
      <!-- PRO -->
      <template v-if="userType === 'pro'">
        <div class="input-group">
          <label>Nom de société</label>
          <InputGroup>
            <InputGroupAddon><i class="pi pi-briefcase"></i></InputGroupAddon>
            <InputText v-model="pro.company" placeholder="Nom de société" />
          </InputGroup>
        </div>
  
        <div class="input-group">
          <label>Email</label>
          <InputGroup>
            <InputGroupAddon><i class="pi pi-envelope"></i></InputGroupAddon>
            <InputText v-model="pro.email" placeholder="Email" type="email" />
          </InputGroup>
        </div>
  
        <div class="input-group">
          <label>Mot de passe</label>
          <InputGroup>
            <InputGroupAddon><i class="pi pi-lock"></i></InputGroupAddon>
            <InputText v-model="pro.password" type="password" placeholder="Mot de passe" />
          </InputGroup>
        </div>
  
        <div class="input-group">
          <label>Numéro de SIRET</label>
          <InputGroup>
            <InputGroupAddon><i class="pi pi-id-card"></i></InputGroupAddon>
            <InputNumber v-model="pro.siret" placeholder="Numéro de SIRET" />
          </InputGroup>
        </div>
  
        <div class="input-group">
          <label>Numéro de TVA</label>
          <InputGroup>
            <InputGroupAddon><i class="pi pi-percentage"></i></InputGroupAddon>
            <InputNumber v-model="pro.vat" placeholder="Numéro de TVA" />
          </InputGroup>
        </div>
      </template>
  
      <!-- PARTICULIER -->
      <template v-else>
        <div class="input-group">
          <label>Nom</label>
          <InputGroup>
            <InputGroupAddon><i class="pi pi-user"></i></InputGroupAddon>
            <InputText v-model="part.fullname" placeholder="Nom complet" />
          </InputGroup>
        </div>
  
        <div class="input-group">
          <label>Prénom</label>
          <InputGroup>
            <InputGroupAddon><i class="pi pi-user-plus"></i></InputGroupAddon>
            <InputText v-model="part.firstname" placeholder="Prénom" />
          </InputGroup>
        </div>
  
        <div class="input-group">
          <label>Email</label>
          <InputGroup>
            <InputGroupAddon><i class="pi pi-envelope"></i></InputGroupAddon>
            <InputText v-model="part.email" placeholder="Email" type="email" />
          </InputGroup>
        </div>
  
        <div class="input-group">
          <label>Mot de passe</label>
          <InputGroup>
            <InputGroupAddon><i class="pi pi-lock"></i></InputGroupAddon>
            <InputText v-model="part.password" type="password" placeholder="Mot de passe" />
          </InputGroup>
        </div>
      </template>
  
      <Button class="button" :label="loading ? 'S’inscrire…' : 'S’inscrire'" :disabled="loading" type="submit" />
      <p v-if="error" class="error">{{ error }}</p>
  
      <p class="hint">
        Vous avez déjà un compte ?
        <NuxtLink to="/auth/login">Se connecter</NuxtLink>
      </p>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useAuth } from '~/composables/useAuth'
  
  type UserType = 'pro' | 'part'
  interface ProForm { company: string; email: string; password: string; siret: number | null; vat: number | null }
  interface PartForm { fullname: string; firstname: string; email: string; password: string }
  
  const { register, loading, error } = useAuth()
  
  const userType = ref<UserType>('part')
  
  const pro = ref<ProForm>({ company: '', email: '', password: '', siret: null, vat: null })
  const part = ref<PartForm>({ fullname: '', firstname: '', email: '', password: '' })
  
  const onSubmit = () => {
    const payload = userType.value === 'pro'
      ? { type: 'pro', ...pro.value }
      : { type: 'part', ...part.value }
    // Validation minimale côté client (évite envoi vide)
    if (userType.value === 'pro' && (!pro.value.company || !pro.value.email || !pro.value.password)) return
    if (userType.value === 'part' && (!part.value.fullname || !part.value.firstname || !part.value.email || !part.value.password)) return
  
    register(payload as any) // typé dans useAuth
  }
  </script>
  
  <style scoped src="./style.css" />
  