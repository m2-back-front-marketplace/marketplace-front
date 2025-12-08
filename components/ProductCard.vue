<template>
    <div>bite {{ (name, price) }}</div>
    <Card
        class="product-card hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
    >
        <template #header>
            <!-- Zone d'image (rouge en attendant la BDD) -->
            <div class="product-img-placeholder">
                <span class="placeholder-text">Image</span>
            </div>
        </template>

        <template #title>
            <div class="title">{{ name }}</div>
        </template>

        <template #subtitle>
            <div class="price">{{ formatPrice(price) }}</div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { defineProps } from "vue";
import Card from "primevue/card";
import { useProducts } from "@/composables/useProducts";

const { getProducts } = useProducts();

console.log(getProducts());

const formatPrice = (value: number) => {
    if (isNaN(value)) return "";
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(value);
};
</script>

<style scoped>
.product-card {
    width: 250px;
    border-radius: 12px;
    overflow: hidden;
    background-color: #fff;
}
.product-card:hover {
    transform: scale(1.03);
}

/* Zone rouge provisoire pour l'image */
.product-img-placeholder {
    width: 100%;
    height: 200px;
    background-color: #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
}

.placeholder-text {
    font-size: 1.1rem;
    opacity: 0.9;
}

.title {
    font-weight: 700;
    font-size: 1.1rem;
    color: #111827;
    margin-top: 0.5rem;
}

.price {
    font-size: 1rem;
    color: #4b5563;
    margin-top: 0.25rem;
}

:deep(.p-card-body) {
    padding: 1rem 1.2rem 1.2rem;
}
</style>
