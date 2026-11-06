import ContactForm from '../components/ContactForm.jsx'
import contact from '../data/contact.json'
import text from '../data/contact-page.json'
import './Contact.css'

function Contact() {
  return (
    <div className="contact">
      <header className="contact-header">
        <h1 className="contact-header__title">{text.title}</h1>
        <p className="contact-header__intro">{text.intro}</p>
        <p className="contact-header__email">
          {text.emailPrompt} <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </p>
      </header>

      <section className="contact-card" aria-label="Contact form">
        <ContactForm />
      </section>
    </div>
  )
}

export default Contact
