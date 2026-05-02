import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        ⛏ Craft<span>Hub</span>
      </Link>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        {user ? (
          <>
            <span className="nav-user">{user.email}</span>
            <Link to="/create" className="btn btn-primary">+ New Post</Link>
            <button className="btn btn-ghost nav-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
