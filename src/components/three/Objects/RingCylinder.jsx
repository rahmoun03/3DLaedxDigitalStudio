import * as THREE from "three"
import React, { useMemo, useRef } from "react"
import { Html } from "@react-three/drei"

export default function RingCylinder({
	label = "null",
	sphereRadius = 1,
	direction = [0, 1, 0],
	color1 = "#d0ad80",
	color2 = "#bfced9",
	cylinderLength = 0.015,
	offset = 0.0,
}) {
	const hoverRef = useRef(false)
	const labelRef = useRef()

	const { position, quaternion } = useMemo(() => {
		const dir = new THREE.Vector3(...direction).normalize()
		const pos = dir.clone().multiplyScalar(sphereRadius + cylinderLength / 2 + offset)
		const quat = new THREE.Quaternion()
		quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
		return { position: pos, quaternion: quat }
	}, [sphereRadius, direction, cylinderLength, offset])

	// handle hover manually
	const handleEnter = (e) => {
		e.stopPropagation()
		hoverRef.current = true
		document.body.style.cursor = "pointer"
		if (labelRef.current) {
			labelRef.current.style.opacity = 1
		// 	labelRef.current.style.transform = "scale(1)"
		}
	}

	const handleLeave = (e) => {
		e.stopPropagation()
		hoverRef.current = false
		document.body.style.cursor = "auto"
		if (labelRef.current) {
			labelRef.current.style.opacity = 0
		// 	labelRef.current.style.transform = "scale(0.9)"
		}
	}

	return (
		<group
			position={position}
			quaternion={quaternion}
			onPointerOver={handleEnter}
			onPointerOut={handleLeave}
		>
			{/* Outer ring */}
			<mesh>
				<cylinderGeometry args={[0.05, 0.05, cylinderLength, 32]} />
				<meshBasicMaterial
					color={color1}
					side={THREE.DoubleSide}
					transparent
					opacity={0.8}
				/>
			</mesh>

			{/* Inner ring */}
			<mesh>
				<cylinderGeometry args={[0.025, 0.025, cylinderLength + 0.001, 32]} />
				<meshBasicMaterial
					color={color2}
					side={THREE.DoubleSide}
					transparent
					opacity={0.9}
				/>
			</mesh>

			{/* Stable UI */}
			<Html center={true} position={[0, 0.5, 0]} distanceFactor={0} >
				<div
					ref={labelRef}
					className="py-6 px-12 rounded-lg transition-all duration-250 font-[Montserrat]"
					style={{
						opacity: 0,
						background: "rgba(0, 0, 0, 0.9)",
						color: "#fff",
						fontSize: '48px',
						whiteSpace: "nowrap",
					}}
				>
					{label}
				</div>
			</Html>
		</group>
	)
}
