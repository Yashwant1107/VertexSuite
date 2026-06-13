import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import './AnimatedCounter.css';

/**
 * Animated number counter.
 *
 * @param {number} end       – target value
 * @param {number} duration  – animation duration in seconds (default 2)
 * @param {string} suffix    – text after the number (e.g. '+', 'K+')
 * @param {string} prefix    – text before the number (e.g. '$')
 * @param {number} decimals  – decimal places to show (default 0)
 * @param {string} className
 */
export default function AnimatedCounter({
  end = 0,
  duration = 2,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
  ...rest
}) {
  const elRef = useRef(null);
  const hasAnimated = useRef(false);
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);

  const formatNumber = useCallback(
    (n) => {
      const fixed = Number(n).toFixed(decimals);
      // Add commas for thousands
      const [intPart, decPart] = fixed.split('.');
      const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return decPart !== undefined ? `${withCommas}.${decPart}` : withCommas;
    },
    [decimals]
  );

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          const proxy = { value: 0 };
          gsap.to(proxy, {
            value: end,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              setDisplay(`${prefix}${formatNumber(proxy.value)}${suffix}`);
            },
          });

          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, prefix, suffix, formatNumber]);

  return (
    <span ref={elRef} className={`animated-counter ${className}`} {...rest}>
      {display}
    </span>
  );
}
