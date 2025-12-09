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
                <InputGroupAddon
                    ><i class="pi pi-align-left"
                /></InputGroupAddon>
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
            <Select
                v-model="product.category"
                :options="categoryOptions"
                option-label="label"
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
                    {{ selectedFileName || "Choisir une image" }}
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
import { ref, computed, onMounted } from "vue";
import { useCategoryStore } from "~/stores/useCategoryStore";
import { useClientPostFormData, useClientPost } from "~/services/api";

const product = ref({
    name: "",
    description: "",
    quantity: 0,
    price: 0,
    category: null,
    file: null as File | null,
});

const categoryStore = useCategoryStore();
const loading = ref(false);
const error = ref("");
const success = ref("");
const selectedFileName = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const categoryOptions = computed(() => {
    return categoryStore.categories.map((cat) => ({
        label: cat.name,
        value: cat.id,
    }));
});

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target?.files?.[0] ?? null;
    product.value.file = file;
    if (file) {
        selectedFileName.value = file.name;
    } else {
        selectedFileName.value = "";
    }
};

const onSubmit = async () => {
    loading.value = true;
    error.value = "";
    success.value = "";

    try {
        const payload: any = {
            name: product.value.name,
            description: product.value.description,
            price: Number(product.value.price),
            quantity: Number(product.value.quantity),
        };

        if (
            product.value.category !== null &&
            product.value.category !== undefined
        ) {
            payload.categories_id = [Number(product.value.category)];
        }

        const res = await useClientPost("/product/create", payload);
        if (res.error || !res.data) {
            throw (
                res.error || new Error("Erreur lors de la création du produit")
            );
        }

        const createdProduct =
            (res.data as any).product ||
            (res.data as any).data?.product ||
            res.data;
        const productId = createdProduct?.id;

        if (!productId) {
            success.value =
                "Produit créé mais impossible de récupérer l'ID depuis la réponse.";
        } else {
            if (product.value.file) {
                const formData = new FormData();
                formData.append("file", product.value.file);

                const uploadRes = await useClientPostFormData(
                    `/product/${productId}/images`,
                    formData,
                );
                if (uploadRes.error) {
                    error.value =
                        "Produit créé, mais l'upload de l'image a échoué.";
                    console.error("Image upload failed:", uploadRes.error);
                } else {
                    success.value = "Produit et image ajoutés avec succès.";
                }
            } else {
                success.value = "Produit ajouté avec succès.";
            }
        }
        product.value = {
            name: "",
            description: "",
            quantity: 0,
            price: 0,
            category: null,
            file: null,
        };
        selectedFileName.value = "";
        if (fileInput.value) fileInput.value.value = "";
    } catch (err: any) {
        error.value =
            err?.message || String(err) || "Erreur lors de l'ajout du produit";
        console.error("Add product error:", err);
    } finally {
        loading.value = false;
    }
};

const resetForm = () => {
    product.value = {
        name: "",
        description: "",
        quantity: 0,
        price: 0,
        category: null,
        file: null,
    };
    selectedFileName.value = "";
    if (fileInput.value) fileInput.value.value = "";
};

onMounted(async () => {
    try {
        if (categoryStore.categories.length <= 0) {
            await categoryStore.loadCategoryList();
        }
    } catch (err) {
        console.error(
            "Error while trying to mount the categories of the component AddProductForm",
            err,
        );
    }
});
</script>

<style scoped src="../auth/LoginForm/style.css"></style>

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
