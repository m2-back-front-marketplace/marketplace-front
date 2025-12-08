import { useApiGet } from '@/services/api';

export const useCategories = () => {
    const { data, pending, error } = useApiGet('http://localhost:8000/category') 
  
    return {
      categories: data,
      pending,
      error
    }
  }
  