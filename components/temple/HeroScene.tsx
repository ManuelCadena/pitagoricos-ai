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
      group.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      group.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05;
    }
  });

  return (
    <group ref={group}>
      {points.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color="#d4af37"
            emissive="#d4af37"
            emissiveIntensity={0.6}
            toneMapped={false}
          />
        </mesh>
      ))}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#d4af37" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

function OrbitSphere({ radius, speed, color, count }: { radius: number; speed: number; color: string; count: number }) {
  const ref = useRef<THREE.Group>(null);
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    });
  }, [radius, count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.getElapsedTime() * speed;
      ref.current.rotation.x = state.clock.getElapsedTime() * speed * 0.3;
    }
  });

  return (
    <group ref={ref}>
      {particles.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#d4af37" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#1a237e" />
      <Tetractys />
      <OrbitSphere radius={3.5} speed={0.05} color="#d4af37" count={24} />
      <OrbitSphere radius={5} speed={0.03} color="#1a237e" count={36} />
      <OrbitSphere radius={6.5} speed={0.02} color="#4a5d23" count={48} />
    </>
  );
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
