import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        ⛏ Craft<span>Hub</span>
      </Link>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/create" className="btn btn-primary">+ New Post</Link>
      </div>
    </nav>
  )
}

export default Navbar
