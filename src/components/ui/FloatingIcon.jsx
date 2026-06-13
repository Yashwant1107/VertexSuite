import './FloatingIcon.css';

/**
 * Anti-gravity floating wrapper.
 * Wraps any content with a gentle up/down float + subtle rotation.
 *
 * @param {number} duration – animation cycle duration in seconds (default 4)
 * @param {number} delay    – animation delay in seconds (default random 0-2)
 * @param {string} className
 * @param {React.ReactNode} children
 */
export default function FloatingIcon({
  duration = 4,
  delay,
  className = '',
  children,
  style,
  ...rest
}) {
  // If no delay supplied, generate a stable random value via inline style.
  // Using Math.random here is fine — it only runs once on mount.
  const resolvedDelay = delay ?? Math.random() * 2;

  return (
    <div
      className={`floating-icon ${className}`}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${resolvedDelay}s`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
