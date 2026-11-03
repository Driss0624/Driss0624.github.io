import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Links from './pages/Links.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import BackOffice from './pages/BackOffice.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/links" element={<Links />} />
      <Route path="/contact" element={<Contact />} />
      {/* Hidden routes: never linked from public navigation. */}
      <Route path="/login" element={<Login />} />
      <Route path="/backoffice" element={<BackOffice />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
