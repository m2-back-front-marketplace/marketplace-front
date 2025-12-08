import { useApiGet } from "~/services/api";
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

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image?: string;
  seller_id: number;
  discount_id?: number;
  category_id: number;
  created_at?: string;
  updated_at?: string;
}

export const useProducts = () => {
  const productStore = useProductStore();

  const getProductsSSR = () => {
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase || "http://localhost:8000/api";

    return useFetch("/product/getAllProducts", {
      baseURL,
      key: 'products-list',
      transform: (response: any) => response?.data || response,
      default: () => [],
      onResponse({ response }) {
        // Met à jour le store avec les données
        if (response._data) {
          productStore.products = response._data;
        }
      }
    });
  };

  // Fonction pour récupérer un produit spécifique (SSR)
  const getProductByIdSSR = (id: string | number) => {
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase || "http://localhost:8000/api";

    return useFetch(`/product/getProduct/${id}`, {
      baseURL,
      key: `product-${id}`,
      transform: (response: any) => response?.data || response,
    });
  };

  // Fonction pour les actions côté client (création, mise à jour, suppression)
  const createProduct = async (productData: CreateProduct) => {
    try {
      const { data, error } = await useApiPost("/product/create", productData);

      if (data.value && !error.value) {
        // Rafraîchir la liste des produits après création
        await refreshCookie('products-list');
        // Optionnel : mettre à jour le store
        await getProductsSSR();
      }

      return { data, error };
    } catch (error) {
      console.error("Error while creating product:", error);
      return { data: null, error };
    }
  };

  const updateProduct = async (productData: UpdateProduct) => {
    try {
      const { data, error } = await useApiPut(`/product/update/${productData.id}`, productData);

      if (data.value && !error.value) {
        // Rafraîchir les données du produit et la liste
        await refreshCookie(`product-${productData.id}`);
        await refreshCookie('products-list');
      }

      return { data, error };
    } catch (error) {
      console.error("Error while updating product:", error);
      return { data: null, error };
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      const { data, error } = await useApiDelete(`/product/delete/${productId}`);

      if (data.value && !error.value) {
        // Rafraîchir la liste après suppression
        await refreshCookie('products-list');
        await getProductsSSR();
      }

      return { data, error };
    } catch (error) {
      console.error("Error while deleting product:", error);
      return { data: null, error };
    }
  };

  // Fonctions utilitaires
  const formatPrice = (value: number) => {
    if (isNaN(value)) return "";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const filterProductsByCategory = (products: Product[], categoryId: number) => {
    return products.filter(product => product.category_id === categoryId);
  };

  const searchProducts = (products: Product[], searchTerm: string) => {
    const term = searchTerm.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  };

  return {
    // Fonctions SSR (à utiliser dans les pages/composants)
    getProductsSSR,
    getProductByIdSSR,

    // Fonctions client (pour les actions)
    createProduct,
    updateProduct,
    deleteProduct,

    // Utilitaires
    formatPrice,
    filterProductsByCategory,
    searchProducts,

    // Store
    productStore
  };
};
