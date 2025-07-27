'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import ThreeGlobe from 'three-globe';
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Color,
  Fog,
  PointLight,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EXCHANGES } from '@/data/exchanges';
import countries from '@/data/globe-data-min.json';

interface GitHubGlobeProps {
  className?: string;
}

export const GitHubGlobe: React.FC<GitHubGlobeProps> = ({ className }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const globeRef = useRef<ThreeGlobe | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize renderer
    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Initialize scene
    const scene = new Scene();
    scene.add(new AmbientLight(0xbbbbbb, 0.3));
    scene.background = new Color(0x040d21);
    sceneRef.current = scene;

    // Initialize camera
    const camera = new PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 400);
    cameraRef.current = camera;

    // Add lights to camera
    const dLight = new DirectionalLight(0xffffff, 0.8);
    dLight.position.set(-800, 2000, 400);
    camera.add(dLight);

    const dLight1 = new DirectionalLight(0x7982f6, 1);
    dLight1.position.set(-200, 500, 200);
    camera.add(dLight1);

    const dLight2 = new PointLight(0x8566cc, 0.5);
    dLight2.position.set(-200, 500, 200);
    camera.add(dLight2);

    scene.add(camera);

    // Add fog
    scene.fog = new Fog(0x535ef3, 400, 2000);

    // Initialize controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.01;
    controls.enablePan = false;
    controls.minDistance = 200;
    controls.maxDistance = 500;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1;
    controls.autoRotate = false;
    controls.minPolarAngle = Math.PI / 3.5;
    controls.maxPolarAngle = Math.PI - Math.PI / 3;
    controlsRef.current = controls;

    // Initialize Globe
    const globe = new ThreeGlobe({
      waitForGlobeReady: true,
      animateIn: true,
    })
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(true)
      .atmosphereColor('#3a228a')
      .atmosphereAltitude(0.25)
      .hexPolygonColor((e: any) => {
        // Highlight certain regions for visual appeal
        const highlightedCountries = ['USA', 'CHN', 'JPN', 'GBR', 'DEU', 'SGP', 'HKG'];
        if (e.properties && highlightedCountries.includes(e.properties.ISO_A3)) {
          return 'rgba(255,255,255, 1)';
        }
        return 'rgba(255,255,255, 0.7)';
      });

    // Set globe material
    const globeMaterial = globe.globeMaterial() as any;
    globeMaterial.color = new Color(0x3a228a);
    globeMaterial.emissive = new Color(0x220038);
    globeMaterial.emissiveIntensity = 0.1;
    globeMaterial.shininess = 0.7;

    // Rotate globe to show a nice initial view
    globe.rotateY(-Math.PI * (5 / 9));
    globe.rotateZ(-Math.PI / 6);

    scene.add(globe);
    globeRef.current = globe;

    // Add exchange data after a delay
    setTimeout(() => {
      addExchangeData(globe);
      setIsLoaded(true);
    }, 1000);

    // Animation loop
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const addExchangeData = (globe: ThreeGlobe) => {
    // Create arcs between exchanges
    const arcs: any[] = [];
    const points: any[] = [];
    
    // Add exchange points
    EXCHANGES.forEach((exchange) => {
      points.push({
        lat: exchange.location.lat,
        lng: exchange.location.lng,
        name: exchange.name,
        city: exchange.location.city,
        provider: exchange.cloudProvider,
        status: exchange.status,
        capacity: exchange.capacity,
      });
    });

    // Create connections between exchanges
    for (let i = 0; i < EXCHANGES.length; i++) {
      for (let j = i + 1; j < EXCHANGES.length; j++) {
        const from = EXCHANGES[i];
        const to = EXCHANGES[j];
        
        // Calculate distance for arc altitude
        const distance = Math.sqrt(
          Math.pow(from.location.lat - to.location.lat, 2) +
          Math.pow(from.location.lng - to.location.lng, 2)
        );

        // Simulate latency based on distance
        const latency = Math.max(20, distance * 2 + Math.random() * 50);
        
        arcs.push({
          startLat: from.location.lat,
          startLng: from.location.lng,
          endLat: to.location.lat,
          endLng: to.location.lng,
          arcAlt: Math.min(distance / 100, 0.4),
          status: latency < 100, // true for good connection, false for poor
          order: Math.floor(Math.random() * 10) + 1,
        });
      }
    }

    // Add arcs to globe
    globe
      .arcsData(arcs)
      .arcColor((e: any) => (e.status ? '#9cff00' : '#FF4000'))
      .arcAltitude((e: any) => e.arcAlt)
      .arcStroke((e: any) => (e.status ? 0.5 : 0.3))
      .arcDashLength(0.9)
      .arcDashGap(4)
      .arcDashAnimateTime(1000)
      .arcsTransitionDuration(1000)
      .arcDashInitialGap((e: any) => e.order * 1);

    // Add points to globe
    globe
      .pointsData(points)
      .pointColor((point: any) => {
        switch (point.provider) {
          case 'AWS': return '#ff9900';
          case 'GCP': return '#4285f4';
          case 'Azure': return '#00bcf2';
          default: return '#ffffff';
        }
      })
      .pointsMerge(true)
      .pointAltitude(0.07)
      .pointRadius(0.05);

    // Add labels for major exchanges
    const majorExchanges = points.filter(p => 
      ['Binance', 'Coinbase', 'OKX', 'Kraken'].includes(p.name)
    );

    globe
      .labelsData(majorExchanges)
      .labelColor(() => '#ffcb21')
      .labelDotRadius(0.3)
      .labelSize(0.5)
      .labelText('name')
      .labelResolution(6)
      .labelAltitude(0.01);
  };

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={mountRef} className="w-full h-full" />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="card p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
              <span className="text-foreground/70 text-sm font-medium">
                Loading GitHub Globe...
              </span>
            </div>
          </div>
        </div>
      )}
      
      {isLoaded && (
        <div className="absolute top-6 left-6 z-20 max-w-sm">
          <div className="card p-4 backdrop-blur-sm">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-2">
              Global Exchange Network
            </h2>
            <p className="text-xs md:text-sm font-normal text-foreground/70 leading-relaxed">
              Real-time cryptocurrency exchange connections with GitHub-style visualization
            </p>
            <div className="flex items-center space-x-4 mt-3 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-foreground/60">Good Connection</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-foreground/60">Poor Connection</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-2 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-foreground/60">AWS</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-foreground/60">GCP</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span className="text-foreground/60">Azure</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};