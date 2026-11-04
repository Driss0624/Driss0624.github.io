import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import './layout.css'

function MainLayout() {
  const navigate = useNavigate()

  // Secret shortcut to the hidden login route: Ctrl+Shift+L, except while typing.
  useEffect(() => {
    function handleKeyDown(event) {
      if (!event.ctrlKey || !event.shiftKey || event.code !== 'KeyL') return
      if (event.target.closest?.('input, textarea')) return
      event.preventDefault()
      navigate('/login')
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return (
    <div className="site">
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
