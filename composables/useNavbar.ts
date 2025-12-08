export const useCategories = () => {
    const { data, pending, error } = useFetch('http://localhost:8000/category') 
  
    return {
      categories: data,
      pending,
      error
    }
  }
  