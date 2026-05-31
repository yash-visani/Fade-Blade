import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setIsOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setIsOpen(false);

  // This clever function checks if the URL matches the link, so it knows when to highlight it!
  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  return (
    <nav className="navbar">

      <Link to="/" className="nav-logo" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <svg width="35" height="35" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="20" fill="#111827" />
          {/* Yellow/Gold slash */}
          <path d="M30 70L70 30" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" />
          <path d="M30 30V70H50" stroke="#FFFFFF" strokeWidth="8" strokeLinejoin="round" />
          <path d="M70 70V30H50" stroke="#FFFFFF" strokeWidth="8" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '2px', color: '#111827' }}>
          FADE<span style={{ color: '#F59E0B', margin: '0 5px' }}>&</span>BLADE
        </span>
      </Link>

      {/* Hamburger Icon */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Nav Links */}
      <div className={`nav-links ${isOpen ? 'mobile-open' : ''}`}>

        <Link to="/" className={`nav-item ${isActive('/')}`} onClick={closeMenu}>Home</Link>

        <Link to="/lookbook" className={`nav-item ${isActive('/lookbook')}`} onClick={closeMenu}>Lookbook</Link>

        {token ? (
          <>
            {role === 'admin' ? (
              <Link to="/admin" className={`nav-item ${isActive('/admin')}`} onClick={closeMenu}>Command Center</Link>
            ) : (
              <Link to="/dashboard" className={`nav-item ${isActive('/dashboard')}`} onClick={closeMenu}>My Dashboard</Link>
            )}
            <button onClick={handleLogout} className="nav-item btn-logout">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className={`nav-item ${isActive('/login')}`} onClick={closeMenu}>Login</Link>
        )}

        <Link to="/book" className="btn-primary btn-book-nav" onClick={closeMenu}>
          Book Now
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;