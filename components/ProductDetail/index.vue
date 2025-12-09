varketplace/marketplace-front/components/ProductDetail/index.vue
<template>
    <div class="product-detail-container">
        <div v-if="pending">Chargement...</div>
        <div v-else-if="error">Erreur lors du chargement du produit.</div>
        <div v-else-if="!productValue">Produit introuvable.</div>
        <div v-else>
            <div class="product-main">
                <img
                    :src="productImage"
                    alt="Image produit"
                    class="main-image"
                />

                <div class="product-info">
                    <h2>{{ productValue.name }}</h2>
                    <p>Vendu par {{ productValue.seller?.user?.username }}</p>
                    <p>{{ productValue.price }} €</p>
                    <p class="description">{{ productValue.description }}</p>

                    <div class="actions">
                        <label class="qty-label">Quantité</label>
                        <input
                            type="number"
                            min="1"
                            v-model.number="quantity"
                            class="qty-input"
                        />

                        <Button
                            :label="adding ? 'Ajout...' : 'Ajouter au panier'"
                            icon="pi pi-shopping-cart"
                            :disabled="
                                adding ||
                                pending ||
                                (productValue?.quantity ?? 0) <= 0
                            "
                            @click="handleAddToCart"
                        />
                    </div>

                    <div v-if="adding" class="info">Ajout en cours...</div>
                    <div v-if="message" class="success">{{ message }}</div>
                    <div v-if="addError" class="error">{{ addError }}</div>
                </div>
            </div>

            <TabView>
                <TabPanel header="Description">
                    <p>{{ productValue.description }}</p>
                </TabPanel>
                <TabPanel header="Avis clients">
                    <p>Aucun avis.</p>
                </TabPanel>
            </TabView>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useProduct } from "@/composables/useProductDetail";
import { useCartStore } from "~/stores/useCartStore";

/**
 * ProductDetail
 * - Uses useProduct(id) which returns a ref `product` (useFetch data)
 * - Unwraps product into `productValue` computed to avoid optional chaining in template expressions
 * - Computes a safe `productImage` URL
 * - Adds `handleAddToCart` that creates a small snapshot and calls cartStore.addToCart(snapshot, qty)
 */

const route = useRoute();
const { product, pending, error } = useProduct(route.params.id);

// unwrap product ref safely (works whether product is a ref or already plain)
const productValue = computed(() => {
    // useFetch returns a ref, but keep defensive guard
    if (!product) return null;
    // if product is a ref-like (has .value) return its value, otherwise return it directly
    const maybe =
        (product as any).value !== undefined ? (product as any).value : product;
    return maybe ?? null;
});

// compute product image (absolute or placeholder)
const placeholder = "https://source.unsplash.com/random/500x500?product";
const productImage = computed(() => {
    const p = productValue.value;
    if (!p) return placeholder;
    const imgs = p.images;
    if (Array.isArray(imgs) && imgs.length > 0) {
        const first = imgs[0];
        // handle string or object { url }
        if (typeof first === "string") return first;
        if (first && typeof first.url === "string") return first.url;
    }
    return placeholder;
});

const cartStore = useCartStore();
const quantity = ref<number>(1);
const adding = ref(false);
const message = ref("");
const addError = ref("");

// add to cart handler
async function handleAddToCart() {
    const p = productValue.value;
    if (!p) {
        addError.value = "Produit introuvable.";
        return;
    }

    const stock = typeof p.quantity === "number" ? Number(p.quantity) : null;
    let qty = Number(quantity.value ?? 1);
    if (!Number.isFinite(qty) || qty < 1) qty = 1;
    if (stock !== null && qty > stock) {
        addError.value = `Quantité demandée (${qty}) supérieure au stock disponible (${stock}).`;
        return;
    }

    if (adding.value) return;
    adding.value = true;
    addError.value = "";
    message.value = "";

    try {
        const snapshot = {
            id: p.id,
            name: p.name,
            price: Number(p.price ?? 0),
            images: p.images ?? [],
        };

        // Defensive: ensure cartStore.addToCart exists
        if (!cartStore || typeof (cartStore as any).addToCart !== "function") {
            addError.value = "Panier indisponible.";
            return;
        }

        const res = await cartStore.addToCart(snapshot, qty);

        if (!res) {
            addError.value = "Ajout au panier échoué (réponse vide).";
        } else if ((res as any).error) {
            addError.value =
                (res as any).error || "Impossible d'ajouter au panier.";
        } else {
            message.value = `Produit ajouté au panier (${qty}).`;
        }
    } catch (err: any) {
        console.error("Add to cart error", err);
        addError.value = err?.message ?? "Erreur lors de l'ajout au panier.";
    } finally {
        adding.value = false;
    }
}
</script>

<style scoped src="./style.css" />
