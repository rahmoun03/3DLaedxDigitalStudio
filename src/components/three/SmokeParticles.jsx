import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import SmokeMaterial from "./materials/smokeMaterial";

export default function SmokeParticles({ count = 400, position = [0, -4, 0] }) {
  const ref = useRef();

  const positions = React.useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 8; // x
      arr[i * 3 + 1] = Math.random() * 3;         // y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8; // z
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    ref.current.uTime = state.clock.elapsedTime;
  });

  return (
    <group position={position}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions}
            count={count}
            itemSize={0.1}
          />
        </bufferGeometry>

        <smokeMaterial
          ref={ref}
          depthWrite={false}
          transparent
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
