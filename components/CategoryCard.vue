<template>
    <NuxtLink :to="`/category/${slug}`" class="category-card">
      <img :src="image" :alt="title" class="category-image" >
      <p class="category-title">{{ title }}</p>
    </NuxtLink>
  </template>
  
  <script setup lang="ts">
  const _props = withDefaults(defineProps<{
    title?: string
    image?: string
    slug?: string
  }>(), {
    title: 'Catégorie sans nom',
    image: '/placeholder.jpg',
    slug: 'sandbox',
  })
  </script>
  
  <style scoped>
  .category-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 180px;
    border-radius: 16px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: transform 0.2s ease;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }
  
  .category-card:hover {
    transform: scale(1.03);
  }
  
  .category-image {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }
  
  .category-title {
    padding: 1rem;
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
  }
  </style>
  