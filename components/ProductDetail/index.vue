<template>
  <div class="product-detail-container">
    <div v-if="pending">Chargement...</div>
    <div v-else-if="error">Erreur lors du chargement du produit.</div>
    <div v-else-if="!product">Produit introuvable.</div>
    <div v-else>
      <div class="product-main">
        <img
          :src="product.images?.[0]?.url || placeholder"
          alt="Image produit"
          class="main-image"
        />

        <div class="product-info">
          <h2>{{ product.name }}</h2>
          <p>Vendu par {{ product.seller?.user?.username }}</p>
          <p>{{ product.price }} €</p>
          <p>{{ product.description }}</p>

          <Button label="Ajouter au panier" icon="pi pi-shopping-cart" />
        </div>
      </div>

      <TabView>
        <TabPanel header="Description">
          <p>{{ product.description }}</p>
        </TabPanel>
        <TabPanel header="Avis clients">
          <p>Aucun avis.</p>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useProduct } from '@/composables/useProductDetail'

const route = useRoute()
const { product, pending, error } = useProduct(route.params.id)

const selectedSize = ref(null)
const quantity = ref(1)
const placeholder = 'https://source.unsplash.com/random/500x500?product'

</script>

<style scoped src="./style.css" />
