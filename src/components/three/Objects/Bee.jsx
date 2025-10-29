import * as THREE from "three";
import { useGLTF, useAnimations, useTexture } from "@react-three/drei";
import { useFrame, useThree, useLoader } from "@react-three/fiber";
import { useRef, useEffect, useMemo } from "react";
import { useProgressStore } from "@/hooks/useProgressStore";
import { RigidBody } from '@react-three/rapier'

export default function Bee(props) {
	console.log("Bee mounted once");

	const { scene, animations} = useGLTF("/models/bee/source/Bee.glb");
	const normalMap = useTexture("/models/bee/textures/gltf_embedded_0.png");

	const { camera } = useThree();
	const { progressRightRef } = useProgressStore();

	const sound = useRef();
	const beelistener = useMemo(() => new THREE.AudioListener(), []);
	const buffer = useLoader(THREE.AudioLoader, '/sounds/bee-flying.mp3');

	const beeRef = useRef();
	const { actions } = useAnimations(animations, beeRef);

	const curve = useMemo(
		() =>
		new THREE.CatmullRomCurve3([
			new THREE.Vector3(0, 0.4, -2),
			new THREE.Vector3(0.5, 0.5, -1.5),
			new THREE.Vector3(1, 1, -1),
			new THREE.Vector3(1, 0.8, 0),
			new THREE.Vector3(0.4, 0.4, 1),
			new THREE.Vector3(0, -0.8, 2),
			new THREE.Vector3(0, -0.6, 3),
			new THREE.Vector3(0, -0.2, 5),
			new THREE.Vector3(0, 0, 6),
		]),
		[]
	);

	useEffect(() => {
		if (actions && animations.length > 1) {
			const anim = actions[animations[1].name];
			anim?.reset().fadeIn(0.5).play();
		}
		
		scene.traverse((child) => {
			if (child.isMesh) {
				child.material.map = normalMap;
			}
		})
	}, [actions, animations]);

	
	useEffect(() => {
		const audio = new THREE.PositionalAudio(beelistener);
		sound.current = audio;
		audio.setBuffer(buffer);
		audio.setRefDistance(1);
		audio.setLoop(true);
		audio.setVolume(0.5);
		try {
			audio.play();
		} catch (e) {
			console.warn("Audio play blocked until user interaction");
		}

		camera.add(beelistener);
		return () => {
			try {
				audio.stop();
				audio.disconnect();
			} catch {}
			camera.remove(beelistener);
		};
	}, [buffer, camera, beelistener]);


	useFrame(() => {
		const bee = beeRef.current;
		if (!bee) return;

		const t = Math.min(progressRightRef.current / 100, 1);
		const target = curve.getPoint(t);

		bee.position.lerp(target, 0.12);
		bee.visible = progressRightRef.current >= 6;
		sound.current?.setVolume(progressRightRef.current / 100);
		sound.current?.setRefDistance(progressRightRef.current / 100);
	});


	return (
		<RigidBody
			colliders="hull"
			type="dynamic" // allow physics interaction
			restitution={0.9}
			friction={0.4}
			mass={3}
		>
			<group ref={beeRef} {...props} visible={progressRightRef.current >= 1}>
				<primitive object={scene} />
			</group>
		</RigidBody>
	);
}
