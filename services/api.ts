import type { UseFetchOptions } from "nuxt/app";

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: {
    message: string;
    code?: string;
    statusCode?: number;
  };
}

export const useApiConfig = () => {
  const config = useRuntimeConfig();
  return {
    baseURL: config.public.apiBase || "http://localhost:8000/api",
  };
};

export const useAuthToken = () => {
  const token = useCookie("auth_token", {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  const setToken = (newToken: string) => {
    token.value = newToken;
  };

  const clearToken = () => {
    token.value = null;
  };

  return {
    token,
    setToken,
    clearToken,
  };
};

// ===== FONCTIONS SSR (useFetch) - Pour le rendu initial =====

export const useApi = <T = unknown>(
  url: string,
  options?: UseFetchOptions<T>,
) => {
  const { baseURL } = useApiConfig();
  const { token } = useAuthToken();
  const router = useRouter();

  const defaults: UseFetchOptions<T> = {
    baseURL,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      ...options?.headers,
    },

    onResponseError({ response }) {
      if (response.status === 401) {
        const { clearToken } = useAuthToken();
        clearToken();
        router.push("/login");
      }
    },

    transform: (response: any) => {
      return response?.data ?? response;
    },
  };

  return useFetch<T>(url, {
    ...defaults,
    ...options,
    headers: {
      ...defaults.headers,
      ...options?.headers,
    },
  });
};

export const useApiGet = <T = unknown>(
  url: string,
  options?: UseFetchOptions<T>,
) => {
  return useApi<T>(url, { ...options, method: "GET" });
};

// ===== FONCTIONS CLIENT ($fetch) =====

const getClientHeaders = () => {
  const { token } = useAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
  };
};

const handleClientError = async (error: any) => {
  if (error.status === 401) {
    const { clearToken } = useAuthToken();
    clearToken();
    await navigateTo("/login");
  }
  throw error;
};

// Client POST (pour formulaires)
export const useClientPost = async <T = unknown>(
  url: string,
  body?: any,
  options: { headers?: Record<string, string> } = {}
) => {
  const { baseURL } = useApiConfig();

  try {
    const data = await $fetch<T>(url, {
      baseURL,
      method: "POST",
      body,
      credentials: "include",
      headers: {
        ...getClientHeaders(),
        ...options.headers,
      },
    });
    return { data, error: null };
  } catch (error: any) {
    await handleClientError(error);
    return { data: null, error };
  }
};

// Client PUT
export const useClientPut = async <T = unknown>(
  url: string,
  body?: any,
  options: { headers?: Record<string, string> } = {}
) => {
  const { baseURL } = useApiConfig();

  try {
    const data = await $fetch<T>(url, {
      baseURL,
      method: "PUT",
      body,
      credentials: "include",
      headers: {
        ...getClientHeaders(),
        ...options.headers,
      },
    });
    return { data, error: null };
  } catch (error: any) {
    await handleClientError(error);
    return { data: null, error };
  }
};

// Client DELETE
export const useClientDelete = async <T = unknown>(
  url: string,
  options: { headers?: Record<string, string> } = {}
) => {
  const { baseURL } = useApiConfig();

  try {
    const data = await $fetch<T>(url, {
      baseURL,
      method: "DELETE",
      credentials: "include",
      headers: {
        ...getClientHeaders(),
        ...options.headers,
      },
    });
    return { data, error: null };
  } catch (error: any) {
    await handleClientError(error);
    return { data: null, error };
  }
};

export const useClientPostFormData = async <T = unknown>(
  url: string,
  formData: FormData
) => {
  const { baseURL } = useApiConfig();
  const { token } = useAuthToken();

  try {
    const data = await $fetch<T>(url, {
      baseURL,
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      },
    });
    return { data, error: null };
  } catch (error: any) {
    await handleClientError(error);
    return { data: null, error };
  }
};

export const useClientGet = async <T = unknown>(
  url: string,
) => {
  const { baseURL } = useApiConfig();
  const { token } = useAuthToken();

  try {
    const data = await $fetch<T>(url, {
      baseURL,
      method: "GET",
      credentials: "include",
      headers: {
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
      },
    });
    return { data, error: null };
  } catch (error: any) {
    await handleClientError(error);
    return { data: null, error };
  }
};

// ===== FONCTIONS LEGACY (pour compatibilité) =====

export const useApiPost = <T = unknown>(
  url: string,
  body?: any,
  options?: UseFetchOptions<T>,
) => {
  return useApi<T>(url, { ...options, method: "POST", body });
};

export const useApiPut = <T = unknown>(
  url: string,
  body?: any,
  options?: UseFetchOptions<T>,
) => {
  return useApi<T>(url, { ...options, method: "PUT", body });
};

export const useApiPatch = <T = unknown>(
  url: string,
  body?: any,
  options?: UseFetchOptions<T>,
) => {
  return useApi<T>(url, { ...options, method: "PATCH", body });
};

export const useApiDelete = <T = unknown>(
  url: string,
  options?: UseFetchOptions<T>,
) => {
  return useApi<T>(url, { ...options, method: "DELETE" });
};
