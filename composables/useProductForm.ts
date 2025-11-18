import { reactive, ref, toRaw } from "vue";

export type Product = {
  name: string;
  description: string;
  quantity: number | null;
  price: number | null;
  category: string | null;
  promotionEnabled: boolean;
  promotionPrice: number | null;
};

export function useProductForm(initial?: Partial<Product>) {
  const product = reactive<Product>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    quantity: initial?.quantity ?? null,
    price: initial?.price ?? null,
    category: initial?.category ?? null,
    promotionEnabled: initial?.promotionEnabled ?? false,
    promotionPrice: initial?.promotionPrice ?? null,
  });

  const errors = ref<Record<keyof Product | "form", string | null>>({
    name: null,
    description: null,
    quantity: null,
    price: null,
    category: null,
    promotionEnabled: null,
    promotionPrice: null,
    form: null,
  });

  const categories = ref([
    { label: "Electronics", value: "electronics" },
    { label: "Clothing", value: "clothing" },
    { label: "Home & Garden", value: "home" },
    { label: "Books", value: "books" },
    { label: "Other", value: "other" },
  ]);

  function validate() {
    Object.keys(errors.value).forEach(
      (k) => (errors.value[k as keyof typeof errors.value] = null),
    );

    let ok = true;

    if (!product.name || !product.name.trim()) {
      errors.value.name = "Name is required";
      ok = false;
    }

    if (!product.description || !product.description.trim()) {
      errors.value.description = "Description is required";
      ok = false;
    }

    if (
      product.quantity === null ||
      product.quantity === undefined ||
      Number.isNaN(product.quantity)
    ) {
      errors.value.quantity = "Quantity is required";
      ok = false;
    } else if (product.quantity < 0) {
      errors.value.quantity = "Quantity cannot be negative";
      ok = false;
    }

    if (
      product.price === null ||
      product.price === undefined ||
      Number.isNaN(product.price)
    ) {
      errors.value.price = "Price is required";
      ok = false;
    } else if (product.price < 0) {
      errors.value.price = "Price cannot be negative";
      ok = false;
    }

    if (!product.category) {
      errors.value.category = "Category is required";
      ok = false;
    }

    if (product.promotionEnabled) {
      if (
        product.promotionPrice === null ||
        product.promotionPrice === undefined ||
        Number.isNaN(product.promotionPrice)
      ) {
        errors.value.promotionPrice =
          "Promotion price is required when promotion is enabled";
        ok = false;
      } else if (product.promotionPrice < 0) {
        errors.value.promotionPrice = "Promotion price cannot be negative";
        ok = false;
      } else if (
        product.price !== null &&
        product.promotionPrice >= product.price
      ) {
        errors.value.promotionPrice =
          "Promotion price must be lower than regular price";
        ok = false;
      }
    }

    return ok;
  }

  async function submit(onSubmit: (payload: Product) => Promise<void> | void) {
    errors.value.form = null;
    if (!validate()) {
      errors.value.form = "Please fix validation errors";
      return { success: false, errors: toRaw(errors.value) };
    }

    try {
      await onSubmit(toRaw(product));
      return { success: true, errors: null };
    } catch (err: any) {
      errors.value.form = err?.message ?? "Submission failed";
      return { success: false, errors: toRaw(errors.value) };
    }
  }

  function reset(next?: Partial<Product>) {
    product.name = next?.name ?? "";
    product.description = next?.description ?? "";
    product.quantity = next?.quantity ?? null;
    product.price = next?.price ?? null;
    product.category = next?.category ?? null;
    product.promotionEnabled = next?.promotionEnabled ?? false;
    product.promotionPrice = next?.promotionPrice ?? null;
    Object.keys(errors.value).forEach(
      (k) => (errors.value[k as keyof typeof errors.value] = null),
    );
  }

  async function getProductList() {
    try {
      const res = await $fetch(`${import.vite.meta.env.API_URL}/`);
    } catch {}
  }

  return {
    product,
    errors,
    categories,
    validate,
    submit,
    reset,
  };
}
