export default defineNuxtRouteMiddleware((to) => {
    const token = useCookie<string | null>('auth_token')
  
    if (!token.value) {
      if (!to.path.startsWith('/auth')) {
        return navigateTo('/auth/login')
      }
    }
  })
  