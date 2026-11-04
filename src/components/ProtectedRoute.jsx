import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js'

const LOGIN = '/login'

function ProtectedRoute({ children }) {
  // checking | allowed | denied
  const [status, setStatus] = useState(isSupabaseConfigured ? 'checking' : 'denied')

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined
    let active = true

    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession()
        if (active) setStatus(data.session ? 'allowed' : 'denied')
      } catch {
        if (active) setStatus('denied')
      }
    }

    checkSession()

    // Logging out, or a session that ends while the page is open, lands here.
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && !session) setStatus('denied')
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  if (status === 'denied') return <Navigate to={LOGIN} replace />
  if (status === 'checking') return null

  return children
}

export default ProtectedRoute
