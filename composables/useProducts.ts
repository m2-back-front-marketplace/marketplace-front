import { useApiPost, useApiDelete, useApiPut, useApiGet } from "~/services/api";
import { useProductStore } from "~/stores/productStore";

interface CreateProduct {
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  seller_id: number;
  discount_id: number;
  category_id: number;
}

interface UpdateProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  seller_id: number;
  discount_id: number;
  category_id: number;
}

interface DeleteProduct {
  id: number;
}

export const useProducts = () => {
  const productStore = useProductStore();
  async function getProducts() {
    try {
      const res = await useApiGet("/product/getAllProducts");
      productStore.products = res.data.value;
      console.log(res, "caca");
      return res.data.value;
    } catch (error) {
      console.error("Error while fetching products:", error);
    }
  }

  return { getProducts };
};
