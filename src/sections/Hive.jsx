import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial, MeshTransmissionMaterial, OrbitControls, useTexture, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three'
import { SkeletonUtils } from "three-stdlib";
import LiquidSphere from '../components/LiquidSphere'





function BeeGroup({bees}) {
	const { scene, animations } = useGLTF("/3DModels/bee/source/Bee.glb");
	
	return (
		<>
		{bees.map((bee, index) => (
			<Bee
				key={bee.id}
				id={bee.id}
				scene={scene}
				animations={animations}
				animation={bee.animation}
				position={bee.position}
				scale={bee.scale}
				rotation={bee.rotation}
			/>
		))}
		</>
	);
}

function Bee({ scene, animations, animation, id, ...props }) {
	const group = useRef();
	const clone = SkeletonUtils.clone(scene);
	const { actions } = useAnimations(animations, group);
	const { camera } = useThree();
  	const raycaster = new THREE.Raycaster();
  	const mouse = new THREE.Vector2();

	const plane = new THREE.Plane(new THREE.Vector3(0, 0, 2), -2);
	const intersectionPoint = new THREE.Vector3();


	useEffect(() => {
		if (actions && animations.length > 0) {
			actions[animations[animation].name]?.play();
		}
	}, [actions, animations]);

	useEffect(() => {

		const handleMouseMove = (event) => {
			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

			if(mouse.x >= 0.70) mouse.x = 0.70;
			if(mouse.x <= -0.70) mouse.x = -0.70;
			if(mouse.y <= -0.70) mouse.y = -0.70;
			if(mouse.y >= 0.70) mouse.y = 0.70;
			
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	useFrame((state, delta) => {
		if (id === 1) {
			raycaster.setFromCamera(mouse, camera);
			raycaster.ray.intersectPlane(plane, intersectionPoint);

			if (group.current) {
				group.current.position.lerp(intersectionPoint, 0.05);
			}
		}
	});



	return (
		<>
			<primitive ref={group} object={clone} {...props} />
			<mesh
				// rotation={[-Math.PI / 2, 0, 0]}
				position={[0, 5, 0.8]}
				// onPointerMove={handleMouseMove}
				visible={false}
			>
				<planeGeometry 
					args={[10, 10]}
				/>
				<meshStandardMaterial />
			</mesh>
		</>
	);
}



function Sphere() {

	return (
		<mesh rotation={[0.4, 0.2, 0]} position={[0, 1.3, 0]} >
		<sphereGeometry args={[1, 64, 64]} />
		<meshStandardMaterial 
			// metalness={1}
			// roughness={5}
			color='#FFC30B'
			emissive="#FFC30B" 
			emissiveIntensity={2}
		/>
		</mesh>
	);
}

function Ground() {


	const [AO, roughness, normal, baseColor, height, SSS] = useTexture([
	    '/Textures/Honeycomb/Honeycomb_001_ambientOcclusion.jpg',
	    '/Textures/Honeycomb/Honeycomb_001_roughness.jpg',
	    '/Textures/Honeycomb/Honeycomb_001_normal.jpg',
	    '/Textures/Honeycomb/Honeycomb_001_basecolor.jpg',
	    '/Textures/Honeycomb/Honeycomb_001_height.png',
	    '/Textures/Honeycomb/Honeycomb_001_SSS.jpg',
	])

	// const [AO, roughness, normal, baseColor, height, SSS] = useTexture([
	// 	'/Textures/honeycomb2/Honeycomb_002_ambientOcclusion.jpg',
	// 	'/Textures/honeycomb2/Honeycomb_002_roughness.jpg',
	// 	'/Textures/honeycomb2/Honeycomb_002_normal.jpg',
	// 	'/Textures/honeycomb2/Honeycomb_002_basecolor.jpg',
	// 	'/Textures/honeycomb2/Honeycomb_002_height.png',
	// 	'/Textures/honeycomb2/Honeycomb_002_SSS.jpg',
	// ])

	normal.repeat.set(8, 8);
	roughness.repeat.set(8, 8);
	AO.repeat.set(8, 8);
	height.repeat.set(8, 8);
	baseColor.repeat.set(8, 8);


	height.wrapS = height.wrapT = baseColor.wrapS = baseColor.wrapT = AO.wrapS = AO.wrapT = normal.wrapS = normal.wrapT = roughness.wrapS = roughness.wrapT = THREE.RepeatWrapping;

	return (
		<group>
			<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
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
					aoMap={AO}
					displacementMap={height}
					displacementScale={0.15}
					thicknessMap={SSS}
				/>
			</mesh>
		</group>
	);
}

function HiveScene() {

	const { camera } = useThree();
	const groupRef = useRef();
	const mouse = useRef({ x: 0, y: 0 });
	const bees = [
		{ id: 0, animation : 0, position : [0, 0, 0], scale: [1.3, 1.3, 1.3], rotation: [0, 0, 0]},
		{ id: 1, animation : 1, position : [0, 0.3, 3], scale: [0.02, 0.02, 0.02], rotation: [0, 0, 0]},
		{ id: 2, animation : 2, position : [-1.3, 0.1, 0.4], scale: [0.06, 0.06, 0.06], rotation: [0, Math.PI / 4, 0]},
	]

	useEffect(() => {
		const handleMouseMove = (e) => {
			mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
			mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);


	// Smooth rotation
	useFrame(() => {
		if (groupRef.current) {
			groupRef.current.rotation.y += (mouse.current.x * 0.2 - groupRef.current.rotation.y) * 0.02;
			groupRef.current.rotation.x += (mouse.current.y * 0.1 - groupRef.current.rotation.x) * 0.01;
		}
		camera.lookAt(0, 1.3, 0)
	});

	return (
		<group ref={groupRef}>
			{/* <Sphere /> */}
			<LiquidSphere />
			<Suspense fallback={null}>
				<BeeGroup bees={bees} />
			</Suspense>
			<Ground />
		</group>
	);
}


export default HiveScene;