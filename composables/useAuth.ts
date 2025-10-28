// composables/useAuth.ts
import { useRouter, useRuntimeConfig } from '#imports'

type LoginPayload = { email: string; password: string }
type User = { id: number; email: string; username: string }

export const useAuth = () => {
  const router = useRouter()
  const {
    public: { loginRedirect = '/sandbox', enableMockAuth = false },
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

  const logout = async () => {
    try {
      await $api('/logout', { method: 'POST' })
    } catch {}
    user.value = null
    await router.push('/auth/login')
  }

  return { user, isLoggedIn, loading, error, login, logout }
}
