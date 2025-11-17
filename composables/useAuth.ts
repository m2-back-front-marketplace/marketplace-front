// composables/useAuth.ts
import { useRouter, useRuntimeConfig } from '#imports'

type LoginPayload = { email: string; password: string }
type ProRegisterPayload = { type: 'pro'; company: string; email: string; password: string; siret: number | null; vat: number | null }
type PartRegisterPayload = { type: 'part'; fullname: string; firstname: string; email: string; password: string }
type RegisterPayload = ProRegisterPayload | PartRegisterPayload

type User = { id: number; email: string; name: string }
type AuthResponse = { token: string; user: User }

const isProPayload = (p: RegisterPayload): p is ProRegisterPayload =>
  p.type === 'pro'

export const useAuth = () => {
  const router = useRouter()
  const {
    public: {
      apiBase = 'mock',          
      enableMockAuth = true,     
      mockLatencyMs = 400,      
      loginRedirect = '/sandbox',
      autoLoginAfterRegister = true 
    }
  } = useRuntimeConfig()

  const token = useCookie<string | null>('auth_token', { sameSite: 'lax' })
  const user = useState<User | null>('auth_user', () => null)
  const loading = useState<boolean>('auth_loading', () => false)
  const error = useState<string | null>('auth_error', () => null)

  const isLoggedIn = computed<boolean>(() => Boolean(token.value))

  const mockLogin = async (payload: LoginPayload): Promise<AuthResponse> => {
    // Simple validation côté client pour feedback UI (passe ESLint/TS)
    if (!payload.email || !payload.password) {
      throw new Error('Email et mot de passe requis')
    }
    await new Promise((r) => setTimeout(r, Number(mockLatencyMs) || 0))
    return {
      token: 'mock-token-123',
      user: { id: 1, email: payload.email, name: 'Utilisateur démo' }
    }
  }

  const mockRegister = async (payload: RegisterPayload): Promise<AuthResponse> => {
    await new Promise(r => setTimeout(r, Number(mockLatencyMs) || 0))

    if (isProPayload(payload)) {
      return {
        token: 'mock-token-register-pro',
        user: {
          id: 2,
          email: payload.email,
          name: payload.company || 'Pro démo'
        }
      }
    }

    return {
      token: 'mock-token-register-part',
      user: {
        id: 3,
        email: payload.email,
        name: `${payload.firstname} ${payload.fullname}`.trim() || 'Particulier démo'
      }
    }
  }

  const realLogin = async (payload: LoginPayload): Promise<any> => {
    return await $fetch(`${apiBase}/user/login`, {
      method: 'POST',
      body: payload
    })
  }

  const realRegister = async (payload: RegisterPayload): Promise<AuthResponse> => {
    if (isProPayload(payload)) {
      // PRO -> /user/registerSeller
      await $fetch(`${apiBase}/user/registerSeller`, {
        method: 'POST',
        body: {
          username: payload.company,
          email: payload.email,
          password: payload.password,
          tax_id: payload.vat ?? undefined
        }
      })
  
      // login après création
      return await realLogin({ email: payload.email, password: payload.password })
    }
  
    // PARTICULIER -> /user/registerClient
    await $fetch(`${apiBase}/user/registerClient`, {
      method: 'POST',
      body: {
        username: `${payload.firstname} ${payload.fullname}`.trim(),
        email: payload.email,
        password: payload.password
      }
    })
  
    return await realLogin({ email: payload.email, password: payload.password })
  }
  


  const login = async (payload: LoginPayload): Promise<void> => {
    loading.value = true
    error.value = null
  
    try {
      const res = (enableMockAuth || apiBase === 'mock')
        ? await mockLogin(payload)
        : await realLogin(payload)
  
      if (process.dev) {
        console.log('[AUTH] login response =', res)
      }
  
      // Si le back renvoie un token dans un champ classique
      const tokenFromBody =
        (res && (res.token || res.accessToken || res.jwt || res.data?.token)) ?? null
  
      // Si le back renvoie un user
      const userFromBody =
        (res && (res.user || res.data?.user)) ?? null
  
      // 1️⃣ Si pas d'erreur HTTP, on considère que le login est OK.
      //    -> soit on a un token, soit on utilise un flag "session".
      token.value = tokenFromBody || 'session'
  
      // 2️⃣ On met quand même quelque chose dans user pour l'UI
      if (userFromBody) {
        user.value = userFromBody
      } else {
        user.value = {
          id: 0,
          email: payload.email,
          name: payload.email.split('@')[0]
        }
      }
  
      await router.push(String(loginRedirect || '/'))
    } catch (e: unknown) {
      if (process.dev) {
        console.error('[AUTH] login error =', e)
      }
  
      const message =
        (e as { data?: { message?: string }; message?: string })?.data?.message ??
        (e as { message?: string })?.message ??
        'Connexion impossible'
      error.value = message
    } finally {
      loading.value = false
    }
  }
  

  const register = async (payload: RegisterPayload): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      const res = (enableMockAuth || apiBase === 'mock') ? await mockRegister(payload) : await realRegister(payload)

      if (autoLoginAfterRegister) {
        token.value = res.token
        user.value = res.user
        await router.push(String(loginRedirect || '/'))
      } else {
        await router.push('/auth/login')
      }
    } catch (e: unknown) {
      const message =
        (e as { data?: { message?: string }; message?: string })?.data?.message ??
        (e as { message?: string })?.message ?? 'Inscription impossible'
      error.value = message
    } finally {
      loading.value = false
    }
  }


  const logout = async (): Promise<void> => {
    token.value = null
    user.value = null
    await router.push('/auth/login')
  }

  return { token, user, isLoggedIn, loading, error, login, register, logout }
}
