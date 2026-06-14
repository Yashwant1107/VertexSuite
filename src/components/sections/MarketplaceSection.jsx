import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import amazonLogo from '../../assets/logo-amazon.png';
import flipkartLogo from '../../assets/logo-flipkart.png';
import shopifyLogo from '../../assets/logo-shopify.png';
import woocommerceLogo from '../../assets/logo-woocommerce.png';
import './MarketplaceSection.css';

gsap.registerPlugin(ScrollTrigger);

const platforms = [
  { id: 'amazon', label: 'Amazon', logo: amazonLogo, x: '12%', y: '18%', rot: -15 },
  { id: 'flipkart', label: 'Flipkart', logo: flipkartLogo, x: '78%', y: '22%', rot: 12 },
  { id: 'shopify', label: 'Shopify', logo: shopifyLogo, x: '20%', y: '72%', rot: 10 },
  { id: 'woocommerce', label: 'WooCommerce', logo: woocommerceLogo, x: '75%', y: '68%', rot: -8 },
];

export default function MarketplaceSection() {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const logos = inner.querySelectorAll('.marketplace-logo');
    const dashboard = inner.querySelector('.marketplace-dashboard');
    const dashIcons = inner.querySelectorAll('.marketplace-dashboard-icon');
    const header = inner.querySelector('.marketplace-header');
    const message = inner.querySelector('.marketplace-message');

    // Get center of viewport
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: inner,
      },
    });

    // Phase 1 (0-0.3): Header fades in, logos float with slight rotation
    tl.to(header, { opacity: 1, duration: 0.05 }, 0);

    logos.forEach((logo, i) => {
      tl.to(logo, {
        rotation: platforms[i].rot * 2,
        y: `+=${i % 2 === 0 ? -20 : 20}`,
        x: `+=${i % 2 === 0 ? 15 : -15}`,
        duration: 0.3,
        ease: 'none',
      }, 0);
    });

    // Phase 2 (0.3-0.7): Logos pull toward center (gravity effect)
    logos.forEach((logo) => {
      const rect = { x: parseFloat(logo.style.left), y: parseFloat(logo.style.top) };
      tl.to(logo, {
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        rotation: 0,
        x: 0,
        y: 0,
        duration: 0.4,
        ease: 'power2.in',
      }, 0.3);
    });

    // Phase 3 (0.7-1.0): Dashboard fades in, logos shrink into dashboard icons
    tl.to(dashboard, {
      opacity: 1,
      scale: 1,
      duration: 0.15,
      ease: 'power2.out',
    }, 0.65);

    // Hide scattered logos
    tl.to(logos, {
      opacity: 0,
      scale: 0.3,
      duration: 0.1,
    }, 0.72);

    // Show dashboard icons
    tl.to(dashIcons, {
      opacity: 1,
      scale: 1,
      duration: 0.1,
      stagger: 0.03,
      ease: 'back.out(1.7)',
    }, 0.78);

    // Fade header slightly
    tl.to(header, { opacity: 0.6, duration: 0.1 }, 0.8);

    // Show message
    tl.to(message, {
      opacity: 1,
      duration: 0.15,
      ease: 'power2.out',
    }, 0.85);

  }, { scope: sectionRef });

  return (
    <section className="marketplace-section" ref={sectionRef}>
      <div className="marketplace-inner" ref={innerRef}>
        <div className="marketplace-grid-bg" />

        {/* Section header */}
        <div className="marketplace-header">
          <span className="section-badge">⬡ MARKETPLACE INTEGRATION</span>
          <h2 className="section-title">
            One Command Center for <span className="text-gradient">Every Marketplace</span>
          </h2>
        </div>

        {/* Scattered platform logos */}
        <div className="marketplace-logos">
          {platforms.map((p) => (
            <div
              key={p.id}
              className="marketplace-logo"
              style={{
                left: p.x,
                top: p.y,
                transform: `rotate(${p.rot}deg)`,
              }}
            >
              <img src={p.logo} alt={p.label} className="marketplace-logo-img" />
              <span className="marketplace-logo-label">{p.label}</span>
            </div>
          ))}
        </div>

        {/* Unified dashboard card */}
        <div className="marketplace-dashboard">
          <div className="marketplace-dashboard-header">
            <div className="marketplace-dashboard-dot" />
            <div className="marketplace-dashboard-dot" />
            <div className="marketplace-dashboard-dot" />
            <span className="marketplace-dashboard-title">Vertex Command Center</span>
          </div>
          <div className="marketplace-dashboard-icons">
            {platforms.map((p) => (
              <div
                key={p.id}
                className="marketplace-dashboard-icon"
              >
                <img src={p.logo} alt={p.label} className="marketplace-dashboard-icon-img" />
              </div>
            ))}
          </div>
        </div>

        {/* End message */}
        <div className="marketplace-message">
          <p>
            Manage Amazon, Flipkart, Shopify &amp; WooCommerce from a single command center.
          </p>
        </div>
      </div>
    </section>
  );
}
