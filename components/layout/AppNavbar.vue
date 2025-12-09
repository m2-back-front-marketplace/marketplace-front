<template>
    <div class="card shadow-sm border-b border-gray-200">
        <Menubar :model="items" class="!justify-between px-6">
            <template #start>
                <NuxtLink to="/products" class="flex items-center gap-2">
                    <img :src="logo" alt="ARKETPLACE" class="h-10 w-auto" />
                </NuxtLink>
            </template>

            <template #item="{ item, props, hasSubmenu, root }">
                <NuxtLink
                    v-if="item.to && !hasSubmenu"
                    v-ripple
                    :to="item.to"
                    class="flex items-center gap-2 px-3 py-2 hover:bg-primary-50 rounded-md transition-colors no-underline"
                    v-bind="props.action"
                    active-class="text-primary"
                >
                    <i v-if="item.icon" :class="[item.icon, 'text-xl']" />
                    <span v-if="item.label" class="font-medium text-gray-700">{{
                        item.label
                    }}</span>
                </NuxtLink>

                <a
                    v-else
                    v-ripple
                    class="flex items-center gap-2 px-3 py-2 hover:bg-primary-50 rounded-md transition-colors cursor-pointer"
                    v-bind="props.action"
                >
                    <i v-if="item.icon" :class="[item.icon, 'text-primary']" />
                    <span class="font-medium text-gray-700">{{
                        item.label
                    }}</span>
                    <Badge
                        v-if="item.badge"
                        :class="{ 'ml-auto': !root, 'ml-2': root }"
                        :value="item.badge"
                    />
                    <i
                        v-if="hasSubmenu"
                        :class="[
                            'pi ml-auto text-gray-500',
                            { 'pi-angle-down': root, 'pi-angle-right': !root },
                        ]"
                    />
                </a>
            </template>
        </Menubar>
    </div>
</template>

<script setup>
import { computed } from "vue";
import logo from "~/assets/img/Logo-complet.svg";
import { useNavbar } from "~/composables/useNavbar";

const { categories } = useNavbar();

const items = computed(() => [
    {
        label: "Produits",
        to: "/products",
    },
    {
        icon: "pi pi-shopping-cart",
        to: "/cart",
        class: "cart-icon",
    },
    {
        icon: "pi pi-dollar",
        to: "/seller/add/product",
        class: "seller-icon",
    },
]);
</script>

<style scoped>
.card {
    border-radius: 0;
    background: white;
}

/* Style pour le lien actif (route courante) */
:deep(.router-link-active) {
    color: #007bff !important;
}

:deep(.router-link-active span) {
    color: #007bff !important;
}

/* Style spécial pour l'icône du panier */
:deep(.cart-icon .pi-shopping-cart) {
    color: #007bff;
    font-size: 1.25rem;
}

/* Amélioration du hover sur les items du menu */
:deep(.p-menubar-item-link) {
    border-radius: 6px;
    transition: all 0.2s ease;
}

:deep(.p-menubar-item-link:hover) {
    background-color: rgba(0, 123, 255, 0.05);
}

/* Style pour les sous-menus */
:deep(.p-menubar-submenu) {
    border-radius: 8px;
    box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

:deep(.p-menubar-submenu .p-menubar-item-link) {
    padding: 0.75rem 1rem;
}

:deep(.p-menubar-submenu .p-menubar-item-link:hover) {
    background-color: rgba(0, 123, 255, 0.08);
}

/* Retirer le soulignement des liens */
:deep(a) {
    text-decoration: none;
}

/* Style pour le logo au hover */
:deep(.flex.items-center.gap-2:hover img) {
    opacity: 0.9;
    transition: opacity 0.2s ease;
}
</style>
