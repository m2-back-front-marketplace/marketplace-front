<template>
  <div class="navbar-wrapper">
    <Menubar :model="items" class="custom-menubar">
      <!-- Logo à gauche -->
      <template #start>
        <NuxtLink to="/" class="logo-container">
          <img :src="logo" alt="EGARKETPLACE" class="navbar-logo">
        </NuxtLink>
      </template>

      <!-- Items du menu -->
      <template #item="{ item, props, hasSubmenu, root }">
        <a 
          v-if="item.to && !hasSubmenu"
          :href="item.to"
          @click.prevent="handleNavigation(item.to)"
          v-ripple 
          class="menu-link"
          v-bind="props.action"
        >
          <i v-if="item.icon" :class="[item.icon, 'menu-icon']"/>
          <span v-if="item.label" class="menu-label">{{ item.label }}</span>
        </a>

        <a 
          v-else
          v-ripple 
          class="menu-link"
          v-bind="props.action"
        >
          <i v-if="item.icon" :class="[item.icon, 'menu-icon']"/>
          <span v-if="item.label" class="menu-label">{{ item.label }}</span>
          <i
            v-if="hasSubmenu"
            class="pi pi-chevron-down submenu-icon"
          />
        </a>
      </template>

      <!-- Avatar et panier à droite -->
      <template #end>
        <div class="navbar-actions">
          <NuxtLink to="/cart" class="cart-link">
            <i class="pi pi-shopping-cart cart-icon"></i>
            <Badge v-if="cartItemCount > 0" :value="cartItemCount" severity="danger" class="cart-badge" />
          </NuxtLink>
          
          <Avatar
            image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            shape="circle"
            size="large"
            class="user-avatar"
          />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import logo from '~/assets/img/Logo-complet.svg'
import { useNavbar } from '~/composables/useNavbar'

const router = useRouter()
const { categories } = useNavbar()

// Simuler le nombre d'articles dans le panier (à remplacer par votre store)
const cartItemCount = computed(() => {
  // TODO: Remplacer par votre logique de panier
  // const cartStore = useCartStore()
  // return cartStore.itemCount
  return 0
})

// Fonction de navigation avec rechargement forcé
const handleNavigation = async (path) => {
  // Si on est déjà sur la page, forcer le rechargement
  if (router.currentRoute.value.path === path) {
    await navigateTo(path, { 
      replace: true,
      force: true
    })
    // Forcer le rechargement de la page
    window.location.reload()
  } else {
    await navigateTo(path)
  }
}

const items = computed(() => [
  { 
    label: 'Accueil', 
    to: '/products',
    icon: null
  },
  {
    label: 'Catégories',
    items: (categories.value ?? []).map((cat) => ({
      label: cat.name,
      icon: 'pi pi-tag',
      to: `/categorie/${cat.id}`,
      command: () => {
        handleNavigation(`/categorie/${cat.id}`)
      }
    }))
  },
  { 
    label: 'Ajouter un produit', 
    to: '/seller/add/add-product',
    icon: null
  },
  { 
    label: 'Best Seller', 
    to: '/best-sellers',
    icon: null
  }
])
</script>

<style scoped>
.navbar-wrapper {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #e5e7eb;
}

/* Menubar custom */
:deep(.custom-menubar) {
  background: transparent;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0;
}

:deep(.p-menubar-root-list) {
  gap: 2rem;
}

/* Logo */
.logo-container {
  display: flex;
  align-items: center;
  text-decoration: none;
  margin-right: 3rem;
}

.navbar-logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

/* Menu items */
.menu-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #333333;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.menu-link:hover {
  color: #007bff;
  background-color: #f8f9fa;
}

.menu-label {
  white-space: nowrap;
}

.menu-icon {
  font-size: 1.1rem;
  color: #007bff;
}

.submenu-icon {
  margin-left: 0.25rem;
  font-size: 0.75rem;
  transition: transform 0.2s;
}

/* Active link */
:deep(.router-link-active) .menu-link {
  color: #007bff;
}

/* Submenu */
:deep(.p-menubar-submenu) {
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  min-width: 200px;
}

:deep(.p-menubar-submenu .p-menuitem-link) {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  transition: all 0.2s;
}

:deep(.p-menubar-submenu .p-menuitem-link:hover) {
  background-color: #f0f7ff;
  color: #007bff;
}

/* Actions à droite */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.cart-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #333333;
  text-decoration: none;
  border-radius: 50%;
  transition: all 0.2s;
}

.cart-link:hover {
  background-color: #f8f9fa;
  color: #007bff;
}

.cart-icon {
  font-size: 1.5rem;
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  font-size: 0.75rem;
}

.user-avatar {
  cursor: pointer;
  transition: transform 0.2s;
}

.user-avatar:hover {
  transform: scale(1.05);
}

/* Responsive */
@media (max-width: 960px) {
  :deep(.custom-menubar) {
    padding: 0.75rem 1rem;
  }

  .logo-container {
    margin-right: 1rem;
  }

  .navbar-logo {
    height: 32px;
  }

  :deep(.p-menubar-root-list) {
    gap: 1rem;
  }

  .menu-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .menu-label {
    display: none;
  }

  .menu-link {
    padding: 0.5rem;
  }

  :deep(.p-menubar-button) {
    display: flex;
  }
}
</style>