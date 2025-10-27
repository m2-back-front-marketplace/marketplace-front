<template>
    <div>
      <AppNavbar />
      <div class="page-wrapper">
        <div class="form-card">
          <h2 class="form-title">Vous Êtes ?</h2>
  
          <!-- Toggle -->
          <div class="segmented">
            <button
              type="button"
              class="seg-btn"
              :class="{ active: userType === 'pro' }"
              @click="setType('pro')"
            >
              Un Professionnel
            </button>
            <button
              type="button"
              class="seg-btn"
              :class="{ active: userType === 'part' }"
              @click="setType('part')"
            >
              Un Particulier
            </button>
          </div>
  
          <!-- PRO -->
          <template v-if="userType === 'pro'">
            <div class="input-group">
              <label>Nom de société</label>
              <InputGroup>
                <InputGroupAddon><i class="pi pi-briefcase" /></InputGroupAddon>
                <InputText v-model="pro.company" placeholder="Nom de société" />
              </InputGroup>
            </div>
  
            <div class="input-group">
              <label>Email</label>
              <InputGroup>
                <InputGroupAddon><i class="pi pi-envelope" /></InputGroupAddon>
                <InputText v-model="pro.email" placeholder="Email" />
              </InputGroup>
            </div>
  
            <div class="input-group">
              <label>Mot de passe</label>
              <InputGroup>
                <InputGroupAddon><i class="pi pi-lock" /></InputGroupAddon>
                <InputText
                  v-model="pro.password"
                  type="password"
                  placeholder="Mot de passe"
                />
              </InputGroup>
            </div>
  
            <div class="input-group">
              <label>Numéro de SIRET</label>
              <InputGroup>
                <InputGroupAddon><i class="pi pi-id-card" /></InputGroupAddon>
                <InputNumber v-model="pro.siret" placeholder="Numéro de SIRET" />
              </InputGroup>
            </div>
  
            <div class="input-group">
              <label>Numéro de TVA</label>
              <InputGroup>
                <InputGroupAddon><i class="pi pi-percentage" /></InputGroupAddon>
                <InputNumber v-model="pro.vat" placeholder="Numéro de TVA" />
              </InputGroup>
            </div>
          </template>
  
          <!-- PARTICULIER -->
          <template v-else>
            <div class="input-group">
              <label>Nom</label>
              <InputGroup>
                <InputGroupAddon><i class="pi pi-user" /></InputGroupAddon>
                <InputText v-model="part.fullname" placeholder="Nom complet" />
              </InputGroup>
            </div>
  
            <div class="input-group">
              <label>Prénom</label>
              <InputGroup>
                <InputGroupAddon><i class="pi pi-user-plus" /></InputGroupAddon>
                <InputText v-model="part.firstname" placeholder="Prénom" />
              </InputGroup>
            </div>
  
            <div class="input-group">
              <label>Email</label>
              <InputGroup>
                <InputGroupAddon><i class="pi pi-envelope" /></InputGroupAddon>
                <InputText v-model="part.email" placeholder="Email" />
              </InputGroup> 
            </div>
  
            <div class="input-group">
              <label>Mot de passe</label>
              <InputGroup>
                <InputGroupAddon><i class="pi pi-lock" /></InputGroupAddon>
                <InputText
                  v-model="part.password"
                  type="password"
                  placeholder="Mot de passe"
                />
              </InputGroup>
            </div>
          </template>
  
          <Button class="button" label="S’inscrire" @click="submit" />
          <p class="hint">
            Vous avez déjà un compte ?
            <NuxtLink to="/auth/login">Se connecter</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue'
  import AppNavbar from '~/components/layout/AppNavbar.vue'
  
  type UserType = 'pro' | 'part'
  
  interface ProForm {
    company: string
    email: string
    password: string
    siret: number | null
    vat: number | null
  }
  interface PartForm {
    fullname: string
    firstname: string
    email: string
    password: string
  }
  
  export default defineComponent({
    name: 'Register',
    components: { AppNavbar },
    setup() {
      const userType = ref<UserType>('part')
  
      const pro = ref<ProForm>({
        company: '',
        email: '',
        password: '',
        siret: null,
        vat: null,
      })
  
      const part = ref<PartForm>({
        fullname: '',
        firstname: '',
        email: '',
        password: '',
      })
  
      const setType = (t: UserType) => {
        userType.value = t
      }
  
      const submit = () => {
        const payload =
          userType.value === 'pro'
            ? { type: 'pro', ...pro.value }
            : { type: 'part', ...part.value }
        console.log('SUBMIT REGISTER =>', payload)
      }
  
      return { userType, pro, part, setType, submit }
    },
  })
  </script>
  
  <style scoped>
.page-wrapper {
  height: 100vh;
  display: flex;
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
  max-width: 560px; 
  display: flex;
  flex-direction: column;
}

.form-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  text-align: center;
  color: #1f2937;
}

.segmented {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}
.seg-btn {
  appearance: none;
  border: none;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  background: #f2f3f5;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.15s ease;
}
.seg-btn.active {
  background: #e9ecff;
  box-shadow: inset 0 0 0 2px #a3b8ff;
}

.input-group {
  margin-bottom: 1.4rem;
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
}

.hint {
  text-align: center;
  margin-top: 1rem;
  font-size: 1rem;
  color: #6b7280;
}

@media (max-width: 480px) {
  .form-card {
    padding: 2rem 1.5rem;
    max-width: 90%;
  }
  .form-title {
    font-size: 1.6rem;
  }
}
</style>

  