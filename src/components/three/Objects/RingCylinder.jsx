import * as THREE from "three";
import React, { useMemo, useRef, useEffect, useState } from "react";
import { Html } from "@react-three/drei";

export default function RingCylinder({
	label = "null",
	currency = "USD", // 🇺🇸 default base for conversion
	sphereRadius = 1,
	direction = [0, 1, 0],
	color1 = "#d0ad80",
	color2 = "#bfced9",
	cylinderLength = 0.015,
	offset = 0.0,
}) {
	const hoverRef = useRef(false);
	const labelRef = useRef();
	const [rate , setRate] = useState("Loading...");

	const { position, quaternion } = useMemo(() => {
		const dir = new THREE.Vector3(...direction).normalize();
		const pos = dir.clone().multiplyScalar(sphereRadius + cylinderLength / 2 + offset);
		const quat = new THREE.Quaternion();
		quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
		return { position: pos, quaternion: quat };
	}, [sphereRadius, direction, cylinderLength, offset]);

	// Fetch exchange rate only once on mount
	useEffect(() => {
		let targetCurrency;

		switch (label) {
			case "Brazil":
				targetCurrency = "BRL";
				break;
			case "Canada":
				targetCurrency = "CAD";
				break;
			case "Europe":
				targetCurrency = "EUR";
				break;
			case "South Africa":
				targetCurrency = "ZAR";
				break;
			case "Palestine":
				targetCurrency = "ILS"; // Israeli Shekel
				break;
			case "Morocco":
				targetCurrency = "MAD";
				break;
			default:
				targetCurrency = "USD";
		}

		fetch(`https://api.frankfurter.app/latest?from=${currency}&to=${targetCurrency}`)
			.then((res) => res.json())
			.then((data) => {
				console.log('exchange rate : ', data);
				const rate = data.rates[targetCurrency];
				setRate(rate ? `1 ${currency} = ${rate.toFixed(2)} ${targetCurrency}` : "N/A");
			})
			.catch(() => {
				setRate("Error loading rate");
			});
	}, [label, currency]);

	// Handle hover
	const handleEnter = (e) => {
		e.stopPropagation();
		hoverRef.current = true;
		document.body.style.cursor = "pointer";
		if (labelRef.current) {
			labelRef.current.style.display = 'flex';
			labelRef.current.style.opacity = 1;
		}
	};

	const handleLeave = (e) => {
		e.stopPropagation();
		hoverRef.current = false;
		document.body.style.cursor = "auto";
		if (labelRef.current) {
			labelRef.current.style.display = 'none';
			labelRef.current.style.opacity = 0;
		}
	};

	return (
		<group
			position={position}
			quaternion={quaternion}

		>
			{/* Outer ring */}
			<mesh
				onPointerOver={handleEnter}
				onPointerOut={handleLeave}
			>
				<cylinderGeometry args={[0.2, 0.2, cylinderLength * 3 , 32]} />
				<meshBasicMaterial transparent opacity={0.0} side={THREE.BackSide} 	blending={THREE.AdditiveBlending} />
			</mesh>


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

			{/* Floating UI */}
			<Html center position={[0, 0.5, 0]} distanceFactor={1.5}>
				<div
					ref={labelRef}
					className="hidden py-4 px-8 rounded-lg transition-all duration-300 font-[Montserrat]"
					style={{
						opacity: 0,
						background: "rgba(0, 0, 0, 0.85)",
						color: "#fff",
						fontSize: "48px",
						whiteSpace: "nowrap",
						textAlign: "center",
					}}
				>
					{/* <div className="font-bold">{label}</div> */}
					<div className="opacity-80 mt-1">{rate}</div>
				</div>
			</Html>
		</group>
	);
}
