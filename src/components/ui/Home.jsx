import Footer from "./components/Footer";
import Header from "./components/Header";
import LdsContent from "./components/LdsContent";
import HiveContent from "./components/HiveContent";
import NoveContent from "./components/NoveContent";
import ScrollProgress from '../ScrollProgress';
import { useSections } from "../../Laedx";
import { AnimatePresence, motion } from "framer-motion";
import { useProgressStore } from "../../zustand/useProgressStore";
import { useEffect } from "react";


const BlankPage = () => {
	
	return (
		<motion.section
			className="w-full h-full"
			initial={{ opacity: 0, y: 30 }} // Start faded & slightly down
			animate={{ opacity: 1, y: 0 }} // Fade in & move up
			exit={{ opacity: 0, y: -30 }} // Fade out & move up
			transition={{ duration: 0.4, ease: "easeInOut" }}
		>
		</motion.section>
	);
}


export default function Home() {
	const { products } = useSections();

	let activeProduct = products.find((p) => p.active)?.name;
	const { progressRightRef, progressLeftRef } = useProgressStore.getState()


	const sectionsMap = {
		Home: <LdsContent />,
		HiveXperience: <HiveContent />,
		NoveXperience: <NoveContent />,
		Noting: <BlankPage />
	};

	// useEffect(() => {
	// 	if(progressRightRef.current > 90) {
	// 		activeProduct = 'Noting';
	// 	}
	// 	if(progressLeftRef.current > 90) {
	// 		activeProduct = 'Noting';
	// 	}
	// }, [progressRightRef, progressLeftRef])


	return (
		<section className="fixed top-0 left-0 w-screen h-screen max-h-md flex flex-col p-4 justify-between overflow-hidden">
			<Header />
			<ScrollProgress />
			<div className="flex-1 flex items-center justify-center relative w-full h-full">
				<AnimatePresence mode="wait" className='h-full'>
					<motion.div
						key={activeProduct} 
						className='h-full'
					>
						{sectionsMap[activeProduct] || null}
					</motion.div>
				</AnimatePresence>
			</div>
			<Footer />
		</section>
	);
}
