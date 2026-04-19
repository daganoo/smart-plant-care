import { Link, useLocation } from 'react-router-dom'
import { Sprout, Menu, X, Home, BarChart3, Cpu, Info } from 'lucide-react'
import { useState } from 'react'
import './Navbar.css'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Accueil', icon: <Home className="nav-icon" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <BarChart3 className="nav-icon" /> },
    { path: '/iot', label: 'Simulation IoT', icon: <Cpu className="nav-icon" /> },
    { path: '/about', label: 'À propos', icon: <Info className="nav-icon" /> },
  ]

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <Sprout className="brand-icon" />
          <span>Smart Plant Care</span>
        </Link>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>

        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar