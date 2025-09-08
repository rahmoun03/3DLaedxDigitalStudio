// import { Html, useProgress} from '@react-three/drei';
import { useMemo, useState, useEffect, use } from 'react';
import { useSpring, animated } from "@react-spring/web";
import { useProgressStore } from './Laedx';



export default function LoadingPage() {
	const progress = useProgressStore((state) => state.progress);
	const [visible, setVisible] = useState(true);
	const [shadow, setShadow] = useState(false);
	const [finish, setFinish] = useState(false);

	useEffect(() => {
		if (progress >= 100) {
			// Wait 1s before starting fade
			const delayTimer = setTimeout(() => {
				setShadow(true);
				setTimeout(() => setVisible(false), 500)
				setTimeout(() => setFinish(true), 2800);
			}, 2000);
			return () => clearTimeout(delayTimer);
		}
	}, [progress, finish]);



	useEffect(() => {
		console.log('Visible now is : ', !visible ? 'enabled' : 'disabled');
		console.log('progress now is : ', progress);

		// if(progress >= 100 && shadow)
		// {
		// 	const ti = setTimeout(() => {

		// 	}, 1000)
		// }
	}, [visible, progress])

	return (
		<div 
			style={{
				zIndex: 9999,
				transition: 'opacity 2500ms linear'
			}}
			className={`${finish ? 'hidden' : 'flex'} ${visible ? 'opacity-100' : 'opacity-0'} fixed top-0 left-0 w-screen h-screen bg-black`}
		>
			<div
				className={`w-full h-full flex justify-center items-center`}
			>
				<CircleProgress progress={progress} shadow={shadow} />
			</div>
		</div>
	);
}


function CircleProgress({ progress , shadow}) {
	const radius = 179;
	const strokeWidth = 1;
	const normalizedRadius = radius - strokeWidth * 0.5;
	const circumference = normalizedRadius * 2 * Math.PI;

	const { animatedProgress } = useSpring({
		animatedProgress: progress,
		config: { tension: 100, friction: 25 },
	});

	const glow = useMemo(() => {
		const p = animatedProgress.to((p) => {return p});
		console.log('Animated Progress : ', p);
		
		return p >= 100
	}, [animatedProgress]);

	return (
	<svg
		width={radius * 2 + 100}
		height={radius * 2 + 100}
		viewBox={`0 0 ${radius * 2 + 100} ${radius * 2 + 100}`}
		style={{
			transform: "rotate(-90deg)",
			display: "block", // Prevent extra spacing
			margin: "auto" // Center in container
		}}
	>
		{/* Glow filter */}
		<defs>
			<filter id="white-glow" x="-50%" y="-50%" width="200%" height="200%">
			<feDropShadow dx="0" dy="0" stdDeviation={10} floodColor="white" floodOpacity={1}/>
			</filter>
		</defs>

		{/* Background circle */}
		<circle
			fill="transparent"
			strokeWidth={strokeWidth}
			r={normalizedRadius}
			cx={(radius * 2 + 100) / 2}
			cy={(radius * 2 + 100) / 2}
		/>

		{/* Animated progress circle */}
		<animated.circle
			stroke={shadow ? '#ffffff79' : '#47454587'}
			fill="transparent"
			strokeWidth={strokeWidth}
			strokeDasharray={`${circumference} ${circumference}`}
			style={{
			strokeDashoffset: animatedProgress.to(
				(p) => circumference - (p / 100) * circumference
			),
			filter: shadow ? "url(#white-glow)" : "none",
			transition: 'all 200ms linear'
			}}
			r={normalizedRadius}
			cx={(radius * 2 + 100) / 2}
			cy={(radius * 2 + 100) / 2}
		/>
	</svg>

	);
}
