import { useRef , useEffect} from "react";
import { useFrame } from "@react-three/fiber";
import { useHelper } from "@react-three/drei";
import { PointLightHelper } from "three";

export default function HoloLight({
  position = [0, 0, 0],
}) {
  const lightRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (lightRef.current) {
      // lightRef.current.position.x += Math.sin(t * 15) * 0.05;
      // lightRef.current.position.y += Math.cos(t * 17) * 0.05;
      // lightRef.current.position.z += Math.sin(t * 19) * 0.03;
      if (t % 100 == 0)
        console.log( "intensity : ", 30 + Math.sin(t * 40) * 4 + Math.random() * 0.6)

      lightRef.current.intensity = 30 + Math.sin(t * 40) * 4 + Math.random() * 0.6;
    }
  });


  // useHelper(lightRef, PointLightHelper, 1, 'red')


  return (
    <pointLight
      ref={lightRef}
      position={position}
      intensity={2}
      color="#51a4de"
      distance={10}
    />
    
  );
}