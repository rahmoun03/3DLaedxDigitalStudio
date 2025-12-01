import { useRef, useMemo, useEffect } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useTexture, Center, Text3D, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import HolographicMaterial from '@/components/three/materials/HolographicMaterial';
import RingCylinder from '@/components/three/Objects/RingCylinder';
import AnimatedCurveLine from '@/components/three/Objects/AnimatedCurveLine';
import HoloLight from '@/components/three/HoloLight';

// import fontUrl from '@/assets/fonts/Inter_Bold.json';
import fontUrl from '@/assets/fonts/Audiowide_Regular.json';
import { alpha } from "framer-motion";
// import ttfFont from '@/assets/fonts/Audiowide/Audiowide-Regular.ttf';



function ProjectionLight({
  position = [0, -3, 0],
}) {

	const alphaLight = useTexture('/textures/Light/alphaLight.jpeg');

  return (
    <group position={position}>
		<mesh >
			<planeGeometry args={[15, 4]} rotation={[Math.PI / 2, Math.PI / 2, 0]} />
			{/* <cylinderGeometry args={[3, .1, 1.5, 64]} /> */}
			<meshLambertMaterial 
				transparent={true}
				opacity={0.9}
				color="#51a4de"
				alphaMap={alphaLight}
				side={2}
			/>
			{/* <HolographicMaterial
				side="BackSide"
				scanlineSize={10.0}
				hologramColor="#51a4de"
				hologramOpacity={0.5}
				fresnelOpacity={0.2}
				hologramBrightness={2.2}
				signalSpeed={0.45}
				fresnelAmount={0.45}
				alphaMap={alphaLight}
			/> */}
		</mesh>
    </group>
  );
}



const Title = () => {

	const { scene } = useGLTF("/models/OpX.glb");


	// const holo = useMemo(() => {
		// const mat = new HolographicMaterial({
		// 	side : "FrontSide",
		// 	scanlineSize : 10.0,
		// 	hologramColor : "#51a4de",
		// 	hologramOpacity : 0.9,
		// 	fresnelOpacity : 0.4,
		// 	hologramBrightness : 2.2,
		// 	signalSpeed : 0.45,
		// 	fresnelAmount : 0.45,
		// 	alphaMap : null
		// })
	// 	return mat
	// }, [])

	useEffect(() => {
		console.log(scene)
		scene.traverse((child) => {
			if(child.isMesh && child.name !== "Orange_part"){
				
				console.log({child})
				child.material.visible = false;
			}
			else
			{
				child.material = new THREE.MeshStandardMaterial({color : "#ff5500", emissive : "#ff5500", side : THREE.FrontSide, transparent : true, opacity: 0.9})
			}
		})
	}, [scene])


	return (
		<group position={[0, -1.5, 0]} rotation={[0, 0, 0]} >
			<Center position={[0, 0, 0]}>
				<Text3D font={fontUrl} lineHeight={0.5}  letterSpacing={0.1} size={0.6} height={0.06}>
					LAEDX
					<HolographicMaterial
						side="FrontSide"
						scanlineSize={10.0}
						hologramColor="#51a4de"
						hologramOpacity={0.9}
						fresnelOpacity={0.4}
						hologramBrightness={2.2}
						signalSpeed={0.45}
						fresnelAmount={0.45}
						alphaMap={null}
					/>
				</Text3D>
				{/* <primitive object={scene} scale={[.52, .53, .8]} position={[3.352, -0.002, 0.001]} /> */}
				<primitive object={scene} scale={[.52, .53, 1.64]} position={[3.352, -0.002, -0.0001]} />
			</Center>

			<Center  position={[0, -0.5, 0]}>					
				<Text3D font={fontUrl} lineHeight={0.2} letterSpacing={0.1}size={0.17} height={0.06}>
					DIGITAL  STUDIO
					<HolographicMaterial
						side="FrontSide"
						scanlineSize={10.0}
						hologramColor="#51a4de"
						hologramOpacity={0.9}
						fresnelOpacity={0.4}
						hologramBrightness={2.2}
						signalSpeed={0.45}
						fresnelAmount={0.45}
						alphaMap={null}
					/>
				</Text3D>
			</Center>

			<Center position={[0, -.8, 0]}>
				<Text3D font={fontUrl} lineHeight={0.2} letterSpacing={0.05} size={0.09} height={0.06}  >
					LEAD TOGETHER
					<HolographicMaterial
						side="FrontSide"
						scanlineSize={10.0}
						hologramColor="#51a4de"
						hologramOpacity={0.9}
						fresnelOpacity={0.4}
						hologramBrightness={2.2}
						signalSpeed={0.45}
						fresnelAmount={0.45}
						alphaMap={null}
					/>
				</Text3D>
			</Center>
		</group>
	)
}

export default function LdsLogo() {
	// const loader = new THREE.FontLoader();
	// loader.load('/public/fonts/Audiowide-Regular.json', function (font) {
	// 	console.log(font);
	// })
	const { scene } = useGLTF("/models/hologram_projector.glb");
	console.log("projector : ", scene)
	useEffect(() => {
		scene.traverse((child) => {
			if (child.name === 'Sphere001' || child.name === 'Sphere002' || child.name === 'Cylinder008') {
				console.log("OK OK OK OK OK OK OK OK")
				child.visible = false;
			}
		})
	}, [])


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


	useEffect(() => {
		console.log('LdsLogo call useEffect')
	}, [])

	return (
		// <RigidBody type="fixed" colliders="ball" restitution={0.9} friction={0.4}>
			<group position={[0, 0.5, 0]} rotation={[0, 0, 0]} ref={groupRef}>

				<group position={[0, -3.5, -.25]}>
					<RigidBody type="fixed" colliders="hull" restitution={0.9} friction={0.4}>
						<primitive object={scene} scale={[0.03, 0.03, 0.03]} />
					</RigidBody>
					<ProjectionLight 
						position={[0.05, 2.5, .25]}
					/>
				</group>
				
				
				<group rotation={[0.7, 0, 0]}>
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
								side="BackSide"
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
				</group>
				<Title />
				<HoloLight position={[0, -2.5, 0]} />
			</group>
		// </RigidBody>
	);
}
