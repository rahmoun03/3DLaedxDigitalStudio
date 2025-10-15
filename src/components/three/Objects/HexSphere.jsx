import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

export default function HexSphere({
	radius = 2,
	hexCount = 400,
	color = "#FF5500",
	pulseSpeed = 1.5,
}) {
	const groupRef = useRef();

	// Precompute hex positions on the sphere
	const hexPositions = useMemo(() => {
		const positions = [];
		for (let i = 0; i < hexCount; i++) {
			const phi = Math.acos(-1 + (2 * i) / hexCount);
			const theta = Math.sqrt(hexCount * Math.PI) * phi;

			const x = radius * Math.cos(theta) * Math.sin(phi);
			const y = radius * Math.sin(theta) * Math.sin(phi);
			const z = radius * Math.cos(phi);
			positions.push(new THREE.Vector3(x, y, z));
		}
		return positions;
	}, [radius, hexCount]);


	return (
		<group ref={groupRef}>
		{hexPositions.map((pos, i) => (
			<Float
				key={i}
				speed={pulseSpeed}
				rotationIntensity={0.3}
				floatIntensity={0.6}
			>
			<mesh position={pos}>
				<circleGeometry args={[0.08, 6]} />
				<meshStandardMaterial
					color={color}
					emissive={color}
					emissiveIntensity={0.6}
					roughness={0.4}
					metalness={0.3}
				/>
			</mesh>
			</Float>
		))}
		</group>
	);
}
