import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useClientGet } from '@/services/api';

interface Category {
  id: number;
  name: string;
}

export const useCategoryStore = defineStore("category", () => {
  const categories = ref<Category[]>([]) ;

  const categoryOptions = computed(() => {
    if (categories.value.length <= 0) {
      return [];
    }
    return categories.value.map(category => ({
      label: category.name,
      value: category.id
    }));
  });


  async function loadCategoryList() {
    try {
      const data = await useClientGet<Category[]>('/category');
      if (!data.data) {
        console.error("Error while trying to get the categories");
        return;
      }
      console.log("Catégories chargées:", data.data.data);
      categories.value = data.data.data;
    } catch {
      console.error("Error while trying to get the categories")
    }
  }

  return { categories, loadCategoryList, categoryOptions };
});
