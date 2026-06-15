import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './WhyVertexSection.css';

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  {
    icon: '🔗',
    value: '50',
    suffix: '+',
    label: 'Integrations',
    sublabel: 'Connected Platforms',
  },
  {
    icon: '💬',
    value: '100K',
    suffix: '+',
    label: 'Conversations Handled',
    sublabel: 'Messages Processed',
  },
  {
    icon: '🛒',
    value: 'Multi',
    suffix: '-Channel',
    label: 'Commerce Platform',
    sublabel: 'Sell Everywhere',
    isText: true,
  },
  {
    icon: '🧠',
    value: 'AI',
    suffix: '',
    label: 'Powered Automation',
    sublabel: 'Smart & Adaptive',
    isText: true,
  },
];

const integrations = [
  { name: 'WhatsApp', icon: '💬', color: '#25D366' },
  { name: 'Instagram', icon: '📸', color: '#E1306C' },
  { name: 'Amazon', icon: 'A', color: '#FF9900' },
  { name: 'Shopify', icon: 'S', color: '#96BF48' },
  { name: 'Flipkart', icon: 'F', color: '#2874F0' },
  { name: 'WooCommerce', icon: 'W', color: '#96588A' },
  { name: 'Facebook', icon: 'f', color: '#1877F2' },
  { name: 'Google Ads', icon: 'G', color: '#4285F4' },
  { name: 'Razorpay', icon: 'R', color: '#2D8CCB' },
  { name: 'Shiprocket', icon: 'SR', color: '#7B3F70' },
  { name: 'Delhivery', icon: 'DL', color: '#E74C3C' },
  { name: 'Mailchimp', icon: 'M', color: '#FFE01B' },
  { name: 'HubSpot', icon: 'H', color: '#FF7A59' },
  { name: 'Zoho', icon: 'Z', color: '#D32F2F' },
];

export default function WhyVertexSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const cards = section.querySelectorAll('.why-vertex-card');
    const header = section.querySelector('.why-vertex-header');

    // Header slide up
    gsap.from(header, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        once: true,
      },
    });

    // Cards stagger in
    gsap.fromTo(
      cards,
      {
        y: 60,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        }
      }
    );

    // Animate numeric counters
    cards.forEach((card) => {
      const counterEl = card.querySelector('.counter-number');
      if (!counterEl || counterEl.dataset.isText === 'true') return;

      const endVal = parseInt(counterEl.dataset.value, 10);
      if (isNaN(endVal)) return;

      const obj = { val: 0 };
      gsap.to(obj, {
        val: endVal,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true,
        },
        onUpdate: () => {
          counterEl.textContent = Math.round(obj.val);
        },
      });
    });

  }, { scope: sectionRef });

  return (
    <section className="why-vertex-section section" ref={sectionRef}>
      <div className="container">
        {/* Header */}
        <div className="why-vertex-header">
          <span className="section-badge">⚡ WHY VERTEX</span>
          <h2 className="section-title">
            Your Digital <span className="text-gradient">Command Center</span>
          </h2>
        </div>

        {/* Metrics grid */}
        <div className="why-vertex-grid">
          {metrics.map((metric, i) => (
            <div key={i} className="why-vertex-card">
              <div className="why-vertex-card-icon">{metric.icon}</div>
              <div className="why-vertex-card-value">
                <span
                  className="counter-number"
                  data-value={metric.isText ? '' : metric.value.replace(/\D/g, '')}
                  data-is-text={metric.isText || false}
                >
                  {metric.value}
                </span>
                <span className="why-vertex-card-suffix">{metric.suffix}</span>
              </div>
              <div className="why-vertex-card-label">{metric.label}</div>
              <div className="why-vertex-card-sublabel">{metric.sublabel}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration logos marquee */}
      <div className="why-vertex-marquee-wrapper">
        <div className="why-vertex-marquee">
          {/* Doubled for infinite scroll */}
          {[...integrations, ...integrations].map((integration, i) => (
            <div key={i} className="why-vertex-marquee-item">
              <div
                className="why-vertex-marquee-icon"
                style={{ background: `${integration.color}22`, color: integration.color }}
              >
                {integration.icon}
              </div>
              {integration.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
