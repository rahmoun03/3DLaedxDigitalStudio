import { Suspense, useEffect, useState } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Canvas , useLoader} from "@react-three/fiber";
import { Helper, useGLTF, useTexture } from "@react-three/drei";
import { OrbitControls, Stats } from "@react-three/drei";
import { AudioLoader } from "three";
import { Fluid } from '@whatisjery/react-fluid-distortion';
import { EffectComposer } from '@react-three/postprocessing';


// pages
import HomeScene from "@/pages/LaedxDigitalStudio/scene";
import HiveXperience from "@/pages/HiveXperience/scene";

// UI/UX
import LaedxDigitalStudioUI from "@/pages/LaedxDigitalStudio";
// import HiveXperienceUI from "@/pages/HiveXperience";

// components
import LoadingPage from "./Loading";
import { ResponsiveCamera, Lights, LoaderBridge } from "./Laedx";
import ScrollSwipeProgress from "@/components/ui/ScrollProgress";
import SciFiLoader from "@/components/ui/SciFiLoader";


function App() {
	// useGLTF.preload("/models/bee/source/Bee.glb");
	useTexture.preload("/textures/worldmap/alpha.jpg");
	// useTexture.preload("/models/bee/textures/gltf_embedded_0.png");
	useLoader(AudioLoader, '/sounds/bee-flying.mp3');
	useLoader(AudioLoader, "/sounds/stone.wav");
	useLoader(AudioLoader, '/sounds/buzz.mp3');
	useLoader(AudioLoader, "/sounds/spacecraft.mp3");
	useGLTF.preload("/models/Opsmall_rock.glb");
	useGLTF.preload("/models/OpX.glb");
	useGLTF.preload("/models/hologram_projector_optimized.glb");
	useGLTF.preload("/models/OpBeeV3.glb");

	const [started, setStarted] = useState(false);

	console.log("App called !!!");

	return (
	<>
		<Router>
			<Routes>
				
				<Route
					path='/'
					element={
						<>
							<ScrollSwipeProgress />
							<LoadingPage onStart={() => setStarted(true)} />
							<Canvas
								camera={{ position: [0, 0, 5], fov: 55 }}
								style={{
									height: "100dvh",
									background: "#000",
								}}
							>
								<Suspense fallback={null}>
									<ResponsiveCamera />
									<LoaderBridge />
									<Lights />
									{/* <OrbitControls /> */}
									<HomeScene />
									{/* {started && ( */}
									{/* )} */}
									{/* <Stats /> */}
									{/* helper */}
									{/* <axesHelper /> */}
									{/* <gridHelper /> */}

									{/* <EffectComposer>
										<Fluid />
									</EffectComposer> */}
								</Suspense>
							</Canvas>

							{/* UI/UX */}
							<LaedxDigitalStudioUI />
						</>
					}
				/>



				<Route
					path='/hivexperience'
					element={
						<>
							<Canvas
								camera={{ position: [0, 0, 10], fov: 55 }}
								style={{
									height: "100dvh",
								}}
							>
								<Suspense fallback={null}>
									{/* <ResponsiveCamera /> */}
									<LoaderBridge />
									<OrbitControls />
									<HiveXperience />
									{/* <Stats /> */}
								</Suspense>
							</Canvas>

							{/* UI/UX */}
							{/* <LaedxDigitalStudioUI /> */}
						</>
					}
				/>



				<Route
					path='/novexperience'
					element={
						<>
							<Canvas
								camera={{ position: [0, 0, 5], fov: 55 }}
								style={{
									height: "100dvh",
									background: "#000",
								}}
							>
								<Suspense fallback={null}>
									<ResponsiveCamera />
									<LoaderBridge />
									<Lights />
									{/* <OrbitControls /> */}
									{started && (
										<HiveXperience />
									)}
									{/* <Stats /> */}
								</Suspense>
							</Canvas>

							{/* UI/UX */}
							{/* <LaedxDigitalStudioUI /> */}
						</>
					}
				/>
				<Route
					path='/test'
					element={
						<>
							<SciFiLoader />
						</>
					}
				/>



			</Routes>
		</Router>

	</>
	);
}

export default App;
