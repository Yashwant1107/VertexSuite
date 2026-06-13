import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MagneticButton from '../ui/MagneticButton';
import './Navbar.css';

const navLinks = [
  { label: 'Platform', href: '#platform' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggleMobile = () => setMobileOpen(prev => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      id="navbar"
      className={`navbar ${scrolled ? 'navbar--glass' : 'navbar--transparent'}`}
    >
      <nav className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMobile}>
          <svg className="navbar-logo-img" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Simplified Vertex triangle logo */}
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A8D7F4" />
                <stop offset="50%" stopColor="#2D8CCB" />
                <stop offset="100%" stopColor="#12569F" />
              </linearGradient>
            </defs>
            <path d="M20 2 L38 36 L2 36 Z" stroke="url(#logoGrad)" strokeWidth="3" fill="none" strokeLinejoin="round"/>
            <path d="M20 12 L30 32 L10 32 Z" stroke="url(#logoGrad)" strokeWidth="2" fill="none" strokeLinejoin="round" opacity="0.6"/>
            <path d="M20 20 L25 30 L15 30 Z" fill="url(#logoGrad)" opacity="0.3"/>
          </svg>
          <span className="navbar-logo-text">
            Vertex<span>Suite</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="navbar-link"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          <MagneticButton strength={0.25}>
            <a href="#contact" className="navbar-cta">
              Book Demo
            </a>
          </MagneticButton>

          {/* Mobile Toggle */}
          <button
            className={`navbar-toggle ${mobileOpen ? 'navbar-toggle--open' : ''}`}
            onClick={toggleMobile}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`navbar-mobile ${mobileOpen ? 'navbar-mobile--open' : ''}`}>
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="navbar-link"
            onClick={closeMobile}
          >
            {link.label}
          </a>
        ))}
        <a href="#contact" className="navbar-cta" onClick={closeMobile}>
          Book Demo
        </a>
      </div>
    </header>
  );
}
