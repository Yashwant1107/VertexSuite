import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './LogisticsSection.css';

gsap.registerPlugin(ScrollTrigger);

const cities = [
  { name: 'Mumbai', x: '62%', y: '52%' },
  { name: 'Delhi', x: '61%', y: '38%' },
  { name: 'London', x: '45%', y: '28%' },
  { name: 'New York', x: '25%', y: '35%' },
  { name: 'Singapore', x: '72%', y: '58%' },
];

const carriers = [
  { name: 'BlueDart', icon: 'BD', best: false },
  { name: 'Delhivery', icon: 'DL', best: true },
  { name: 'DTDC', icon: 'DT', best: false },
  { name: 'Ecom Express', icon: 'EE', best: false },
];

export default function LogisticsSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const routes = section.querySelectorAll('.shipping-route');
    const panelRight = section.querySelector('.logistics-panel-right');
    const loadingBar = section.querySelector('.logistics-ai-loading-bar');
    const dots = section.querySelectorAll('.map-dot');

    // Animate routes drawing in
    routes.forEach((route, i) => {
      gsap.to(route, {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'center center',
          scrub: true,
        },
      });
    });

    // Map dots scale in
    gsap.from(dots, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      },
    });

    // Right panel
    gsap.to(panelRight, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 40%',
        toggleActions: 'play none none reverse',
      },
    });

    // Loading bar animation
    gsap.to(loadingBar, {
      width: '100%',
      duration: 2,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: section,
        start: 'top 35%',
        toggleActions: 'play none none reverse',
      },
    });

  }, { scope: sectionRef });

  return (
    <section className="logistics-section section" ref={sectionRef}>
      <div className="logistics-map-container">
        {/* Simplified world map as SVG background */}
        <svg className="logistics-map-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
          {/* Simplified continent outlines */}
          {/* North America */}
          <path className="map-land" d="M120,80 L180,60 L250,80 L280,120 L260,180 L220,200 L180,220 L140,200 L100,160 L90,120 Z" />
          {/* South America */}
          <path className="map-land" d="M200,240 L240,230 L260,260 L270,320 L260,380 L230,400 L200,380 L190,320 L185,280 Z" />
          {/* Europe */}
          <path className="map-land" d="M420,60 L480,50 L520,70 L500,120 L480,140 L440,130 L420,100 Z" />
          {/* Africa */}
          <path className="map-land" d="M440,160 L490,150 L520,200 L530,280 L510,340 L480,360 L450,340 L430,280 L420,220 Z" />
          {/* Asia */}
          <path className="map-land" d="M520,40 L620,30 L720,50 L760,100 L740,160 L700,200 L640,220 L580,200 L540,160 L520,100 Z" />
          {/* India */}
          <path className="map-land" d="M600,180 L640,170 L660,200 L650,260 L630,290 L610,270 L590,240 L585,210 Z" />
          {/* Southeast Asia */}
          <path className="map-land" d="M700,200 L740,190 L760,220 L750,260 L720,280 L700,260 L690,230 Z" />
          {/* Australia */}
          <path className="map-land" d="M740,320 L800,310 L840,330 L850,370 L830,400 L780,410 L740,390 L730,360 Z" />
        </svg>

        {/* Shipping routes */}
        <svg className="logistics-routes-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
          {/* Mumbai to London */}
          <path className="shipping-route" d="M620,260 Q520,120 450,130" />
          {/* Mumbai to New York */}
          <path className="shipping-route" d="M620,260 Q400,100 250,170" />
          {/* Mumbai to Singapore */}
          <path className="shipping-route" d="M620,260 Q660,260 720,280" />
          {/* Delhi to London */}
          <path className="shipping-route" d="M610,190 Q530,100 460,110" />
          {/* Mumbai to Delhi */}
          <path className="shipping-route" d="M620,260 Q615,230 610,190" />
        </svg>

        {/* Map dots */}
        {cities.map((city) => (
          <div
            key={city.name}
            className="map-dot"
            style={{ left: city.x, top: city.y }}
          >
            <span className="map-dot-label">{city.name}</span>
          </div>
        ))}

        {/* Left panel */}
        <div className="logistics-panel-left">
          <span className="section-badge">🚚 SMART LOGISTICS</span>
          <h2 className="section-title">
            AI-Powered <span className="text-gradient">Shipping Intelligence</span>
          </h2>
          <p>
            Automatically compare 50+ shipping partners in real-time. Our AI selects
            the fastest, cheapest route — saving you up to 40% on every shipment.
          </p>
        </div>

        {/* Right panel */}
        <div className="logistics-panel-right">
          {/* AI Indicator */}
          <div className="logistics-ai-indicator">
            <div className="logistics-ai-header">
              <div className="logistics-ai-dot" />
              <span className="logistics-ai-title">AI Selecting Best Partner</span>
            </div>
            <div className="logistics-ai-loading">
              <div className="logistics-ai-loading-bar" />
            </div>
            <div className="logistics-ai-text">Analyzing 50+ carriers across 3 zones...</div>
          </div>

          {/* Cost comparison */}
          <div className="logistics-cost-card">
            <div className="logistics-cost-header">Shipping Cost</div>
            <div className="logistics-cost-prices">
              <span className="logistics-cost-original">₹150</span>
              <span className="logistics-cost-new">₹89</span>
            </div>
            <div className="logistics-cost-savings">You save ₹61 (41%)</div>
          </div>

          {/* Carrier list */}
          <div className="logistics-carriers">
            <div className="logistics-carriers-title">Available Partners</div>
            {carriers.map((carrier) => (
              <div
                key={carrier.name}
                className={`logistics-carrier ${carrier.best ? 'best-match' : ''}`}
              >
                <div className="logistics-carrier-icon">{carrier.icon}</div>
                <span className="logistics-carrier-name">{carrier.name}</span>
                {carrier.best && (
                  <span className="logistics-carrier-badge">Best Match</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
