import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useUserStore } from "~/stores/useUserStore";

/**
 * Store de panier:
 * - Persistance locale via localStorage pour les utilisateurs non connectés (guest).
 * - Synchronisation avec l'API backend si l'utilisateur est connecté.
 *
 * Endpoints backend (attendus) :
 * - GET    /cart           -> récupère le panier (avec credentials)
 * - POST   /cart/items     -> ajoute un item { productId, quantity }
 * - PUT    /cart/items/:id -> met à jour la quantité { quantity }
 * - DELETE /cart/items/:id -> supprime un item
 * - DELETE /cart          -> vide le panier
 *
 * Le store essaie d'être tolérant : si le backend n'est pas disponible,
 * il continue à fonctionner en mode local (localStorage).
 */

/* Types */
interface ProductSnapshot {
  id: number;
  name?: string;
  price?: number;
  images?: { url: string }[];
  quantity?: number; // stock disponible si connu
  [key: string]: any;
}

interface CartItem {
  id?: number; // id côté serveur (si présent)
  productId: number; // id du produit
  quantity: number;
  product?: ProductSnapshot; // snapshot pour affichage sans requêtes supplémentaires
}

interface Cart {
  id?: number;
  client_id?: number;
  items: CartItem[];
}

/* Constantes */
const LOCAL_STORAGE_KEY = "varketplace_cart_v1";
const LOCAL_STORAGE_TTL = 7 * 24 * 60 * 60 * 1000; // 1 semaine en ms

/* Utilitaires locaux */
const isClient = typeof window !== "undefined";

/**
 * Format de stockage en localStorage :
 * {
 *   items: CartItem[],
 *   expiresAt: number (timestamp ms)
 * }
 *
 * Lors de la lecture, si la clé existe mais est expirée, on la supprime et on renvoie un panier vide.
 * On prend aussi en charge l'ancien format (objet Cart simple avec seulement items[]).
 */
function readLocalCart(): Cart {
  if (!isClient) return { items: [] };
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return { items: [] };

    const parsed = JSON.parse(raw);
    const now = Date.now();

    // Si on a un champ expiresAt (nouveau format)
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof parsed.expiresAt === "number"
    ) {
      if (parsed.expiresAt < now) {
        // expiré -> supprimer et retourner vide
        try {
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch {}
        return { items: [] };
      }
      // expiré non atteint -> vérifier items
      if (Array.isArray(parsed.items)) {
        // Retourner uniquement la structure Cart (sans expiresAt)
        return { items: parsed.items };
      }
      return { items: [] };
    }

    // Support pour l'ancien format (parsed.items est un tableau) :
    if (parsed && Array.isArray(parsed.items)) {
      // migrer en ajoutant expiresAt
      try {
        const payload = {
          items: parsed.items,
          expiresAt: now + LOCAL_STORAGE_TTL,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
      } catch {}
      return { items: parsed.items };
    }

    return { items: [] };
  } catch (e) {
    // Si parse fail, on supprime la clé corrompue
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
    return { items: [] };
  }
}

