import { useGLTF } from "@react-three/drei";
import { useMemo, useRef, useCallback } from "react";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useShake from '@/hooks/useShake';

export default function Rocks({ rockCount = 15, radius = 2.5 }) {
	const { scene } = useGLTF("/models/small_rock.glb");
	const groupRef = useRef();
	const rockRefs = useRef([]);

	const { world } = useRapier();

	// Generate positions once
	const rocks = useMemo(() => {
		const arr = [];
		for (let i = 0; i < rockCount; i++) {
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);

			const x = radius * Math.sin(phi) * Math.cos(theta);
			const y = radius * Math.sin(phi) * Math.sin(theta);
			const z = radius * Math.cos(phi);

			if (z >= 0.3) continue;

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

	// Floating + gentle spin
	useFrame((state, delta) => {
		const maxRange = 8; // maximum allowed distance from origin
		const pullStrength = 0.002; // how strongly to pull back
		const dampingFactor = 0.98; // how much to slow down drifting
		
		rockRefs.current.forEach((body, i) => {
			if (!body) return;
		
			const t = state.clock.elapsedTime + i;
		
			// gentle float motion
			const impulse = {
				x: Math.sin(t * 0.5) * 0.0005,
				y: Math.cos(t * 0.4) * 0.0005,
				z: Math.sin(t * 0.3) * 0.0005,
			};
			body.applyImpulse(impulse, true);
		
			// rotation motion
			body.applyTorqueImpulse(
			{
				x: (Math.random() - 0.5) * 0.0001,
				y: (Math.random() - 0.5) * 0.0001,
				z: (Math.random() - 0.5) * 0.0001,
			},
			true
			);
		
			// --- keep within range ---
			const translation = body.translation();
			const pos = new THREE.Vector3(translation.x, translation.y, translation.z);
			const dist = pos.length();
		
			if (dist > maxRange) {
				// Pull back toward center
				const dir = pos.normalize().multiplyScalar(-pullStrength * (dist - maxRange));
				body.applyImpulse(dir, true);
			}
		
			// Slight velocity damping for stability
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

	const handleShake = useCallback((intensity = 40) => {
		rockRefs.current.forEach((body) => {
			if (!body) return;
		
			// Random direction for X, Y, Z
			const dir = new THREE.Vector3(
				(Math.random() - 0.5) * 6,   // X
				(Math.random() - 0.5) * 4, // Y
				(Math.random() - 0.5) * 4    // Z
			).normalize();
		
			// Random magnitude per rock
			const mag = 0.02 + Math.random() * 0.5;
			body.applyImpulse(dir.multiplyScalar(mag), true);
		
			// Random torque for tumbling effect
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

	// 🪄 Activate shake listener
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
					gravityScale={0.2} // makes them feel lighter
				>
					<primitive
						object={scene.clone()}
						scale={rock.scale}
					/>
				</RigidBody>
			))}
		</group>
	);
}
