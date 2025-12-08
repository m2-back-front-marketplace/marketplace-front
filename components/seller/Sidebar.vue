<template>
  <div class="seller-sidebar">
    <!-- Header -->
    <div class="sidebar-header">
      <img :src="logo" alt="VEGARKETPLACE" class="sidebar-logo-img" />
      <div class="header-user-info">
        <Avatar icon="pi pi-user" shape="circle" size="large" />
        <div class="header-user-details">
          <span class="header-user-name">{{ userName }}</span>
          <span class="header-user-role">{{ $t("seller.sidebar.role") }}</span>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="sidebar-content">
      <Menu :model="menuItems" class="sidebar-menu" style="border: none">
        <template #item="{ item, props }">
          <NuxtLink
            v-if="item.route"
            :to="item.route"
            class="menu-item-link"
            v-bind="props.action"
          >
            <i :class="item.icon"></i>
            <span class="menu-item-label">{{ item.label }}</span>
            <Badge
              v-if="item.badge"
              :value="item.badge"
              :severity="item.badgeSeverity"
              class="menu-badge"
            />
          </NuxtLink>
          <a v-else class="menu-item-link" v-bind="props.action">
            <i :class="item.icon"></i>
            <span class="menu-item-label">{{ item.label }}</span>
          </a>
        </template>
      </Menu>
    </div>

    <!-- Footer -->
    <div class="sidebar-footer">
      <Divider />
      <div class="user-info">
        <Avatar icon="pi pi-user" shape="circle" size="large" />
        <div class="user-details">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">{{ $t("seller.sidebar.role") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import logo from "~/assets/img/Logo-complet.svg";

const { t } = useI18n();
const userName = ref("John Doe"); // À remplacer par les vraies données utilisateur

const menuItems = ref([
  {
    label: t("Accueil"),
    icon: "pi pi-home",
    route: "/seller/dashboard",
  },
  {
    label: t("Commandes"),
    icon: "pi pi-box",
    route: "/seller/products",
    badge: "12",
    badgeSeverity: "info",
  },
  {
    label: t("Produits"),
    icon: "pi pi-shopping-cart",
    route: "/seller/orders",
    badge: "3",
    badgeSeverity: "warn",
  },
  {
    label: t("Promotions"),
    icon: "pi pi-megaphone",
    route: "/seller/customers",
  },
  {
    label: t("analytics"),
    icon: "pi pi-chart-line",
    route: "/seller/analytics",
  },
  {
    label: t("settings"),
    icon: "pi pi-cog",
    route: "/seller/settings",
  },
]);
</script>

<style scoped>
.seller-sidebar {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 280px;
  background: var(--surface-card);
  border-right: 1px solid var(--surface-border);
  position: sticky;
  top: 0;
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.sidebar-logo-img {
  height: 2.5rem;
  width: auto;
}

.header-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.header-user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow: hidden;
}

.header-user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-user-role {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.sidebar-menu {
  border: none !important;
  background: transparent;
  width: 100%;
}

.menu-item-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.menu-item-link:hover {
  background: var(--surface-hover);
  color: var(--primary-500);
}

.menu-item-link i {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.menu-item-label {
  flex: 1;
  white-space: nowrap;
}

.menu-badge {
  margin-left: auto;
}

.menu-item-link.router-link-active {
  background: var(--primary-50);
  color: var(--primary-500);
  border-left-color: var(--primary-500);
  font-weight: 600;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--surface-border);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow: hidden;
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.85rem;
  color: var(--text-color-secondary);
}

/* Scrollbar styling */
.sidebar-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: var(--surface-border);
  border-radius: 10px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: var(--surface-300);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .seller-sidebar {
    position: fixed;
    z-index: 1000;
    box-shadow: var(--shadow-3);
  }
}
</style>
