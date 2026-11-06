import LoginForm from '../components/LoginForm.jsx'
import text from '../data/login-page.json'
import './Login.css'

function Login() {
  return (
    <div className="login">
      <header className="login-header">
        <h1 className="login-header__title">{text.title}</h1>
        <p className="login-header__intro">{text.intro}</p>
      </header>

      <section className="login-card" aria-label="Login form">
        <LoginForm />
      </section>
    </div>
  )
}

export default Login
