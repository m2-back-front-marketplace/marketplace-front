<template>
  <div>
    <AppNavbar />
    <div class="test-products-page">
      <div class="container">
        <h1>Test des Produits (SSR)</h1>

        <div v-if="pending" class="loading">
          <p>Chargement des produits...</p>
          <div class="skeleton-grid">
            <div v-for="i in 6" :key="i" class="skeleton-card"></div>
          </div>
        </div>

        <div v-else-if="error" class="error">
          <h2>Erreur de chargement</h2>
          <p>{{ error }}</p>
          <button @click="refresh()">Réessayer</button>
        </div>

        <div v-else class="products-container">
          <p>{{ data?.length || 0 }} produits trouvés</p>

          <div v-if="data && data.length > 0" class="products-grid">
            <ProductCard
              v-for="product in data"
              :key="product.id"
              :product="product"
              @click="handleProductClick"
              @add-to-cart="handleAddToCart"
            />
          </div>

          <div v-else class="no-products">
            <p>Aucun produit disponible</p>
          </div>
        </div>

        <details class="debug-info">
          <summary>Debug Info</summary>
          <pre>{{ { products: data?.slice(0, 2), pending, error } }}</pre>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppNavbar from '~/components/layout/AppNavbar.vue'
const config = useRuntimeConfig();
const baseURL = config.public.apiBase || "http://localhost:8000/api";

const { data, error, pending, refresh } = await useFetch('/product/getAllProducts', {
  baseURL,
  key: 'all-products',
  transform: (response) => response?.data || response,
  default: () => []
});

const handleProductClick = (product) => {
  console.log('Produit cliqué:', product.name);
};

const handleAddToCart = (product, quantity) => {
  console.log(`Ajout au panier: ${quantity}x ${product.name}`);
};

useHead({
  title: 'Products'
});
</script>

<style scoped>
.test-products-page {
  min-height: 100vh;
  padding: 2rem;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.skeleton-card {
  height: 400px;
  background: #e2e8f0;
  border-radius: 12px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.error {
  text-align: center;
  color: #dc2626;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.error button {
  background: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
}

.products-container p {
  text-align: center;
  color: #6b7280;
  margin-bottom: 2rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  justify-items: center;
}

.no-products {
  text-align: center;
  padding: 4rem;
  color: #6b7280;
}

.debug-info {
  margin-top: 3rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.debug-info summary {
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 1rem;
}

.debug-info pre {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .test-products-page {
    padding: 1rem;
  }

  .products-grid,
  .skeleton-grid {
    grid-template-columns: 1fr;
  }
}
</style>