function writeLocalCart(cart: Cart) {
  if (!isClient) return;
  try {
    const payload = {
      items: Array.isArray(cart.items) ? cart.items : [],
      expiresAt: Date.now() + LOCAL_STORAGE_TTL,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    // ignore storage errors (quota etc.)
  }
}

/* Store */
export const useCartStore = defineStore("cart", () => {
  const cart = ref<Cart>({ items: [] });
  const loading = ref(false);
  const error = ref<string | null>(null);

  const userStore = useUserStore();

  // Ensure cart.value is always a valid Cart object with items to avoid null access errors
  function ensureCart() {
    if (!cart.value || typeof cart.value !== "object") {
      cart.value = { items: [] } as Cart;
    }
    if (!Array.isArray((cart.value as Cart).items)) {
      (cart.value as Cart).items = [];
    }
  }

  // Initialize cart immediately so computed props and methods are safe
  ensureCart();

  const items = computed(
    () => ((cart.value as Cart).items ?? []) as CartItem[],
  );
  const totalItems = computed(() =>
    items.value.reduce((s, it) => s + (it.quantity ?? 0), 0),
  );
  const totalPrice = computed(() =>
    items.value.reduce(
      (s, it) => s + it.quantity * (it.product?.price ?? 0),
      0,
    ),
  );

  /* Helpers pour appeler le backend via Nuxt $fetch */
  const nuxtApp = (
    typeof useNuxtApp === "function" ? useNuxtApp() : null
  ) as any;
  const $fetchClient =
    nuxtApp?.$fetch ?? (typeof $fetch !== "undefined" ? $fetch : null);

  function buildHeaders() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    // Si le user store contient un token, on l'ajoute
    const token: any = (userStore && (userStore as any).token) ?? null;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  async function loadCart() {
    loading.value = true;
    error.value = null;

    // Si utilisateur connecté -> essayer de charger depuis le serveur
    const isAuthenticated = !!(userStore && (userStore as any).user);
    if (isAuthenticated && $fetchClient) {
      try {
        const config = useRuntimeConfig();
        const baseURL = config.public.apiBase || "http://localhost:8000/api";
        const url = `${baseURL}/cart`;
        // utiliser credentials pour cookies si c'est la méthode d'auth
        const data = await $fetchClient(url, {
          method: "GET",
          credentials: "include",
          headers: buildHeaders(),
        });
        // backend peut renvoyer { data: cart, message } ou directement cart
        const remoteCart = (data && (data as any).data) ?? data ?? null;
        if (remoteCart) {
          cart.value = {
            id: remoteCart.id,
            client_id: remoteCart.client_id,
            items: (remoteCart.items ?? []).map((it: any) => ({
              id: it.id,
              productId: it.product_id ?? it.productId ?? it.product?.id,
              quantity: it.quantity ?? 0,
              product: it.product ?? undefined,
            })),
          };
          // nettoyer localStorage (on considère que le remote est source de vérité)
          writeLocalCart(cart.value);
          loading.value = false;
          return { data: cart.value, error: null };
        }
      } catch (err: any) {
        // si erreur serveur -> fallback sur local
        error.value =
          err?.message ?? "Erreur lors du chargement du panier distant";
        // continue pour charger le local
      } finally {
        loading.value = false;
      }
    }

    // Mode invité ou fallback : charger depuis localStorage
    const local = readLocalCart();
    cart.value = local;
    loading.value = false;
    return { data: cart.value, error: null };
  }

  /**
   * Fusionne les items du localStorage vers le backend.
   * Utilisé typiquement lorsque l'utilisateur se connecte.
   */
  async function mergeLocalToServer() {
    if (!$fetchClient) return;
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase || "http://localhost:8000/api";
    const local = readLocalCart();
    if (!local.items || local.items.length === 0) return;

    loading.value = true;
    try {
      // pour chaque item local, appeler POST /cart/items
      for (const it of local.items) {
        try {
          await $fetchClient(`${baseURL}/cart/items`, {
            method: "POST",
            body: { productId: it.productId, quantity: it.quantity },
            credentials: "include",
            headers: buildHeaders(),
          });
        } catch (e) {
          // ignorer erreurs individuelles pour continuer la fusion
        }
      }
      // après fusion, recharger le panier depuis le serveur et vider local
      await loadCart();
      // vider localStorage
      writeLocalCart({ items: [] });
    } catch (e: any) {
      // ignore
    } finally {
      loading.value = false;
    }
  }

  /**
   * Ajoute un produit au panier.
   * - Si utilisateur connecté : appelle le backend et recharge le panier.
   * - Sinon : met à jour localStorage.
   */
  async function addToCart(product: ProductSnapshot | number, quantity = 1) {
    error.value = null;
    const productId = typeof product === "number" ? product : product.id;
    const isAuthenticated = !!(userStore && (userStore as any).user);

    // Ensure cart exists before any access
    ensureCart();

    // Mode invité : mise à jour locale (optimistic)
    if (!isAuthenticated || !$fetchClient) {
      // Cherche si l'item existe
      const found = cart.value.items.find((it) => it.productId === productId);
      if (found) {
        found.quantity = (found.quantity ?? 0) + quantity;
      } else {
        const snapshot: ProductSnapshot | undefined =
          typeof product === "object" ? product : undefined;
        cart.value.items.push({
          productId,
          quantity,
          product: snapshot,
        });
      }
      writeLocalCart(cart.value);
      return { data: cart.value, error: null };
    }

    // Mode connecté : appeler backend
    loading.value = true;
    try {
      const config = useRuntimeConfig();
      const baseURL = config.public.apiBase || "http://localhost:8000/api";
      const url = `${baseURL}/cart/items`;
      const data = await $fetchClient(url, {
        method: "POST",
        body: { productId, quantity },
        credentials: "include",
        headers: buildHeaders(),
      });
      // recharger le panier
      await loadCart();
      return { data, error: null };
    } catch (err: any) {
      error.value = err?.message ?? "Erreur ajout panier";
      // fallback: appliquer localement pour éviter perte d'expérience
      const found = cart.value.items.find((it) => it.productId === productId);
      if (found) {
        found.quantity = (found.quantity ?? 0) + quantity;
      } else {
        const snapshot: ProductSnapshot | undefined =
          typeof product === "object" ? product : undefined;
        cart.value.items.push({
          productId,
          quantity,
          product: snapshot,
        });
      }
      writeLocalCart(cart.value);
      return { data: cart.value, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Met à jour un item existant.
   * Si itemId correspond à un id serveur (number) on utilise endpoint PUT /cart/items/:id
   * Sinon on met à jour localement en cherchant par productId.
   */
  async function updateItem(itemIdOrProductId: number, quantity: number) {
    error.value = null;
    const isAuthenticated = !!(userStore && (userStore as any).user);

    // Ensure cart exists before access
    ensureCart();

    // Cherche localement (par id serveur ou productId)
    const localIndex = (cart.value.items ?? []).findIndex(
      (it) => it.id === itemIdOrProductId || it.productId === itemIdOrProductId,
    );
    const localItem = localIndex >= 0 ? cart.value.items[localIndex] : null;

    if (!isAuthenticated || !$fetchClient || !localItem || !localItem.id) {
      // mode local ou pas d'id serveur -> update local
      if (localItem) {
        localItem.quantity = quantity;
        writeLocalCart(cart.value);
        return { data: cart.value, error: null };
      } else {
        // si pas trouvé, rien à faire
        return { data: null, error: "Item introuvable" };
      }
    }

    // mode connecté avec id serveur
    loading.value = true;
    try {
      const config = useRuntimeConfig();
      const baseURL = config.public.apiBase || "http://localhost:8000/api";
      const url = `${baseURL}/cart/items/${localItem.id}`;
      const data = await $fetchClient(url, {
        method: "PUT",
        body: { quantity },
        credentials: "include",
        headers: buildHeaders(),
      });
      await loadCart();
      return { data, error: null };
    } catch (err: any) {
      error.value = err?.message ?? "Erreur update item";
      loading.value = false;
      return { data: null, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Supprime un item du panier.
   * itemIdOrProductId peut être soit l'id serveur (item.id) soit productId.
   */
  async function removeItem(itemIdOrProductId: number) {
    error.value = null;
    const isAuthenticated = !!(userStore && (userStore as any).user);

    // Ensure cart exists before access
    ensureCart();

    const foundIndex = (cart.value.items ?? []).findIndex(
      (it) => it.id === itemIdOrProductId || it.productId === itemIdOrProductId,
    );
    const found = foundIndex >= 0 ? cart.value.items[foundIndex] : null;

    if (!found) {
      return { data: null, error: "Item introuvable" };
    }

    if (!isAuthenticated || !$fetchClient || !found.id) {
      // suppression locale
      cart.value.items.splice(foundIndex, 1);
      writeLocalCart(cart.value);
      return { data: cart.value, error: null };
    }

    // suppression serveur
    loading.value = true;
    try {
      const config = useRuntimeConfig();
      const baseURL = config.public.apiBase || "http://localhost:8000/api";
      const url = `${baseURL}/cart/items/${found.id}`;
      const data = await $fetchClient(url, {
        method: "DELETE",
        credentials: "include",
        headers: buildHeaders(),
      });
      await loadCart();
      return { data, error: null };
    } catch (err: any) {
      error.value = err?.message ?? "Erreur suppression item";
      loading.value = false;
      return { data: null, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  /**
   * Vide le panier (local ou distant selon l'auth).
   */
  async function clearCart() {
    error.value = null;
    const isAuthenticated = !!(userStore && (userStore as any).user);

    if (!isAuthenticated || !$fetchClient) {
      cart.value = { items: [] };
      writeLocalCart(cart.value);
      return { data: cart.value, error: null };
    }

    loading.value = true;
    try {
      const config = useRuntimeConfig();
      const baseURL = config.public.apiBase || "http://localhost:8000/api";
      const url = `${baseURL}/cart`;
      const data = await $fetchClient(url, {
        method: "DELETE",
        credentials: "include",
        headers: buildHeaders(),
      });
      cart.value = { items: [] };
      writeLocalCart(cart.value);
      return { data: cart.value, error: null };
    } catch (err: any) {
      error.value = err?.message ?? "Erreur vidage panier";
      loading.value = false;
      return { data: null, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  /* Lorsque l'utilisateur devient connecté (ou se déconnecte), on tente des actions */
  // Si l'utilisateur se connecte : fusionner local -> server puis recharger
  watch(
    () => (userStore as any).user,
    async (newUser, oldUser) => {
      // si on passe de guest -> connecté, faire merge
      if (!oldUser && newUser) {
        await mergeLocalToServer();
      }
      // si on se déconnecte, on recharge local depuis storage
      if (oldUser && !newUser) {
        const local = readLocalCart();
        cart.value = local;
      }
    },
  );

  // Sauvegarde automatique dans localStorage à chaque changement de cart (utile pour guest)
  watch(
    cart,
    (newCart) => {
      writeLocalCart(newCart);
    },
    { deep: true },
  );

  /* Initialisation (client-side) : charger le panier */
  if (isClient) {
    // On ne "await" pas ici — l'appel peut être fait par la page/layour lors du montage
    // Mais on peut lancer un chargement asynchrone
    loadCart().catch(() => {});
  }

  return {
    // state
    cart,
    items,
    totalItems,
    totalPrice,
    loading,
    error,

    // actions
    loadCart,
    mergeLocalToServer,
    addToCart,
    updateItem,
    removeItem,
    clearCart,

    // util
    readLocalCart,
    writeLocalCart,
  };
});
