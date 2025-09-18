import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";


import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import StickerPeel from "../../components/ui/StickerPeel";
import ldsLogo from "/logo/LdsLogo.png";
import HivelogoWhite from "/logo/HivelogoWhite.svg";
import NovelogoWhite from "/logo/Novelogowhite.svg";


function useWindowSize() {
	const isClient = typeof window !== "undefined";
	const [size, setSize] = useState({
		width: isClient ? window.innerWidth : 1200,
		height: isClient ? window.innerHeight : 800,
	});

	useEffect(() => {
		if (!isClient) return;
		const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, [isClient]);

	return size;
}




export function ComingSoonText() {
  return (
    <div className="relative mb-50 flex items-center justify-center w-full h-full font-[Audiowide]">
      <h1
        className="text-4xl md:text-9xl font-extrabold tracking-wide absolute"
        style={{
          color: "black",
          WebkitTextStroke: "0.3px rgb(218, 218, 218)",
        }}
      >
        COMING SOON
      </h1>

      {/* Top layer: pure white text with circular mask */}
      <motion.h1
        className="text-4xl md:text-9xl font-extrabold tracking-wide absolute text-white font-[Audiowide]"
		style={{
			WebkitMaskImage: "radial-gradient(circle, white 50%, transparent 51%)",
			WebkitMaskRepeat: "no-repeat",
			WebkitMaskSize: "300px 300px",
			WebkitMaskPosition: "-50% 50%",
		  }}
		  
        animate={{
          WebkitMaskPosition: ["-50% 50%", "0% 50%","100% 50%", "150% 50%", "100% 50%", "50% 50%", "0% 50%", "-50% 50%"],
          WebkitMaskSize: ["300px 300px", "400px 400px", "500px 500px", "600px 600px", "700px 700px", "600px 600px", "500px 500px", "400px 400px", "300px 300px"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        COMING SOON
	</motion.h1>
    </div>
  );
}


const ComingSoonBody = () => {
	
	const { width } = useWindowSize();

	// sticker size responsive
	const stickerWidth = useMemo(() => {
		if (width >= 1280) return 300; // xl / desktop
		if (width >= 768) return 240;  // md / tablet
		return 160;                    // sm / mobile
	}, [width]);
  
	// compute responsive initial positions
	const { ldsPosition, hivePosition, novePosition } = useMemo(() => {
		console.log(width);
		if (width >= 1280) {
			// desktop: horizontal layout
			return {
				ldsPosition: { x: 0, y: 200 },
				hivePosition: { x: 400, y: 200 },
				novePosition: { x: -400, y: 200 },
			};
		}
		if (width >= 768) {
			// tablet: tighter horizontal layout
			return {
				ldsPosition: { x: 0, y: 140 },
				hivePosition: { x: 260, y: 140 },
				novePosition: { x: -260, y: 140 },
			};
		}
		// mobile: stack vertically (centered x)
		return {
			ldsPosition: { x: 0, y: 100 },
			hivePosition: { x: 100, y: 200 },
			novePosition: { x: -100, y: 200 },
		};
	}, [width]);


	useEffect(() => {
		console.log('hivePosition', hivePosition);
		console.log('novePosition', novePosition);
		console.log('ldsPosition', ldsPosition);
	}, [ldsPosition, hivePosition, novePosition]);
	
	return (
		<div className="flex-1 flex items-center justify-center relative w-full h-full">
			<ComingSoonText />
			<StickerPeel
				imageSrc={ldsLogo}
				width={stickerWidth}
				rotate={0}
				peelBackHoverPct={10}
				peelBackActivePct={20}
				shadowIntensity={0.6}
				lightingIntensity={0.1}
				initialPosition={ldsPosition}
				/>
			<StickerPeel
				imageSrc={HivelogoWhite}
				width={stickerWidth}
				rotate={0}
				peelBackHoverPct={10}
				peelBackActivePct={20}
				shadowIntensity={0.6}
				lightingIntensity={0.1}
				initialPosition={hivePosition}
			/>
			<StickerPeel
				imageSrc={NovelogoWhite}
				width={stickerWidth}
				rotate={0}
				peelBackHoverPct={10}
				peelBackActivePct={20}
				shadowIntensity={0.6}
				lightingIntensity={0.1}
				initialPosition={novePosition}
			/>
		</div>
	);
}


export default function ComingSoon() {

	return (
		<section className="fixed top-0 left-0 w-screen h-dvh max-h-md flex flex-col bg-[#000] p-4 justify-between overflow-hidden">
			<Header />
			<ComingSoonBody />
			<Footer />
		</section>
	);
}
