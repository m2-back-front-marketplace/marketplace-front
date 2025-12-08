import { useApiGet } from '@/services/api';
import { useCategoryStore } from '@/stores/useCategoryStore';

export const useCategories = () => {
  const categoryStore = useCategoryStore();
    const { data, pending, error } = useApiGet('http://localhost:8000/category') 
    categoryStore.category = data.value;
  
    return {
      categories: data,
      pending,
      error
    }
  }
  