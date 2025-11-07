import { useMemo, useState, useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useLoadingStore } from "@/hooks/useLoadingStore";

const tips = [
  {id: 1, tip: "💡 Swipe from left to right to explore NoveXperience.", gif: '/gif/swipeLeft.webm'},
  {id: 2, tip: "💡 Swipe from right to left to explore HiveXperience.", gif: '/gif/swipeLeft.webm'},
  {id: 3, tip: "🌌 Shake your phone to see something cool!", gif: '/gif/shakePhone.webm'},
  {id: 4, tip: "🎧 Turn up your sound for the best experience.", gif: '/gif/volumeUp.webm'},
//   {id: 5, tip: "🚀 Experience the future of digital immersion.", gif: '/gif/swipeLeft.webm'}
];


function useFitText(minFont = 12, maxFont = 200) {
	const ref = useRef(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const resize = () => {
			const parent = el.parentElement;
			if (!parent) return;
			const parentWidth = parent.offsetWidth;
			const textLength = el.textContent.length;
			console.log('parent width : ',  parentWidth);
			console.log('text length : ',  textLength);
			const newSize = Math.min(maxFont, Math.max(minFont, parentWidth / (textLength * 0.4)));
			el.style.fontSize = `${newSize}px`;
		};

		resize();
		const observer = new ResizeObserver(resize);
		observer.observe(el.parentElement);

		return () => observer.disconnect();
	}, [minFont, maxFont]);

	return ref;
}

