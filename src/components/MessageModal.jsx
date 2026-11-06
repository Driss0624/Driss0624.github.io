import { useEffect, useRef } from 'react'
import { FaTimes } from 'react-icons/fa'
import text from '../data/back-office.json'
import './MessageModal.css'

const dateTimeFormat = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function MessageModal({ message, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog.open) dialog.showModal()
  }, [])

  // The dialog has no padding, so only the backdrop reports the dialog itself.
  // preventDefault keeps the click from pulling focus off the "View" button.
  function handleMouseDown(event) {
    if (event.target !== dialogRef.current) return
    event.preventDefault()
    dialogRef.current.close()
  }

  return (
    <dialog
      className="message-modal"
      ref={dialogRef}
      onClose={onClose}
      onMouseDown={handleMouseDown}
      aria-labelledby="message-modal-title"
    >
      <div className="message-modal__content">
        <div className="message-modal__header">
          <h2 id="message-modal-title">{text.modal.title}</h2>
          <button
            className="message-modal__close"
            type="button"
            onClick={() => dialogRef.current.close()}
          >
            <FaTimes aria-hidden="true" />
            {text.modal.close}
          </button>
        </div>

        <dl className="message-modal__details">
          <dt>{text.modal.from}</dt>
          <dd>{message.name}</dd>
          <dt>{text.modal.email}</dt>
          <dd>{message.email}</dd>
          <dt>{text.modal.date}</dt>
          <dd>{dateTimeFormat.format(new Date(message.created_at))}</dd>
          <dt>{text.modal.message}</dt>
          <dd className="message-modal__message">{message.message}</dd>
        </dl>
      </div>
    </dialog>
  )
}

export default MessageModal
