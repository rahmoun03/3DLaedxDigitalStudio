import React, { useState, useEffect } from "react";

const CustomCursor = () => {
	const [position, setPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const move = (e) => {
			setPosition({ x: e.clientX, y: e.clientY });
		};
		window.addEventListener("mousemove", move);

		return () => {
			window.removeEventListener("mousemove", move);
		};
	}, []);

	return (
		<div
			className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference border border-white p-4 rounded-full duration-none"
			style={{
				transform: `translate(${position.x - 10}px, ${position.y - 10}px)`,
			}}
		>
			{/* Outer circle */}
			<div className="w-2 h-2 border-2 bg-white rounded-full" />
		</div>
	);
};

export default CustomCursor;
