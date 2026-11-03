const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Checks the contact form values. Returns per-field errors and one summary
// line; an empty summary means the values are valid.
export function validateContact({ name, email, message }) {
  const values = { name: name.trim(), email: email.trim(), message: message.trim() }
  const errors = {}

  if (!values.name) errors.name = 'Please enter your name.'
  if (!values.email) errors.email = 'Please enter your email.'
  else if (!EMAIL_PATTERN.test(values.email)) errors.email = 'Please enter a valid email address.'
  if (!values.message) errors.message = 'Please enter a message.'

  const hasEmptyField = !values.name || !values.email || !values.message
  let summary = ''
  if (hasEmptyField) summary = 'Please fill in all fields.'
  else if (errors.email) summary = 'Please enter a valid email address.'

  return { errors, summary }
}
