<template>
    <Card class="product-card" @click="handleProductClick">
        <template #header>
            <div class="product-img-container">
                <img
                    v-if="imageSrc && !imageError"
                    :src="imageSrc"
                    :alt="product.name"
                    class="product-img"
                    @error="handleImageError"
                />
                <div v-else class="product-img-placeholder">
                    <i class="pi pi-image" style="font-size: 2rem"></i>
                    <span class="placeholder-text">Image</span>
                </div>
            </div>
        </template>

        <template #title>
            <div class="title">{{ product.name }}</div>
        </template>

        <template #subtitle>
            <div class="price">{{ formatPrice(product.price) }}</div>
        </template>

        <template #content>
            <div class="product-info">
                <p v-if="product.description" class="description">
                    {{ truncateDescription(product.description) }}
                </p>
                <div class="product-meta">
                    <span v-if="product.quantity > 0" class="stock available">
                        <i class="pi pi-check-circle"></i>
                        En stock ({{ product.quantity }})
                    </span>
                    <span v-else class="stock unavailable">
                        <i class="pi pi-times-circle"></i>
                        Rupture de stock
                    </span>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="card-actions">
                <button
                    v-if="product.quantity > 0"
                    class="add-to-cart native-button"
                    @click.stop="addToCart"
                    :disabled="addingToCart"
                >
                    <i class="pi pi-shopping-cart" aria-hidden="true"></i>
                    <span>Ajouter au panier</span>
                </button>
                <button v-else class="native-button disabled" disabled>
                    <i class="pi pi-ban" aria-hidden="true"></i>
                    <span>Indisponible</span>
                </button>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Card from "primevue/card";
import { useProducts } from "~/composables/useProducts";
import { useCartStore } from "~/stores/useCartStore";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    images?: Array<{ id?: number; url?: string }> | string[];
    seller_id: number;
    discount_id?: number;
    category_id: number;
    created_at?: string;
    updated_at?: string;
}

interface Props {
    product: Product;
    maxDescriptionLength?: number;
}

const props = withDefaults(defineProps<Props>(), {
    maxDescriptionLength: 100,
});

const emit = defineEmits<{
    click: [product: Product];
    addToCart: [product: Product, quantity: number];
}>();

const { formatPrice } = useProducts();

const cartStore = useCartStore();

const addingToCart = ref(false);
const imageError = ref(false);

const imageSrc = computed(() => {
    try {
        const imgs: any = props.product?.images;
        if (!imgs || !Array.isArray(imgs) || imgs.length === 0) return "";
        const first = imgs[0];
        if (!first) return "";
        if (typeof first === "string") return first;
        if (first && (first as any).url) return (first as any).url;
        return "";
    } catch (e) {
        return "";
    }
});

const truncateDescription = computed(() => {
    return (text: string) => {
        if (!text) return "";
        if (text.length <= props.maxDescriptionLength) return text;
        return text.substring(0, props.maxDescriptionLength) + "...";
    };
});

const handleProductClick = () => {
    emit("click", props.product);
    // Optionnel : navigation vers la page produit
    // navigateTo(`/products/${props.product.id}`);
};

