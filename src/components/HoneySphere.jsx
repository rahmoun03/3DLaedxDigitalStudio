import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function HoneySphere() {
  const meshRef = useRef();
  const colorRef = useRef({ time: 0 });

  useFrame((state, delta) => {
    colorRef.current.time += delta * 0.5;

    // Animate vertices for energy feel
    // meshRef.current.geometry.attributes.position.needsUpdate = true;
    // const positions = meshRef.current.geometry.attributes.position;
    // const count = positions.count;

    // for (let i = 0; i < count; i++) {
    //   const x = positions.getX(i);
    //   const y = positions.getY(i);
    //   const z = positions.getZ(i);
    //   const offset = Math.sin(colorRef.current.time + x * 2 + y * 2) * 0.05;
    //   positions.setXYZ(i, x + offset, y + offset, z + offset);
    // }

    // Animate honey gradient colors
    const colors = meshRef.current.geometry.attributes.color;
    for (let i = 0; i < count; i++) {
      const t = (Math.sin(colorRef.current.time * 2 + i * 0.05) + 1) / 2; // 0 → 1
      const honeyColor = new THREE.Color().setHSL(0.12 + t * 0.08, 0.9, 0.5); 
      colors.setXYZ(i, honeyColor.r, honeyColor.g, honeyColor.b);
    }
    colors.needsUpdate = true;
  });

  const geometry = new THREE.IcosahedronGeometry(1, 10);
  const count = geometry.attributes.position.count;
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(1, 0.84, 0); // Initial honey-like color
  }
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        vertexColors
        size={0.03}
        transparent
        opacity={0.9
        }
      />
    </points>
  );
}