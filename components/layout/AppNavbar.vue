<template>
    <div class="card shadow-sm border-b border-gray-200">
      <Menubar :model="items" class="!justify-between px-6">
        
        <template #start>
  <div class="flex items-center gap-2">
    <img :src="logo" alt="EGARKETPLACE" class="h-10 w-auto" >
  </div>
</template>
        <template #item="{ item, props, hasSubmenu, root }">
          <a v-ripple class="flex items-center gap-2 px-3 py-2" v-bind="props.action">
            <i v-if="item.icon" :class="[item.icon, 'text-primary']"/>
            <span class="font-medium">{{ item.label }}</span>
  
            <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
            <span
              v-if="item.shortcut"
              class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
              >{{ item.shortcut }}</span
            >
            <i
              v-if="hasSubmenu"
              :class="[
                'pi pi-angle-down ml-auto',
                { 'pi-angle-down': root, 'pi-angle-right': !root }
              ]"
            />
          </a>
        </template>

        <template #end>
          <div class="flex items-center justify-center w-full gap-3">
            <Avatar
              image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
              shape="circle"
              size="large"
            />
          </div>
        </template>
      </Menubar>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import logo from '~/assets/img/Logo-complet.svg'
  
  const items = ref([
    { label: 'Accueil', icon: 'pi pi-home' },
    {
      label: 'Catégories',
      items: [
        { label: 'Électroniques', icon: 'pi pi-desktop' },
        { label: 'Mode & Beauté', icon: 'pi pi-user' },
        { label: 'Maison & Jardin', icon: 'pi pi-home' },
        { label: 'Sport', icon: 'pi pi-cog' },
        { label: 'Jouets', icon: 'pi pi-bookmark' }
      ]
    },
    { label: 'Promotions' },
    { label: 'Best Seller' },
    { label: 'Panier' }
  ])
  </script>
  
  <style scoped>
  .card {
    border-radius: 0;
  }
  </style>
  