export default function LoadingPage({ onStart }) {
	const progress = useLoadingStore((state) => state.progress);
	const [displayProgress, setDisplayProgress] = useState(0);
	const [visible, setVisible] = useState(true);
	const [shadow, setShadow] = useState(false);
	const [ready, setReady] = useState(false);
	const [tip, setTip] = useState(tips[0]);
	const textRef = useFitText();


	// Rotate random tips every 3 seconds
	useEffect(() => {
		let next = 0;
		const interval = setInterval(() => {
			setTip(tips[next]);
			next = (next + 1) % tips.length;
		}, 4000);
		return () => clearInterval(interval);
	}, []);


	useEffect(() => {
		// console.log('real progress : ', progress)
		let raf;
		const animate = () => {
			setDisplayProgress((prev) => {
				
				if (progress === 0) {
					return Math.min(prev + 0.2, 95);
				}

				if (prev >= 99) {
					return 100;
				}

				if ((progress - prev) > 0) {
					
					return prev + ( progress - prev ) * 0.25;
				}

				return prev;
			});
			raf = requestAnimationFrame(animate);
		};
		raf = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(raf);
	}, [progress]);

	// Detect when loading finishes
	useEffect(() => {
		if (displayProgress >= 100) {
		const delay = setTimeout(() => {
			setShadow(true);
			setReady(true);
		}, 1000);
		return () => clearTimeout(delay);
		}
	}, [displayProgress]);

	const handleStart = async () => {

		// Ask for motion permission (iOS only)
		if (
			typeof DeviceMotionEvent !== "undefined" &&
			typeof DeviceMotionEvent.requestPermission === "function"
		) {
			try {
				const response = await DeviceMotionEvent.requestPermission();
				if (response === "granted") {
					console.log("✅ Motion permission granted on iOS");
				} else {
					console.warn("❌ Motion permission denied by user");
				}
			} catch (err) {
				console.error("⚠️ Motion permission request failed:", err);
			}
		} else {
			console.log("ℹ️ DeviceMotionEvent permission not required or not supported on this device");
		}
		
		if (onStart) onStart();
		setVisible(false);
		setReady(false);
	};

	return (
		<div
			className={`fixed top-0 left-0 w-screen h-dvh flex flex-col justify-center md:p-4 items-center bg-[#141414] text-white transition-opacity duration-2000 z-[9999] ${
					visible ? "opacity-100 " : "opacity-0 pointer-events-none"
			}`}
		>
			<div className="flex flex-col w-full justify-center items-center gap-8 ">
				{/* <img src="/logo/DarkLogo.png" alt="LDS Logo" className={`w-[480px] ${visible ? "scale-100" : "scale-220 md:scale-200 translate-y-33 md:translate-y-25"} transition-all duration-1000 ease-in`} /> */}

				<button
					onClick={handleStart}
					disabled={!ready}
					className={`
						relative font-[Montserrat] rounded-full text-sm font-bold tracking-[0.5rem] uppercase
						px-10 py-3 transition-all duration-200 ease-in-out
						${ready
						? 'cursor-pointer text-cyan-200 border-t border-b border-transparent hover:[background-size:10px_10px,10px_10px,cover] active:[filter:hue-rotate(250deg)]'
						: `cursor-not-allowed text-gray-600 border-gray-700 ${visible ? "opacity-50" : "opacity-0"}`}
					`}
					style={{
						'--main-color': 'rgb(128, 222, 234)',
						'--main-bg-color': 'rgba(128, 222, 234,0.36)',
						'--pattern-color': 'rgba(128, 222, 234,0.073)',
						filter: 'hue-rotate(0deg)',
						backgroundImage: `
							radial-gradient(circle, var(--main-bg-color) 0%, rgba(0,0,0,0) 95%),
							linear-gradient(var(--pattern-color) 1px, transparent 1px),
							linear-gradient(to right, var(--pattern-color) 1px, transparent 1px)
						`,
						backgroundSize: 'cover, 15px 15px, 15px 15px',
						backgroundPosition: 'center center, center center, center center',
						borderImage: 'radial-gradient(circle, var(--main-color) 0%, rgba(0,0,0,0) 100%) 1',
					}}
				>
					START
				</button>

			</div>

			<div className={`absolute bottom-6 flex items-center gap-2 text-xs text-gray-500 w-full ${visible ? "opacity-100 " : "opacity-0 pointer-events-none"}`}>

				<div className="flex flex-col justify-center items-center w-full px-4">
					{/* <span 
						className={`font-[beba] flex flex-col justify-start items-start gap-5 text-gray-500 md:text-3xl text-xl transition-all duration-600 `}
						// style={{transform: `translateX(${Math.floor(displayProgress) >= 95 ? 95 : Math.floor(displayProgress)}%)`}}
					>
						{Math.floor(displayProgress)}%
					</span> */}
					{/* <span
						ref={textRef}
						className="font-[beba] uppercase leading-none tracking-wide whitespace-nowrap"
						style={{textShadow: "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff"}}
					>
						LAEDX DIGITAL STUDIO
					</span> */}
					{/* progress bar */}
					{/* <div className="w-full h-6 bg-gray-700  border-1 overflow-hidden" > */}
						<SciFiProgressBar progress={displayProgress}/>
					{/* </div> */}
				</div>

				<style>{`
					[data-progress] {
						transition: clip-path 0.3s linear;
					}
					/* Mobile: fill bottom → top */
					@media (max-width: 767px) {
						[data-progress] {
							clip-path: inset(calc(100% - var(--progress)) 0 0 0);
						}
					}
					/* Desktop: fill left → right */
						@media (min-width: 768px) {
						[data-progress] {
							clip-path: inset(0 calc(100% - var(--progress)) 0 0);
						}
					}
				`}</style>
			</div>
		</div>
	);
}


function SciFiProgressBar({ progress = 0 }) {
	const totalSegments = 50;
	const activeSegments = Math.floor((progress / 100) * totalSegments);

	// useEffect(() => {
	// 	console.log('progress : ', progress);
	// 	console.log('active segments : ', activeSegments);
		
	// }, [progress])

	return (
		<div className="w-full mx-auto mt-8 p-2 rounded-lg">
			<div className="flex gap-[2px] justify-between">
				{Array.from({ length: totalSegments }).map((_, i) => {
					const active = i < activeSegments;
					return (
						<div
							key={i}
							className={`h-5 flex-1 rounded-sm transition-all duration-300 ${
								active
								? "bg-cyan-100 shadow-[0_0_8px_rgba(0,255,255,0.8)]"
								: "bg-gray-800 border border-cyan-800/30"
							}`}
							style={{
								transform: active ? "scaleY(1.1)" : "scaleY(1)",
								transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
							}}
						/>
					);
				})}
			</div>

			<div className="text-center mt-2 text-cyan-50 text-sm font-mono tracking-widest">
				{progress.toFixed(0)}%
			</div>
		</div>
	);
}

