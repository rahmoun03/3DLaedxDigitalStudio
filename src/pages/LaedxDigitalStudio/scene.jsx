import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree, extend} from "@react-three/fiber";
import { MeshReflectorMaterial, useTexture, useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three'
import { EffectComposer , Bloom } from '@react-three/postprocessing';
import { Physics } from "@react-three/rapier";
import { RigidBody, useRapier } from "@react-three/rapier";




import Bee from '@/components/three/Objects/Bee';
import Rocks from '@/components/three/Objects/Rocks';
import RingCylinder from '@/components/three/Objects/RingCylinder';
import AnimatedCurveLine from '@/components/three/Objects/AnimatedCurveLine';
// import HexSphere from '@/components/three/Objects/HexSphere';

import HolographicMaterial from '@/components/three/materials/HolographicMaterial';
import '@/components/three/materials/DissolveMaterial';
import { useProgressStore } from "@/hooks/useProgressStore";
import useShake  from "@/hooks/useShake";


function DissolveSphere({ progress = 0 }) {
	const matRef = useRef();

	useFrame(() => {
	  if (matRef.current) {
		matRef.current.uProgress = THREE.MathUtils.clamp(progress / 100, 0, 1);
	  }
	});
  
	return (
	  <RigidBody colliders="ball" type="dynamic" restitution={0.9} friction={0.4} mass={3}>
		<group rotation={[0.4, 0.2, 0]} position={[0, 0, 0]}>
		  <mesh>
			<sphereGeometry args={[1, 128, 128]} />
			<dissolveMaterial ref={matRef} />
		  </mesh>
		  <pointLight position={[0, 0, 0]} intensity={25} color="#51a4de" />
		</group>
	  </RigidBody>
	);
}

function HoloLight() {
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

function Sphere() {
  // Parameters
  const texture = useTexture("/textures/worldmap/alpha.jpg");
  const sphereRadius = 1
  const offset = 0.0 // small gap so cylinder doesn’t clip into the sphere
  const cylinderLength = 0.015

  // Direction where you want the cylinder (example: diagonally upward)
  const direction = new THREE.Vector3(-0.4, 0.8, 0.6).normalize()

  // Position = direction * (sphere radius + half cylinder length + small offset)
  const position = direction.clone().multiplyScalar(
    sphereRadius + cylinderLength / 2 + offset
  )

  // Align cylinder so its axis points along that direction
  const quaternion = new THREE.Quaternion()
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)

  return (
    <RigidBody type="fixed" colliders="ball" restitution={0.9} friction={0.4}>
      <group rotation={[0.2, 0.0, 0]} position={[0, 0, 0]}>



		<group>
			{/* global ring */}
			<mesh position={position} quaternion={quaternion}>
				<cylinderGeometry args={[0.06, 0.06, cylinderLength, 32]} />
				<meshBasicMaterial 
					color="#ff5500"
					side={2}
					transparent
					opacity={0.8}
				/>
			</mesh>

			<mesh position={position} quaternion={quaternion}>
				<cylinderGeometry args={[0.03, 0.03, cylinderLength + 0.001, 32]} />
				<meshBasicMaterial 
					color="#bfced9"
					side={2}
					transparent
					opacity={0.9}
				/>
			</mesh>


			{/* local rings */}
			<RingCylinder direction={[-1.5, -0.5, 0.5]} color1="#d0ad80" color2="#bfced9" /> // america
			<RingCylinder direction={[0, 1, 0]} color1="#d0ad80" color2="#bfced9" /> // auropa
			<RingCylinder direction={[0, 0, 1]} color1="#d0ad80" color2="#bfced9" /> // south africa
			<RingCylinder direction={[1, 1, 0]} color1="#d0ad80" color2="#bfced9" /> // asia
			<RingCylinder direction={[0.5, 1, 1]} color1="#d0ad80" color2="#bfced9" /> // Palestine
		</group>



		<group rotation={[-0.7, 4.6 , 0]}>
			<mesh>
				<sphereGeometry args={[sphereRadius, 64, 64]} />
				<HolographicMaterial
					side="DoubleSide"
					scanlineSize={10.0}
					hologramColor="#51a4de"
					hologramOpacity={0.9}
					fresnelOpacity={0.9}
					hologramBrightness={2.2}
					signalSpeed={0.45}
					fresnelAmount={0.45}
					alphaMap={texture}
				/>
			</mesh>

			<mesh >
				<sphereGeometry args={[sphereRadius, 64, 64]} />
				<HolographicMaterial
					side="FrontSide"
					scanlineSize={10.0}
					hologramColor="#51a4de"
					hologramOpacity={0.4}
					fresnelOpacity={0.4}
					hologramBrightness={1.2}
					signalSpeed={0.45}
					fresnelAmount={0.45}
					alphaMap={null}
				/>
			</mesh>
		</group>


		{[
		[-1.5, -0.5, 0.5],
		[0, 1, 0],
		[0, 0, 1],
		[1, 1, 0],
		[0.5, 1, 1],
		].map((dir, i) => {
		const end = new THREE.Vector3(...dir).normalize().multiplyScalar(1);
		return (
			<AnimatedCurveLine
			key={i}
			start={position}
			end={end}
			color="#d0ad80"
			curvature={0.5} // stronger arc
			thickness={0.01} // thicker line
			speed={0.5} // slower reveal
			/>
		);
		})}


        {/* <pointLight position={[0, 0, 0]} intensity={30} color="#51a4de" /> */}
		<HoloLight />
      </group>
    </RigidBody>
  )
}


function Ground() {
	// const { progressRightRef, progressLeftRef } = useProgressStore();
	const groupRef = useRef();

	// const [AO, roughness, normal, baseColor, height] = useTexture([
	// 	'/textures/Stone/Wall_Stone_025_ambientOcclusion.png',
	// 	'/textures/Stone/Wall_Stone_025_roughness.png',
	// 	'/textures/Stone/Wall_Stone_025_normal.png',
	// 	'/textures/Stone/Wall_Stone_025_basecolor.png',
	// 	'/textures/Stone/Wall_Stone_025_height.png',
	// ])

	const [AO, roughness, normal, baseColor, height] = useTexture([
		'/textures/Stone2/Stone_Path_008_ambientOcclusion.jpg',
		'/textures/Stone2/Stone_Path_008_roughness.jpg',
		'/textures/Stone2/Stone_Path_008_normal.jpg',
		'/textures/Stone2/Stone_Path_008_basecolor.jpg',
		'/textures/Stone2/Stone_Path_008_height.png',
	])

	// const [AO, roughness, normal, baseColor, height] = useTexture([
	// 	'/textures/Floor/Stylized_Stone_Floor_006_ambientOcclusion.png',
	// 	'/textures/Floor/Stylized_Stone_Floor_006_roughness.png',
	// 	'/textures/Floor/Stylized_Stone_Floor_006_normal.png',
	// 	'/textures/Floor/Stylized_Stone_Floor_006_basecolor.png',
	// 	'/textures/Floor/Stylized_Stone_Floor_006_height.png',
	// ])


	normal.repeat.set(8, 8);
	roughness.repeat.set(8, 8);
	AO.repeat.set(8, 8);
	height.repeat.set(8, 8);
	baseColor.repeat.set(8, 8);


	height.wrapS = height.wrapT = baseColor.wrapS = baseColor.wrapT = AO.wrapS = AO.wrapT = normal.wrapS = normal.wrapT = roughness.wrapS = roughness.wrapT = THREE.RepeatWrapping;


	const start = new THREE.Vector3(0, 0, 0);
	const end = new THREE.Vector3(0, -8, 0);

	// useFrame(() => {
	// 	if(groupRef.current) {
	// 		const t = progressRightRef.current / 100;
	// 		const target = new THREE.Vector3().lerpVectors(start, end, t);
	// 		groupRef.current.position.lerp(target, 0.05);
	// 	}
	// });

	return (
		<group ref={groupRef} position={start}>

			{/* mirror */}
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]} receiveShadow>
				<planeGeometry args={[30, 30]} />

				<MeshReflectorMaterial
					transparent
					opacity={0.5}         // how see-through
					roughness={0}         // perfectly smooth surface
					blur={[0, 0]}         // no distortion blur
					resolution={1024}     // reflection resolution
					mixBlur={0}           // no mixed blur
					mixStrength={0.5}       // reflection strength
					mirror={1}          // reflection amount
					depthWrite={false}    // better transparent blending
					envMapIntensity={0}   // brightness from environment
				/>
			</mesh>
			

			{/* textures */}
			<mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
				<planeGeometry args={[30, 30, 720, 720]} />
				<meshPhysicalMaterial
					map={baseColor}
					normalMap={normal}
					roughnessMap={roughness}
					// roughness={1}
					aoMap={AO}
					displacementMap={height}
					displacementScale={0.15}
				/>
			</mesh>
		</group>
	);
}


