import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiGet } from '@/services/api';

export const useCategoryStore = defineStore("category", () => {
  const categories = ref([]);

  async function loadCategoryList() {
    try {
      const data = await useApiGet('/category');
      console.log("data",data)
    } catch {
      console.error("Error while trying to get the categories")
    }
  }

  return { categories, loadCategoryList };
});
