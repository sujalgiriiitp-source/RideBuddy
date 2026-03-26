import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkClass = ({ isActive }) =>
  `flex min-h-11 flex-col items-center justify-center rounded-lg px-2 py-1 text-xs font-medium transition ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-500'
  }`

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/auth')
  }

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-extrabold tracking-tight text-brand-700">
            RideBuddy
          </Link>
          {isAuthenticated && (
            <button onClick={handleLogout} className="dark-btn px-3 py-1.5 text-xs">
              Logout
            </button>
          )}
        </div>
      </header>

      {isAuthenticated && (
        <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 px-3 py-2 backdrop-blur md:hidden">
          <div className="mx-auto grid max-w-5xl grid-cols-4">
            <NavLink to="/" className={linkClass}>
              <span>Home</span>
            </NavLink>
            <NavLink to="/find" className={linkClass}>
              <span>Find</span>
            </NavLink>
            <NavLink to="/offer" className={linkClass}>
              <span>Offer</span>
            </NavLink>
            <NavLink to="/profile" className={linkClass}>
              <span>Profile</span>
            </NavLink>
          </div>
        </nav>
      )}

      {isAuthenticated && (
        <nav className="hidden border-b border-slate-200 bg-white md:block">
          <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-2 text-sm font-medium">
            <NavLink to="/" className={({ isActive }) => (isActive ? 'text-brand-700' : 'text-slate-600')}>
              Home
            </NavLink>
            <NavLink to="/find" className={({ isActive }) => (isActive ? 'text-brand-700' : 'text-slate-600')}>
              Find Ride
            </NavLink>
            <NavLink to="/offer" className={({ isActive }) => (isActive ? 'text-brand-700' : 'text-slate-600')}>
              Offer Ride
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? 'text-brand-700' : 'text-slate-600')}
            >
              Profile
            </NavLink>
          </div>
        </nav>
      )}
    </>
  )
}

export default Navbar
