<template>
    <form class="product-form" @submit.prevent="onSubmit">
      <header class="product-form__header">
        <h1>Ajouter un produit</h1>
        <p class="product-form__subtitle">
          Bienvenue ! Ajoutez un nouveau produit à votre catalogue.
        </p>
      </header>
  
      <section class="product-form__section">
        <div class="field">
          <label for="name">Nom du produit</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Nom du produit"
          />
        </div>
  
        <div class="field">
          <label for="description">Description du produit</label>
          <textarea
            id="description"
            v-model="form.description"
            placeholder="Description du produit"
            rows="4"
          />
        </div>
  
        <div class="field-row">
          <div class="field">
            <label for="quantity">Quantité</label>
            <input
              id="quantity"
              v-model.number="form.quantity"
              type="number"
              min="0"
              placeholder="Quantité"
            />
          </div>
  
          <div class="field">
            <label for="price">Prix</label>
            <input
              id="price"
              v-model.number="form.price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Prix"
            />
          </div>
        </div>
  
        <div class="field-row">
          <div class="field">
            <label for="category">Catégorie (optionnel)</label>
            <select
              id="category"
              v-model="form.category"
            >
              <option value="">Sélectionnez une catégorie</option>
              <option
                v-for="cat in categoryOptions"
                :key="cat"
                :value="cat"
              >
                {{ cat }}
              </option>
            </select>
          </div>
  
          <div class="field">
            <label for="promotion">Promotion (optionnel)</label>
            <input
              id="promotion"
              v-model.number="form.promotion"
              type="number"
              min="0"
              step="0.01"
              placeholder="Promotion (optionnel)"
            />
          </div>
        </div>
      </section>
  
      <section class="product-form__section">
        <div
          class="upload-area"
          @dragover.prevent
          @drop.prevent="onDrop"
        >
          <p class="upload-area__title">Ajouter des images</p>
          <p class="upload-area__subtitle">
            Glissez et déposez des images ici, ou cliquez pour sélectionner des fichiers
          </p>
  
          <button
            type="button"
            class="upload-area__button"
            @click="fileInput?.click()"
          >
            Sélectionner des fichiers
          </button>
  
          <input
            ref="fileInput"
            type="file"
            class="upload-area__input"
            accept="image/*"
            multiple
            @change="onFileChange"
          />
  
          <ul v-if="files.length" class="upload-area__list">
            <li v-for="file in files" :key="file.name">
              {{ file.name }}
            </li>
          </ul>
        </div>
      </section>
  
      <p v-if="error" class="product-form__error">
        {{ error }}
      </p>
  
      <footer class="product-form__footer">
        <button
          type="button"
          class="btn btn--ghost"
          @click="onReset"
          :disabled="loading"
        >
          Annuler
        </button>
        <button
          type="submit"
          class="btn btn--primary"
          :disabled="loading"
        >
          {{ loading ? 'Ajout en cours…' : 'Ajouter le produit' }}
        </button>
      </footer>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useProductForm } from '~/composables/useProductForm'
  
  interface ProductFormState {
    name: string
    description: string
    quantity: number | null
    price: number | null
    category: string
    promotion: number | null
  }
  
  const { createProduct, loading, error } = useProductForm()
  
  const initialState: ProductFormState = {
    name: '',
    description: '',
    quantity: null,
    price: null,
    category: '',
    promotion: null,
  }
  
  const form = ref<ProductFormState>({ ...initialState })
  const files = ref<File[]>([])
  const fileInput = ref<HTMLInputElement | null>(null)
  
  // ✅ MOCK catégories pour l’instant (mets ici celles que tu as en BDD)
  const categoryOptions = [
    'Informatique',
    'Téléphone',
    'Accessoires',
    'Modes et vêtements',
    'Maison et jardin',
    'Sports et loisirs',
    'Santé et beauté',
    'Automobile',
    'Alimentation',
    'Autres',
  ]
  
  const onFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files) {
      files.value = Array.from(target.files)
    }
  }
  
  const onDrop = (event: DragEvent) => {
    if (event.dataTransfer?.files) {
      files.value = Array.from(event.dataTransfer.files)
    }
  }
  
  const onReset = () => {
    form.value = { ...initialState }
    files.value = []
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
  
  const onSubmit = async () => {
    if (!form.value.name || !form.value.price || !form.value.quantity) {
      // validation minimale
      return
    }
  
    await createProduct({
      name: form.value.name,
      description: form.value.description || undefined,
      price: Number(form.value.price),
      quantity: Number(form.value.quantity),
      discount_id: form.value.promotion ?? undefined,
      // on envoie la catégorie si choisie
      category: form.value.category || undefined,
    })
  
    onReset()
  }
  </script>
  
  <style scoped src="./style.css" />
  