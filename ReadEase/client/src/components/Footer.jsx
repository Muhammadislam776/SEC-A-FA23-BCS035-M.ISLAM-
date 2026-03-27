import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Globe, Mail, Heart, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const links = {
    Library: [
      { label: 'Dashboard', to: '/' },
      { label: 'Book Collection', to: '/books' },
      { label: 'Members', to: '/members' },
      { label: 'Borrowing', to: '/borrowing' },
    ],
    Account: [
      { label: 'Login', to: '/login' },
      { label: 'Register', to: '/register' },
      { label: 'My Profile', to: '/profile' },
    ],
  };

  return (
    <footer className="footer-custom mt-auto">
      <div className="container">

        {/* Top row */}
        <div className="row g-5 py-5">

          {/* Brand */}
          <div className="col-md-4">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none mb-3">
              <div className="brand-icon-sm">
                <BookOpen size={18} className="text-white" />
              </div>
              <span className="fw-bold fs-5 footer-brand">
                Read<span className="text-primary">Ease</span>
              </span>
            </Link>

            <p className="footer-text mb-4" style={{ maxWidth: 280 }}>
              A modern Library Management System built to make knowledge accessible,
              borrowing simple, and library administration effortless.
            </p>

            {/* Social Icons */}
            <div className="d-flex gap-2">
              {[Globe, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="social-icon"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading} className="col-6 col-md-2">
              <h6 className="footer-heading mb-3">{heading}</h6>
              <ul className="list-unstyled">
                {items.map(item => (
                  <li key={item.to} className="mb-2">
                    <Link to={item.to} className="footer-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="col-md-4">
            <h6 className="footer-heading mb-3">Stay Updated</h6>
            <p className="footer-text mb-3">
              Get notified about new arrivals and library events.
            </p>

            <div className="d-flex gap-2">
              <input
                type="email"
                className="form-control footer-input rounded-pill"
                placeholder="your@email.com"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary rounded-pill px-3 fw-bold"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom */}
        <div className="d-flex flex-wrap justify-content-between align-items-center py-3 gap-2">
          <p className="footer-text mb-0 small d-flex align-items-center gap-1">
            Made with <Heart size={13} className="text-danger" fill="currentColor" />
            &copy; {new Date().getFullYear()} ReadEase
          </p>

          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            className="scroll-top-btn"
            onClick={scrollTop}
          >
            <ArrowUp size={16} />
          </motion.button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;