import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function HoloLight() {
  const lightRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(t * 15) * 0.05;
      lightRef.current.position.y = Math.cos(t * 17) * 0.05;
      lightRef.current.position.z = Math.sin(t * 19) * 0.03;

      lightRef.current.intensity = 30 + Math.sin(t * 40) * 4 + Math.random() * 0.6;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 0]}
      intensity={30}
      color="#51a4de"
      distance={10}
    />
  );
}