<template>
    <div class="cart-page min-h-screen">
        <AppNavbar />

        <div class="container mx-auto py-8 px-4">
            <h1 class="text-2xl font-bold mb-6">Mon panier</h1>

            <div v-if="loading" class="p-6 bg-white rounded shadow text-center">
                <p>Chargement du panier...</p>
            </div>

            <div v-else>
                <div
                    v-if="isEmpty"
                    class="p-6 bg-white rounded shadow text-center"
                >
                    <p class="text-lg text-gray-600 mb-4">
                        Votre panier est vide.
                    </p>
                    <NuxtLink
                        to="/"
                        class="inline-block bg-primary text-white px-4 py-2 rounded"
                    >
                        Continuer mes achats
                    </NuxtLink>
                </div>

                <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Items list -->
                    <div class="lg:col-span-2">
                        <div class="space-y-4">
                            <div
                                v-for="item in items"
                                :key="item.productId + '-' + (item.id ?? 0)"
                                class="p-4 bg-white rounded shadow flex items-center gap-4"
                            >
                                <div
                                    class="w-24 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden flex items-center justify-center"
                                >
                                    <img
                                        v-if="imageFor(item)"
                                        :src="imageFor(item)"
                                        :alt="item.product?.name ?? 'Produit'"
                                        class="object-cover w-full h-full"
                                    />
                                    <div v-else class="text-gray-400">
                                        No image
                                    </div>
                                </div>

                                <div class="flex-1">
                                    <h3 class="font-semibold text-lg">
                                        {{
                                            item.product?.name ??
                                            "Produit #" + item.productId
                                        }}
                                    </h3>
                                    <p class="text-sm text-gray-500 mt-1">
                                        Prix unitaire:
                                        <strong>{{
                                            formatPrice(
                                                item.product?.price ?? 0,
                                            )
                                        }}</strong>
                                    </p>

                                    <div class="mt-3 flex items-center gap-3">
                                        <label class="text-sm text-gray-600"
                                            >Quantité</label
                                        >
                                        <div
                                            class="flex items-center border rounded overflow-hidden"
                                        >
                                            <button
                                                class="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                                                @click="decreaseQty(item)"
                                                :disabled="updating"
                                            >
                                                -
                                            </button>
                                            <input
                                                class="w-16 text-center border-l border-r px-2 py-1"
                                                type="number"
                                                min="1"
                                                :value="item.quantity"
                                                @change="
                                                    onQtyChange($event, item)
                                                "
                                            />
                                            <button
                                                class="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                                                @click="increaseQty(item)"
                                                :disabled="updating"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            class="ml-4 text-sm text-red-600 hover:underline"
                                            @click="remove(item)"
                                            :disabled="updating"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </div>

                                <div class="w-40 text-right">
                                    <div class="text-gray-700 font-semibold">
                                        {{
                                            formatPrice(
                                                (item.product?.price ?? 0) *
                                                    item.quantity,
                                            )
                                        }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Summary -->
                    <aside class="p-4 bg-white rounded shadow h-fit">
                        <div class="mb-4">
                            <p class="text-sm text-gray-600">Articles</p>
                            <p class="text-xl font-semibold">
                                {{ totalItems }}
                            </p>
                        </div>

                        <div class="mb-4">
                            <p class="text-sm text-gray-600">Total</p>
                            <p class="text-2xl font-bold">
                                {{ formatPrice(totalPrice) }}
                            </p>
                        </div>

                        <div class="space-y-3">
                            <button
                                class="w-full bg-primary text-white py-2 rounded font-semibold"
                                @click="proceedToCheckout"
                            >
                                Passer à la caisse
                            </button>

                            <button
                                class="w-full border border-gray-300 py-2 rounded text-gray-700"
                                @click="clear"
                                :disabled="updating"
                            >
                                Vider le panier
                            </button>

                            <NuxtLink
                                to="/"
                                class="block text-center text-sm text-gray-600 hover:underline"
                            >
                                Continuer mes achats
                            </NuxtLink>
                        </div>

                        <div v-if="error" class="mt-4 text-sm text-red-600">
                            {{ error }}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import AppNavbar from "~/components/layout/AppNavbar.vue";
import { useCartStore } from "~/stores/useCartStore";
import { useProducts } from "~/composables/useProducts";
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const { formatPrice } = useProducts();
const router = useRouter();

const loading = ref(false);
const updating = ref(false);
const error = ref<string | null>(null);

// computed bindings
const items = computed(() => cartStore.items);
const totalItems = computed(() => cartStore.totalItems);
const totalPrice = computed(() => cartStore.totalPrice);

// read-only helper
const isEmpty = computed(() => !items.value || items.value.length === 0);

// display helpers
function imageFor(item: any) {
    try {
        const imgs = item.product?.images;
        if (!imgs) return null;
        if (Array.isArray(imgs) && imgs.length > 0) {
            const first = imgs[0];
            if (typeof first === "string") return first;
            if (first && first.url) return first.url;
        }
        if (typeof imgs === "string") return imgs;
        return null;
    } catch {
        return null;
    }
}

// load cart on mount (store already loads on client init, but ensure fresh)
if (process.client) {
    loading.value = true;
    cartStore.loadCart().finally(() => (loading.value = false));
}

// actions
async function increaseQty(item: any) {
    updating.value = true;
    try {
        await cartStore.updateItem(item.productId, item.quantity + 1);
    } catch (err: any) {
        error.value = err?.message ?? "Erreur lors de la mise à jour";
    } finally {
        updating.value = false;
    }
}

async function decreaseQty(item: any) {
    if (item.quantity <= 1) return remove(item);
    updating.value = true;
    try {
        await cartStore.updateItem(item.productId, item.quantity - 1);
    } catch (err: any) {
        error.value = err?.message ?? "Erreur lors de la mise à jour";
    } finally {
        updating.value = false;
    }
}

function onQtyChange(e: Event, item: any) {
    const target = e.target as HTMLInputElement;
    let v = parseInt(target.value || "0", 10);
    if (isNaN(v) || v < 1) v = 1;
    // update only if different
    if (v === item.quantity) {
        // reset input (in case of invalid)
        target.value = String(item.quantity);
        return;
    }
    updating.value = true;
    cartStore
        .updateItem(item.productId, v)
        .catch((err: any) => {
            error.value = err?.message ?? "Erreur lors de la mise à jour";
        })
        .finally(() => (updating.value = false));
}

async function remove(item: any) {
    const id = item.productId;
    updating.value = true;
    try {
        await cartStore.removeItem(id);
    } catch (err: any) {
        error.value = err?.message ?? "Erreur lors de la suppression";
    } finally {
        updating.value = false;
    }
}

async function clear() {
    if (!confirm("Voulez-vous vider votre panier ?")) return;
    updating.value = true;
    try {
        await cartStore.clearCart();
    } catch (err: any) {
        error.value = err?.message ?? "Impossible de vider le panier";
    } finally {
        updating.value = false;
    }
}

function proceedToCheckout() {
    // simple flow: go to /checkout (page should exist or be implemented)
    router.push({ path: "/checkout" }).catch(() => {
        // fallback: navigate to login if user must be authenticated
        router.push({ path: "/auth/login" }).catch(() => {});
    });
}

// page meta
useHead({ title: "Panier - Varketplace" });
</script>

<style scoped>
/* Layout container */
.container {
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
}

/* Colors */
.bg-primary {
    background-color: #2563eb;
}
.text-primary {
    color: #2563eb;
}

/* Page */
.cart-page {
    background: #f7fafc;
    color: #111827;
}

/* Grid / content */
.grid {
    gap: 1.5rem;
}

/* Card / item styles */
.p-4.bg-white.rounded.shadow.flex.items-center.gap-4,
.cart-item,
.p-4.bg-white.rounded.shadow.flex.items-center.gap-4 {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.04);
    border: 1px solid rgba(16, 24, 40, 0.03);
}