const addToCart = async () => {
    if (props.product.quantity <= 0) return;
    if (addingToCart.value) return;
    addingToCart.value = true;

    const snapshot = {
        id: props.product.id,
        name: props.product.name,
        price: props.product.price,
        images: props.product.images,
    };

    // helper fallback: write to localStorage if cart store is unavailable or fails
    const LOCAL_KEY = "varketplace_cart_v1";
    const fallbackAddToLocal = (prodSnapshot: any, qty = 1) => {
        try {
            const raw = localStorage.getItem(LOCAL_KEY);
            const parsed = raw ? JSON.parse(raw) : { items: [] };
            if (!parsed || !Array.isArray(parsed.items)) parsed.items = [];
            const items = parsed.items;
            const existing = items.find(
                (it: any) => it.productId === prodSnapshot.id,
            );
            if (existing) {
                existing.quantity = (existing.quantity ?? 0) + qty;
            } else {
                items.push({
                    productId: prodSnapshot.id,
                    quantity: qty,
                    product: prodSnapshot,
                });
            }
            localStorage.setItem(LOCAL_KEY, JSON.stringify({ items }));
            return { ok: true, data: { items } };
        } catch (e) {
            console.error("fallbackAddToLocal error:", e);
            return { ok: false, error: e };
        }
    };

    try {
        // prefer store if available
        if (cartStore && typeof cartStore.addToCart === "function") {
            const res = await cartStore.addToCart(snapshot, 1);
            // if store returned an error object, fallback to local to avoid crash
            if (res && (res as any).error) {
                console.warn(
                    "Cart store reported error, falling back to local:",
                    (res as any).error,
                );
                fallbackAddToLocal(snapshot, 1);
                emit("addToCart", props.product, 1);
                emit("add-to-cart", props.product, 1);
            } else {
                // success path
                emit("addToCart", props.product, 1);
                emit("add-to-cart", props.product, 1);
            }
        } else {
            // no store available -> local fallback
            fallbackAddToLocal(snapshot, 1);
            emit("addToCart", props.product, 1);
            emit("add-to-cart", props.product, 1);
        }
    } catch (err) {
        // Defensive: if store code throws (eg. cart.value was null), fallback to localStorage
        console.error("Erreur lors de l'ajout au panier:", err);
        try {
            fallbackAddToLocal(snapshot, 1);
            emit("addToCart", props.product, 1);
            emit("add-to-cart", props.product, 1);
        } catch (e) {
            console.error("Fallback also failed:", e);
        }
        // Do not rethrow to avoid breaking the UI
    } finally {
        addingToCart.value = false;
    }
};

const handleImageError = () => {
    imageError.value = true;
};
</script>

<style scoped>
.product-card {
    width: 280px;
    min-height: 400px;
    border-radius: 12px;
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    transition: all 0.3s ease;
}

.product-img-container {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
}

.product-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-img-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    gap: 0.5rem;
}

.placeholder-text {
    font-size: 0.9rem;
    opacity: 0.9;
    font-weight: 500;
}

.title {
    font-weight: 700;
    font-size: 1.2rem;
    color: #111827;
    line-height: 1.4;
    margin-bottom: 0.5rem;
}

.price {
    font-size: 1.3rem;
    font-weight: 700;
    color: #059669;
    margin-bottom: 0.5rem;
}

.product-info {
    padding: 0.5rem 0;
}

.description {
    font-size: 0.9rem;
    color: #6b7280;
    line-height: 1.5;
    margin-bottom: 1rem;
}

.product-meta {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

.stock {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
}

.stock.available {
    color: #059669;
    background-color: #d1fae5;
}

.stock.unavailable {
    color: #dc2626;
    background-color: #fee2e2;
}

.card-actions {
    display: flex;
    width: 100%;
    gap: 0.5rem;
    padding: 0.5rem 0 0;
    align-items: center;
}

:deep(.p-card-body) {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.card-actions button,
.card-actions .native-button {
    width: 100%;
    font-weight: 600;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: #2563eb;
    color: #fff;
    opacity: 1;
    visibility: visible;
    transform: none;
    z-index: 2;
}
.card-actions .native-button.disabled {
    background-color: #6b7280;
    opacity: 0.9;
    cursor: not-allowed;
}

.card-actions :hover {
    background-color: #1d4ed8;
}

:deep(.p-card-content) {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

:deep(.p-card-footer) {
    padding-top: 0;
    margin-top: auto;
    position: relative;
    z-index: 1;
    overflow: visible;
}

@media (max-width: 768px) {
    .product-card {
        width: 100%;
        max-width: 300px;
    }

    .title {
        font-size: 1.1rem;
    }

    .price {
        font-size: 1.2rem;
    }
}
</style>
