// RingCylinder.jsx
import * as THREE from "three"
import React, { useMemo } from "react"

export default function RingCylinder({
  sphereRadius = 1,
  direction = [0, 1, 0], // unit direction
  color1 = "#ff5500",
  color2 = "#51a4de",
  cylinderLength = 0.015,
  offset = 0.00, // small gap to avoid clipping
}) {
  const { position, quaternion } = useMemo(() => {
    const dir = new THREE.Vector3(...direction).normalize()
    const pos = dir.clone().multiplyScalar(sphereRadius + cylinderLength / 2 + offset)

    const quat = new THREE.Quaternion()
    quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)

    return { position: pos, quaternion: quat }
  }, [sphereRadius, direction, cylinderLength, offset])

  return (
    <group position={position} quaternion={quaternion}>
      {/* Outer ring */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, cylinderLength, 32]} />
        <meshBasicMaterial
          color={color1}
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Inner ring */}
      <mesh>
        <cylinderGeometry args={[0.025, 0.025, cylinderLength + 0.001, 32]} />
        <meshBasicMaterial
          color={color2}
          side={THREE.DoubleSide}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  )
}
