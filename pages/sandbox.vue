<template>
    <div class="sandbox-page">
      <h1>Sandbox — Test Composants</h1>
      <section>
        <h2>Banner Component</h2>
        <Banner />
      </section>

      <section>
        <h2>CategoryCard</h2>
        <div class="product-grid">
    <CategoryCard
      v-for="cat in categories"
      :key="cat.slug"
      :title="cat.title"
      :image="cat.image"
      :slug="cat.slug"
    />
  </div>
      </section>
  
      <section>
        <h2> ProductCard</h2>
        <div class="product-grid">
          <ProductCard title="Casque sans fil" :price="99.99" />
          <ProductCard title="Fauteuil moderne" :price="249.99" />
          <ProductCard title="Lampe design" :price="49.9" />
          <ProductCard title="Montre connectée" :price="199.99" />
          <ProductCard title="Ordinateur portable" :price="899.99" />
        </div>
      </section>
  
      <section>
        <h2> Login Form</h2>
      </section>
  
      <section>
        <h2>Register Form</h2>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
    import Banner from '~/components/Banner.vue'
    import ProductCard from '~/components/ProductCard.vue'
    import CategoryCard from '~/components/CategoryCard.vue'

    const categories = [
  { title: 'Mode et vêtements', image: '/images/categories/Mode.jpg', slug: 'Mode et vêtements' },
  { title: 'Ecran et tableeeete', image: '/images/categories/Ecran.jpg', slug: 'Ecran et tableeeete' },
  { title: 'Maison et Jardin', image: '/images/categories/Maison.jpg', slug: 'Maison et Jardin' },
  { title: 'Informatique', image: '/images/categories/Informatique.jpg', slug: 'Informatique' },
]
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
  