
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { OrbitControls, Stats } from "@react-three/drei";



import SceneManager from "./pages/SceneManager";
import LoadingPage from "./Loading";
import { ResponsiveCamera, Lights, LoaderBridge } from "./Laedx";
import ScrollSwipeProgress from "@/components/ui/ScrollProgress";	


// UI
import LaedxDigitalStudioUI from "./pages/LaedxDigitalStudio/index";


function App() {
	useGLTF.preload('/models/bee/source/Bee.glb');

	console.log('App called !!!')

	return (
		<>
			{/* <ScrollSwipeProgress /> */}
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
					<OrbitControls maxZoom={3} />
					<SceneManager />
					{/* <Stats /> */}
				</Suspense>
			</Canvas>
			

			{/* UI/UX */}
			<LaedxDigitalStudioUI />
			{/* <Home /> */}
			{/* <ComingSoon /> */}
		</>
	)
}

export default App
