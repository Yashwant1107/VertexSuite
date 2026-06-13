import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './HeroSection.css';

gsap.registerPlugin(ScrollTrigger);

// Generate random stars for the background
const stars = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  duration: `${2 + Math.random() * 4}s`,
  delay: `${Math.random() * 3}s`,
}));

const headlineLines = [
  { text: 'One Platform.', gradient: false },
  { text: 'Infinite Connections.', gradient: true },
];

export default function HeroSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const ctx = sectionRef.current;
    const words = ctx.querySelectorAll('.word');
    const subheadline = ctx.querySelector('.hero-subheadline');
    const cta = ctx.querySelector('.hero-cta');
    const scrollIndicator = ctx.querySelector('.hero-scroll-indicator');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Word-by-word headline reveal
    tl.to(words, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
    });

    // 2. Subheadline fade in
    tl.to(subheadline, {
      opacity: 1,
      y: 0,
      duration: 0.7,
    }, '-=0.3');

    // 3. CTA buttons slide up
    tl.to(cta, {
      opacity: 1,
      y: 0,
      duration: 0.6,
    }, '-=0.3');

    // 4. Scroll indicator fade in
    tl.to(scrollIndicator, {
      opacity: 1,
      duration: 0.5,
    }, '-=0.2');

    // Parallax fade-out on scroll
    gsap.to(ctx.querySelector('.hero-content'), {
      y: -80,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: ctx,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, { scope: sectionRef });

  return (
    <section className="hero-section" ref={sectionRef}>
      {/* Background stars */}
      <div className="hero-stars">
        {stars.map((star) => (
          <div
            key={star.id}
            className="hero-star"
            style={{
              left: star.left,
              top: star.top,
              '--duration': star.duration,
              '--delay': star.delay,
            }}
          />
        ))}
      </div>

      {/* Animated glow orbs */}
      <div className="hero-bg-orbs">
        <div className="hero-orb hero-orb--1" />
        <div className="hero-orb hero-orb--2" />
        <div className="hero-orb hero-orb--3" />
        <div className="hero-orb hero-orb--4" />
      </div>

      {/* Main content */}
      <div className="hero-content">
        <h1 className="hero-headline">
          {headlineLines.map((line, lineIdx) => (
            <span className="line" key={lineIdx}>
              {line.text.split(' ').map((word, wordIdx) => (
                <span
                  className={`word ${line.gradient ? 'text-gradient' : ''}`}
                  key={`${lineIdx}-${wordIdx}`}
                >
                  {word}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p className="hero-subheadline">
          Social Commerce, Marketplace Management, Logistics, Marketing &amp; Analytics
          in one unified ecosystem.
        </p>

        <div className="hero-cta">
          <button className="btn btn-primary btn-lg">Book Demo</button>
          <button className="btn btn-secondary btn-lg">Explore Platform</button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll-indicator">
        <span>Scroll</span>
        <div className="hero-scroll-chevron" />
      </div>
    </section>
  );
}
