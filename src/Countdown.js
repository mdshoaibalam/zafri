// Countdown.js
import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import * as THREE from 'three';

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2024-12-22T00:00:00');

    const updateCountdown = () => {
      const now = new Date();
      const totalSeconds = (targetDate - now) / 1000;

      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
        camera={{ position: [0, 0, 5] }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <ConfettiParticles />
        <FallingSnow />
      </Canvas>
      <div style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'orangered',  // Dark text color
        fontSize: '6rem',   // Larger font size for header
        fontWeight: 'bolder', // Extra bold text
        textAlign: 'center',
        textShadow: '3px 3px 10px rgba(255, 255, 255, 0.9)', // Enhanced shadow
      }}>
        <p>Shoaib Weds Sana</p>
      </div>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'green',  // Dark text color
        fontSize: '2rem',   // Large font size
        fontWeight: 'bold', // Bold text
        textAlign: 'center',
        textShadow: '2px 2px 8px rgba(255, 255, 255, 0.8)', // Light shadow for visibility
      }}>
         
        <p>
        Countdown to December 22, 2024: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </p>
      </div>
    </div>
  );
};

const ConfettiParticles = () => {
  const mesh = useRef();
  const particles = Array.from({ length: 100 }, () => ({
    position: [Math.random() * 6 - 3, Math.random() * 6 - 3, Math.random() * 6 - 3],
    velocity: [Math.random() * 0.02 - 0.01, Math.random() * 0.02 - 0.01, Math.random() * 0.02 - 0.01],
  }));

  useFrame(() => {
    particles.forEach((particle, i) => {
      const pos = new THREE.Vector3(...particle.position);
      pos.add(new THREE.Vector3(...particle.velocity));

      if (pos.y < -3 || pos.y > 3) particle.velocity[1] *= -1;
      if (pos.x < -3 || pos.x > 3) particle.velocity[0] *= -1;
      if (pos.z < -3 || pos.z > 3) particle.velocity[2] *= -1;

      particle.position = [pos.x, pos.y, pos.z];

      mesh.current.setMatrixAt(i, new THREE.Matrix4().makeTranslation(pos.x, pos.y, pos.z));
    });

    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, particles.length]}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshStandardMaterial color="pink" />
    </instancedMesh>
  );
};

const FallingSnow = () => {
  const snowflakes = useRef();
  const particles = Array.from({ length: 200 }, () => ({
    position: [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5],
    velocity: [0, -Math.random() * 0.02 - 0.01, 0],
  }));

  useFrame(() => {
    particles.forEach((particle, i) => {
      const pos = new THREE.Vector3(...particle.position);
      pos.add(new THREE.Vector3(...particle.velocity));

      if (pos.y < -5) pos.y = 5;

      particle.position = [pos.x, pos.y, pos.z];

      snowflakes.current.setMatrixAt(i, new THREE.Matrix4().makeTranslation(pos.x, pos.y, pos.z));
    });

    snowflakes.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={snowflakes} args={[null, null, particles.length]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial color="white" />
    </instancedMesh>
  );
};

export default Countdown;
