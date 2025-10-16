import { useMemo, useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useLoadingStore } from "@/hooks/useLoadingStore";

const tips = [
  {tip: "💡 Swipe left/right to explore NoveXperience/HiveXperience.", gif: '/gif/swipeLeft.webm'},
  {tip: "🌌 Shake your phone to see something cool!", gif: '/gif/swipeLeft.webm'},
  {tip: "✨ Discover interactive 3D stories.", gif: '/gif/swipeLeft.webm'},
  {tip: "🚀 Experience the future of digital immersion.", gif: '/gif/swipeLeft.webm'},
  {tip: "🎧 Turn up your sound for the best experience.", gif: '/gif/swipeLeft.webm'}
];

export default function LoadingPage() {
	const progress = useLoadingStore((state) => state.progress);
	const [displayProgress, setDisplayProgress] = useState(0);
	const [visible, setVisible] = useState(true);
	const [shadow, setShadow] = useState(false);
	const [ready, setReady] = useState(false);
	const [tip, setTip] = useState(tips[0]);

	// Rotate random tips every 3 seconds
	useEffect(() => {
		const interval = setInterval(() => {
		setTip(tips[Math.floor(Math.random() * tips.length)]);
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

	const handleStart = () => {
		setVisible(false);
		setTimeout(() => {
		setReady(false);
		}, 2000);
	};

	return (
		<div
			className={`fixed top-0 left-0 w-screen h-dvh flex flex-col justify-center items-center bg-black text-white transition-all duration-500 ${
				visible ? "opacity-100 z-[9999]" : "opacity-0 pointer-events-none"
		}`}
		>
		<div className="flex flex-col w-full justify-center items-center gap-8">
			<video 
				src={tip.gif}
				autoPlay
				loop
				muted
				className="border-1 border-gray-800 rounded-2xl p-10"
			/>
			<p className="text-sm text-gray-400 font-[Montserrat] text-center">{ tip.tip }</p>

			{/* {ready && ( */}
			<button
				onClick={handleStart}
				className={`mt-4 px-6 py-2 border-1 rounded-full text-sm transition-all duration-300  ${ready ? 'cursor-pointer border-white hover:bg-white hover:text-black' : 'cursor-not-allowed text-gray-700 border-gray-700'}`}
				disabled={!ready}
			>
				Start Experience
			</button>
			{/* )} */}
		</div>

		{/* Small spinner bottom-left */}
		{displayProgress < 100 && (
			<div className="absolute bottom-6 left-6 flex items-center gap-2 text-xs text-gray-500">
			<div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
			{/* <span>Loading...</span> */}
					{/* Progress number */}
				<div className="font-[beba] flex flex-col items-center gap-5 text-white text-xl">
					{Math.floor(displayProgress)}
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
		)}
		</div>
	);
}

function CircleProgress({ progress, shadow }) {
	const radius = 60;
	const strokeWidth = 2;
	const normalizedRadius = radius - strokeWidth * 0.5;
	const circumference = normalizedRadius * 2 * Math.PI;

	const { animatedProgress } = useSpring({
		animatedProgress: progress,
		config: { tension: 100, friction: 25 },
	});

	return (
		<svg
		width={radius * 2 + 20}
		height={radius * 2 + 20}
		viewBox={`0 0 ${radius * 2 + 20} ${radius * 2 + 20}`}
		style={{ transform: "rotate(-90deg)" }}
		>
		<defs>
			<filter id="white-glow" x="-50%" y="-50%" width="200%" height="200%">
			<feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="white" floodOpacity="1" />
			</filter>
		</defs>

		<circle
			fill="transparent"
			strokeWidth={strokeWidth}
			stroke="#333"
			r={normalizedRadius}
			cx={(radius * 2 + 20) / 2}
			cy={(radius * 2 + 20) / 2}
		/>

		<animated.circle
			stroke={shadow ? "#fff" : "#666"}
			fill="transparent"
			strokeWidth={strokeWidth}
			strokeDasharray={`${circumference} ${circumference}`}
			style={{
			strokeDashoffset: animatedProgress.to(
				(p) => circumference - (p / 100) * circumference
			),
			filter: shadow ? "url(#white-glow)" : "none",
			}}
			r={normalizedRadius}
			cx={(radius * 2 + 20) / 2}
			cy={(radius * 2 + 20) / 2}
		/>
		</svg>
	);
}
