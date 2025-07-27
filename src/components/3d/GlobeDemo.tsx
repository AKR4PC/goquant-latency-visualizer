"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { EXCHANGES } from "@/data/exchanges";

const World = dynamic(() => import("../ui/globe").then((m) => m.World), {
  ssr: false,
});

export function GlobeDemo() {
  const globeConfig = {
    pointSize: 5, // Bigger points
    globeColor: '#0a1628', // Darker globe for better contrast
    showAtmosphere: true,
    atmosphereColor: '#FFFFFF',
    atmosphereAltitude: 0.12,
    emissive: '#000000', // Pure black for maximum contrast
    emissiveIntensity: 0.05,
    shininess: 0.95,
    polygonColor: 'rgba(255,255,255,0.9)', // Higher opacity for white dots
    ambientLight: '#ffffff',
    directionalLeftLight: '#ffffff',
    directionalTopLight: '#ffffff',
    pointLight: '#ffffff',
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  // Generate arcs from our exchange data with cloud provider colors
  const exchangeArcs = useMemo(() => {
    const arcs = [];
    
    // Cloud provider colors
    const providerColors = {
      AWS: "#ff9900",     // Orange
      GCP: "#4285f4",     // Blue  
      Azure: "#0078d4",   // Azure Blue
    };
    
    // Create connections between exchanges
    for (let i = 0; i < EXCHANGES.length; i++) {
      for (let j = i + 1; j < EXCHANGES.length; j++) {
        const fromExchange = EXCHANGES[i];
        const toExchange = EXCHANGES[j];
        
        // Calculate distance for arc height
        const distance = Math.sqrt(
          Math.pow(fromExchange.location.lat - toExchange.location.lat, 2) +
          Math.pow(fromExchange.location.lng - toExchange.location.lng, 2)
        );
        
        // Simulate realistic latency based on distance
        const baseLatency = Math.max(10, distance * 2 + Math.random() * 30);
        let latencyColor = "#10b981"; // Green for low latency
        if (baseLatency > 100) latencyColor = "#f59e0b"; // Yellow for medium
        if (baseLatency > 200) latencyColor = "#ef4444"; // Red for high
        
        // Use cloud provider color for same-provider connections
        let connectionColor = latencyColor;
        if (fromExchange.cloudProvider === toExchange.cloudProvider) {
          connectionColor = providerColors[fromExchange.cloudProvider];
        }
        
        arcs.push({
          order: Math.floor(Math.random() * 15) + 1,
          startLat: fromExchange.location.lat,
          startLng: fromExchange.location.lng,
          endLat: toExchange.location.lat,
          endLng: toExchange.location.lng,
          arcAlt: Math.min(distance / 60, 0.4),
          color: connectionColor,
        });
      }
    }
    
    // Add some additional major trading route connections
    const majorRoutes = [
      // Asia-Pacific routes
      { from: 'binance-singapore', to: 'okx-hongkong', color: '#06b6d4' },
      { from: 'bybit-singapore', to: 'binance-tokyo', color: '#06b6d4' },
      // US routes
      { from: 'coinbase-sanfrancisco', to: 'coinbase-newyork', color: '#8b5cf6' },
      { from: 'kraken-sanfrancisco', to: 'coinbase-sanfrancisco', color: '#8b5cf6' },
      // Cross-continental routes
      { from: 'binance-singapore', to: 'coinbase-sanfrancisco', color: '#f59e0b' },
      { from: 'okx-hongkong', to: 'kraken-london', color: '#f59e0b' },
      { from: 'coinbase-newyork', to: 'kraken-london', color: '#f59e0b' },
    ];
    
    majorRoutes.forEach(route => {
      const fromExchange = EXCHANGES.find(e => e.id === route.from);
      const toExchange = EXCHANGES.find(e => e.id === route.to);
      
      if (fromExchange && toExchange) {
        const distance = Math.sqrt(
          Math.pow(fromExchange.location.lat - toExchange.location.lat, 2) +
          Math.pow(fromExchange.location.lng - toExchange.location.lng, 2)
        );
        
        arcs.push({
          order: Math.floor(Math.random() * 10) + 1,
          startLat: fromExchange.location.lat,
          startLng: fromExchange.location.lng,
          endLat: toExchange.location.lat,
          endLng: toExchange.location.lng,
          arcAlt: Math.min(distance / 50, 0.5),
          color: route.color,
        });
      }
    });
    
    return arcs;
  }, []);

  return (
    <div className="flex flex-row items-center justify-center h-full w-full relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="max-w-7xl mx-auto w-full relative overflow-hidden h-full px-4">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="absolute top-8 right-8 z-20 max-w-sm"
        >
          <div className="card-elevated bg-white/10 backdrop-blur-md border border-white/20 p-6">
            <h2 className="text-mono text-lg font-bold text-white mb-3">
              Global Exchange Network
            </h2>
            <p className="text-mono text-sm text-white/80 leading-relaxed mb-4">
              Real-time cryptocurrency exchange connections across AWS, GCP, and Azure cloud providers
            </p>
            <div className="grid grid-cols-3 gap-3 text-xs text-mono">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-sm"></div>
                <span className="text-white/70 font-medium">Low</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-3 h-3 bg-amber-400 rounded-full shadow-sm"></div>
                <span className="text-white/70 font-medium">Medium</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-3 h-3 bg-red-400 rounded-full shadow-sm"></div>
                <span className="text-white/70 font-medium">High</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="absolute w-full bottom-0 inset-x-0 h-32 bg-gradient-to-b pointer-events-none select-none from-transparent to-slate-900 z-40" />
        
        <div className="absolute w-full h-full z-10">
          <World data={exchangeArcs} globeConfig={globeConfig} />
        </div>
      </div>
    </div>
  );
}