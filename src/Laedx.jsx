import React , { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useProgress } from '@react-three/drei';
import LdsScene from "./sections/lds";
import NoveScene from "./sections/Nove";
import HiveScene from "./sections/Hive";
import CustomCursor from './components/CustomCursor'

import LoadingPage from "./Loading";
import { create } from "zustand";
import { EffectComposer, Bloom } from '@react-three/postprocessing'



import Home from './components/ui/Home'; 

export const useProgressStore = create((set) => ({
	progress: 0,
	setProgress: (p) => set({ progress: p }),
}));

export const useSections = create((set) => ({

	products: [
		{ name: "Home", active: true },
		{ name: "HiveXperience", active: false },
		{ name: "NoveXperience", active: false },
	],

	setActiveProduct: (name) =>
		set((state) => ({
		products: state.products.map((p) => ({
			...p,
			active: p.name === name,
		})),
	})),
}));


export function LoaderBridge() {
	const { progress } = useProgress();
	const setProgress = useProgressStore((state) => state.setProgress);

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
			camera.position.set(0, 2, 5);
			camera.fov = 60;
		} else if (size.width < 1280) {
			// Tablet
			camera.position.set(0, 2, 5);
			camera.fov = 55;
		} else {
			// Desktop
			camera.position.set(0, 2, 5);
			camera.fov = 55;
		}

		camera.updateProjectionMatrix();
	}, [size, camera]);

	return null; 
}


export default function Laedx() {

	const { products } = useSections();

	const activeProduct = products.find((p) => p.active)?.name;

	const sectionLight = {
		Home: '#F7EFC5',
		NoveXperience: '#D5F3FF',
		HiveXperience: '#FFC30B',
	};
	
	const sectionScene = {
		Home: <LdsScene />,
		NoveXperience: <NoveScene />,
		HiveXperience: <HiveScene />,
	};


	return (
		<>
			<LoadingPage />
			<Canvas
				camera={{ position: [0, 2, 5] , fov: 55 }}
				style={{ 
					height: '100vh', 
					background: "#000",
				}}
				shadows
			>
				{/* <LoadingPage /> */}
				<ResponsiveCamera />
				<Suspense fallback={null}>
					<LoaderBridge />

					{/* Lights */}
					<ambientLight intensity={1} />
					<pointLight 
						position={[0, 1.3, 0]}
						intensity={3.5}
						color={sectionLight[activeProduct] || '#f7efc5'}
						// color="#F7EFC5" 
						// color="#D5F3FF"
						// color="#FFC30B"
						castShadow
					/>
					<directionalLight position={[0, 50, 50]} color={sectionLight[activeProduct] || '#f7efc5'} />

					{/* Post bloom for the hot rim */}
					{/* <EffectComposer>
						<Bloom intensity={1} luminanceThreshold={0.2} luminanceSmoothing={0.025} />
					</EffectComposer> */}

					{/* <OrbitControls/> */}

					{/* Scene */}
					{/* <LdsScene /> */}
					{/* <NoveScene /> */}
					{/* <HiveScene /> */}
					{sectionScene[activeProduct]}
			
				</Suspense>
			</Canvas>
			<Home />
		</>
	);
}
