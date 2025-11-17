export const useApi = () => {
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || ''
  
    // pour SSR : on garde les cookies existants
    const headers = process.server ? useRequestHeaders(['cookie']) : {}
  
    const $api = $fetch.create({
      baseURL: apiBase,        // http://localhost:8000
      credentials: 'include',  // 🔑 indispensable pour cookie httpOnly
      headers,                 // utile côté serveur
    })
  
    return { $api }
  }
  