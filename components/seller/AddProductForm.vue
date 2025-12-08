<template>
  <form class="form-card" @submit.prevent="onSubmit">
    <h2 class="form-title">Ajouter un produit</h2>

    <div class="input-group">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-tag" /></InputGroupAddon>
        <InputText
          v-model="product.name"
          placeholder="Nom du produit"
          required
        />
      </InputGroup>
    </div>

    <div class="input-group">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-align-left" /></InputGroupAddon>
        <Textarea
          v-model="product.description"
          placeholder="Description du produit"
          rows="4"
          class="w-full"
        />
      </InputGroup>
    </div>

    <div class="input-group">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-hashtag" /></InputGroupAddon>
        <InputNumber
          v-model="product.quantity"
          placeholder="Quantité"
          :min="0"
          mode="decimal"
          show-buttons
        />
      </InputGroup>
    </div>

    <div class="input-group">
      <InputGroup>
        <InputGroupAddon><i class="pi pi-euro" /></InputGroupAddon>
        <InputNumber
          v-model="product.price"
          placeholder="Prix"
          :min="0"
          mode="currency"
          currency="EUR"
          locale="fr-FR"
        />
      </InputGroup>
    </div>

    <div class="input-group">
      <label class="input-label">Catégorie</label>
      <Dropdown
        v-model="product.category"
        :options="categoryOptions"
        option-label="name"
        option-value="value"
        placeholder="Sélectionner une catégorie"
        class="w-full"
      />
    </div>

    <div class="input-group">
      <label class="input-label">Image du produit</label>
      <div class="file-upload-container">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileChange"
          class="file-input"
          id="file-upload"
        />
        <label for="file-upload" class="file-label">
          <i class="pi pi-upload"></i>
          {{ selectedFileName || 'Choisir une image' }}
        </label>
      </div>
    </div>

    <Button
      class="button"
      :label="loading ? 'Ajout en cours…' : 'Ajouter le produit'"
      :disabled="loading"
      type="submit"
    />

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>

    <div class="form-actions">
      <Button
        type="button"
        label="Annuler"
        severity="secondary"
        text
        @click="resetForm"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const product = ref({
  name: '',
  description: '',
  quantity: 0,
  price: 0,
  category: ''
});

const loading = ref(false);
const error = ref('');
const success = ref('');
const selectedFileName = ref('');
const fileInput = ref();

const categoryOptions = ref([
  { name: 'Fruits', value: 'fruits' },
  { name: 'Légumes', value: 'vegetables' },
  { name: 'Herbes aromatiques', value: 'herbs' },
  { name: 'Céréales', value: 'cereals' },
  { name: 'Légumineuses', value: 'legumes' },
  { name: 'Autres', value: 'others' }
]);

const handleFileChange = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    selectedFileName.value = file.name;
  } else {
    selectedFileName.value = '';
  }
};

const resetForm = () => {
  // Tu peux ajouter ta logique ici
};

const onSubmit = () => {
  // Tu peux ajouter ta logique ici
};
</script>

<style scoped src="../auth/LoginForm/style.css">
</style>

<style scoped>
.input-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

:global(.p-inputtextarea) {
  font-size: 1rem;
  padding: 0.9rem 1rem;
  width: 100%;
  resize: vertical;
  min-height: 100px;
}

:global(.p-inputnumber-input),
:global(.p-dropdown) {
  font-size: 1rem;
  padding: 0.9rem 1rem;
  width: 100%;
}

.file-upload-container {
  position: relative;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
  font-size: 1rem;
}

.file-label:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.success {
  color: #059669;
  margin-top: 0.75rem;
  text-align: center;
  font-weight: 500;
}
</style>
