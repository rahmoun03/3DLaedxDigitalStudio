import { useRef, useEffect } from "react";
import * as THREE from 'three';
import { useAnimations, useGLTF, useTexture } from "@react-three/drei";



const HiveBee = () => {
	const groupRef = useRef();
	const beeRef = useRef();
	const { scene, animations} = useGLTF("/models/bee/source/Bee.glb");
	const { actions } = useAnimations(animations, beeRef);
	const normalMap = useTexture("/models/bee/textures/gltf_embedded_0.png");

	scene.traverse((child) => {
		if (child.isMesh) {
			// Convert to light-reactive material
			child.material = new THREE.MeshStandardMaterial({
				map: normalMap,
			});
		}
	});

	// start animation
	useEffect(() => {
		if (actions && animations.length > 1) {
			const anim = actions[animations[1].name];
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
			<directionalLight position={[0, 0, 10]} intensity={1} color="#fff" />
			<ambientLight intensity={1} color="#fff" />
			<HiveBee />
		</group>
	);
}


export default HiveXperience;