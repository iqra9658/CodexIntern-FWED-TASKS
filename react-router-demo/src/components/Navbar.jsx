import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
    setSearchQuery('');
  };

  const activeStyle = {
    fontWeight: '700',
    textDecoration: 'underline',
    color: '#0ea5e9',
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(to right, #0ea5e9, #3b82f6)',
        color: '#fff',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}
    >
      {/* Logo */}
      <div style={{ fontWeight: '700', fontSize: '1.2rem' }}>MyApp</div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ flex: 1, margin: '0 2rem' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          style={{
            width: '100%',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            border: 'none',
            outline: 'none',
          }}
        />
      </form>

      {/* Desktop Links */}
      <div className="desktop-links" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : { color: '#fff' })}>
          Home
        </NavLink>
        <NavLink to="/about" style={({ isActive }) => (isActive ? activeStyle : { color: '#fff' })}>
          About
        </NavLink>
        <NavLink to="/contact" style={({ isActive }) => (isActive ? activeStyle : { color: '#fff' })}>
          Contact
        </NavLink>

        {/* User Login / Avatar */}
        <button
          style={{
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#fff',
            color: '#0ea5e9',
            borderRadius: '9999px',
            fontWeight: '600',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          Login
        </button>
      </div>

      {/* Hamburger for Mobile */}
      <button
        className="mobile-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none',
          background: 'transparent',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: '#fff',
        }}
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            background: '#0ea5e9',
            color: '#fff',
            width: '200px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            padding: '1rem',
          }}
        >
          <NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : { color: '#fff' })} onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <br />
          <NavLink to="/about" style={({ isActive }) => (isActive ? activeStyle : { color: '#fff' })} onClick={() => setMenuOpen(false)}>
            About
          </NavLink>
          <br />
          <NavLink to="/contact" style={({ isActive }) => (isActive ? activeStyle : { color: '#fff' })} onClick={() => setMenuOpen(false)}>
            Contact
          </NavLink>
          <br />
          <button
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.5rem',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: '#fff',
              color: '#0ea5e9',
              fontWeight: '600',
              cursor: 'pointer',
            }}
            onClick={() => alert('Login clicked!')}
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
}
