<template>
    <Card class="product-card hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
      <template #header>
        <!-- Zone d'image (rouge en attendant la BDD) -->
        <div class="product-img-placeholder">
          <span class="placeholder-text">Image</span>
        </div>
      </template>
  
      <template #title>
        <div class="title">{{ title }}</div>
      </template>
  
      <template #subtitle>
        <div class="price">{{ formatPrice(price) }}</div>
      </template>
    </Card>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue'
  import Card from 'primevue/card'
  
  const _props = withDefaults(defineProps<{
    title?: string
    price?: number
  }>(), {
      title: 'Produit sans titre',
      price: 0,
    })

  
  const formatPrice = (value: number) => {
    if (isNaN(value)) return ''
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }
  </script>
   <style scoped src="./style.css" />