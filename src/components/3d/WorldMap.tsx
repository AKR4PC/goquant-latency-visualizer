'use client';

import React, { Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Earth } from './Earth';
import { ExchangeMarker } from './ExchangeMarker';
import { LatencyConnection } from './LatencyConnection';
import { WorldMapProps } from '@/types';
import { SCENE_CONFIG } from '@/utils/constants';
import { latLngToVector3 } from '@/utils/calculations';

export const WorldMap: React.FC<WorldMapProps> = ({
  exchanges,
  latencyData,
  selectedExchanges,
  showRegions,
  theme,
  onExchangeSelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [realtimeLatency, setRealtimeLatency] = React.useState(latencyData);

  // Subscribe to real-time latency updates
  useEffect(() => {
    // Mock real-time updates for now
    const interval = setInterval(() => {
      setRealtimeLatency([]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Convert exchange locations to 3D positions
  const exchangePositions = useMemo(() => {
    return exchanges.map(exchange => ({
      exchange,
      position: latLngToVector3(exchange.location.lat, exchange.location.lng, SCENE_CONFIG.EARTH_RADIUS + 0.5),
    }));
  }, [exchanges]);

  // Generate connection lines for active latency data
  const connections = useMemo(() => {
    return realtimeLatency.map(data => {
      const fromExchange = exchanges.find(e => e.id === data.from);
      const toExchange = exchanges.find(e => e.id === data.to);
      
      if (!fromExchange || !toExchange) return null;
      
      const fromPos = latLngToVector3(
        fromExchange.location.lat, 
        fromExchange.location.lng, 
        SCENE_CONFIG.EARTH_RADIUS + 0.5
      );
      const toPos = latLngToVector3(
        toExchange.location.lat, 
        toExchange.location.lng, 
        SCENE_CONFIG.EARTH_RADIUS + 0.5
      );
      
      return {
        key: `${data.from}-${data.to}`,
        from: fromPos,
        to: toPos,
        latency: data.latency,
        data,
      };
    }).filter(Boolean);
  }, [realtimeLatency, exchanges]);

  // Performance monitoring
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Dispatch custom event with FPS data
        window.dispatchEvent(new CustomEvent('fps-update', { 
          detail: { fps, timestamp: new Date() } 
        }));
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    measureFPS();
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas
        ref={canvasRef}
        camera={{
          position: [0, 0, SCENE_CONFIG.CAMERA_DISTANCE],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]} // Adaptive pixel ratio for performance
        performance={{
          min: 0.5, // Minimum performance threshold
        }}
        className="bg-transparent"
      >
        {/* Lighting setup */}
        <ambientLight intensity={0.4} color="#f0f6fc" />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.6}
          color="#ffffff"
          castShadow
        />
        <pointLight
          position={[-10, -10, -5]}
          intensity={0.3}
          color="#58a6ff"
        />
        <pointLight
          position={[5, -5, 10]}
          intensity={0.2}
          color="#79c0ff"
        />

        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={50}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
          dampingFactor={0.05}
          enableDamping={true}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          panSpeed={0.8}
        />

        {/* Background stars - subtle for light mode */}
        <Stars
          radius={300}
          depth={60}
          count={300}
          factor={3}
          saturation={0}
          fade={true}
          speed={0.3}
        />

        {/* Main Earth component */}
        <Suspense fallback={null}>
          <Earth />
        </Suspense>

        {/* Exchange markers */}
        <Suspense fallback={null}>
          {exchangePositions.map(({ exchange, position }) => (
            <ExchangeMarker
              key={exchange.id}
              exchange={exchange}
              position={position}
              isSelected={selectedExchanges.includes(exchange.id)}
              onSelect={onExchangeSelect}
            />
          ))}
        </Suspense>

        {/* Latency connections */}
        <Suspense fallback={null}>
          {connections.map((connection) => (
            connection && (
              <LatencyConnection
                key={connection.key}
                from={connection.from}
                to={connection.to}
                latency={connection.latency}
                animated={true}
              />
            )
          ))}
        </Suspense>
      </Canvas>

      {/* Loading overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 transition-opacity duration-500">
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
            <span className="text-foreground/70 text-sm font-medium">
              Loading 3D visualization...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};