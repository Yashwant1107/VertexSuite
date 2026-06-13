import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import './MagneticButton.css';

/**
 * Magnetic hover-effect button.
 *
 * @param {number}   strength   – pull intensity (0 – 1), default 0.3
 * @param {string}   className  – additional CSS class names
 * @param {function} onClick    – click handler
 * @param {React.ReactNode} children
 */
export default function MagneticButton({
  strength = 0.3,
  className = '',
  onClick,
  children,
  ...rest
}) {
  const btnRef = useRef(null);
  const quickToX = useRef(null);
  const quickToY = useRef(null);

  useEffect(() => {
    // gsap.quickTo returns a function you can call repeatedly — much faster
    // than creating a new tween each mousemove event.
    quickToX.current = gsap.quickTo(btnRef.current, 'x', {
      duration: 0.4,
      ease: 'power3.out',
    });
    quickToY.current = gsap.quickTo(btnRef.current, 'y', {
      duration: 0.4,
      ease: 'power3.out',
    });
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      const rect = btnRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      quickToX.current(dx * strength);
      quickToY.current(dy * strength);
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.4)',
    });
  }, []);

  return (
    <button
      ref={btnRef}
      className={`magnetic-button ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...rest}
    >
      <span className="magnetic-button__content">{children}</span>
    </button>
  );
}
