import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface Profile {
  id: string
  role: string | null
  decision_type: string | null
  onboarding_complete: boolean
  disclaimer_accepted_at: string | null
  hrv_consent_given: boolean
  pilot_accelerated_timers: boolean
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (!error && data) {
        return data as Profile
      }
    } catch {}
    return null
  }, [])

  const refreshProfile = useCallback(async () => {
    if (user) {
      const p = await fetchProfile(user.id)
      if (p) setProfile(p)
    }
  }, [user, fetchProfile])

  useEffect(() => {
    let mounted = true
    let initialized = false

    // Single initialization: use onAuthStateChange as the primary source.
    // Supabase fires INITIAL_SESSION event on startup with the cached session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return

        setSession(newSession)
        setUser(newSession?.user ?? null)

        if (newSession?.user) {
          // Fetch profile — use setTimeout to avoid Supabase auth deadlock
          // (known issue: calling supabase functions inside onAuthStateChange callback)
          setTimeout(async () => {
            if (!mounted) return
            const p = await fetchProfile(newSession.user.id)
            if (mounted) {
              setProfile(p)
              if (!initialized) {
                initialized = true
                setLoading(false)
              }
            }
          }, 0)
        } else {
          setProfile(null)
          if (!initialized) {
            initialized = true
            setLoading(false)
          }
        }
      }
    )

    // Safety timeout: if onAuthStateChange never fires (shouldn't happen, but just in case)
    const safetyTimeout = setTimeout(() => {
      if (mounted && !initialized) {
        console.warn('Auth safety timeout — forcing loading=false')
        initialized = true
        setLoading(false)
      }
    }, 8000)

    return () => {
      mounted = false
      clearTimeout(safetyTimeout)
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error: error as Error | null }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error as Error | null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{
      user, session, profile, loading,
      signUp, signIn, signOut, refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
