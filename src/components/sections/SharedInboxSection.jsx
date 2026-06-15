import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './SharedInboxSection.css';

gsap.registerPlugin(ScrollTrigger);

const messages = [
  {
    id: 'instagram',
    platform: 'instagram',
    icon: '📸',
    sender: 'Sarah M.',
    preview: 'Hey! Love this product, is it available?',
    time: '2m ago',
    x: '8%', y: '35%', rot: -8,
  },
  {
    id: 'whatsapp',
    platform: 'whatsapp',
    icon: '💬',
    sender: 'Raj K.',
    preview: 'Can you send me the catalog?',
    time: '5m ago',
    x: '62%', y: '30%', rot: 5,
  },
  {
    id: 'messenger',
    platform: 'messenger',
    icon: '💭',
    sender: 'Priya S.',
    preview: 'What are the shipping charges?',
    time: '12m ago',
    x: '15%', y: '65%', rot: 6,
  },
  {
    id: 'email',
    platform: 'email',
    icon: '✉️',
    sender: 'orders@store.com',
    preview: 'New bulk order request from...',
    time: '18m ago',
    x: '60%', y: '68%', rot: -10,
  },
];

const iconColors = {
  instagram: 'linear-gradient(135deg, #833AB4, #FD1D1D, #F77737)',
  whatsapp: '#25D366',
  messenger: '#0084FF',
  email: 'linear-gradient(135deg, #6B7280, #9CA3AF)',
};

export default function SharedInboxSection() {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const msgEls = inner.querySelectorAll('.inbox-message');
    const card = inner.querySelector('.shared-inbox-card');
    const cardItems = inner.querySelectorAll('.shared-inbox-card-item');
    const header = inner.querySelector('.shared-inbox-header');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: inner,
      },
    });

    // Phase 0: Show header
    tl.to(header, { opacity: 1, duration: 0.05 }, 0);

    // Phase 1 (0–0.4): Messages drift around
    msgEls.forEach((msg, i) => {
      tl.to(msg, {
        x: `+=${i % 2 === 0 ? 20 : -15}`,
        y: `+=${i % 2 === 0 ? -15 : 20}`,
        rotation: messages[i].rot * 1.5,
        duration: 0.4,
        ease: 'none',
      }, 0);
    });

    // Phase 2 (0.4–0.8): Messages pull together and align vertically
    msgEls.forEach((msg, i) => {
      tl.to(msg, {
        left: '50%',
        top: `${35 + i * 12}%`,
        xPercent: -50,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 0.85,
        duration: 0.35,
        ease: 'power2.inOut',
      }, 0.4);
    });

    // Phase 3 (0.8–1.0): Unified inbox card forms
    // Hide floating messages
    tl.to(msgEls, {
      opacity: 0,
      scale: 0.5,
      duration: 0.08,
    }, 0.78);

    // Show card
    tl.to(card, {
      opacity: 1,
      scale: 1,
      duration: 0.1,
      ease: 'power2.out',
    }, 0.78);

    // Slide in card items
    tl.to(cardItems, {
      opacity: 1,
      x: 0,
      duration: 0.08,
      stagger: 0.03,
    }, 0.85);

    // Fade header
    tl.to(header, { opacity: 0.5, duration: 0.1 }, 0.85);

  }, { scope: sectionRef });

  return (
    <section className="shared-inbox-section" ref={sectionRef}>
      <div className="shared-inbox-inner" ref={innerRef}>
        {/* Section header */}
        <div className="shared-inbox-header">
          <span className="section-badge">✉ SHARED INBOX</span>
          <h2 className="section-title">
            Every Message. <span className="text-gradient">One Inbox.</span>
          </h2>
        </div>

        {/* Floating message bubbles */}
        <div className="shared-inbox-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`inbox-message inbox-message--${msg.platform}`}
              style={{
                left: msg.x,
                top: msg.y,
                transform: `rotate(${msg.rot}deg)`,
              }}
            >
              <div className="inbox-message-icon">{msg.icon}</div>
              <div className="inbox-message-body">
                <div className="inbox-message-sender">{msg.sender}</div>
                <div className="inbox-message-preview">{msg.preview}</div>
                <div className="inbox-message-time">{msg.time}</div>
              </div>
              <div className="inbox-message-platform-dot" />
            </div>
          ))}
        </div>

        {/* Unified inbox card */}
        <div className="shared-inbox-card">
          <div className="shared-inbox-card-header">
            <h3>All Messages</h3>
            <span className="shared-inbox-card-count">4 new</span>
          </div>
          <div className="shared-inbox-card-list">
            {messages.map((msg) => (
              <div key={msg.id} className="shared-inbox-card-item">
                <div
                  className="shared-inbox-card-item-icon"
                  style={{ background: iconColors[msg.platform] }}
                >
                  {msg.icon}
                </div>
                <div className="shared-inbox-card-item-text">
                  <div className="shared-inbox-card-item-name">{msg.sender}</div>
                  <div className="shared-inbox-card-item-msg">{msg.preview}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
