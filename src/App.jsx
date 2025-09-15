
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from '@react-three/postprocessing';

import SceneManager from "./pages/SceneManager";
import LoadingPage from "./Loading";
import { ResponsiveCamera, Lights, LoaderBridge } from "./Laedx";
import HiveTransition from "./components/three/HiveTransition";
import ScrollSwipeProgress from "@/components/ScrollProgress";

function App() {

	return (
		<>
			<ScrollSwipeProgress />
			<LoadingPage />
			<Canvas
				camera={{ position: [0, 2, 5] , fov: 55 }}
				style={{ 
					height: '100vh', 
					background: "#000",
				}}
				shadows
			>
				<Suspense fallback={null}>
					<ResponsiveCamera />
					<LoaderBridge />
					{/* Lights */}
					<Lights activeProduct={'Home'} />
					{/* Post bloom for the hot rim */}
					<EffectComposer>
						<Bloom intensity={0.1} luminanceThreshold={0.2} />
					</EffectComposer>
					{/* <OrbitControls/> */}
					{/* Scene */}
					<SceneManager />
					<HiveTransition />
				</Suspense>
			</Canvas>

			{/* UI/UX */}
			{/* <Home /> */}
		</>
	)
}

export default App
