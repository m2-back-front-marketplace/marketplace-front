<template>
  <div class="product-detail-container">
    <div v-if="pending">Chargement...</div>

    <div v-else-if="error">Erreur lors du chargement du produit.</div>

    <div v-else-if="product?.value">
      <div class="product-main">
        <div class="product-image">
          <img
            :src="product.value.images?.[0]?.url || placeholder"
            alt="Image produit"
            class="main-image"
          />
        </div>

        <div class="product-info">
          <h2 class="product-name">{{ product.value.name }}</h2>
          <p class="product-seller">
            Vendu par {{ product.value.seller?.user?.username || '—' }}
          </p>
          <p class="product-price">{{ product.value.price }} €</p>
          <p class="product-desc">{{ product.value.description }}</p>

          <div class="product-controls">
            <Dropdown
              v-model="selectedSize"
              :options="sizes"
              placeholder="Taille"
              class="dropdown"
            />
            <InputNumber
              v-model="quantity"
              showButtons
              :min="1"
              class="quantity-input"
            />
          </div>

          <Button label="Ajouter au panier" icon="pi pi-shopping-cart" />
        </div>
      </div>

      <div class="product-tabs">
        <TabView>
          <TabPanel header="Description">
            <p class="full-description">{{ product.value.description }}</p>
          </TabPanel>
          <TabPanel header="Avis clients">
            <p>Aucun avis pour le moment.</p>
          </TabPanel>
        </TabView>
      </div>
    </div>

    <div v-else>
      Produit introuvable.
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import { useProduct } from '@/composables/useProductDetail'

const route = useRoute()
const { product, pending, error } = useProduct(route.params.id)

const sizes = ref(['S', 'M', 'L', 'XL'])
const selectedSize = ref(null)
const quantity = ref(1)

const placeholder = 'https://source.unsplash.com/random/500x500?product'

watchEffect(() => {
  console.log('[PAGE] pending:', pending.value)
  console.log('[PAGE] error:', error.value)
  console.log('[PAGE] product:', product.value)
})
</script>

<style scoped src="./style.css" />
