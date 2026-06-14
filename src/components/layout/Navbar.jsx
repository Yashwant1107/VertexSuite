import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MagneticButton from '../ui/MagneticButton';
import vertexLogo from '../../assets/vertex-logo.png';
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
          <img src={vertexLogo} alt="Vertex Suite" className="navbar-logo-img" />
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
          <MagneticButton strength={0.25} className="navbar-cta-magnetic">
            <span className="navbar-cta-text">Book Demo</span>
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
