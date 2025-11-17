// composables/useAuth.ts
import { useRouter, useRuntimeConfig } from '#imports'

type LoginPayload = { email: string; password: string }
type ProRegisterPayload = { type: 'pro'; company: string; email: string; password: string; siret: number | null; vat: number | null }
type PartRegisterPayload = { type: 'part'; fullname: string; firstname: string; email: string; password: string }
type RegisterPayload = ProRegisterPayload | PartRegisterPayload

type User = { id: number; email: string; name: string }
type AuthResponse = { token: string; user: User }

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
  const { $api } = useApi()

  const user = useState<User | null>('auth_user', () => null)
  const loading = useState<boolean>('auth_loading', () => false)
  const error = useState<string | null>('auth_error', () => null)

  const isLoggedIn = computed(() => Boolean(user.value))

  const mockLogin = async (payload: LoginPayload) => {
    if (!payload.email || !payload.password
      throw new Error('Email et mot de passe requis')
    await new Promise((r) => setTimeout(r, 300))
    user.value = { id: 1, email: payload.email, username: 'Utilisateur démo' }
  }

  const realLogin = async (payload: LoginPayload) => {
    const { user: u } = await $api<{ user: User }>('/login', {
      method: 'POST',
      body: payload,
    })
    user.value = u ?? null
  }

  const login = async (payload: LoginPayload) => {
    loading.value = true
    error.value = null
    try {
      if (enableMockAuth) await mockLogin(payload)
      else await realLogin(payload)
      await router.push(String(loginRedirect || '/'))
    } catch (e: any) {
      error.value = e?.data?.message || e?.message || 'Connexion impossible'
      throw e
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
