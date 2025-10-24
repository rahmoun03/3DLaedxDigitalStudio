import { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree, useLoader} from "@react-three/fiber";
import { useTexture } from '@react-three/drei';
import * as THREE from 'three'
import { AudioLoader } from "three";
import { Physics } from "@react-three/rapier";
import { RigidBody } from "@react-three/rapier";



import Bee from '@/components/three/Objects/Bee';
import Rocks from '@/components/three/Objects/Rocks';
import RingCylinder from '@/components/three/Objects/RingCylinder';
import AnimatedCurveLine from '@/components/three/Objects/AnimatedCurveLine';
import LdsLogo from '@/components/three/Objects/LdsLogo';
// import HexSphere from '@/components/three/Objects/HexSphere';

import HolographicMaterial from '@/components/three/materials/HolographicMaterial';
import '@/components/three/materials/DissolveMaterial';
import { useProgressStore } from "@/hooks/useProgressStore";
import useShake  from "@/hooks/useShake";



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
	const groupRef = useRef();
	const sphereRadius = 1
	const offset = 0.0 // small gap so cylinder doesn’t clip into the sphere
	const cylinderLength = 0.015
	const rings = [
		{ dir: [-1.5, -0.5, 0.5], label: "Brazil" },
		{ dir: [0, 1, 0], label: "Europe" },
		{ dir: [0, 0, 1], label: "South Africa" },
		{ dir: [-2.0, 0.5, -0.5], label: "USA" },
		{ dir: [0.5, 1.3, 1], label: "Palestine" },
	];
	
	// Direction where you want the cylinder (example: diagonally upward)
	const direction = new THREE.Vector3(-0.4, 0.8, 0.6).normalize()

	// Position = direction * (sphere radius + half cylinder length + small offset)
	const position = direction.clone().multiplyScalar(
		sphereRadius + cylinderLength / 2 + offset
	)

	// Align cylinder so its axis points along that direction
	const quaternion = new THREE.Quaternion()
	quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction)


	//   useFrame(() => {
	// 	if(groupRef.current) {
	// 		groupRef.current.rotation.x += 0.001;
	// 		groupRef.current.rotation.y += 0.01;
	// 	}
	//   })

	return (
		<RigidBody type="fixed" colliders="ball" restitution={0.9} friction={0.4}>
		<group rotation={[0.2, 0.0, 0]} position={[0, 0, 0]} ref={groupRef}>



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
				{rings.map((ring, i) => (
					<RingCylinder
						key={i}
						direction={ring.dir}
						color1="#d0ad80"
						color2="#bfced9"
					/>
				))}
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

			{rings.map((ring, i) => {
				const end = new THREE.Vector3(...ring.dir).normalize().multiplyScalar(1);
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



function HomeScene() {

	console.log('Home Scene called !!!')

	const { camera } = useThree();
	const groupRef = useRef();
	const listener = useMemo(() => new THREE.AudioListener(), []);
	const buzzSound = useLoader(AudioLoader, '/sounds/buzz.mp3');
	const spacecraftSound = useLoader(AudioLoader, "/sounds/spacecraft.mp3");


	useEffect(() => {
		const audio = new THREE.PositionalAudio(listener);
		audio.setBuffer(buzzSound);
		audio.setRefDistance(1);
		audio.setVolume(0.5);
		audio.setLoop(true);
		
		// const audio2 = new THREE.PositionalAudio(listener);
		// audio2.setBuffer(spacecraftSound);
		// audio2.setRefDistance(1);
		// audio2.setLoop(true);
		// audio2.setVolume(0.5);
		try {
			audio.play();
			// audio2.play();
		} catch (e) {
			console.warn("Audio play blocked until user interaction");
		}

		camera.add(listener);
		return () => {
			try {
				audio.stop();
				audio.disconnect();
				// audio2.stop();
				// audio2.disconnect();
			} catch {}
			camera.remove(listener);
		};
	}, [buzzSound, spacecraftSound, camera, listener]);


	useFrame(() => {
		camera.lookAt(0, 0, 0);
	})

	return (
		<group ref={groupRef}>
			<Physics gravity={[0, 0, 0]}>
				{/* <Sphere /> */}
				<LdsLogo />
				<Bee scale={[0.02, 0.02, 0.02]} position={[0, 0, -3]}/>
				<Rocks rockCount={60} radius={1.5} />

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
