<template>
    <div class="sandbox-page">
      <h1>Sandbox — Test Composants</h1>
  
      <section>
        <h2>🧱 ProductCard</h2>
        <div class="product-grid">
          <ProductCard title="Casque sans fil" :price="99.99" />
          <ProductCard title="Fauteuil moderne" :price="249.99" />
          <ProductCard title="Lampe design" :price="49.9" />
        </div>
      </section>
  
      <section>
        <h2>🔐 Login Form</h2>
        <LoginForm />
      </section>
  
      <section>
        <h2>📝 Register Form</h2>
        <RegisterForm />
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  import ProductCard from '~/components/ProductCard.vue'
  </script>
  
  <style scoped>
  .sandbox-page {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 4rem;
    background: #f9fafb;
  }
  .product-grid {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  </style>
  