// composables/useAuth.ts
import { useRouter, useRuntimeConfig } from '#imports'

type LoginPayload = { email: string; password: string }
type User = { id: number; email: string; name: string }
type AuthResponse = { token: string; user: User }

export const useAuth = () => {
  const router = useRouter()
  const {
    public: {
      apiBase = 'mock',          // ← "mock" par défaut tant que l’API n’est pas prête
      enableMockAuth = true,     // ← flag de mock activé
      mockLatencyMs = 400,       // ← petit délai pour simuler un appel réseau
      loginRedirect = '/sandbox' // ← où rediriger après login
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

  const realLogin = async (payload: LoginPayload): Promise<AuthResponse> => {
    // On n’appelle pas réellement tant que l’API n’est pas dispo.
    // Laisse le code prêt pour le jour J.
    return await $fetch<AuthResponse>(`${apiBase}/auth/login`, {
      method: 'POST',
      body: payload
    })
  }

  const login = async (payload: LoginPayload): Promise<void> => {
    loading.value = true
    error.value = null
    try {
      const res = (enableMockAuth || apiBase === 'mock')
        ? await mockLogin(payload)
        : await realLogin(payload)

      token.value = res.token
      user.value = res.user
      await router.push(String(loginRedirect || '/'))
    } catch (e: unknown) {
      const message =
        (e as { data?: { message?: string }; message?: string })?.data?.message ??
        (e as { message?: string })?.message ??
        'Connexion impossible'
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

  return { token, user, isLoggedIn, loading, error, login, logout }
}
