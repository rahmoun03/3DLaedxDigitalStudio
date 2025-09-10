import React, { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial, useTexture } from '@react-three/drei';
import * as THREE from 'three'


// import GalaxyBall from '../components/GalaxyBall';
// import CubeHDRI from '../components/CubeHDRI';
// import LiquidSphere from '../components/LiquidSphere';
import GlassOuter from '../components/GlassOuter';


//GLSL
import noveVertex from "./shaders/nove/vertex.glsl";
import noveFragment from "./shaders/nove/fragment.glsl";

function Stars({ count = 2000, radius = 100, innerRadius = 10 }) {

	const alphaMap = useTexture('/Textures/kenney_particle-pack/PNG (Transparent)/star_07.png')

	const stars = useMemo(() => {
		const positions = [];

		for (let i = 0; i < count; i++) {
		let r = innerRadius + Math.random() * (radius - innerRadius); // min radius = innerRadius
		const theta = THREE.MathUtils.randFloatSpread(360);
		const phi = THREE.MathUtils.randFloatSpread(360);

		const x = r * Math.sin(theta) * Math.cos(phi);
		const y = r * Math.sin(theta) * Math.sin(phi);
		const z = r * Math.cos(theta);

		positions.push(x, y, z);
		}

		return new Float32Array(positions);
	}, [count, radius, innerRadius]);

	return (
		<points>
		<bufferGeometry>
			<bufferAttribute
				attach="attributes-position"
				count={stars.length / 3}
				array={stars}
				itemSize={3}
			/>
		</bufferGeometry>
		<pointsMaterial
			color="#D5F3FF"
			size={1}
			sizeAttenuation
			emissive='#D5F3FF'
			emissiveIntensity={3}
			depthWrite={false}
			transparent
			alphaMap={alphaMap}
		/>
		</points>
	);
}



// function Sphere() {
// 	return (
// 		<mesh rotation={[0.4, 0.2, 0]} position={[0, 1.3, 0]} >
// 		<sphereGeometry args={[1, 64, 64]} />
// 		<meshStandardMaterial 
// 			metalness={0.8}
// 			roughness={5}
// 			color="#D5F3FF"
// 			emissive="#D5F3FF" 
// 			emissiveIntensity={3} 
// 		/>
// 		</mesh>
// 	);
// }




function Sphere() {

	const clock = new THREE.Clock();
	const meshRef = useRef();
	const GalaxyMaterial = new THREE.ShaderMaterial({
		uniforms : { 
			u_time: { value: 0 } ,
			u_tintA: { value: new THREE.Color('#7a5cff') },
			u_tintB: { value: new THREE.Color('#00e5ff') },
		},
		transparent : false,
		depthWrite : true,
		side : THREE.FrontSide,
		vertexShader : noveVertex,
		fragmentShader : noveFragment
	});

	useFrame(() => {
	  	GalaxyMaterial.uniforms.u_time.value = clock.getElapsedTime() / 3;
	});

	return (
		<mesh
			ref={meshRef}
			position={[0, 1.3, 0]} 
		>
			<sphereGeometry args={[1, 64, 64]}  />
			<primitive object={GalaxyMaterial} attach='material' />
		</mesh>
	);
}

function Ground() {

	const [AO, roughness, normal, baseColor, height, metalic] = useTexture([
		'/Textures/scifi/Sci-fi_Metal_Plate_003_ambientOcclusion.jpg',
		'/Textures/scifi/Sci-fi_Metal_Plate_003_roughness.jpg',
		'/Textures/scifi/Sci-fi_Metal_Plate_003_normal.jpg',
		'/Textures/scifi/Sci-fi_Metal_Plate_003_basecolor.jpg',
		'/Textures/scifi/Sci-fi_Metal_Plate_003_height.png',
		'/Textures/scifi/Sci-fi_Metal_Plate_003_metallic.jpg',
	])
	// const [AO, roughness, normal, baseColor, height, metalic] = useTexture([
	// 	'/Textures/coins/Stylized_Coins_001_ambientOcclusion.png',
	// 	'/Textures/coins/Stylized_Coins_001_roughness.png',
	// 	'/Textures/coins/Stylized_Coins_001_normal.png',
	// 	'/Textures/coins/Stylized_Coins_001_basecolor.png',
	// 	'/Textures/coins/Stylized_Coins_001_height.png',
	// 	'/Textures/coins/Stylized_Coins_001_metallic.png',
	// ])
	// const [AO, roughness, normal, baseColor, height, metalic] = useTexture([
	// 	'/Textures/metal/Metal_Plate_048_ambientOcclusion.jpg',
	// 	'/Textures/metal/Metal_Plate_048_roughness.jpg',
	// 	'/Textures/metal/Metal_Plate_048_normal.jpg',
	// 	'/Textures/metal/Metal_Plate_048_basecolor.jpg',
	// 	'/Textures/metal/Metal_Plate_048_height.png',
	// 	'/Textures/metal/Metal_Plate_048_metallic.jpg',
	// ])


	normal.repeat.set(8, 8);
	roughness.repeat.set(8, 8);
	AO.repeat.set(8, 8);
	height.repeat.set(8, 8);
	baseColor.repeat.set(8, 8);


	height.wrapS = height.wrapT = baseColor.wrapS = baseColor.wrapT = AO.wrapS = AO.wrapT = normal.wrapS = normal.wrapT = roughness.wrapS = roughness.wrapT = THREE.RepeatWrapping;

	return (
		<group>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.089, 0]} receiveShadow>
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
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
				<planeGeometry args={[30, 30, 720, 720]} />
				<meshPhysicalMaterial
					map={baseColor}
					normalMap={normal}
					roughnessMap={roughness}
					// roughness={1}
					aoMap={AO}
					displacementMap={height}
					displacementScale={0.15}
					metalnessMap={metalic}
					// metalness={1}
				/>
			</mesh>
		</group>
	);
}

function NoveScene() {
	const { camera } = useThree();
	const groupRef = useRef();
	const [mouse, setMouse] = useState({ x: 0, y: 0 });


	useEffect(() => {
		const handleMouseMove = (e) => {
			setMouse({
				x: (e.clientX / window.innerWidth) * 2 - 1, 
				y: -(e.clientY / window.innerHeight) * 2 + 1
			});
			// console.log("x : ",(e.clientX / window.innerWidth) * 2 - 1);
			// console.log("y : ",-(e.clientY / window.innerHeight) * 2 + 1);
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	// Smooth rotation
	useFrame(() => {
		if (groupRef.current) {
			groupRef.current.rotation.y += (mouse.x * 0.2 - groupRef.current.rotation.y) * 0.02;
			groupRef.current.rotation.x += (mouse.y * 0.1 - groupRef.current.rotation.x) * 0.01;
		}
		camera.lookAt(0, 1.3, 0)
	});

	return (
		<group ref={groupRef}>
			<GlassOuter useCubeCam />
			{/* <Sphere /> */}
			{/* <LiquidSphere /> */}
			{/* <GalaxyBall /> */}
			<Ground />
			{/* <CubeHDRI file="/HDRI/HDR_rich_multi_nebulae_1.hdr"/> */}
			<Stars innerRadius={15}/>
		</group>
	);
}


export default NoveScene;
