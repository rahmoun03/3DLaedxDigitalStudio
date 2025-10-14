
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
// import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useGLTF } from "@react-three/drei";
import { OrbitControls, Stats } from "@react-three/drei";



import CustomCursor from "@/components/ui/CustomCursor";
import SceneManager from "./pages/SceneManager";
import LoadingPage from "./Loading";
import { ResponsiveCamera, Lights, LoaderBridge } from "./Laedx";
// import HiveTransition from "./components/three/HiveTransition";
import ScrollSwipeProgress from "@/components/ui/ScrollProgress";	
// import Home from "./components/ui/Home";

function App() {
	useGLTF.preload('/models/bee/source/Bee.glb');

	console.log('App called !!!')

	return (
		<>
			<ScrollSwipeProgress />
			{/* <CustomCursor /> */}
			<LoadingPage />
			<Canvas
				camera={{ position: [0, 0, 5] , fov: 55 }}
				style={{ 
					height: '100dvh', 
					background: "#000",
				}}
			>
				<Suspense fallback={null}>
					<ResponsiveCamera />
					<LoaderBridge />
					<Lights />
					{/* <OrbitControls/> */}
					<SceneManager />
					<Stats />
				</Suspense>
			</Canvas>
			

			{/* UI/UX */}
			{/* <Home /> */}
			{/* <ComingSoon /> */}
		</>
	)
}

export default App