function HologramLogo() {
	const {scene} = useGLTF('/models/LogoV3.glb');


	useEffect(() => {
		scene.traverse((child) => {
			if(child.isMesh) {
				child.material = HolographicMaterial;
			}
		})
	}, [])

	return (
		<primitive object={scene} />
	)
}

function HomeScene() {

	console.log('Home Scene called !!!')
	// window.alert('aaaaaaaaaaaaaa');


	const { camera, size } = useThree();
	const groupRef = useRef();



	const { progressRightRef, progressLeftRef } = useProgressStore();

	useFrame(() => {
		camera.lookAt(0, 0, 0);
	})


	// useShake(() => {
	// 	window.alert("You shook your phone! 🎉");
	// }, 2500);

	return (
		<group ref={groupRef}>
			<Physics gravity={[0, 0, 0]}>
				<Sphere />
				{/* <AnimatedCurveLine /> */}
				<Bee scale={[0.02, 0.02, 0.02]} position={[0, 0, -2]}/>
				<Rocks rockCount={60} radius={1.5} />
				{/* <DissolveSphere progress={progressRightRef.current} /> */}
				{/* <HexSphere radius={2} hexCount={900} color="#FF5500" /> */}
			</Physics>

			{/* <LiquidSphere /> */}
			{/* <Ground /> */}
			{/* Post bloom for the hot rim */}
			{/* <EffectComposer >
				<Bloom intensity={0.1} luminanceThreshold={0.2} />
			</EffectComposer> */}
		</group>
	);
}

export default HomeScene;
