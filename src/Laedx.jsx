import React , { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useProgress } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';


// import LdsScene from "./sections/lds";
// import NoveScene from "./sections/Nove";
// import HiveScene from "./sections/Hive";

import LoadingPage from "./Loading";
import { useLoadingStore } from "@/hooks/useLoadingStore";
import { useSections } from "@/hooks/useSectionsStore";
import HiveTransition from './components/three/HiveTransition';

import Home from './components/ui/Home'; 

export function LoaderBridge() {
	const { progress } = useProgress();
	const setProgress = useLoadingStore((state) => state.setProgress);

	useEffect(() => {
		setProgress(progress); // sync with store
	}, [progress, setProgress]);

	return null; // nothing to render
}


export function ResponsiveCamera() {
	const { camera, size } = useThree();

	useEffect(() => {
		// Example: Adjust camera position or FOV based on width
		if (size.width < 768) {
			// Mobile
			camera.position.set(0, 0, 5);
			camera.fov = 60;
		} else if (size.width < 1280) {
			// Tablet
			camera.position.set(0, 0, 5);
			camera.fov = 55;
		} else {
			// Desktop
			camera.position.set(0, 0, 5);
			camera.fov = 55;
		}

		camera.updateProjectionMatrix();
	}, [size, camera]);

	return null; 
}

export function Lights() {

	return (
		<>
			{/* <ambientLight intensity={0.2} /> */}
			<pointLight position={[0, 0, 6]} intensity={8} color='white' />
		</>
	);
}
