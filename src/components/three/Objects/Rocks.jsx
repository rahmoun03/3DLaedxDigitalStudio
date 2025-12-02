import { useGLTF } from "@react-three/drei";
import { useMemo, useRef, useCallback, useEffect } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import useShake from "@/hooks/useShake";

export default function Rocks({ rockCount = 15, radius = 2.5 }) {
	const { scene } = useGLTF("/models/Opsmall_rock.glb");
	const groupRef = useRef();
	const rockRefs = useRef([]);

	const { camera } = useThree();

	// //  Preload hit sound
	// const hitBuffer = useLoader(THREE.AudioLoader, "/sounds/stone.wav");

	// //  Shared listener
	// const listener = useMemo(() => new THREE.AudioListener(), []);
	// useEffect(() => {
	// 	camera.add(listener);
	// 	return () => camera.remove(listener);
	// }, [camera, listener]);

	//  Generate rocks positions
	const rocks = useMemo(() => {
		const arr = [];
		for (let i = 0; i < rockCount; i++) {
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);
			const x = radius * Math.sin(phi) * Math.cos(theta);
			const y = radius * Math.sin(phi) * Math.sin(theta);
			const z = radius * Math.cos(phi);
			if (z >= 0) continue;
			arr.push({
				position: [x, y, z],
				rotation: [
					Math.random() * Math.PI,
					Math.random() * Math.PI,
					Math.random() * Math.PI,
				],
				scale: 0.3 + Math.random() * 0.3,
			});
		}
		return arr;
	}, [rockCount, radius]);

	// 🌀 Floating motion
	useFrame((state) => {
		const maxRange = 8;
		const pullStrength = 0.002;
		const dampingFactor = 0.98;

		rockRefs.current.forEach((body, i) => {
			if (!body) return;
			const t = state.clock.elapsedTime + i;

			body.applyImpulse(
				{
					x: Math.sin(t * 0.5) * 0.0005,
					y: Math.cos(t * 0.4) * 0.0005,
					z: Math.sin(t * 0.3) * 0.0005,
				},
				true
			);

			body.applyTorqueImpulse(
				{
					x: (Math.random() - 0.5) * 0.0001,
					y: (Math.random() - 0.5) * 0.0001,
					z: (Math.random() - 0.5) * 0.0001,
				},
				true
			);

			const translation = body.translation();
			const pos = new THREE.Vector3(translation.x, translation.y, translation.z);
			const dist = pos.length();

			if (dist > maxRange) {
				const dir = pos.normalize().multiplyScalar(-pullStrength * (dist - maxRange));
				body.applyImpulse(dir, true);
			}

			const linvel = body.linvel();
			body.setLinvel(
				{
					x: linvel.x * dampingFactor,
					y: linvel.y * dampingFactor,
					z: linvel.z * dampingFactor,
				},
				true
			);
		});
	});


	// const playHitSound = useCallback((event) => {
	// 	const bodyA = event.rigidBody;
	// 	const bodyB = event.other?.rigidBody;

	// 	if (!bodyA) return;

	// 	// Get their velocities
	// 	const velA = bodyA.linvel();
	// 	const velB = bodyB ? bodyB.linvel() : { x: 0, y: 0, z: 0 };

	// 	// Calculate relative speed (impact intensity)
	// 	const relVel = Math.sqrt(
	// 		Math.pow(velA.x - velB.x, 2) +
	// 		Math.pow(velA.y - velB.y, 2) +
	// 		Math.pow(velA.z - velB.z, 2)
	// 	);

	// 	const impactStrength = Math.min(relVel / 5, 1); // Normalize 0–1

	// 	// if (impactStrength < 0.1) return; // Ignore weak bumps

	// 	//  Play sound with volume based on intensity
	// 	const sound = new THREE.Audio(listener);
	// 	sound.setBuffer(hitBuffer);
	// 	sound.setVolume(impactStrength * 0.6 + 0.1);
	// 	sound.setPlaybackRate(0.9 + Math.random() * 0.2);
	// 	sound.play();

	// }, [hitBuffer, listener]);


	const handleShake = useCallback(() => {
		rockRefs.current.forEach((body) => {
			if (!body) return;
			const dir = new THREE.Vector3(
				(Math.random() - 0.5) * 6,
				(Math.random() - 0.5) * 4,
				(Math.random() - 0.5) * 4
			).normalize();
			const mag = 0.02 + Math.random() * 0.5;
			body.applyImpulse(dir.multiplyScalar(mag), true);
			body.applyTorqueImpulse(
				new THREE.Vector3(
					(Math.random() - 0.5) * 0.02,
					(Math.random() - 0.5) * 0.02,
					(Math.random() - 0.5) * 0.02
				),
				true
			);
		});
	}, []);

	useShake(handleShake, 500);

	return (
		<group ref={groupRef}>
			{rocks.map((rock, i) => (
				<RigidBody
					key={i}
					ref={(el) => (rockRefs.current[i] = el)}
					colliders="hull"
					restitution={0.8}
					friction={0.6}
					angularDamping={0.8}
					linearDamping={0.8}
					position={rock.position}
					rotation={rock.rotation}
					gravityScale={0.2}
					// onCollisionEnter={playHitSound}
				>
					<primitive object={scene.clone()} scale={rock.scale} />
				</RigidBody>
			))}
		</group>
	);
}
