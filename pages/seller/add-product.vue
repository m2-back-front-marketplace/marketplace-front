<template>
  <div>
    <h2>Créer un produit</h2>
    <ProductForm @submit="onCreate" />
  </div>
</template>

<script setup>
import AddProductForm from "~/components/seller/AddProductForm.vue";

async function onCreate(payload) {
  // Exemple: envoi à ton API
  console.log("Submit payload:", payload);
  // await $fetch('/api/products', { method: 'POST', body: payload })
}
definePageMeta({
  layout: "seller",
});
</script>
