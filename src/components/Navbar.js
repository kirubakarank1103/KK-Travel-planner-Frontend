import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">✈ VOYAGER</Link>

      <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
        <span></span><span></span><span></span>
      </div>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>Home</Link>

        {user ? (
          <>
            <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/trips" className={isActive('/trips')} onClick={() => setMenuOpen(false)}>My Trips</Link>
            <Link to="/profile" className={isActive('/profile')} onClick={() => setMenuOpen(false)}>Profile</Link>
            <button className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.8rem' }} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive('/login')} onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)}>
              <button className="btn-gold" style={{ padding: '8px 20px', fontSize: '0.8rem' }}>Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;