import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Platform data                                                      */
/* ------------------------------------------------------------------ */
const PLATFORMS = [
  { name: 'Amazon',      color: '#FF9900', radius: 2.4, speed: 0.35, inclination: 0.15,  phaseOffset: 0 },
  { name: 'Shopify',     color: '#96BF48', radius: 2.9, speed: 0.28, inclination: -0.2,  phaseOffset: 1.05 },
  { name: 'WooCommerce', color: '#96588A', radius: 3.4, speed: 0.22, inclination: 0.25,  phaseOffset: 2.1 },
  { name: 'WhatsApp',    color: '#25D366', radius: 2.6, speed: 0.32, inclination: -0.1,  phaseOffset: 3.14 },
  { name: 'Instagram',   color: '#E4405F', radius: 3.1, speed: 0.26, inclination: 0.18,  phaseOffset: 4.19 },
  { name: 'Facebook',    color: '#1877F2', radius: 3.7, speed: 0.20, inclination: -0.22, phaseOffset: 5.24 },
];

const DATA_PARTICLES_PER_LINE = 5;

/* ------------------------------------------------------------------ */
/*  Glowing center triangle                                            */
/* ------------------------------------------------------------------ */
function VertexCenter() {
  const groupRef = useRef();

  const triangleGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const s = 0.6;
    shape.moveTo(0, s);
    shape.lineTo(-s * 0.866, -s * 0.5);
    shape.lineTo(s * 0.866, -s * 0.5);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Main triangle */}
      <mesh geometry={triangleGeo}>
        <meshStandardMaterial
          color="#49C8FF"
          emissive="#2D8CCB"
          emissiveIntensity={2.5}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer glow triangle (slightly larger + more transparent) */}
      <mesh geometry={triangleGeo} scale={1.5}>
        <meshStandardMaterial
          color="#A8D7F4"
          emissive="#49C8FF"
          emissiveIntensity={1.5}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Halo ring */}
      <mesh rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.85, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#49C8FF"
          emissive="#49C8FF"
          emissiveIntensity={3}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Core glow point light */}
      <pointLight color="#49C8FF" intensity={4} distance={8} decay={2} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Orbiting platform node                                             */
/* ------------------------------------------------------------------ */
function PlatformNode({ platform }) {
  const groupRef = useRef();
  const { name, color, radius, speed, inclination, phaseOffset } = platform;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const angle = t * speed + phaseOffset;
    groupRef.current.position.x = Math.cos(angle) * radius;
    groupRef.current.position.z = Math.sin(angle) * radius;
    groupRef.current.position.y = Math.sin(angle * 0.7 + phaseOffset) * inclination * radius * 0.4;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        {/* Main sphere */}
        <mesh>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>

        {/* Outer glow shell */}
        <mesh>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </mesh>

        {/* Label */}
        <Html
          position={[0, 0.45, 0]}
          center
          distanceFactor={8}
          style={{
            color: '#fff',
            fontSize: '11px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            textShadow: `0 0 12px ${color}, 0 0 24px ${color}50`,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {name}
        </Html>
      </Float>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Connection line + flowing data particles                           */
/* ------------------------------------------------------------------ */
function ConnectionLine({ platform }) {
  const lineRef = useRef();
  const particlesRef = useRef();
  const { color, radius, speed, inclination, phaseOffset } = platform;

  const particleData = useMemo(() => {
    const offsets = [];
    for (let i = 0; i < DATA_PARTICLES_PER_LINE; i++) {
      offsets.push(Math.random()); // 0-1 position along line
    }
    return offsets;
  }, []);

  const particlePositions = useMemo(
    () => new Float32Array(DATA_PARTICLES_PER_LINE * 3),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const angle = t * speed + phaseOffset;
    const endX = Math.cos(angle) * radius;
    const endZ = Math.sin(angle) * radius;
    const endY = Math.sin(angle * 0.7 + phaseOffset) * inclination * radius * 0.4;

    // Update line vertices
    if (lineRef.current) {
      const posArr = lineRef.current.geometry.attributes.position.array;
      // Start (center)
      posArr[0] = 0;
      posArr[1] = 0;
      posArr[2] = 0;
      // End (planet)
      posArr[3] = endX;
      posArr[4] = endY;
      posArr[5] = endZ;
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Update data particles flowing along the line
    if (particlesRef.current) {
      for (let i = 0; i < DATA_PARTICLES_PER_LINE; i++) {
        // Particle travels from center to node, cycling
        const p = (particleData[i] + t * (0.15 + i * 0.03)) % 1;
        particlePositions[i * 3] = endX * p;
        particlePositions[i * 3 + 1] = endY * p;
        particlePositions[i * 3 + 2] = endZ * p;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const lineVerts = useMemo(() => new Float32Array(6), []);
  const col = useMemo(() => new THREE.Color(color), [color]);

  return (
    <>
      {/* Connection line */}
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={lineVerts}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={col}
          transparent
          opacity={0.2}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Data flow particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particlePositions}
            count={DATA_PARTICLES_PER_LINE}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.06}
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main exported component                                            */
/* ------------------------------------------------------------------ */
export default function OrbitingIcons() {
  const systemRef = useRef();

  // Slow global rotation
  useFrame((state) => {
    if (!systemRef.current) return;
    systemRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={systemRef}>
      {/* Ambient + directional for basic lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />

      {/* Center logo */}
      <VertexCenter />

      {/* Orbiting platform nodes + connection lines */}
      {PLATFORMS.map((platform) => (
        <group key={platform.name}>
          <PlatformNode platform={platform} />
          <ConnectionLine platform={platform} />
        </group>
      ))}
    </group>
  );
}
