import { useRef, useState } from "react"
import { motion } from "framer-motion"
import VideoPlayer from "./VideoPlayer"

const LdsContent = () => {
	const [showVideo, setShowVideo] = useState(false)
	const holdTimer = useRef(null)

	const handleMouseDown = () => {
		console.log('hooooooold');
		
		holdTimer.current = setTimeout(() => {
			setShowVideo(true) // show our custom video
		}, 5000) // 10s hold
	}

	const handleMouseUp = () => {
		if (holdTimer.current) {
			clearTimeout(holdTimer.current)
			holdTimer.current = null
		}
	}

	return (
		<>
			<motion.section
				className="w-full h-full flex flex-col lg:flex-row p-2 py-8 lg:p-10 justify-between items-center text-gray-400 font-[JetBrains] mix-blending-normal"
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -30 }}
				transition={{ duration: 0.4, ease: "easeInOut" }}
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
			>
				{/* logo */}
				<motion.div
					initial={{ opacity: 0, x: -50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2, duration: 0.4 }}
				>
					<img src="/logo/LdsLogo.png" alt="LDS Logo" className="h-32" />
				</motion.div>

				{/* description */}
				<motion.div
					className="w-full lg:w-2/7 flex flex-col gap-4"
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2, duration: 0.4 }}
				>
					<div>
						<span>We are </span>
						<span className="text-white">Laedx Digital Studio (LDS)</span>
						<span>, part of the Laedx Group, headquartered in Marrakech.</span>
					</div>
					<span>
						We deliver high-quality digital solutions with a 96% international client retention rate.
						Our services include web & app development, UX/UI design, Salesforce, Mulesoft,
						ServiceNow, cybersecurity, and AI/ML.  
						Guided by our ETHICS values, we create lasting value for our clients and community.
					</span>
				</motion.div>
			</motion.section>

			{/* Custom video overlay */}
			{showVideo && (
				<VideoPlayer
				src="/videos/lds-promo.mp4" // put your video file in /public/videos/
				onClose={() => setShowVideo(false)}
				/>
			)}
		</>
	)
}

export default LdsContent
