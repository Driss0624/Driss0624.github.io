import { useRef } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import text from '../data/back-office.json'
import './MessageTable.css'

const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })

function withName(template, name) {
  return template.replace('{name}', () => name)
}

function MessageTable({
  messages,
  confirmingId,
  deletingId,
  onView,
  onAskDelete,
  onCancelDelete,
  onConfirmDelete,
}) {
  // Cancel removes the focused button, so focus goes back to that row's Delete.
  const refocusId = useRef(null)

  function handleCancel(id) {
    refocusId.current = id
    onCancelDelete()
  }

  function restoreFocus(button, id) {
    if (!button || refocusId.current !== id) return
    refocusId.current = null
    button.focus()
  }

  return (
    <table className="message-table" aria-label={text.tableLabel}>
      <thead>
        <tr>
          <th scope="col">{text.columns.name}</th>
          <th scope="col">{text.columns.email}</th>
          <th scope="col">{text.columns.date}</th>
          <th scope="col">{text.columns.actions}</th>
        </tr>
      </thead>
      <tbody>
        {messages.map((message) => {
          const deleting = message.id === deletingId

          return (
            <tr key={message.id}>
              <td data-label={text.columns.name}>{message.name}</td>
              <td data-label={text.columns.email}>{message.email}</td>
              <td data-label={text.columns.date}>
                {dateFormat.format(new Date(message.created_at))}
              </td>
              <td data-label={text.columns.actions}>
                {message.id === confirmingId ? (
                  <div className="message-table__actions">
                    <p className="message-table__question">{text.confirmDelete}</p>
                    <button
                      className="message-table__button message-table__button--danger"
                      type="button"
                      onClick={() => onConfirmDelete(message)}
                      disabled={deleting}
                      aria-label={withName(text.confirmLabel, message.name)}
                    >
                      <FaTrashAlt aria-hidden="true" />
                      {text.confirm}
                    </button>
                    <button
                      className="message-table__button"
                      type="button"
                      ref={(button) => button?.focus()}
                      onClick={() => handleCancel(message.id)}
                      disabled={deleting}
                      aria-label={withName(text.cancelLabel, message.name)}
                    >
                      {text.cancel}
                    </button>
                  </div>
                ) : (
                  <div className="message-table__actions">
                    <button
                      className="message-table__button"
                      type="button"
                      onClick={() => onView(message)}
                      aria-label={withName(text.viewLabel, message.name)}
                    >
                      {text.view}
                    </button>
                    <button
                      className="message-table__button message-table__button--danger"
                      type="button"
                      ref={(button) => restoreFocus(button, message.id)}
                      onClick={() => onAskDelete(message.id)}
                      aria-label={withName(text.deleteLabel, message.name)}
                    >
                      <FaTrashAlt aria-hidden="true" />
                      {text.delete}
                    </button>
                  </div>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default MessageTable
