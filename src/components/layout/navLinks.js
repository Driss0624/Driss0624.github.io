import { FaBriefcase, FaEnvelope, FaHome, FaLink } from 'react-icons/fa'

// Public routes only. Login and Back Office must never be added here (ai-spec.md §11).
export const navLinks = [
  { path: '/', label: 'Home', Icon: FaHome },
  { path: '/portfolio', label: 'Portfolio', Icon: FaBriefcase },
  { path: '/links', label: 'Links', Icon: FaLink },
  { path: '/contact', label: 'Contact', Icon: FaEnvelope },
]
