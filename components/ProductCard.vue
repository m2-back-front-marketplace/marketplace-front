<template>
  <Card
    class="product-card hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
    @click="handleProductClick"
  >
    <template #header>
      <div class="product-img-container">
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="product-img"
          @error="handleImageError"
        />
        <div v-else class="product-img-placeholder">
          <i class="pi pi-image" style="font-size: 2rem;"></i>
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
        <Button
          v-if="product.quantity > 0"
          label="Ajouter au panier"
          icon="pi pi-shopping-cart"
          @click.stop="addToCart"
          :loading="addingToCart"
        />
        <Button
          v-else
          label="Indisponible"
          icon="pi pi-ban"
          severity="secondary"
          disabled
        />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Card from "primevue/card";
import Button from "primevue/button";

import { useProducts } from "~/composables/useProducts";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
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
  maxDescriptionLength: 100
});

const emit = defineEmits<{
  click: [product: Product];
  addToCart: [product: Product, quantity: number];
}>();

const { formatPrice } = useProducts();

const addingToCart = ref(false);
const imageError = ref(false);

const truncateDescription = computed(() => {
  return (text: string) => {
    if (!text) return '';
    if (text.length <= props.maxDescriptionLength) return text;
    return text.substring(0, props.maxDescriptionLength) + '...';
  };
});

const handleProductClick = () => {
  emit('click', props.product);
  // Optionnel : navigation vers la page produit
  // navigateTo(`/products/${props.product.id}`);
};

const addToCart = async () => {
  if (props.product.quantity <= 0) return;

  addingToCart.value = true;
  try {
    emit('addToCart', props.product, 1);
    // Ici tu peux ajouter la logique d'ajout au panier
    console.log('Ajout au panier:', props.product.name);
  } catch (error) {
    console.error('Erreur lors de l\'ajout au panier:', error);
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

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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

.product-card:hover .product-img {
  transform: scale(1.05);
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
}

.card-actions :deep(.p-button) {
  width: 100%;
  font-weight: 600;
}

:deep(.p-card-body) {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
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
}

/* Responsive */
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
