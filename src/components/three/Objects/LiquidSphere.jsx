// LiquidSphere.jsx
import * as THREE from "three"
import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"

export default function LiquidSphere() {
  const meshRef = useRef()
  const { mouse, camera, viewport } = useThree()
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector3(0, 0, 0) },
    uStrength: { value: 0.0 },
  }), [])

  // Track mouse in 3D space
  useFrame((state, delta) => {
    uniforms.uTime.value += delta
    uniforms.uStrength.value = THREE.MathUtils.lerp(
      uniforms.uStrength.value,
      0.0,
      0.05
    )

    // Raycast mouse to sphere
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObject(meshRef.current)
    if (intersects.length > 0) {
      uniforms.uMouse.value.copy(intersects[0].point)
      uniforms.uStrength.value = 0.4
    }
  })

  return (
    <mesh
      ref={meshRef}
      onPointerMove={(e) => e.stopPropagation()}
      onClick={(e) => {
        uniforms.uStrength.value = 1.0 // click = stronger splash
      }}
    >
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          uniform float uTime;
          uniform vec3 uMouse;
          uniform float uStrength;
          varying vec3 vPos;
          void main() {
            vPos = position;
            float dist = distance(position, uMouse);
            float ripple = sin(dist * 20.0 - uTime * 5.0) * exp(-dist * 4.0) * uStrength;
            vec3 newPosition = position + normal * ripple * 0.2;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vPos;
          void main() {
            vec3 color = mix(vec3(0.1, 0.9, 0.8), vec3(0.0, 0.8, 1.0), vPos.y * 0.5 + 0.5);
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  )
}
