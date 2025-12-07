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
    baseURL: config.public.apiBase || "http://localhost:3000/api",
  };
};

export const useAuthToken = () => {
  const token = useCookie("auth_token", {
    maxAge: 60 * 60 * 24 * 7, // 7 jours
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

export const useApi = <T = unknown>(
  url: string,
  options?: UseFetchOptions<T>,
) => {
  const { baseURL } = useApiConfig();
  const { token } = useAuthToken();
  const router = useRouter();

  const defaults: UseFetchOptions<T> = {
    baseURL,

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
