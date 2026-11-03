import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa'
import contact from '../../data/contact.json'

const year = new Date().getFullYear()

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <ul className="site-footer__links">
          <li>
            <a href={`mailto:${contact.email}`}>
              <FaEnvelope aria-hidden="true" />
              <span>{contact.email}</span>
            </a>
          </li>
          <li>
            <a href={contact.github} target="_blank" rel="noopener noreferrer">
              <FaGithub aria-hidden="true" />
              <span>GitHub</span>
            </a>
          </li>
          <li>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
              <FaLinkedin aria-hidden="true" />
              <span>LinkedIn</span>
            </a>
          </li>
        </ul>
        <p className="site-footer__copyright">
          © {year} {contact.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
