import Footer from "./components/Footer";
import Header from "./components/Header";
import LdsContent from "./components/LdsContent";
import HiveContent from "./components/HiveContent";
import NoveContent from "./components/NoveContent";
import ScrollProgress from '../ScrollProgress';
import { useSections } from "../../Laedx";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
	const { products } = useSections();

	const activeProduct = products.find((p) => p.active)?.name;

	const sectionsMap = {
		Home: <LdsContent />,
		HiveXperience: <HiveContent />,
		NoveXperience: <NoveContent />,
	};

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
