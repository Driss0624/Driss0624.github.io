import { useEffect, useRef, useState } from 'react'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import MessageModal from '../components/MessageModal.jsx'
import MessageTable from '../components/MessageTable.jsx'
import { supabase } from '../lib/supabaseClient.js'
import text from '../data/back-office.json'
import './BackOffice.css'

async function fetchMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('id, name, email, message, created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

function BackOffice() {
  const [messages, setMessages] = useState([])
  // loading | ready | error
  const [status, setStatus] = useState('loading')
  const [attempt, setAttempt] = useState(0)
  const [selected, setSelected] = useState(null)
  const [confirmingId, setConfirmingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  // '' | deleted | deleteFailed | logoutFailed
  const [notice, setNotice] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)
  const headingRef = useRef(null)

  useEffect(() => {
    let active = true

    async function loadMessages() {
      try {
        const data = await fetchMessages()
        if (!active) return
        setMessages(data)
        setStatus('ready')
      } catch {
        if (active) setStatus('error')
      }
    }

    loadMessages()
    return () => {
      active = false
    }
  }, [attempt])

  function handleRetry() {
    setStatus('loading')
    setAttempt((current) => current + 1)
  }

  function handleAskDelete(id) {
    setNotice('')
    setConfirmingId(id)
  }

  async function handleDelete(message) {
    setNotice('')
    setDeletingId(message.id)
    try {
      // RLS blocks a delete without an error, so ask which rows were removed.
      const { data, error } = await supabase
        .from('messages')
        .delete()
        .eq('id', message.id)
        .select('id')
      if (error) throw error
      if (data.length === 0) throw new Error('No row was deleted')

      setMessages((current) => current.filter((item) => item.id !== message.id))
      setNotice('deleted')
      headingRef.current?.focus()
    } catch {
      setNotice('deleteFailed')
    } finally {
      setDeletingId(null)
      setConfirmingId(null)
    }
  }

  // On success, ProtectedRoute sees the session end and redirects to login.
  async function handleLogout() {
    setNotice('')
    setLoggingOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch {
      setLoggingOut(false)
      setNotice('logoutFailed')
    }
  }

  const failure = notice === 'deleteFailed' || notice === 'logoutFailed'

  return (
    <div className="back-office">
      <header className="back-office-header">
        <div>
          <h1 className="back-office-header__title" ref={headingRef} tabIndex={-1}>
            {text.title}
          </h1>
          <p className="back-office-header__intro">{text.intro}</p>
        </div>
        <button
          className="back-office__button"
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? text.loggingOut : text.logout}
        </button>
      </header>

      <section aria-label={text.tableLabel}>
        <div role="status">
          {notice === 'deleted' && (
            <p className="back-office__notice back-office__notice--success">
              <FaCheckCircle aria-hidden="true" />
              <span>{text.deleted}</span>
            </p>
          )}
          {status === 'loading' && <p className="back-office__state">{text.loading}</p>}
          {status === 'ready' && messages.length === 0 && (
            <p className="back-office__state">{text.empty}</p>
          )}
        </div>

        {failure && (
          <p className="back-office__notice back-office__notice--failure" role="alert">
            <FaTimesCircle aria-hidden="true" />
            <span>{text[notice]}</span>
          </p>
        )}

        {status === 'error' && (
          <div className="back-office__notice back-office__notice--failure" role="alert">
            <FaTimesCircle aria-hidden="true" />
            <span>{text.loadFailed}</span>
            <button className="back-office__button" type="button" onClick={handleRetry}>
              {text.retry}
            </button>
          </div>
        )}

        {status === 'ready' && messages.length > 0 && (
          <MessageTable
            messages={messages}
            confirmingId={confirmingId}
            deletingId={deletingId}
            onView={setSelected}
            onAskDelete={handleAskDelete}
            onCancelDelete={() => setConfirmingId(null)}
            onConfirmDelete={handleDelete}
          />
        )}
      </section>

      {selected && <MessageModal message={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

export default BackOffice
