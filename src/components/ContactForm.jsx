import { useEffect, useRef, useState } from 'react'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js'
import { validateContact } from '../lib/validateContact.js'
import text from '../data/contact-page.json'
import contact from '../data/contact.json'
import './ContactForm.css'

const EMPTY = { name: '', email: '', message: '' }
const FIELDS = ['name', 'email', 'message']
const SUCCESS_MS = 5000

function ContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [summary, setSummary] = useState('')
  // idle | sending | success | failure
  const [status, setStatus] = useState('idle')
  const fieldRefs = { name: useRef(null), email: useRef(null), message: useRef(null) }

  // Hide the success message after a few seconds.
  useEffect(() => {
    if (status !== 'success') return undefined
    const timer = setTimeout(() => setStatus('idle'), SUCCESS_MS)
    return () => clearTimeout(timer)
  }, [status])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    // Typing again hides the last result and clears that field's error.
    if (status === 'success' || status === 'failure') setStatus('idle')
    if (errors[name]) {
      const remaining = { ...errors }
      delete remaining[name]
      setErrors(remaining)
      if (Object.keys(remaining).length === 0) setSummary('')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (status === 'sending') return

    const result = validateContact(values)
    setErrors(result.errors)
    setSummary(result.summary)
    if (result.summary) {
      const firstInvalid = FIELDS.find((field) => result.errors[field])
      fieldRefs[firstInvalid].current?.focus()
      return
    }

    setStatus('sending')
    try {
      // No .select(): visitors may insert but not read messages (RLS).
      const { error } = await supabase.from('messages').insert({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
      })
      if (error) throw error
      setValues(EMPTY)
      setStatus('success')
    } catch {
      setStatus('failure')
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <p className="contact-feedback contact-feedback--failure" role="status">
        <FaTimesCircle aria-hidden="true" />
        <span>
          {text.unavailable} <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </span>
      </p>
    )
  }

  const sending = status === 'sending'

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {FIELDS.map((field) => {
        const id = `contact-${field}`
        const errorId = `${id}-error`
        const shared = {
          id,
          name: field,
          ref: fieldRefs[field],
          value: values[field],
          onChange: handleChange,
          disabled: sending,
          'aria-invalid': errors[field] ? 'true' : 'false',
          'aria-describedby': errors[field] ? errorId : undefined,
        }

        return (
          <div className="contact-form__field" key={field}>
            <label htmlFor={id}>{text.labels[field]}</label>
            {field === 'message' ? (
              <textarea {...shared} rows={6} maxLength={2000} />
            ) : (
              <input
                {...shared}
                type={field === 'email' ? 'email' : 'text'}
                autoComplete={field}
                maxLength={field === 'email' ? 254 : 100}
              />
            )}
            {errors[field] && (
              <p className="contact-form__error" id={errorId}>
                {errors[field]}
              </p>
            )}
          </div>
        )
      })}

      <div aria-live="polite">
        {summary && <p className="contact-form__summary">{summary}</p>}
      </div>

      <button className="contact-form__submit" type="submit" disabled={sending}>
        {sending ? text.sending : text.submit}
      </button>

      {status === 'success' && (
        <p className="contact-feedback contact-feedback--success" role="status">
          <FaCheckCircle aria-hidden="true" />
          <span>{text.success}</span>
        </p>
      )}
      {status === 'failure' && (
        <p className="contact-feedback contact-feedback--failure" role="alert">
          <FaTimesCircle aria-hidden="true" />
          <span>
            {text.failure} <a href={`mailto:${contact.email}`}>{contact.email}</a>.
          </span>
        </p>
      )}
    </form>
  )
}

export default ContactForm
