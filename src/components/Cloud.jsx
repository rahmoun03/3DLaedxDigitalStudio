import { useRef, useMemo, useState } from 'react'
import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Cloud({ position = [3, 2, 4], opacity = 1 }) {
  const group = useRef()

  // Load alpha textures
  const alphaMap1 = useTexture('/Textures/cloud/alphamap.jpg')
  const alphaMap2 = useTexture('/Textures/cloud2/alphamap.jpg')

  // Reuse materials (GPU efficient)
  const materials = useMemo(() => ({
    mat1: new THREE.MeshStandardMaterial({
      color: 'white',
      transparent: true,
      alphaMap: alphaMap1,
      depthWrite: false,
	  emissive: 'white',
	  emissiveIntensity: 1
    }),
    mat2: new THREE.MeshStandardMaterial({
      color: 'white',
      transparent: true,
      alphaMap: alphaMap2,
      depthWrite: false,
	  emissive: 'white',
	  emissiveIntensity: 1
    }),
  }), [alphaMap1, alphaMap2])


  return (
    <group ref={group} position={position}>
      {/* Cloud cluster */}
      <mesh material={materials.mat1} position={[0, 0, 0]}>
        <planeGeometry args={[3, 3]} />
      </mesh>
      <mesh material={materials.mat1} position={[2, 0, 0.2]}>
        <planeGeometry args={[3, 3]} />
      </mesh>
      <mesh material={materials.mat2} position={[1, 0, 0.2]}>
        <planeGeometry args={[3, 3]} />
      </mesh>
      <mesh material={materials.mat2} position={[0, 0, 0]}>
        <planeGeometry args={[3, 3]} />
      </mesh>
      <mesh material={materials.mat2} position={[2, 0, 0.2]}>
        <planeGeometry args={[3, 3]} />
      </mesh>
      <mesh material={materials.mat2} position={[2, 1, 0]}>
        <planeGeometry args={[3, 3]} />
      </mesh>
    </group>
  )
}
