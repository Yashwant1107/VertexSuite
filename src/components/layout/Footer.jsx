import vertexLogo from '../../assets/vertex-logo.png';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="container-wide">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <a href="/" className="footer-logo">
              <img src={vertexLogo} alt="Vertex Suite" style={{ width: 32, height: 32, objectFit: 'contain' }} />
              <span className="footer-logo-text">
                Vertex<span>Suite</span>
              </span>
            </a>
            <p className="footer-description">
              The unified digital ecosystem connecting your commerce, communication, 
              marketing, and logistics into one powerful platform.
            </p>
            <div className="footer-socials">
              <a href="#" className="footer-social-link" aria-label="Twitter/X">
                𝕏
              </a>
              <a href="#" className="footer-social-link" aria-label="LinkedIn">
                in
              </a>
              <a href="#" className="footer-social-link" aria-label="Instagram">
                IG
              </a>
              <a href="#" className="footer-social-link" aria-label="YouTube">
                ▶
              </a>
            </div>
          </div>

          {/* Platform Column */}
          <div className="footer-column">
            <h4>Platform</h4>
            <ul>
              <li><a href="#marketplace">Marketplace Hub</a></li>
              <li><a href="#inbox">Shared Inbox</a></li>
              <li><a href="#commerce">Social Commerce</a></li>
              <li><a href="#marketing">Marketing Hub</a></li>
              <li><a href="#logistics">Smart Logistics</a></li>
              <li><a href="#analytics">Analytics</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Press Kit</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">API Reference</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Status Page</a></li>
              <li><a href="#">Changelog</a></li>
            </ul>
            <div className="footer-newsletter">
              <p>Subscribe to our newsletter</p>
              <form className="footer-newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="footer-newsletter-input"
                  aria-label="Email for newsletter"
                />
                <button type="submit" className="footer-newsletter-btn">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} VertexSuite. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
