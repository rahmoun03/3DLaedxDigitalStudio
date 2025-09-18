
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useGLTF } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";

import SceneManager from "./pages/SceneManager";
import LoadingPage from "./Loading";
import { ResponsiveCamera, Lights, LoaderBridge } from "./Laedx";
import HiveTransition from "./components/three/HiveTransition";
import ScrollSwipeProgress from "@/components/ScrollProgress";
import Home from "./components/ui/Home";
import ComingSoon from '@/pages/ComingSoon/index';

function App() {
	useGLTF.preload('/models/bee/source/Bee.glb');

	return (
		<>
			{/* <ScrollSwipeProgress />
			<LoadingPage />
			<Canvas
				camera={{ position: [0, 1.3, 5] , fov: 55 }}
				style={{ 
					height: '100vh', 
					background: "#000",
				}}
			>
				<Suspense fallback={null}>
					<ResponsiveCamera />
					<LoaderBridge />
					<Lights />
					<OrbitControls/>
					<SceneManager />
				</Suspense>
			</Canvas> */}
			

			{/* UI/UX */}
			{/* <Home /> */}
			<ComingSoon />
		</>
	)
}

export default App
