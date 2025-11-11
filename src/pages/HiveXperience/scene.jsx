import { useRef, useEffect } from "react";
import * as THREE from 'three';
import { useAnimations, useGLTF, useTexture } from "@react-three/drei";


function convertStandardToPhysical(stdMat) {
	const phys = new THREE.MeshPhysicalMaterial();

	// Copy shared PBR properties
	phys.color = stdMat.color.clone();
	phys.metalness = stdMat.metalness;
	phys.roughness = stdMat.roughness;

	phys.map = stdMat.map;
	phys.normalMap = stdMat.normalMap;
	phys.roughnessMap = stdMat.roughnessMap;
	phys.metalnessMap = stdMat.metalnessMap;
	phys.envMap = stdMat.envMap;

	// Optional: upgraded Physical material tweaks
	phys.clearcoat = 1.0;
	phys.clearcoatRoughness = 0.1;
	phys.transmission = 0;
	phys.thickness = 0.1;

	return phys;
}

const HiveBee = () => {
	const groupRef = useRef();
	const beeRef = useRef();
	const { scene, animations} = useGLTF("/models/BeeV3.glb");
	const { actions } = useAnimations(animations, beeRef);


	// start animation
	useEffect(() => {
		console.log({scene})
		scene.traverse((child) => {
			if (child.isMesh && child.material.isMeshStandardMaterial) {
				console.log({child})
				child.material.metalness = 0.6;
				child.material.roughness = 0.6;
			}
		})
		if (actions && animations.length > 1) {
			const anim = actions[animations[0].name];
			anim?.reset().fadeIn(0.5).play();
		}
	}, [actions, animations]);

	return (
		<group ref={groupRef} >
			<primitive ref={beeRef} object={scene} scale={[0.2, 0.2, 0.2]} />
		</group>
	)
}

function HiveXperience() {
	const groupRef = useRef();

	return (
		<group ref={groupRef} >
			{/* normal light */}
			<directionalLight position={[0, 2, 5]} intensity={3} color="#fff" />
			<ambientLight intensity={5} color="#fff" />
			<HiveBee />
		</group>
	);
}


export default HiveXperience;