/* Thumbnail */
.w-24.h-24 {
    width: 96px !important;
    height: 96px !important;
}
.w-24.h-24 .object-cover,
.w-24.h-24 img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* Item info */
.flex-1 h3 {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.25;
    color: #111827;
}
.flex-1 p {
    margin: 0.25rem 0 0;
    color: #6b7280;
}

/* Quantity control */
.flex.items-center.border.rounded.overflow-hidden,
.controls,
.quantity-control {
    display: inline-flex;
    align-items: center;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #e6e7eb;
}
.quantity-control button,
.flex.items-center.border.rounded.overflow-hidden button {
    background: #f3f4f6;
    border: none;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    color: #374151;
    font-weight: 600;
}
.quantity-control button:hover,
.flex.items-center.border.rounded.overflow-hidden button:hover {
    background: #e9ecef;
}
.quantity-control input,
.flex.items-center.border.rounded.overflow-hidden input,
input[type="number"] {
    width: 64px;
    text-align: center;
    border: none;
    padding: 0.4rem 0.5rem;
    outline: none;
    font-size: 0.95rem;
}

/* Item price column */
.w-40 {
    width: 160px;
}
.w-40 .text-gray-700 {
    font-size: 1rem;
}

/* Summary card */
aside.p-4.bg-white.rounded.shadow.h-fit,
.summary .summary-card,
aside {
    background: #ffffff;
    padding: 1.25rem;
    border-radius: 10px;
    box-shadow: 0 6px 18px rgba(16, 24, 40, 0.04);
    border: 1px solid rgba(16, 24, 40, 0.03);
}

