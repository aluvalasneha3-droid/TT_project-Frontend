import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../services/api'

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand-mark">C</div>
        <div>
          <div className="brand-name">Candle Craft</div>
          <small>Learn. Simulate. Track.</small>
        </div>
      </div>

      <nav className="main-nav">
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/stocks">Stocks</NavLink>
            <NavLink to="/portfolio">Portfolio</NavLink>
            <NavLink to="/transactions">Transactions</NavLink>
            <NavLink to="/learn">Learn to Trade</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>

      <div className="nav-account">
        {isAuthenticated ? (
          <>
            <span className="balance-pill">{formatCurrency(user?.balance || 0)}</span>
            <button type="button" className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <span className="balance-pill muted">Virtual trading</span>
        )}
      </div>
    </header>
  )
}

export default Navbar
