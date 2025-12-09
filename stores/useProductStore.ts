import { defineStore } from "pinia";
import { useClientPost } from "~/services/api"

interface CreateProductForm {
  name: string;
  description: string;
  price: number;
  quantity: number;
  sellerId: number;
  discoundId: number;
  categoriesId: number
}

export const useProductStore = defineStore("product", () => {
  async function createProduct (form: CreateProductForm ) {
    try {
      const data =  await useClientPost('/product/create', form);
      return data;
    }
    catch(error) {
      console.error(error);
    }
  }

  return { createProduct }
});