/* Totals */
.summary .total,
.summary .text-2xl {
    font-weight: 800;
    color: #111827;
}

/* Buttons */
button.w-full.bg-primary,
button.bg-primary {
    background: #2563eb;
    color: #fff;
    border: none;
    padding: 0.65rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition:
        transform 0.12s ease,
        box-shadow 0.12s ease;
}
button.w-full.bg-primary:hover,
button.bg-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(37, 99, 235, 0.12);
}
button.w-full.border {
    background: #fff;
    color: #374151;
    border-radius: 8px;
}

/* Remove link */
button.ml-4.text-sm.text-red-600 {
    background: transparent;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
}
button.ml-4.text-sm.text-red-600:hover {
    background: rgba(239, 68, 68, 0.06);
}

/* Empty state */
.empty .inline-block.bg-primary {
    display: inline-block;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    text-decoration: none;
}

/* Responsive: sticky summary on larger screens */
@media (min-width: 1024px) {
    .cart-content {
        display: grid;
        grid-template-columns: 1fr 360px;
        gap: 1.5rem;
        align-items: start;
    }

    aside.p-4.bg-white.rounded.shadow.h-fit,
    .summary {
        position: sticky;
        top: 96px;
    }

    .w-24.h-24 {
        width: 112px !important;
        height: 112px !important;
    }
}

/* Mobile responsiveness */
@media (max-width: 1023px) {
    .cart-item,
    .p-4.bg-white.rounded.shadow.flex.items-center.gap-4 {
        flex-direction: row;
        gap: 0.75rem;
    }

    .w-40 {
        width: 120px;
    }

    .container {
        padding-left: 0.75rem;
        padding-right: 0.75rem;
    }
}

/* Small aesthetic tweaks */
.text-sm.text-gray-600,
.text-sm {
    color: #6b7280;
}
.font-semibold {
    font-weight: 600;
}

/* Accessibility: focus states */
button:focus,
input:focus {
    outline: 3px solid rgba(37, 99, 235, 0.15);
    outline-offset: 2px;
}
</style>
