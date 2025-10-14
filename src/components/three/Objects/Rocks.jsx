import { useGLTF } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Rocks({ rockCount = 15, radius = 3 }) {
  const { scene } = useGLTF("/models/small_rock.glb");
  const groupRef = useRef();
  const rockRefs = useRef([]);

  const { world } = useRapier();

  // Generate positions once
  const rocks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < rockCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      if (z > 0) continue;

      arr.push({
        position: [x, y, z],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ],
        scale: 0.3 + Math.random() * 0.3,
      });
    }
    return arr;
  }, [rockCount, radius]);

  // Floating + gentle spin
  useFrame((state, delta) => {
    rockRefs.current.forEach((body, i) => {
      if (!body) return;
      const t = state.clock.elapsedTime + i;
      const impulse = {
        x: Math.sin(t * 0.5) * 0.0005,
        y: Math.cos(t * 0.4) * 0.0005,
        z: Math.sin(t * 0.3) * 0.0005,
      };
      body.applyImpulse(impulse, true);
      body.applyTorqueImpulse({
        x: (Math.random() - 0.5) * 0.0001,
        y: (Math.random() - 0.5) * 0.0001,
        z: (Math.random() - 0.5) * 0.0001,
      }, true);
    });
  });

  return (
    <group ref={groupRef}>
      {rocks.map((rock, i) => (
        <RigidBody
          key={i}
          ref={(el) => (rockRefs.current[i] = el)}
          colliders="hull"
          restitution={0.8}
          friction={0.6}
          angularDamping={0.8}
          linearDamping={0.8}
          position={rock.position}
          rotation={rock.rotation}
          gravityScale={0.2} // makes them feel lighter
        >
          <primitive
            object={scene.clone()}
            scale={rock.scale}
          />
        </RigidBody>
      ))}
    </group>
  );
}
