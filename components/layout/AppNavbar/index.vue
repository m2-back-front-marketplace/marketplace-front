<template>
    <div class="card shadow-sm border-b border-gray-200">
      <Menubar :model="items" class="!justify-between px-6 ">
        
        <template #start>
  <div class="navbar-logo">
    <img src="/assets/img/Logo-complet.svg" alt="Logo complet" class="logo-desktop" />
    <img src="/assets/img/Logo-Noir.svg" alt="Logo icône" class="logo-mobile" />
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
              shape="square"
              size="large"
            />
          </div>
        </template>
      </Menubar>
    </div>
  </template>
  
  <script setup>
    import { computed } from 'vue'
    import logo from '~/assets/img/Logo-Noir.svg'
    import { useCategories } from '~/composables/useNavbar'
    
    const { categories } = useCategories()
    
    const items = computed(() => [
      { label: 'Accueil', to: '/' },
    
      {
        label: 'Catégories',
        items: (categories.value ?? []).map((cat) => ({
          label: cat.name,
          icon: 'pi pi-tag',
          to: `/categorie/${cat.id}`
        }))
      },
    
      { label: 'Promotions', to: '/promotions' },
      { label: 'Best Seller', to: '/best-sellers' },
      { icon: 'pi pi-shopping-cart', to: '/panier' }
    ])
    </script>
   <style scoped src="./style.css" />