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
  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  return (
    <nav className="navbar">
      
      <Link to="/" className="nav-logo" onClick={closeMenu}>
        FADE <span>&</span> BLADE
      </Link>

      {/* Hamburger Icon */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Nav Links */}
      <div className={`nav-links ${isOpen ? 'mobile-open' : ''}`}>
        
        <Link to="/" className={`nav-item ${isActive('/')}`} onClick={closeMenu}>Home</Link>
        
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