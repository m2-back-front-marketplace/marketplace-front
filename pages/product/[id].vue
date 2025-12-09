<template>
  <AppNavbar />
    <div class="product-detail-page">
      <ProductDetail />
    </div>
</template>
  
<script setup>
import ProductDetail from '@/components/ProductDetail/index.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
const route = useRoute()
const { product, pending, error } = useProduct(route.params.id)

</script>
  
<style scoped>
  .product-detail-page {
    padding: 2rem;
    display: flex;
    justify-content: center;
    }
</style>
  