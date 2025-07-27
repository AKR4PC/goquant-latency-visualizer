'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { ExchangeMarkerProps } from '@/types';
import { CLOUD_PROVIDERS } from '@/utils/constants';

export const ExchangeMarker: React.FC<ExchangeMarkerProps> = ({
  exchange,
  position,
  isSelected,
  onSelect,
  scale = 1,
}) => {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  
  const config = CLOUD_PROVIDERS[exchange.cloudProvider];
  
  // Animate the marker
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      
      // Rotate based on cloud provider
      if (config.markerType === 'cube') {
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
      } else if (config.markerType === 'pyramid') {
        meshRef.current.rotation.y += 0.02;
      }
    }
    
    // Animate glow for selected markers
    if (glowRef.current && isSelected) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const handleClick = () => {
    onSelect(exchange);
  };

  const getGeometry = () => {
    const size = 0.2 * scale;
    switch (config.markerType) {
      case 'cube':
        return <boxGeometry args={[size, size, size]} />;
      case 'pyramid':
        return <coneGeometry args={[size, size * 1.5, 4]} />;
      default: // sphere
        return <sphereGeometry args={[size, 16, 16]} />;
    }
  };

  return (
    <group position={position}>
      {/* Selection glow */}
      {isSelected && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial 
            color={config.color}
            transparent={true}
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>
      )}
      
      {/* Main marker */}
      <mesh 
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        {getGeometry()}
        <meshPhongMaterial 
          color={config.color}
          shininess={100}
          transparent={false}
        />
      </mesh>
      
      {/* Status indicator */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial 
          color={
            exchange.status === 'online' ? '#1a7f37' :
            exchange.status === 'maintenance' ? '#bf8700' : '#cf222e'
          }
        />
      </mesh>
      
      {/* Pulsing ring for online status */}
      {exchange.status === 'online' && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.35, 16]} />
          <meshBasicMaterial 
            color="#1a7f37"
            transparent={true}
            opacity={0.6}
          />
        </mesh>
      )}
    </group>
  );
};