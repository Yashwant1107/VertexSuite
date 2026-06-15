import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './SocialCommerceSection.css';

gsap.registerPlugin(ScrollTrigger);

const confettiColors = ['#25D366', '#49C8FF', '#FF9900', '#FF6B6B', '#FFD93D', '#6BCB77'];

export default function SocialCommerceSection() {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;

    const phone = inner.querySelector('.phone-mockup');
    const info = inner.querySelector('.social-commerce-info');
    const typingEls = inner.querySelectorAll('.chat-typing');
    const msg1 = inner.querySelector('.chat-msg--m1');
    const msg2 = inner.querySelector('.chat-msg--m2');
    const productCards = inner.querySelector('.chat-product-cards');
    const msg3 = inner.querySelector('.chat-msg--m3');
    const buyBtn = inner.querySelector('.chat-buy-btn');
    const checkout = inner.querySelector('.chat-checkout');
    const confirmed = inner.querySelector('.chat-confirmed');
    const chatContent = inner.querySelector('.chat-content');
    const confettiPieces = inner.querySelectorAll('.confetti-piece');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        pin: inner,
      },
    });

    // Phase 1 (0-0.2): Phone slides in, info fades in, first message
    tl.to(phone, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0);
    tl.to(info, { opacity: 1, x: 0, duration: 0.08, ease: 'power2.out' }, 0.02);

    // Show typing then first message
    tl.to(typingEls[0], { opacity: 1, duration: 0.03 }, 0.08);
    tl.to(typingEls[0], { opacity: 0, duration: 0.02 }, 0.14);
    tl.to(msg1, { opacity: 1, y: 0, scale: 1, duration: 0.04 }, 0.16);

    // Phase 2 (0.2-0.4): Reply + product cards
    tl.to(typingEls[1], { opacity: 1, duration: 0.03 }, 0.22);
    tl.to(typingEls[1], { opacity: 0, duration: 0.02 }, 0.28);
    tl.to(msg2, { opacity: 1, y: 0, scale: 1, duration: 0.04 }, 0.30);
    tl.to(productCards, { opacity: 1, y: 0, duration: 0.06 }, 0.34);
    tl.to(chatContent, {
      y: -350,
      duration: 0.25,
      ease: 'none'
    }, 0.35);
    // Phase 3 (0.4-0.6): Customer reply + Buy button
    tl.to(msg3, { opacity: 1, y: 0, scale: 1, duration: 0.04 }, 0.44);
    tl.to(buyBtn, { opacity: 1, scale: 1, duration: 0.05, ease: 'back.out(1.7)' }, 0.52);

    // Phase 4 (0.6-0.8): Checkout summary
    tl.to(buyBtn, { opacity: 0.4, duration: 0.03 }, 0.62);
    tl.to(checkout, { opacity: 1, y: 0, duration: 0.06 }, 0.64);

    // Phase 5 (0.8-1.0): Order confirmed + confetti
    tl.to(confirmed, { opacity: 1, scale: 1, duration: 0.06, ease: 'back.out(1.7)' }, 0.84);

    // Confetti burst
    confettiPieces.forEach((piece, i) => {
      const angle = (i / confettiPieces.length) * Math.PI * 2;
      const distance = 60 + Math.random() * 80;
      tl.to(piece, {
        opacity: 1,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 40,
        rotation: Math.random() * 360,
        duration: 0.08,
        ease: 'power2.out',
      }, 0.88);
      tl.to(piece, {
        opacity: 0,
        y: `+=${30 + Math.random() * 40}`,
        duration: 0.06,
      }, 0.95);

    });

  }, { scope: sectionRef });

  return (
    <section className="social-commerce-section" ref={sectionRef}>
      <div className="social-commerce-inner" ref={innerRef}>
        <div className="social-commerce-layout">
          {/* Left — Section Info */}
          <div className="social-commerce-info">
            <span className="section-badge">🛒 SOCIAL COMMERCE</span>
            <h2 className="section-title">
              Turn Conversations into <span className="text-gradient">Conversions</span>
            </h2>
            <p>
              Sell directly inside WhatsApp, Instagram DMs, and Facebook Messenger.
              From product discovery to checkout — every step happens in one conversation.
            </p>
          </div>

          {/* Right — Phone Mockup */}
          <div className="social-commerce-phone-wrapper">
            <div className="phone-mockup">
              {/* Phone header */}
              <div className="phone-header">
                <div className="phone-header-avatar">🏪</div>
                <div>
                  <div className="phone-header-name">Vertex Store</div>
                  <div className="phone-header-status">online</div>
                </div>
              </div>

              {/* Chat area */}
              <div className="phone-chat">
                <div className="chat-content">
                  {/* Typing indicator 1 */}
                  <div className="chat-typing">
                    <div className="chat-typing-dot" />
                    <div className="chat-typing-dot" />
                    <div className="chat-typing-dot" />
                  </div>

                  {/* Message 1 — incoming */}
                  <div className="chat-msg chat-msg--incoming chat-msg--m1">
                    Hi! I saw your product on Instagram 👀
                    <div className="chat-msg-time">10:32 AM</div>
                  </div>

                  {/* Typing indicator 2 */}
                  <div className="chat-typing">
                    <div className="chat-typing-dot" />
                    <div className="chat-typing-dot" />
                    <div className="chat-typing-dot" />
                  </div>

                  {/* Message 2 — outgoing */}
                  <div className="chat-msg chat-msg--outgoing chat-msg--m2">
                    Hey! Here are our bestsellers 🛍️
                    <div className="chat-msg-time">10:33 AM</div>
                  </div>

                  {/* Product cards */}
                  <div className="chat-product-cards">
                    <div className="chat-product-card">
                      <div className="chat-product-img">👕</div>
                      <div className="chat-product-name">Classic Blue Tee</div>
                      <div className="chat-product-price">₹899</div>
                    </div>
                    <div className="chat-product-card">
                      <div className="chat-product-img">👟</div>
                      <div className="chat-product-name">Sport Sneakers</div>
                      <div className="chat-product-price">₹2,499</div>
                    </div>
                  </div>

                  {/* Message 3 — incoming */}
                  <div className="chat-msg chat-msg--incoming chat-msg--m3">
                    I want the Blue one! 💙
                    <div className="chat-msg-time">10:34 AM</div>
                  </div>

                  {/* Buy button */}
                  <button className="chat-buy-btn">🛒 Buy Now — ₹899</button>

                  {/* Checkout summary */}
                  <div className="chat-checkout">
                    <div className="chat-checkout-title">📋 Order Summary</div>
                    <div className="chat-checkout-row">
                      <span>Classic Blue Tee × 1</span>
                      <span>₹899</span>
                    </div>
                    <div className="chat-checkout-row">
                      <span>Shipping</span>
                      <span>FREE</span>
                    </div>
                    <div className="chat-checkout-row">
                      <span>Total</span>
                      <span>₹899</span>
                    </div>
                  </div>

                  {/* Order confirmed */}
                  <div className="chat-confirmed">
                    <div className="chat-confirmed-emoji">✅</div>
                    <div className="chat-confirmed-text">Order Confirmed!</div>
                    <div className="chat-confirmed-order">Order #VTX-20260613-1847</div>

                    {/* Confetti */}
                    <div className="chat-confetti">
                      {confettiColors.map((color, i) =>
                        Array.from({ length: 3 }, (_, j) => (
                          <div
                            key={`${i}-${j}`}
                            className="confetti-piece"
                            style={{
                              background: color,
                              left: '50%',
                              top: '50%',
                            }}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
