<template>
    <div class="checkout-page">
        <AppNavbar />

        <div class="container">
            <div v-if="isSuccess" class="success-card">
                <h1>Merci pour votre commande 🎉</h1>
                <p class="muted">
                    Nous avons bien reçu votre paiement. Un e-mail de
                    confirmation a été envoyé à
                    <strong>{{ sessionEmail }}</strong> si fourni.
                </p>
                <div class="actions">
                    <NuxtLink to="/" class="btn btn-primary"
                        >Retour à l'accueil</NuxtLink
                    >
                    <NuxtLink to="/products" class="btn"
                        >Continuer mes achats</NuxtLink
                    >
                </div>
            </div>

            <div v-else class="checkout-grid">
                <section class="cart-summary card">
                    <h2>Récapitulatif</h2>
                    <div v-if="items.length === 0" class="empty">
                        <p>Votre panier est vide.</p>
                        <NuxtLink to="/" class="btn btn-link"
                            >Retour aux produits</NuxtLink
                        >
                    </div>

                    <ul v-else class="items-list">
                        <li
                            v-for="it in items"
                            :key="it.productId + '-' + (it.id ?? 0)"
                            class="item"
                        >
                            <img
                                v-if="getImage(it)"
                                :src="getImage(it)"
                                alt="thumb"
                                class="thumb"
                            />
                            <div class="meta">
                                <div class="title">
                                    {{
                                        it.product?.name ??
                                        "Produit #" + it.productId
                                    }}
                                </div>
                                <div class="meta-sub">
                                    <span class="qty">x{{ it.quantity }}</span>
                                    <span class="unit">{{
                                        formatPrice(it.product?.price ?? 0)
                                    }}</span>
                                </div>
                            </div>
                            <div class="line-price">
                                {{
                                    formatPrice(
                                        (it.product?.price ?? 0) * it.quantity,
                                    )
                                }}
                            </div>
                        </li>
                    </ul>

                    <div class="summary-row">
                        <span>Sous-total</span>
                        <strong>{{ formatPrice(totalPrice) }}</strong>
                    </div>
                </section>

                <section class="checkout-form card">
                    <h2>Informations</h2>

                    <form @submit.prevent="startCheckout" class="form">
                        <label>
                            <span>Adresse e‑mail (recommandé)</span>
                            <input
                                v-model="customer.email"
                                type="email"
                                placeholder="ex: toto@example.com"
                                required
                                :disabled="isLoggedIn"
                            />
                        </label>

                        <label>
                            <span>Nom complet</span>
                            <input
                                v-model="customer.name"
                                type="text"
                                placeholder="Prénom Nom"
                                :disabled="isLoggedIn"
                            />
                        </label>

                        <div class="notice">
                            Paiement sécurisé par Stripe. Vous serez redirigé
                            vers la page de paiement.
                        </div>

                        <div class="form-actions">
                            <button
                                type="submit"
                                class="btn btn-primary"
                                :disabled="loading || items.length === 0"
                            >
                                <span v-if="!loading"
                                    >Payer {{ formatPrice(totalPrice) }}</span
                                >
                                <span v-else>Redirection...</span>
                            </button>

                            <NuxtLink to="/cart" class="btn btn-secondary"
                                >Modifier le panier</NuxtLink
                            >
                        </div>

                        <div v-if="error" class="error">{{ error }}</div>
                    </form>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import AppNavbar from "~/components/layout/AppNavbar.vue";
import { useCartStore } from "~/stores/useCartStore";
import { useProducts } from "~/composables/useProducts";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "~/stores/useUserStore";

const cartStore = useCartStore();
const { formatPrice } = useProducts();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const loading = ref(false);
const error = ref<string | null>(null);

// If user is logged in, prefill customer info and disable inputs
const isLoggedIn = computed(() => !!(userStore && (userStore as any).user));

const customer = ref<{ email?: string; name?: string }>({
    email: (userStore && (userStore as any).user?.email) ?? "",
    name:
        (userStore &&
            ((userStore as any).user?.name ??
                `${(userStore as any).user?.firstName ?? ""} ${(userStore as any).user?.lastName ?? ""}`)) ??
        "",
});

