'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Tetractys() {
  const group = useRef<THREE.Group>(null);

  const [points, lineGeometry] = useMemo(() => {
    const rows = 4;
    const spacing = 0.6;
    const pts: THREE.Vector3[] = [];
    for (let row = 0; row < rows; row++) {
      const count = row + 1;
      const y = (rows - 1 - row) * spacing * 0.866;
      for (let i = 0; i < count; i++) {
        const x = (i - row / 2) * spacing;
        pts.push(new THREE.Vector3(x, y - 1, 0));
      }
    }

    const edges: THREE.Vector3[] = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[i].distanceTo(pts[j]) <= 0.65) {
          edges.push(pts[i], pts[j]);
        }
      }
    }
    const geo = new THREE.BufferGeometry().setFromPoints(edges);
    return [pts, geo];
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.08;
      group.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.08;
    }
  });

  return (
    <group ref={group}>
      {points.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#d4af37"
            emissive="#d4af37"
            emissiveIntensity={0.8}
            toneMapped={false}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#d4af37" transparent opacity={0.4} linewidth={2} />
      </lineSegments>
    </group>
  );
}

function OrbitSphere({ radius, speed, color, count }: { radius: number; speed: number; color: string; count: number }) {
  const ref = useRef<THREE.Group>(null);
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const randomOffset = (Math.random() - 0.5) * 0.2;
      return new THREE.Vector3(
        Math.cos(angle) * (radius + randomOffset),
        Math.sin(angle) * (radius + randomOffset),
        (Math.random() - 0.5) * 0.5
      );
    });
  }, [radius, count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.getElapsedTime() * speed;
      ref.current.rotation.x = state.clock.getElapsedTime() * speed * 0.4;
      ref.current.rotation.y = state.clock.getElapsedTime() * speed * 0.2;
    }
  });

  return (
    <group ref={ref}>
      {particles.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#d4af37" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#1a237e" />
      <pointLight position={[0, 0, 15]} intensity={0.5} color="#d4af37" />
      
      <Tetractys />
      <OrbitSphere radius={3.5} speed={0.06} color="#d4af37" count={32} />
      <OrbitSphere radius={5.5} speed={0.04} color="#1a237e" count={48} />
      <OrbitSphere radius={7.5} speed={0.025} color="#4a5d23" count={64} />
    </>
  );
}

export function HeroScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
