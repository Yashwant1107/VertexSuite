import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 2000;
const MAX_CONNECTIONS = 200;
const CONNECTION_DISTANCE = 1.8;
const CURSOR_RADIUS = 2.0;
const CURSOR_STRENGTH = 0.6;
const LERP_SPEED = 0.02;
const FIELD_SIZE = 12;

/**
 * Persistent particle network background.
 * Renders ~2000 softly drifting particles with sine-based floating,
 * cursor repulsion, and dynamic connection lines between nearby particles.
 * This component renders the scene content only — the wrapping <Canvas>
 * lives in App.jsx.
 */
export default function ParticleBackground() {
  const pointsRef = useRef();
  const linesRef = useRef();
  const { viewport } = useThree();

  // ---------- particle data ----------
  const {
    positions,
    originalPositions,
    colors,
    sizes,
    velocities,
    phases,
  } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const originalPositions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const phases = new Float32Array(PARTICLE_COUNT * 3); // phase offsets for sine

    // Brand palette (normalised to 0-1)
    const palette = [
      [45 / 255, 140 / 255, 203 / 255],   // #2D8CCB
      [73 / 255, 200 / 255, 255 / 255],    // #49C8FF
      [168 / 255, 215 / 255, 244 / 255],   // #A8D7F4
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Spread particles across a large cube volume
      const x = (Math.random() - 0.5) * FIELD_SIZE * 2;
      const y = (Math.random() - 0.5) * FIELD_SIZE * 2;
      const z = (Math.random() - 0.5) * FIELD_SIZE;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      // Pick random brand colour
      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = col[0];
      colors[i3 + 1] = col[1];
      colors[i3 + 2] = col[2];

      sizes[i] = 0.03 + Math.random() * 0.03; // 0.03 – 0.06

      // Slow drift velocities
      velocities[i3] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.002;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.001;

      // Random sine phases
      phases[i3] = Math.random() * Math.PI * 2;
      phases[i3 + 1] = Math.random() * Math.PI * 2;
      phases[i3 + 2] = Math.random() * Math.PI * 2;
    }

    return { positions, originalPositions, colors, sizes, velocities, phases };
  }, []);

  // ---------- line data ----------
  const linePositions = useMemo(
    () => new Float32Array(MAX_CONNECTIONS * 2 * 3), // 2 vertices per segment
    []
  );
  const lineColors = useMemo(
    () => new Float32Array(MAX_CONNECTIONS * 2 * 3),
    []
  );

  // ---------- per-frame update ----------
  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;

    const time = state.clock.elapsedTime;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArr = posAttr.array;

    // Convert pointer to world coords (on z = 0 plane)
    const pointerX = state.pointer.x * (viewport.width / 2);
    const pointerY = state.pointer.y * (viewport.height / 2);

    // ---- update particles ----
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Sine-based floating offset
      const sineX = Math.sin(time * 0.3 + phases[i3]) * 0.15;
      const sineY = Math.sin(time * 0.25 + phases[i3 + 1]) * 0.2;
      const sineZ = Math.sin(time * 0.2 + phases[i3 + 2]) * 0.08;

      // Target = original + sine offset + slow drift
      const targetX = originalPositions[i3] + sineX + velocities[i3] * time;
      const targetY = originalPositions[i3 + 1] + sineY + velocities[i3 + 1] * time;
      const targetZ = originalPositions[i3 + 2] + sineZ + velocities[i3 + 2] * time;

      // Cursor repulsion (2D on x/y plane)
      const dx = posArr[i3] - pointerX;
      const dy = posArr[i3 + 1] - pointerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let pushX = 0;
      let pushY = 0;
      if (dist < CURSOR_RADIUS && dist > 0.001) {
        const force = (1 - dist / CURSOR_RADIUS) * CURSOR_STRENGTH;
        pushX = (dx / dist) * force;
        pushY = (dy / dist) * force;
      }

      // Lerp towards target + push
      posArr[i3] += ((targetX + pushX) - posArr[i3]) * LERP_SPEED;
      posArr[i3 + 1] += ((targetY + pushY) - posArr[i3 + 1]) * LERP_SPEED;
      posArr[i3 + 2] += (targetZ - posArr[i3 + 2]) * LERP_SPEED;
    }

    posAttr.needsUpdate = true;

    // ---- slow rotation ----
    pointsRef.current.rotation.y = time * 0.015;
    pointsRef.current.rotation.x = Math.sin(time * 0.01) * 0.05;

    // ---- update connection lines ----
    const linePosArr = linesRef.current.geometry.attributes.position.array;
    const lineColArr = linesRef.current.geometry.attributes.color.array;
    let connectionCount = 0;

    // Only check a spatial subset for performance — sample front-most particles
    // We iterate and break early once we hit MAX_CONNECTIONS
    outer:
    for (let i = 0; i < PARTICLE_COUNT && connectionCount < MAX_CONNECTIONS; i += 3) {
      const ix = posArr[i * 3];
      const iy = posArr[i * 3 + 1];
      const iz = posArr[i * 3 + 2];

      for (let j = i + 3; j < PARTICLE_COUNT && connectionCount < MAX_CONNECTIONS; j += 3) {
        const jx = posArr[j * 3];
        const jy = posArr[j * 3 + 1];
        const jz = posArr[j * 3 + 2];

        const ddx = ix - jx;
        const ddy = iy - jy;
        const ddz = iz - jz;
        const d2 = ddx * ddx + ddy * ddy + ddz * ddz;

        if (d2 < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
          const ci = connectionCount * 6; // 2 verts × 3 components
          const alpha = 1 - Math.sqrt(d2) / CONNECTION_DISTANCE;

          linePosArr[ci] = ix;
          linePosArr[ci + 1] = iy;
          linePosArr[ci + 2] = iz;
          linePosArr[ci + 3] = jx;
          linePosArr[ci + 4] = jy;
          linePosArr[ci + 5] = jz;

          // Fade colour with distance — cyan tint
          const r = 0.28 * alpha;
          const g = 0.78 * alpha;
          const b = 1.0 * alpha;

          lineColArr[ci] = r;
          lineColArr[ci + 1] = g;
          lineColArr[ci + 2] = b;
          lineColArr[ci + 3] = r;
          lineColArr[ci + 4] = g;
          lineColArr[ci + 5] = b;

          connectionCount++;
        }
      }
    }

    // Zero-out unused line verts so they collapse to invisible degenerate segments
    for (let k = connectionCount * 6; k < MAX_CONNECTIONS * 6; k++) {
      linePosArr[k] = 0;
      lineColArr[k] = 0;
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.color.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, connectionCount * 2);

    // Sync line rotation with points
    linesRef.current.rotation.copy(pointsRef.current.rotation);
  });

  return (
    <>
      {/* ---- particles ---- */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={PARTICLE_COUNT}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={colors}
            count={PARTICLE_COUNT}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            array={sizes}
            count={PARTICLE_COUNT}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          vertexColors
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* ---- connection lines ---- */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={linePositions}
            count={MAX_CONNECTIONS * 2}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={lineColors}
            count={MAX_CONNECTIONS * 2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </>
  );
}
