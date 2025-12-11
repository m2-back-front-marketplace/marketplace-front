import { useProductStore } from "@/stores/useProductStore";

export const useProduct = (id: number | string) => {
  const productStore = useProductStore();

  const { data, error, pending } = useFetch(`/product/getProductById/${id}`, {
    baseURL: process.env.NUXT_PUBLIC_API_BASE,
    key: `product-${id}`,
    transform: (response) => response?.data || null,
    default: () => null,
  });

  return {
    product: data,
    pending,
    error,
  };
};
