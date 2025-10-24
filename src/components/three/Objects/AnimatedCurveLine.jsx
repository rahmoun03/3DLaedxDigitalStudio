import React, { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function AnimatedCurveLine({
	start = new THREE.Vector3(0, 0, 0),
	end = new THREE.Vector3(1, 1, 1),
	color = "#d0ad80",
	thickness = 0.02,
	curvature = 0.8,
	speed = 0.6,
	pause = 0.5,
}) {
	const [progress, setProgress] = useState(0);
	const [pauseTime, setPauseTime] = useState(0);
	const pausedRef = useRef(false);

	// Curved path
	const curve = useMemo(() => {
		const mid = start.clone().add(end).multiplyScalar(0.5);
		const up = mid.clone().normalize().multiplyScalar(curvature);
		const control = mid.add(up);
		return new THREE.QuadraticBezierCurve3(start, control, end);
	}, [start, end, curvature]);

	const points = useMemo(() => curve.getPoints(200), [curve]);

	const visiblePoints = useMemo(() => {
		const count = Math.floor(points.length * progress);
		return points.slice(0, Math.max(2, count));
	}, [points, progress]);

	useFrame((_, delta) => {
		if (pausedRef.current) {
			setPauseTime((t) => {
				if (t + delta >= pause) {
					pausedRef.current = false;
					setPauseTime(0);
					setProgress(0);
				}
				return t + delta;
			});
		} else {
			setProgress((p) => {
				const next = p + delta * speed;
				if (next >= 1) {
					pausedRef.current = true;
					return 1;
				}
				return next;
			});
		}
	});

	return (
		<mesh>
			<tubeGeometry
				args={[
					new THREE.CatmullRomCurve3(
						visiblePoints.length > 1 ? visiblePoints : [start, end]
					),
					100,
					thickness,
					8,
					false,
				]}
			/>
			<meshStandardMaterial
				color={color}
				transparent
				opacity={0.8}
				emissive={color}
				emissiveIntensity={2.5}
				roughness={0.2}
				metalness={0.9}
			/>
		</mesh>
	);
}
