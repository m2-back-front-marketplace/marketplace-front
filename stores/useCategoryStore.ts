import { defineStore } from "pinia";
import { ref } from "vue";

export const useCategoryStore = defineStore("category", () => {
  const category = ref();

  return { category };
});
