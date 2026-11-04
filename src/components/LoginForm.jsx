import { useEffect, useRef, useState } from 'react'
import { FaTimesCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js'
import text from '../data/login-page.json'
import './LoginForm.css'

const BACK_OFFICE = '/backoffice'

function LoginForm() {
  const navigate = useNavigate()
  const [values, setValues] = useState({ email: '', password: '' })
  // checking | idle | submitting
  const [status, setStatus] = useState(isSupabaseConfigured ? 'checking' : 'idle')
  // '' | required | invalid | failure
  const [feedback, setFeedback] = useState('')
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  // An admin who is already signed in skips the form.
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined
    let active = true

    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession()
        if (!active) return
        if (data.session) navigate(BACK_OFFICE, { replace: true })
        else setStatus('idle')
      } catch {
        if (active) setStatus('idle')
      }
    }

    checkSession()
    return () => {
      active = false
    }
  }, [navigate])

  // The fields are disabled during the request, so focus has to wait until the
  // failed attempt has re-enabled them.
  useEffect(() => {
    if (feedback === 'invalid' || feedback === 'failure') passwordRef.current?.focus()
  }, [feedback])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setFeedback('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (status !== 'idle') return

    const email = values.email.trim()
    const { password } = values
    if (!email || !password) {
      setFeedback('required')
      const firstEmpty = email ? passwordRef : emailRef
      firstEmpty.current?.focus()
      return
    }

    setFeedback('')
    setStatus('submitting')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      navigate(BACK_OFFICE, { replace: true })
    } catch (error) {
      setValues((current) => ({ ...current, password: '' }))
      setStatus('idle')
      setFeedback(error.code === 'invalid_credentials' ? 'invalid' : 'failure')
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <p className="login-feedback" role="status">
        <FaTimesCircle aria-hidden="true" />
        <span>{text.unavailable}</span>
      </p>
    )
  }

  if (status === 'checking') return null

  const submitting = status === 'submitting'

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <div className="login-form__field">
        <label htmlFor="login-email">{text.labels.email}</label>
        <input
          id="login-email"
          name="email"
          type="email"
          ref={emailRef}
          value={values.email}
          onChange={handleChange}
          autoComplete="username"
          maxLength={254}
          disabled={submitting}
        />
      </div>

      <div className="login-form__field">
        <label htmlFor="login-password">{text.labels.password}</label>
        <input
          id="login-password"
          name="password"
          type="password"
          ref={passwordRef}
          value={values.password}
          onChange={handleChange}
          autoComplete="current-password"
          disabled={submitting}
        />
      </div>

      <div aria-live="polite">
        {feedback === 'required' && <p className="login-form__summary">{text.required}</p>}
      </div>

      <button className="login-form__submit" type="submit" disabled={submitting}>
        {submitting ? text.submitting : text.submit}
      </button>

      {(feedback === 'invalid' || feedback === 'failure') && (
        <p className="login-feedback" role="alert">
          <FaTimesCircle aria-hidden="true" />
          <span>{text[feedback]}</span>
        </p>
      )}
    </form>
  )
}

export default LoginForm
