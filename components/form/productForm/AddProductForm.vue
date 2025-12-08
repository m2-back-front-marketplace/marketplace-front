<template>
  <form @submit.prevent="handleSubmit" class="product-form">
    <!-- Header -->
    <div class="form-header">
      <h2 class="form-title">Nouveau Produit</h2>
      <p class="form-subtitle">Remplissez les informations du produit</p>
    </div>

    <div class="form-content">
      <div class="form-grid">
        <div class="form-field form-field-full">
          <label for="name" class="field-label">Nom du produit</label>
          <InputText
            id="name"
            v-model="product.name"
            :class="{ 'field-invalid': errors.name }"
            class="field-input"
          />
          <small v-if="errors.name" class="field-error">{{
            errors.name
          }}</small>
        </div>

        <div class="form-field form-field-full">
          <label for="description" class="field-label"
            >Description du produit</label
          >
          <Textarea
            id="description"
            v-model="product.description"
            rows="4"
            autoResize
            :class="{ 'field-invalid': errors.description }"
            class="field-input"
          />
          <small v-if="errors.description" class="field-error">{{
            errors.description
          }}</small>
        </div>

        <!-- 3. Quantité (full width) -->
        <div class="form-field form-field-full">
          <label for="quantity" class="field-label">Quantité</label>
          <InputNumber
            id="quantity"
            v-model="product.quantity"
            :min="0"
            :showButtons="true"
            :class="{ 'field-invalid': errors.quantity }"
            class="field-input"
          />
          <small v-if="errors.quantity" class="field-error">{{
            errors.quantity
          }}</small>
        </div>

        <!-- 4. Prix (left) et Catégorie (right) -->
        <div class="form-field">
          <label for="price" class="field-label">Prix</label>
          <InputNumber
            id="price"
            v-model="product.price"
            mode="currency"
            currency="EUR"
            :min="0"
            :class="{ 'field-invalid': errors.price }"
            class="field-input"
          />
          <small v-if="errors.price" class="field-error">{{
            errors.price
          }}</small>
        </div>

        <div class="form-field">
          <label for="category" class="field-label">Catégorie</label>
          <Dropdown
            id="category"
            v-model="product.category"
            :options="categories"
            optionLabel="label"
            optionValue="value"
            placeholder="Sélectionner une catégorie"
            :class="{ 'field-invalid': errors.category }"
            class="field-input"
          />
          <small v-if="errors.category" class="field-error">{{
            errors.category
          }}</small>
        </div>

        <!-- Promotion (optional section) -->
        <div class="form-field form-field-full">
          <label for="promotionToggle" class="field-label">Promotion</label>
          <div class="field-checkbox-wrapper">
            <Checkbox
              v-model="product.promotionEnabled"
              inputId="promotionToggle"
            />
            <label for="promotionToggle" class="checkbox-label"
              >Activer la promotion</label
            >
          </div>
        </div>

        <div v-if="product.promotionEnabled" class="form-field form-field-full">
          <label for="promotionPrice" class="field-label"
            >Prix promotionnel</label
          >
          <InputNumber
            id="promotionPrice"
            v-model="product.promotionPrice"
            mode="currency"
            currency="EUR"
            :min="0"
            :class="{ 'field-invalid': errors.promotionPrice }"
            class="field-input"
          />
          <small v-if="errors.promotionPrice" class="field-error">{{
            errors.promotionPrice
          }}</small>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="form-footer">
      <Divider />
      <div class="form-actions">
        <div v-if="errors.form" class="field-error form-error">
          {{ errors.form }}
        </div>
        <div class="actions-buttons">
          <Button
            type="button"
            label="Réinitialiser"
            severity="secondary"
            outlined
            @click="onReset"
          />
          <Button type="submit" label="Enregistrer" icon="pi pi-check" />
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useProductForm } from "~/composables/useProductForm";
import Textarea from "primevue/textarea";

const { product, errors, categories, submit, reset } = useProductForm();

const emit = defineEmits<{
  (e: "submit", payload: import("~/composables/useProductForm").Product): void;
}>();

async function handleSubmit() {
  const result = await submit(async (payload) => {
    emit("submit", payload);
  });

  if (result.success) {
    reset();
  }
}

function onReset() {
  reset();
}
</script>

<style scoped src="./style.css" />
