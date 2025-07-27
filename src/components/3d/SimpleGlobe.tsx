'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Color,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Exchange, LatencyData, CloudRegion } from '@/types';
import { getProviderColor } from '@/data/cloudProviders';
import globeData from '@/data/globe-data-min.json';

interface SimpleGlobeProps {
  exchanges: Exchange[];
  latencyData: LatencyData[];
  cloudRegions: CloudRegion[];
  selectedExchanges: string[];
  showRegions: boolean;
  showConnections: boolean;
  animationsEnabled: boolean;
  theme: 'dark' | 'light';
  onExchangeClick?: (exchange: Exchange) => void;
  onRegionClick?: (region: CloudRegion) => void;
}

export default function SimpleGlobe({
  exchanges,
  latencyData,
  selectedExchanges,
  animationsEnabled,
  theme,
}: SimpleGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!mountRef.current || !isClient) return;

    let renderer: WebGLRenderer;
    let camera: PerspectiveCamera;
    let scene: Scene;
    let controls: OrbitControls;
    let Globe: unknown;
    let animationId: number;

    const init = async () => {
      try {
        // Dynamic import
        const ThreeGlobe = (await import('three-globe')).default;

        // Clear container
        if (mountRef.current) {
          mountRef.current.innerHTML = '';
        }

        // Initialize renderer
        renderer = new WebGLRenderer({ 
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(mountRef.current!.clientWidth, mountRef.current!.clientHeight);
        mountRef.current!.appendChild(renderer.domElement);

        // Initialize scene with better background
        scene = new Scene();
        scene.background = new Color(theme === 'dark' ? 0x0a1628 : 0x87ceeb);
        
        // Enhanced lighting for maximum visibility
        scene.add(new AmbientLight(0xffffff, 0.8));
        
        const directionalLight1 = new DirectionalLight(0xffffff, 1.0);
        directionalLight1.position.set(-1, 1, 1);
        scene.add(directionalLight1);
        
        const directionalLight2 = new DirectionalLight(0xffffff, 0.6);
        directionalLight2.position.set(1, -1, -1);
        scene.add(directionalLight2);

        // Initialize camera
        camera = new PerspectiveCamera(
          75,
          mountRef.current!.clientWidth / mountRef.current!.clientHeight,
          0.1,
          1000
        );
        
        // Position camera for larger globe
        camera.position.z = 220;
        camera.position.x = 0;
        camera.position.y = 0;

        // Initialize controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        controls.minDistance = 150;
        controls.maxDistance = 300;
        controls.rotateSpeed = 0.5;
        controls.zoomSpeed = 0.8;
        controls.autoRotate = animationsEnabled;
        controls.autoRotateSpeed = 0.5;
        controls.minPolarAngle = Math.PI / 6;
        controls.maxPolarAngle = Math.PI - Math.PI / 6;

        // Initialize Globe with maximum white visibility
        Globe = new ThreeGlobe({
          waitForGlobeReady: true,
          animateIn: true,
        })
          .hexPolygonsData(globeData.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.2)
          .showAtmosphere(true)
          .atmosphereColor(theme === 'dark' ? '#FFFFFF' : '#87ceeb')
          .atmosphereAltitude(0.12)
          .hexPolygonColor(() => {
            // Make ALL landmasses pure white with maximum opacity
            return theme === 'dark' 
              ? 'rgba(255,255,255,1.0)'  // Pure white, full opacity
              : 'rgba(255,255,255,0.95)'; // Nearly pure white
          });

        const globeInstance = Globe as any;

        // Add exchange points with bright colors
        const exchangePoints = exchanges.map(exchange => ({
          lat: exchange.location.lat,
          lng: exchange.location.lng,
          size: selectedExchanges.includes(exchange.id) ? 1.8 : 1.2,
          color: getProviderColor(exchange.cloudProvider),
          altitude: 0.01,
        }));

        globeInstance
          .pointsData(exchangePoints)
          .pointColor('color')
          .pointAltitude('altitude')
          .pointRadius('size')
          .pointResolution(12);

        // Add labels for selected exchanges
        const exchangeLabels = exchanges
          .filter(exchange => selectedExchanges.includes(exchange.id))
          .map(exchange => ({
            lat: exchange.location.lat,
            lng: exchange.location.lng,
            text: exchange.name,
            color: getProviderColor(exchange.cloudProvider),
            size: 1.0,
          }));

        globeInstance
          .labelsData(exchangeLabels)
          .labelText('text')
          .labelColor('color')
          .labelSize('size')
          .labelDotRadius(0.3)
          .labelAltitude(0.01)
          .labelResolution(6);

        // Add connection arcs
        if (latencyData.length > 0) {
          const connectionArcs = latencyData.slice(0, 15).map(connection => {
            const fromExchange = exchanges.find(e => e.id === connection.from);
            const toExchange = exchanges.find(e => e.id === connection.to);
            
            if (!fromExchange || !toExchange) return null;
            
            return {
              startLat: fromExchange.location.lat,
              startLng: fromExchange.location.lng,
              endLat: toExchange.location.lat,
              endLng: toExchange.location.lng,
              color: connection.latency < 50 ? '#10b981' : 
                     connection.latency < 150 ? '#f59e0b' : '#ef4444',
              altitude: Math.min(connection.latency / 800, 0.4),
            };
          }).filter(Boolean);

          globeInstance
            .arcsData(connectionArcs)
            .arcColor('color')
            .arcAltitude('altitude')
            .arcStroke(0.6)
            .arcDashLength(0.4)
            .arcDashGap(0.2)
            .arcDashAnimateTime(1500);
        }

        // Store globe instance for updates
        globeRef.current = globeInstance;

        // Set globe material for maximum contrast
        globeInstance.rotateY(-Math.PI * (5 / 9));
        globeInstance.rotateZ(-Math.PI / 6);
        
        const globeMaterial = globeInstance.globeMaterial();
        globeMaterial.color = new Color(theme === 'dark' ? 0x0a1628 : 0x4682b4);
        globeMaterial.emissive = new Color(theme === 'dark' ? 0x000000 : 0x000033);
        globeMaterial.emissiveIntensity = 0.05;
        globeMaterial.shininess = 0.95;

        scene.add(Globe as any);

        setIsLoading(false);
        setError(null);

        // Animation loop
        const animate = () => {
          controls.update();
          renderer.render(scene, camera);
          animationId = requestAnimationFrame(animate);
        };
        animate();

      } catch (err) {
        console.error('Error initializing globe:', err);
        setError('Failed to initialize 3D globe: ' + (err as Error).message);
        setIsLoading(false);
      }
    };

    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);
    init();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (controls) {
        controls.dispose();
      }
      if (renderer) {
        renderer.dispose();
      }
      // Clean up globe reference
      globeRef.current = null;
    };
  }, [isClient, theme, animationsEnabled]);

  // Separate effect for updating data without reinitializing globe
  useEffect(() => {
    if (!isClient || isLoading || !globeRef.current) return;
    
    try {
      const globeInstance = globeRef.current;
      
      // Update exchange points
      const exchangePoints = exchanges.map(exchange => ({
        lat: exchange.location.lat,
        lng: exchange.location.lng,
        size: selectedExchanges.includes(exchange.id) ? 1.8 : 1.2,
        color: getProviderColor(exchange.cloudProvider),
        altitude: 0.01,
      }));

      globeInstance.pointsData(exchangePoints);

      // Update labels
      const exchangeLabels = exchanges
        .filter(exchange => selectedExchanges.includes(exchange.id))
        .map(exchange => ({
          lat: exchange.location.lat,
          lng: exchange.location.lng,
          text: exchange.name,
          color: getProviderColor(exchange.cloudProvider),
          size: 1.0,
        }));

      globeInstance.labelsData(exchangeLabels);

      // Update arcs
      if (latencyData.length > 0) {
        const connectionArcs = latencyData.slice(0, 15).map(connection => {
          const fromExchange = exchanges.find(e => e.id === connection.from);
          const toExchange = exchanges.find(e => e.id === connection.to);
          
          if (!fromExchange || !toExchange) return null;
          
          return {
            startLat: fromExchange.location.lat,
            startLng: fromExchange.location.lng,
            endLat: toExchange.location.lat,
            endLng: toExchange.location.lng,
            color: connection.latency < 50 ? '#10b981' : 
                   connection.latency < 150 ? '#f59e0b' : '#ef4444',
            altitude: Math.min(connection.latency / 800, 0.4),
          };
        }).filter(Boolean);

        globeInstance.arcsData(connectionArcs);
      }
    } catch (error) {
      console.warn('Error updating globe data:', error);
    }
  }, [exchanges, latencyData, selectedExchanges, isClient, isLoading]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-400">Initializing...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 dark:bg-red-900/20">
        <div className="text-center p-6">
          <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">
            3D Globe Error
          </div>
          <div className="text-red-500 dark:text-red-300 text-sm mb-4">
            {error}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-900/80 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-600 dark:text-gray-400">Loading 3D Globe...</div>
          </div>
        </div>
      )}
      
      <div 
        ref={mountRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Info overlay */}
      <div className="absolute top-4 right-4 text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-3 py-2 rounded-lg shadow">
        <div>{exchanges.length} exchanges</div>
        <div>{latencyData.length} connections</div>
        <div className="text-green-500">● Live</div>
      </div>
    </div>
  );
}