import { useRef, useCallback } from 'react';
import './TiltCard.css';

/**
 * 3D perspective tilt card with glare overlay.
 *
 * @param {string}   className  – extra CSS classes
 * @param {number}   maxTilt    – max rotation degrees (default 15)
 * @param {number}   scale      – hover scale factor (default 1.02)
 * @param {React.ReactNode} children
 */
export default function TiltCard({
  className = '',
  maxTilt = 15,
  scale = 1.02,
  children,
  ...rest
}) {
  const cardRef = useRef(null);
  const glareRef = useRef(null);
  const rafId = useRef(null);

  const handleMouseMove = useCallback(
    (e) => {
      const card = cardRef.current;
      if (!card) return;

      // Cancel any pending rAF to avoid stacking
      if (rafId.current) cancelAnimationFrame(rafId.current);

      rafId.current = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width; // 0 – 1
        const y = (e.clientY - rect.top) / rect.height;

        const rotateY = (x - 0.5) * maxTilt * 2; // -maxTilt ... +maxTilt
        const rotateX = (0.5 - y) * maxTilt * 2;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;

        // Move glare
        if (glareRef.current) {
          glareRef.current.style.background = `radial-gradient(
            circle at ${x * 100}% ${y * 100}%,
            rgba(255, 255, 255, 0.18) 0%,
            rgba(255, 255, 255, 0) 60%
          )`;
          glareRef.current.style.opacity = '1';
        }
      });
    },
    [maxTilt, scale]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);

    const card = cardRef.current;
    if (card) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = '0';
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
      <div ref={glareRef} className="tilt-card__glare" />
    </div>
  );
}
