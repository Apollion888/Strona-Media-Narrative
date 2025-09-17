import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const Scene3D = ({
  intensity = 0.3,
  particleCount = 150,
  enableInteraction = true,
  className = '',
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const [isWebGLSupported, setIsWebGLSupported] = useState(true);

  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const webglSupport = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    setIsWebGLSupported(webglSupport);
  }, []);

  useEffect(() => {
    if (!isWebGLSupported || !mountRef.current) return;

    let scene,
      camera,
      renderer,
      particles,
      mouseX = 0,
      mouseY = 0;

    const init = () => {
      // Scene setup
      scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera setup
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      // Renderer setup
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;

      mountRef.current.appendChild(renderer.domElement);

      // Particle system
      createParticleSystem();

      // Ambient light
      const ambientLight = new THREE.AmbientLight(0x00ff00, intensity * 0.2);
      scene.add(ambientLight);

      // Point lights
      const pointLight1 = new THREE.PointLight(0x00ff00, intensity, 10);
      pointLight1.position.set(2, 2, 2);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x00ffff, intensity * 0.8, 8);
      pointLight2.position.set(-2, -2, 1);
      scene.add(pointLight2);
    };

    const createParticleSystem = () => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Random positions
        positions[i3] = (Math.random() - 0.5) * 10;
        positions[i3 + 1] = (Math.random() - 0.5) * 10;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;

        // Cyberpunk colors (green/cyan variations)
        const colorVariant = Math.random();
        if (colorVariant < 0.7) {
          colors[i3] = 0; // R
          colors[i3 + 1] = 1; // G
          colors[i3 + 2] = Math.random() * 0.5; // B
        } else {
          colors[i3] = 0; // R
          colors[i3 + 1] = Math.random() * 0.8 + 0.2; // G
          colors[i3 + 2] = 1; // B
        }

        // Random velocities
        velocities[i3] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

      // Particle material
      const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);
    };

    const animate = (time) => {
      animationIdRef.current = requestAnimationFrame(animate);

      if (particles) {
        const positions = particles.geometry.attributes.position.array;
        const velocities = particles.geometry.attributes.velocity.array;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;

          // Update positions
          positions[i3] += velocities[i3];
          positions[i3 + 1] += velocities[i3 + 1];
          positions[i3 + 2] += velocities[i3 + 2];

          // Boundary checks
          if (Math.abs(positions[i3]) > 5) velocities[i3] *= -1;
          if (Math.abs(positions[i3 + 1]) > 5) velocities[i3 + 1] *= -1;
          if (Math.abs(positions[i3 + 2]) > 5) velocities[i3 + 2] *= -1;

          // Mouse interaction
          if (enableInteraction) {
            const mouseInfluence = 0.001;
            const dx = mouseX * mouseInfluence;
            const dy = mouseY * mouseInfluence;

            velocities[i3] += dx;
            velocities[i3 + 1] -= dy;
          }
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.rotation.y += 0.002;
        particles.rotation.x += 0.001;
      }

      // Camera gentle movement
      camera.position.x += (mouseX * 0.0005 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.0005 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    const handleMouseMove = (event) => {
      if (!enableInteraction) return;
      mouseX = event.clientX - window.innerWidth / 2;
      mouseY = event.clientY - window.innerHeight / 2;
    };

    const handleResize = () => {
      if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    // Initialize
    init();
    animate();

    // Event listeners
    if (enableInteraction) {
      document.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (enableInteraction) {
        document.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', handleResize);

      if (renderer && mountRef.current && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }

      // Dispose of Three.js resources
      if (scene) {
        scene.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        scene.clear();
      }

      if (renderer) {
        renderer.dispose();
      }
    };
  }, [isWebGLSupported, intensity, particleCount, enableInteraction]);

  if (!isWebGLSupported) {
    return (
      <div
        className={`three-fallback ${className}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: 'radial-gradient(ellipse at center, #0f2f0f 0%, #111111 100%)',
          pointerEvents: 'none',
        }}
      />
    );
  }

  return (
    <div
      ref={mountRef}
      className={`three-scene ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default Scene3D;
