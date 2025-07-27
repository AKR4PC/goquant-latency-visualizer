'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { SCENE_CONFIG } from '@/utils/constants';

interface EarthProps {
  radius?: number;
  rotationSpeed?: number;
}

export const Earth: React.FC<EarthProps> = ({
  radius = SCENE_CONFIG.EARTH_RADIUS,
  rotationSpeed = SCENE_CONFIG.ANIMATION_SPEED,
}) => {
  const groupRef = useRef<Group>(null);
  const sphereRef = useRef<Mesh>(null);
  const wireframeRef = useRef<Mesh>(null);

  // Rotate the Earth
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed * delta;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Earth sphere - solid with subtle color */}
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshPhongMaterial 
          color="#1e293b"
          transparent={true}
          opacity={0.4}
          shininess={100}
        />
      </mesh>
      
      {/* Wireframe grid overlay */}
      <mesh ref={wireframeRef} position={[0, 0, 0]}>
        <sphereGeometry args={[radius * 1.001, 16, 16]} />
        <meshBasicMaterial 
          color="#64748b"
          wireframe={true}
          transparent={true}
          opacity={0.6}
        />
      </mesh>
      
      {/* Subtle atmosphere glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[radius * 1.05, 32, 32]} />
        <meshBasicMaterial 
          color="#3b82f6"
          transparent={true}
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};