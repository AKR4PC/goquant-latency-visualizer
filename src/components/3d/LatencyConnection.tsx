'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { LatencyConnectionProps } from '@/types';
import { getLatencyColor } from '@/utils/calculations';

export const LatencyConnection: React.FC<LatencyConnectionProps> = ({
  from,
  to,
  latency,
  animated = true,
  color,
}) => {
  // Generate curved path between two points
  const points = useMemo(() => {
    const start = from.clone();
    const end = to.clone();
    
    // Calculate midpoint and lift it up for the curve
    const midpoint = start.clone().add(end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    
    // Lift the midpoint outward from Earth center for a nice arc
    const liftHeight = Math.min(distance * 0.5, 3); // Adjust curve height
    midpoint.normalize().multiplyScalar(midpoint.length() + liftHeight);
    
    // Create smooth curve using quadratic bezier
    const curve: Vector3[] = [];
    const segments = 20;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const point = new Vector3();
      
      // Quadratic bezier curve formula
      point.copy(start.clone().multiplyScalar((1 - t) * (1 - t)));
      point.add(midpoint.clone().multiplyScalar(2 * (1 - t) * t));
      point.add(end.clone().multiplyScalar(t * t));
      
      curve.push(point);
    }
    
    return curve;
  }, [from, to]);

  const connectionColor = color || getLatencyColor(latency);
  const opacity = latency < 50 ? 0.8 : latency < 150 ? 0.6 : 0.4;

  return (
    <group>
      {/* Main connection line */}
      <Line
        points={points}
        color={connectionColor}
        lineWidth={2}
        transparent={true}
        opacity={opacity}
      />
      
      {/* Data flow particles */}
      {animated && (
        <DataFlowParticles 
          points={points} 
          color={connectionColor}
          speed={latency < 50 ? 2 : latency < 150 ? 1.5 : 1}
        />
      )}
    </group>
  );
};

// Component for animated particles flowing along the connection
const DataFlowParticles: React.FC<{
  points: Vector3[];
  color: string;
  speed: number;
}> = ({ points, color, speed }) => {
  const particleRefs = useRef<(THREE.Mesh | null)[]>([]);
  const particleCount = 3;

  useFrame((state) => {
    particleRefs.current.forEach((particle, index) => {
      if (!particle) return;
      
      const time = state.clock.elapsedTime * speed + (index * 2);
      const progress = (time % 4) / 4; // Complete cycle every 4 seconds
      const pointIndex = Math.floor(progress * (points.length - 1));
      const localProgress = (progress * (points.length - 1)) % 1;
      
      if (pointIndex < points.length - 1) {
        const currentPoint = points[pointIndex];
        const nextPoint = points[pointIndex + 1];
        
        // Interpolate between current and next point
        particle.position.lerpVectors(currentPoint, nextPoint, localProgress);
        
        // Fade in/out at the ends
        const fadeDistance = 0.1;
        let opacity = 1;
        if (progress < fadeDistance) {
          opacity = progress / fadeDistance;
        } else if (progress > 1 - fadeDistance) {
          opacity = (1 - progress) / fadeDistance;
        }
        
        (particle.material as THREE.MeshBasicMaterial).opacity = opacity * 0.8;
      }
    });
  });

  return (
    <>
      {Array.from({ length: particleCount }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => (particleRefs.current[i] = el)}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial 
            color={color}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      ))}
    </>
  );
};