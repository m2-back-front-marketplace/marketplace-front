<template>
    <div class="banner">
      <div class="overlay">
        <div class="content">
          <h1>Les BIG PROMOS <span>DU MOIS</span></h1>
          <p>Economoisez sur vos produits préféré, offres limitées !</p>
          <NuxtLink to="/sandbox">
            <button class="cta-button">Découvrir</button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineOptions({
    name: 'PromoBanner'
  });
  // Image random Unsplash : mobilier / deals / tech
  const _bgUrl = `https://source.unsplash.com/featured/1200x500/?furniture,technology,sale`
  </script>
  
  <style scoped>
  .banner {
    width: 100%;
    height: 450px;
    background-image: url("https://source.unsplash.com/featured/1200x500/?furniture,technology,sale");
    background-size: cover;
    background-position: center;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .overlay {
    backdrop-filter: blur(2px);
    background-color: rgba(255, 255, 255, 0.6);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    text-align: center;
  }
  
  .content {
    max-width: 90%;
  }
  
  h1 {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: #111;
  }
  
  h1 span {
    color: #4b5563;
  }
  
  p {
    font-size: 1.1rem;
    color: #333;
    margin-bottom: 1.5rem;
  }
  
  .cta-button {
    background-color: #e0f2f1;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 9999px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .cta-button:hover {
    background-color: #b2dfdb;
  }
  
  @media (max-width: 768px) {
    .banner {
      height: auto;
      padding: 2rem 0;
    }
  
    h1 {
      font-size: 2rem;
    }
  
    p {
      font-size: 1rem;
    }
  
    .cta-button {
      font-size: 0.95rem;
    }
  }
  </style>
  