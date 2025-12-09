import { useApiGet } from '@/services/api'
import { useProductStore } from '@/stores/useProductStore'

export const useProduct = (id: number | string) => {
  const productStore = useProductStore()
  const { data, pending, error } = useApiGet(`http://localhost:8000/product/${id}`)

  watchEffect(() => {
    console.log('[DEBUG] Fetched product:', data.value)
  })
  productStore.product = data.value


  return {
    product: data,
    pending,
    error
  }
}
