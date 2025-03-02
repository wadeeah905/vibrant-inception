import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Import the Earth texture from the same folder
import earthTextureImage from './8081_earthmap10k.jpg';

// Google Maps Custom Map Component
import { useEffect } from 'react';

function CustomMap() {
  useEffect(() => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 0, lng: 0 },
      zoom: 2,
      styles: [
        {
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }],
        },
        {
          elementType: 'labels.text.fill',
          stylers: [{ color: '#616161' }],
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#f5f5f5' }],
        },
        {
          featureType: 'administrative',
          elementType: 'geometry',
          stylers: [{ color: '#blue' }], // Custom blue borders
        },
        {
          featureType: 'administrative.country',
          elementType: 'geometry.stroke',
          stylers: [
            { color: '#0000ff' }, // Set the country borders to blue
            { weight: 2 }, // Increase border thickness
          ],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#c9c9c9' }],
        },
      ],
    });
  }, []);

  return <div id="map" style={{ height: '400px', width: '100%' }} />;
}

// Main Earth Component
export function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const lightningRef = useRef<THREE.PointLight>(null);

  // Load the texture
  const earthTexture = new THREE.TextureLoader().load(earthTextureImage);

  useFrame(({ clock }) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001; // Rotate Earth slowly
    }

    if (lightningRef.current) {
      const time = clock.getElapsedTime();
      lightningRef.current.intensity = 2 + Math.sin(time * 2) * 0.5; // Simulate light flickering
      lightningRef.current.position.x = Math.sin(time) * 3;
      lightningRef.current.position.z = Math.cos(time) * 3;
    }
  });

  return (
    <>
      {/* 3D Earth Section */}
      <div style={{ width: '50%', height: '400px', float: 'left' }}>
        <ambientLight intensity={0.5} />
        <pointLight ref={lightningRef} color="#4040ff" intensity={3} distance={10} />
        <mesh ref={earthRef}>
          <Sphere args={[2, 64, 64]}>
            <meshStandardMaterial
              map={earthTexture}
              emissive="#ffffff"
              emissiveIntensity={0.3}
              metalness={0.5}
              roughness={0.8}
            />
          </Sphere>
        </mesh>
      </div>

      {/* Google Maps Section */}
      <div style={{ width: '50%', height: '400px', float: 'left' }}>
        <CustomMap />
      </div>
    </>
  );
}
