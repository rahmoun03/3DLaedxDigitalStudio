import React, { useState, useEffect } from "react";

export default function SciFiLoader() {

	const [progress, setProgress] = useState(0);
	const radius = 60;
	const stroke = 8;
	const normalizedRadius = radius - stroke * 2;
	const circumference = normalizedRadius * 2 * Math.PI;
	const strokeDashoffset =
		circumference - (progress / 100) * circumference;


	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((p) => (p < 100 ? p + 1 : 100));
		}, 60);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="relative flex flex-col items-center justify-center w-full h-screen bg-black text-white overflow-hidden">
			{/* Background Glow */}
			<div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 via-transparent to-purple-900/20 animate-pulse blur-3xl" />

			{/* Outer Glow Ring */}
			<div className="absolute w-[220px] h-[220px] rounded-full border border-cyan-500/20 shadow-[0_0_30px_5px_rgba(0,255,255,0.1)] animate-spin-slow" />

			{/* SVG Ring */}
			<svg
				height={radius * 2}
				width={radius * 2}
				className="rotate-[-90deg] relative z-10"
			>
				{/* Background track */}
				<circle
					stroke="#0f172a"
					fill="transparent"
					strokeWidth={stroke}
					r={normalizedRadius}
					cx={radius}
					cy={radius}
				/>
				{/* Animated progress ring */}
				<circle
					stroke="url(#gradient)"
					fill="transparent"
					strokeWidth={stroke}
					strokeDasharray={circumference + " " + circumference}
					strokeDashoffset={strokeDashoffset}
					r={normalizedRadius}
					cx={radius}
					cy={radius}
					strokeLinecap="round"
					className="transition-all duration-300 ease-linear"
				/>
				{/* Gradient definition */}
				<defs>
					<linearGradient id="gradient">
						<stop offset="0%" stopColor="#00ffff" />
						<stop offset="100%" stopColor="#8b5cf6" />
					</linearGradient>
				</defs>
			</svg>

			{/* Inner Core */}
			<div className="absolute w-[80px] h-[80px] rounded-full bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-md" />

			{/* Text */}
			<div className="absolute flex flex-col items-center justify-center mt-2 z-20">
				<span className="font-mono text-3xl tracking-widest text-cyan-400 drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">
					{Math.floor(progress)}%
				</span>
				<span className="text-xs uppercase text-purple-300 tracking-[0.3em] mt-1">
					Initializing
				</span>
			</div>

			{/* Subtle moving lines for sci-fi effect */}
			<div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-scan" />
		</div>
	);
}

/* Add custom animation in your global.css or Tailwind config: */

/* tailwind.config.js */
export const theme = {
	extend: {
		animation: {
			'spin-slow': 'spin 10s linear infinite',
			'scan': 'scan 2s linear infinite',
		},
		keyframes: {
			scan: {
				'0%': { transform: 'translateX(-100%)' },
				'100%': { transform: 'translateX(100%)' },
			},
		},
	},
};
