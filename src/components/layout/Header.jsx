import { Link, NavLink } from 'react-router-dom'
import { navLinks } from './navLinks.js'
// AI-generated logo (tool: ChatGPT image generation), trimmed and resized for the header.
import logo from '../../assets/images/logo.png'

function Header() {
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="site-header__brand">
            <img
              src={logo}
              alt="Driss Elhail logo — return to the home page"
              className="site-header__logo"
            />
            <span className="site-header__name">Driss Elhail</span>
          </Link>

          <nav className="desktop-nav" aria-label="Main">
            <ul>
              {navLinks.map(({ path, label }) => (
                <li key={path}>
                  <NavLink to={path} end className="desktop-nav__link">
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <nav className="mobile-nav" aria-label="Main">
        <ul>
          {navLinks.map(({ path, label, Icon }) => (
            <li key={path}>
              <NavLink to={path} end className="mobile-nav__link">
                <Icon aria-hidden="true" className="mobile-nav__icon" />
                <span className="mobile-nav__label">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}

export default Header
