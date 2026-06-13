import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './MarketingHubSection.css';

gsap.registerPlugin(ScrollTrigger);

const stages = [
  { id: 'awareness', name: 'Awareness', stat: 'Impressions', value: '2.4M', color: '#A8D7F4' },
  { id: 'consideration', name: 'Consideration', stat: 'Clicks', value: '180K', color: '#2D8CCB' },
  { id: 'conversion', name: 'Conversion', stat: 'Conversions', value: '12.5K', color: '#12569F' },
  { id: 'loyalty', name: 'Loyalty', stat: 'Retained', value: '8.2K', color: '#49C8FF' },
];

// Generate particles
const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${30 + Math.random() * 40}%`,
  delay: Math.random() * 0.5,
}));

export default function MarketingHubSection() {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;

    const info = inner.querySelector('.marketing-hub-info');
    const funnelFills = inner.querySelectorAll('.funnel-stage-fill');
    const labels = inner.querySelectorAll('.funnel-label');
    const particleEls = inner.querySelectorAll('.funnel-particle');
    const loyaltyGlow = inner.querySelector('.funnel-loyalty-glow');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: inner,
      },
    });

    // Info slides in
    tl.to(info, { opacity: 1, x: 0, duration: 0.1, ease: 'power2.out' }, 0);

    // Phase 1 (0-0.25): Awareness lights up + particles enter top
    tl.to(funnelFills[0], { opacity: 0.8, duration: 0.15 }, 0.05);
    tl.to(labels[0], { opacity: 1, x: 0, duration: 0.1 }, 0.08);

    // Particles start flowing
    particleEls.forEach((p, i) => {
      const startY = -10;
      const endY = 25;
      tl.fromTo(p,
        { opacity: 0, top: `${startY}%`, left: `${30 + Math.random() * 40}%` },
        { opacity: 0.8, top: `${endY}%`, duration: 0.2, ease: 'none' },
        0.05 + (i * 0.008)
      );
    });

    // Phase 2 (0.25-0.5): Consideration lights up
    tl.to(funnelFills[1], { opacity: 0.8, duration: 0.15 }, 0.25);
    tl.to(labels[1], { opacity: 1, x: 0, duration: 0.1 }, 0.28);

    // Particles continue flowing (some disappear = filtering)
    particleEls.forEach((p, i) => {
      if (i % 3 === 0) {
        tl.to(p, { opacity: 0, duration: 0.1 }, 0.3);
      } else {
        tl.to(p, { top: '50%', duration: 0.2, ease: 'none' }, 0.25);
      }
    });

    // Phase 3 (0.5-0.75): Conversion lights up
    tl.to(funnelFills[2], { opacity: 0.8, duration: 0.15 }, 0.5);
    tl.to(labels[2], { opacity: 1, x: 0, duration: 0.1 }, 0.53);

    // More particles disappear
    particleEls.forEach((p, i) => {
      if (i % 3 !== 0 && i % 2 === 0) {
        tl.to(p, { opacity: 0, duration: 0.1 }, 0.55);
      } else if (i % 3 !== 0) {
        tl.to(p, { top: '75%', duration: 0.2, ease: 'none' }, 0.5);
      }
    });

    // Phase 4 (0.75-1.0): Loyalty glows brightly
    tl.to(funnelFills[3], { opacity: 1, duration: 0.15 }, 0.75);
    tl.to(labels[3], { opacity: 1, x: 0, duration: 0.1 }, 0.78);
    tl.to(loyaltyGlow, { opacity: 1, duration: 0.2 }, 0.8);

    // Remaining particles settle at bottom
    particleEls.forEach((p, i) => {
      if (i % 3 !== 0 && i % 2 !== 0) {
        tl.to(p, {
          top: '90%',
          left: '50%',
          boxShadow: '0 0 12px rgba(73, 200, 255, 0.8)',
          duration: 0.2,
          ease: 'none',
        }, 0.75);
      }
    });

  }, { scope: sectionRef });

  return (
    <section className="marketing-hub-section" ref={sectionRef}>
      <div className="marketing-hub-inner" ref={innerRef}>
        <div className="marketing-hub-layout">
          {/* Left — Info */}
          <div className="marketing-hub-info">
            <span className="section-badge">📊 MARKETING HUB</span>
            <h2 className="section-title">
              Full-Funnel <span className="text-gradient">Marketing Automation</span>
            </h2>
            <p>
              From awareness to loyalty, orchestrate every touchpoint with AI-driven
              campaigns, automated workflows, and real-time analytics across all channels.
            </p>
          </div>

          {/* Right — Funnel */}
          <div className="marketing-hub-funnel-wrapper">
            <svg className="funnel-svg" viewBox="0 0 400 520" fill="none">
              {/* Awareness - widest */}
              <path
                className="funnel-stage-fill"
                d="M40 20 L360 20 L330 140 L70 140 Z"
                fill={stages[0].color}
              />
              <path
                className="funnel-stage-stroke"
                d="M40 20 L360 20 L330 140 L70 140 Z"
                stroke={stages[0].color}
              />

              {/* Consideration - medium */}
              <path
                className="funnel-stage-fill"
                d="M70 145 L330 145 L290 265 L110 265 Z"
                fill={stages[1].color}
              />
              <path
                className="funnel-stage-stroke"
                d="M70 145 L330 145 L290 265 L110 265 Z"
                stroke={stages[1].color}
              />

              {/* Conversion - narrow */}
              <path
                className="funnel-stage-fill"
                d="M110 270 L290 270 L250 390 L150 390 Z"
                fill={stages[2].color}
              />
              <path
                className="funnel-stage-stroke"
                d="M110 270 L290 270 L250 390 L150 390 Z"
                stroke={stages[2].color}
              />

              {/* Loyalty - narrowest */}
              <path
                className="funnel-stage-fill"
                d="M150 395 L250 395 L220 500 L180 500 Z"
                fill={stages[3].color}
              />
              <path
                className="funnel-stage-stroke"
                d="M150 395 L250 395 L220 500 L180 500 Z"
                stroke={stages[3].color}
              />
            </svg>

            {/* Stage labels with stats */}
            <div className="funnel-labels">
              {stages.map((stage) => (
                <div key={stage.id} className={`funnel-label funnel-label--${stage.id}`}>
                  <div className="funnel-label-name">{stage.name}</div>
                  <div className="funnel-label-value">{stage.value}</div>
                  <div className="funnel-label-stat">{stage.stat}</div>
                </div>
              ))}
            </div>

            {/* Particles */}
            <div className="funnel-particles">
              {particles.map((p) => (
                <div
                  key={p.id}
                  className="funnel-particle"
                  style={{ left: p.left }}
                />
              ))}
            </div>

            {/* Loyalty glow */}
            <div className="funnel-loyalty-glow" />
          </div>
        </div>
      </div>
    </section>
  );
}
