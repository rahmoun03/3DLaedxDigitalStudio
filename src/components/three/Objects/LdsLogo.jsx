import { useRef, useMemo } from "react";
import { RigidBody } from "@react-three/rapier";
import { useTexture, Html } from "@react-three/drei";
import * as THREE from "three";

import HolographicMaterial from '@/components/three/materials/HolographicMaterial';
import RingCylinder from '@/components/three/Objects/RingCylinder';
import AnimatedCurveLine from '@/components/three/Objects/AnimatedCurveLine';
import HoloLight from '@/components/three/HoloLight';

export default function LdsLogo() {
	const groupRef = useRef();
	const texture = useTexture("/textures/worldmap/alpha.jpg");
	const sphereRadius = 1;
	const offset = 0.0;
	const cylinderLength = 0.015;


	// Reference direction for the central cylinder
	const direction = useMemo(
		() => new THREE.Vector3(-0.4, 0.8, 0.6).normalize(),
		[]
	);
	const ProjectorDir = useMemo(
		() => new THREE.Vector3(0, -3, 2).normalize(),
		[]
	)

	const ProjectorPosition = useMemo(
		() =>
			ProjectorDir
				.clone()
				.multiplyScalar(sphereRadius + cylinderLength / 2 + offset + 1.5),
		[ProjectorDir]
	);


	const position = useMemo(
		() =>
			direction
				.clone()
				.multiplyScalar(sphereRadius + cylinderLength / 2 + offset),
		[direction]
	);

	const quaternion = useMemo(() => {
		const q = new THREE.Quaternion();
		q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
		return q;
	}, [direction]);
	
	const ProjectionQuaternion = useMemo(() => {
		const q = new THREE.Quaternion();
		q.setFromUnitVectors(new THREE.Vector3(0, 1, 0), ProjectorDir);
		return q;
	}, [ProjectorDir]);

	// Ring data
	const rings = [
		{ dir: [-1.5, -0.5, 0.5], label: "Brazil" },
		{ dir: [0, 1, 0], label: "Europe" },
		{ dir: [0, 0, 1], label: "South Africa" },
		{ dir: [-2.0, 1.5, -0.5], label: "Canada" },
		{ dir: [0.5, 1.3, 1], label: "Palestine" },
	];

	return (
		<RigidBody type="fixed" colliders="ball" restitution={0.9} friction={0.4}>
			<group rotation={[0.7, 0.1, 0]} ref={groupRef}>
				{/* shadow of projection */}
				{/* <mesh position={ProjectorPosition} quaternion={ProjectionQuaternion}> */}
					{/* <cylinderGeometry args={[0.01, sphereRadius, 5, 64]} /> */}
					{/* <meshBasicMaterial color="#51a4de" side={THREE.DoubleSide} transparent opacity={0.02} wireframe/> */}
					{/* <HolographicMaterial
							side="BackSide"
							scanlineSize={3.0}
							hologramColor="#51a4de"
							hologramOpacity={0.4}
							fresnelOpacity={0.4}
							hologramBrightness={0.4}
							signalSpeed={0.45}
							fresnelAmount={0.45}
							// alphaMap={texture}
					/> */}
				{/* </mesh> */}
				{/* Global center ring */} 
				<mesh position={position} quaternion={quaternion}>
					<cylinderGeometry args={[0.06, 0.06, cylinderLength, 32]} />
					<meshBasicMaterial color="#ff5500" side={2} transparent opacity={0.8} />
				</mesh>

				<mesh position={position} quaternion={quaternion}>
					<cylinderGeometry args={[0.03, 0.03, cylinderLength + 0.001, 32]} />
					<meshBasicMaterial color="#bfced9" side={2} transparent opacity={0.9} />
				</mesh>

				{/* Local rings */}
				{rings.map((ring, i) => (
					<RingCylinder
						key={i}
						label={ring.label}
						direction={ring.dir}
						color1="#d0ad80"
						color2="#bfced9"
					/>
				))}

				{/* Sphere */}
				<group rotation={[-0.7, 4.6, 0]} >
					<mesh>
						<sphereGeometry args={[sphereRadius, 64, 64]} />
						<HolographicMaterial
							side="DoubleSide"
							scanlineSize={10.0}
							hologramColor="#51a4de"
							hologramOpacity={0.9}
							fresnelOpacity={0.9}
							hologramBrightness={1.0}
							signalSpeed={0.45}
							fresnelAmount={0.45}
							alphaMap={texture}
						/>
					</mesh>

					<mesh>
						<sphereGeometry args={[sphereRadius, 64, 64]} />
						<HolographicMaterial
							side="DoubleSide"
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

				{/* Animated curved lines */}
				{rings.map((ring, i) => {
					const end = new THREE.Vector3(...ring.dir).normalize().multiplyScalar(1);
					return (
						<AnimatedCurveLine
							key={i}
							start={position}
							end={end}
							color="#d0ad80"
							curvature={0.4}
							thickness={0.01}
							speed={0.5}
						/>
					);
				})}

				<HoloLight />
			</group>
		</RigidBody>
	);
}
