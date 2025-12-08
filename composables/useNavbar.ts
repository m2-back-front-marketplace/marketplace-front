import { useApiGet } from '@/services/api';
import { useCategoryStore } from '@/stores/useCategoryStore';

export const useNavbar = () => {
  const categoryStore = useCategoryStore();
  const { data, pending, error } = useApiGet('/category');
    categoryStore.category = data.value;

    return {
      categories: data,
    }
  }
