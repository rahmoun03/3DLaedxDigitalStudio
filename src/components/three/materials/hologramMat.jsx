import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";

// import holographicVertex from "./holographicVertex.glsl";
// import holographicFragment from "./holographicFragment.glsl";

import holographicVertex from '@/assets/shaders/holographic/vertex.glsl';
import holographicFragment from '@/assets/shaders/holographic/fragment.glsl';
import { transform } from "framer-motion";

const HologramMat = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#51a4de"),
    uUseTexture: false,
    uTexture: null,
    uIntensity: 1.0,
    uStripeSpeed: 0.1,
    uStripeDensity: 20.0,
  },
  holographicVertex,
  holographicFragment,
);

extend({ HologramMat });

export default function HolographicMaterial({
  color = "#51a4de",
  texture = null,
  useTexture = false,
  intensity = 4,
  stripeSpeed = 0.1,
  stripeDensity = 20,
  ...props
}) {
  const matRef = useRef();

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <hologramMat
      ref={matRef}
      uColor={new THREE.Color(color)}
      uTexture={texture}
      uUseTexture={useTexture}
      uIntensity={intensity}
      uStripeSpeed={stripeSpeed}
      uStripeDensity={stripeDensity}
      transparent
      depthWrite={false}
      side={THREE.DoubleSide}
      blending={THREE.AdditiveBlending}
      {...props}
    />
  );
}
