import { motion } from "framer-motion";

const HiveContent = () => {
	
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
				<img src="/logo/HivelogoWhite.svg" alt="" className="h-28"/>
			</motion.div>


			{/* description */}
			<motion.div
				className="w-full lg:w-2/7 flex flex-col gap-4"
				initial={{ opacity: 0, x: 50 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.2, duration: 0.4 }}
			>
				<div>
					<span>Introducing </span>
					<span className="text-white">HiveXperience</span>
					<span>, our AI-powered recruitment and job matching platform.</span>
				</div>
				<span>
					HiveXperience connects talent with opportunities through intelligent matching,
					streamlining hiring for companies while helping professionals find their ideal roles.  
					With cutting-edge AI and a user-focused approach, we make recruitment faster, smarter, and more effective.
				</span>
			</motion.div>
		</motion.section>
	);
}

export default HiveContent;