// Keep customer in sync if user information becomes available later
watch(
    () => (userStore as any).user,
    (u: any) => {
        if (u) {
            customer.value.email = u.email ?? customer.value.email;
            customer.value.name =
                u.name ??
                (`${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
                    customer.value.name);
        }
    },
);

// computed bindings
const items = computed(() => cartStore.items);
const totalPrice = computed(() => cartStore.totalPrice);
const totalItems = computed(() => cartStore.totalItems);

// Detect a success state: Stripe redirects to /checkout/success normally with session_id.
// We also accept ?session_id= or ?success=1 in query.
// If success we will clear the cart (server already processed payment).
const isSuccess = computed(() => {
    return !!(route.query.session_id || route.query.success);
});

// show session email if any (we set via query param optionally)
const sessionEmail = computed(
    () => route.query.email ?? customer.value.email ?? "",
);

// helper to get image url
function getImage(it: any) {
    const imgs = it.product?.images;
    if (!imgs) return null;
    if (Array.isArray(imgs) && imgs.length > 0) {
        const first = imgs[0];
        return typeof first === "string" ? first : (first.url ?? null);
    }
    if (typeof imgs === "string") return imgs;
    return null;
}

// If landing on success, clear local cart (so user doesn't see old items)
watch(isSuccess, (v) => {
    if (v) {
        // Clear local cart after a short delay to avoid race with UI rendering
        setTimeout(() => {
            try {
                cartStore.clearCart();
            } catch (e) {
                // ignore
            }
        }, 400);
    }
});

// On mount, try to prefill email from cartStore metadata if any
onMounted(() => {
    // if cart has items and maybe contains a product of customer email metadata, we ignore for now
    // This is a place to prefill from user store if available
    // e.g. customer.value.email = userStore.user?.email ?? '';
});

/**
 * startCheckout
 * Calls the server API to create a Stripe Checkout session.
 * Server endpoint: POST /api/checkout/session
 * Payload:
 *  { items: cartStore.items, customer: { email, name } }
 *
 * Server returns { url } (session url) -> we redirect the browser there.
 */
async function startCheckout() {
    error.value = null;

    if (!items.value || items.value.length === 0) {
        error.value = "Votre panier est vide.";
        return;
    }

    loading.value = true;
    try {
        // Prepare payload: we send the items as-is (store layer keeps product snapshot)
        const payload = {
            items: items.value.map((it: any) => ({
                productId: it.productId,
                quantity: it.quantity,
                product: it.product,
                price: it.product?.price,
                name: it.product?.name,
            })),
            customer: {
                email: customer.value.email,
                name: customer.value.name,
            },
            metadata: {
                // attach user id when available so backend can associate order to authenticated user
                userId: (userStore && (userStore as any).user?.id) ?? null,
            },
        };

        // call our server API (Nuxt server api prefix /api is mapped to server/api)
        // Using global $fetch provided by Nitro/Nuxt
        const config = useRuntimeConfig();
        const baseApi = config.public?.apiBase ? "" : ""; // server route is internal to Nuxt app: /api/...
        const res = await $fetch("/api/checkout/session", {
            method: "POST",
            body: payload,
        });

        if (!res || !res.url) {
            throw new Error("Impossible de démarrer la session de paiement");
        }

        // Optionally we can clear local cart now (but better to clear on success)
        // Redirect the browser to Stripe Checkout URL
        window.location.assign(res.url);
    } catch (err: any) {
        console.error("checkout error", err);
        error.value = err?.message ?? "Erreur lors de la création du paiement";
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.checkout-page {
    min-height: 100vh;
    background: #f7fafc;
    color: #111827;
}

.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.checkout-grid {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 1.5rem;
}

.card {
    background: #fff;
    border-radius: 10px;
    padding: 1.25rem;
    box-shadow: 0 8px 20px rgba(17, 24, 39, 0.04);
    border: 1px solid rgba(16, 24, 40, 0.03);
}

.cart-summary h2,
.checkout-form h2 {
    margin: 0 0 0.75rem 0;
    font-size: 1.125rem;
}

.items-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.thumb {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 8px;
    background: #f3f4f6;
    flex-shrink: 0;
}

.meta {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
}

.title {
    font-weight: 600;
}

.meta-sub {
    display: flex;
    gap: 0.75rem;
    color: #6b7280;
    font-size: 0.95rem;
}

.line-price {
    width: 110px;
    text-align: right;
    font-weight: 700;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px dashed #e6e7eb;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.form label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.95rem;
}

.form input[type="text"],
.form input[type="email"] {
    padding: 0.6rem 0.75rem;
    border-radius: 8px;
    border: 1px solid #e6e7eb;
    outline: none;
    font-size: 0.95rem;
    background: #fff;
}

.notice {
    font-size: 0.9rem;
    color: #6b7280;
    margin-top: 0.25rem;
}

.form-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.75rem;
    align-items: center;
}

.btn {
    padding: 0.6rem 1rem;
    border-radius: 8px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.btn-primary {
    background: #2563eb;
    color: white;
    border: none;
}

.btn-secondary {
    background: #fff;
    border: 1px solid #e6e7eb;
    color: #111827;
}

.btn-link {
    background: transparent;
    color: #2563eb;
    padding: 0;
}

.error {
    margin-top: 0.75rem;
    padding: 0.6rem;
    background: #fff1f2;
    color: #b91c1c;
    border-radius: 6px;
    border: 1px solid rgba(185, 28, 28, 0.08);
}

/* Success card */
.success-card {
    max-width: 720px;
    margin: 3rem auto;
    text-align: center;
    padding: 2rem;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(17, 24, 39, 0.06);
}
.success-card .muted {
    color: #6b7280;
    margin: 0.75rem 0 1.5rem 0;
}
.success-card .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

/* Responsive */
@media (max-width: 1024px) {
    .checkout-grid {
        grid-template-columns: 1fr;
    }
    .line-price {
        width: 90px;
    }
    .thumb {
        width: 72px;
        height: 72px;
    }
}
</style>
