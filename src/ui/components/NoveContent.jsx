import { motion } from "framer-motion";

const NoveContent = () => {
	
	return (
		<motion.section
			className="w-full flex flex-col lg:flex-row p-2 lg:p-10 justify-between items-center text-gray-400 font-[JetBrains] mix-blending-normal"
			initial={{ opacity: 0, y: 30 }} // Start faded & slightly down
			animate={{ opacity: 1, y: 0 }} // Fade in & move up
			exit={{ opacity: 0, y: -30 }} // Fade out & move up
			transition={{ duration: 0.4, ease: "easeInOut" }}
		>
			{/* logo */}
			<motion.div
				initial={{ opacity: 0, x: -50 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.2, duration: 0.4 }}
			>
				<img src="/logo/Novelogowhite.svg" alt="" className="h-28"/>
			</motion.div>

			{/* description */}
			<motion.div
				className="w-full lg:w-2/7 flex flex-col gap-4"
				initial={{ opacity: 0, x: 50 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.2, duration: 0.4 }}
			>
				<div>
					<span>Discover </span>
					<span className="text-white">NoveXperience</span>
					<span>, our dedicated service for crafting custom digital solutions.</span>
				</div>
				<span>
					NoveXperience partners with businesses to design and deliver innovative projects 
					tailored to their unique needs. From concept to deployment, we transform ideas into 
					high-impact solutions that drive growth, enhance user experience, and ensure lasting value.
				</span>
			</motion.div>
		</motion.section>
	);
}

export default NoveContent;