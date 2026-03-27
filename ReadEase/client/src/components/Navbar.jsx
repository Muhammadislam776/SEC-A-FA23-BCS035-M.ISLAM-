import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen, LayoutDashboard, Users, Repeat,
  Moon, Sun, Menu, X, LogOut, User, ChevronDown
} from 'lucide-react';

const Navbar = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { to: '/books', label: 'Books', icon: <BookOpen size={16} /> },
    { to: '/members', label: 'Members', icon: <Users size={16} /> },
    { to: '/borrowing', label: 'Borrowing', icon: <Repeat size={16} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 26 }}
        className={`navbar-custom sticky-top ${scrolled ? 'navbar-scrolled' : ''} ${darkMode ? 'dark' : ''}`}
      >
        <div className="container">
          <div className="d-flex align-items-center justify-content-between w-100 py-2">
            {/* Brand */}
            <Link to="/" className="brand d-flex align-items-center gap-2 text-decoration-none">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="brand-icon"
              >
                <BookOpen size={22} className="text-white" />
              </motion.div>
              <span className="brand-text fw-bold fs-5">
                Read<span className="text-primary-light">Ease</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <ul className="nav-links d-none d-lg-flex align-items-center gap-1 mb-0 list-unstyled">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`nav-link-item d-flex align-items-center gap-2 ${isActive(link.to) ? 'active' : ''}`}
                  >
                    {link.icon}
                    {link.label}
                    {isActive(link.to) && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="nav-indicator"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right Controls */}
            <div className="d-flex align-items-center gap-2">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="theme-btn"
                onClick={() => setDarkMode(!darkMode)}
                title="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {darkMode
                    ? <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                        <Sun size={18} className="text-warning" />
                      </motion.span>
                    : <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                        <Moon size={18} />
                      </motion.span>
                  }
                </AnimatePresence>
              </motion.button>

              {/* Auth Area */}
              {user ? (
                <div className="position-relative">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className="user-btn d-flex align-items-center gap-2"
                    onClick={() => setProfileOpen(v => !v)}
                  >
                    <div className="user-avatar">{user.firstName?.[0]?.toUpperCase()}</div>
                    <span className="d-none d-md-inline fw-bold small">{user.firstName}</span>
                    <ChevronDown size={14} className={`transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="profile-dropdown"
                        onMouseLeave={() => setProfileOpen(false)}
                      >
                        <div className="px-3 py-2 border-bottom">
                          <div className="fw-bold small">{user.firstName} {user.lastName}</div>
                          <div className="text-muted" style={{ fontSize: 12 }}>{user.email}</div>
                        </div>
                        <Link to="/profile" className="dropdown-item-custom" onClick={() => setProfileOpen(false)}>
                          <User size={14} /> My Profile
                        </Link>
                        <button className="dropdown-item-custom text-danger w-100 text-start" onClick={() => { logout(); setProfileOpen(false); }}>
                          <LogOut size={14} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn-nav-outline">Login</Link>
                  <Link to="/register" className="btn-nav-solid">Sign Up</Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="theme-btn d-lg-none"
                onClick={() => setMobileOpen(v => !v)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mobile-menu"
            >
              <div className="container py-3 d-flex flex-column gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`mobile-nav-item d-flex align-items-center gap-2 ${isActive(link.to) ? 'active' : ''}`}
                  >
                    {link.icon} {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
