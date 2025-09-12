import React, { useEffect, useRef } from "react";
import { useProgressStore } from "../zustand/useProgressStore";
import { useSections } from "../Laedx";

export default function ScrollSwipeProgress({
	step = 10,
	sensitivity = 0.08,
	idleDelay = 180,
	stepDuration = 200,
	max = 100,
}) {
	const { setProgressRight, setProgressLeft, progressRightRef, progressLeftRef } = useProgressStore()
	const { products, setActiveProduct } = useSections();


	const isDecayingRef = useRef(false);
	const idleTimeoutRef = useRef(null);
	const touchStartX = useRef(0);
	const pointerStartX = useRef(0);

	const setProgressValue = (direction, value) => {
		const clamped = Math.max(0, Math.min(max, value))
		if (direction === "right") {
			progressRightRef.current = clamped // updates ref for R3F
			setProgressRight(clamped)          // optional: updates UI bar
			if(clamped > 90) {
				setActiveProduct('HiveXperience')
			}
		} else {
			progressLeftRef.current = clamped
			setProgressLeft(clamped)
			if(clamped > 90) {
				setActiveProduct('NoveXperience')
			}
		}
	}

	const cancelDecayAndIdle = () => {
		if (idleTimeoutRef.current) {
			clearTimeout(idleTimeoutRef.current);
			idleTimeoutRef.current = null;
		}
		isDecayingRef.current = false;
	};

	useEffect(() => {
		// --- Wheel (desktop horizontal scroll) ---
		const onWheel = (e) => {
			const delta = e.deltaY || 0;
			if (delta === 0) return;
			const deltaPercent = Math.abs(delta) * sensitivity;

			if (delta > 0) {
				setProgressValue("right", progressRightRef.current + deltaPercent);
				setProgressValue("left", 0);
			} else {
				setProgressValue("left", progressLeftRef.current + deltaPercent);
				setProgressValue("right", 0);
			}

			resetIdleDecay();
		};

		// --- Touch events (mobile) ---
		const onTouchStart = (e) => {
			touchStartX.current = e.touches[0].clientX;
			cancelDecayAndIdle();
		};

		const onTouchMove = (e) => {
			const deltaX = e.touches[0].clientX - touchStartX.current;
			const deltaPercent = (Math.abs(deltaX) / window.innerWidth) * 100;

			if (deltaX < 0) {
				setProgressValue("right", deltaPercent);
				setProgressValue("left", 0);
			} else {
				setProgressValue("left", deltaPercent);
				setProgressValue("right", 0);
			}

			resetIdleDecay();
		};

		const onTouchEnd = () => resetIdleDecay();

		// --- Pointer events (desktop / tablets) ---
		const onPointerDown = (e) => {
			pointerStartX.current = e.clientX;
			cancelDecayAndIdle();
		};

		const onPointerMove = (e) => {
			if (pointerStartX.current === 0) return;
			const deltaX = e.clientX - pointerStartX.current;
			const deltaPercent = (Math.abs(deltaX) / window.innerWidth) * 100;

			if (deltaX < 0) {
				setProgressValue("right", deltaPercent);
				setProgressValue("left", 0);
			} else {
				setProgressValue("left", deltaPercent);
				setProgressValue("right", 0);
			}

			resetIdleDecay();
		};

		const onPointerUp = () => {
		pointerStartX.current = 0;
		resetIdleDecay();
		};

		// Attach listeners
		window.addEventListener("wheel", onWheel, { passive: true });
		window.addEventListener("touchstart", onTouchStart, { passive: true });
		window.addEventListener("touchmove", onTouchMove, { passive: true });
		window.addEventListener("touchend", onTouchEnd, { passive: true });
		window.addEventListener("pointerdown", onPointerDown);
		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", onPointerUp);

		return () => {
			window.removeEventListener("wheel", onWheel);
			window.removeEventListener("touchstart", onTouchStart);
			window.removeEventListener("touchmove", onTouchMove);
			window.removeEventListener("touchend", onTouchEnd);
			window.removeEventListener("pointerdown", onPointerDown);
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
			cancelDecayAndIdle();
		};
	}, [sensitivity, idleDelay]);

	const resetIdleDecay = () => {
		if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
		isDecayingRef.current = false;
		idleTimeoutRef.current = setTimeout(() => startDecay(), idleDelay);
	};

	const startDecay = () => {
		if (isDecayingRef.current) return;
		isDecayingRef.current = true;

		(async function decayLoop() {
		await wait(60);
		while (
			isDecayingRef.current &&
			(progressRightRef.current > 0 || progressLeftRef.current > 0)
		) {
			if (progressRightRef.current > 0)
			setProgressValue("right", progressRightRef.current - step);
			if (progressLeftRef.current > 0)
			setProgressValue("left", progressLeftRef.current - step);
			await wait(stepDuration + 80);
		}
		isDecayingRef.current = false;
		})();
	};

	function wait(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	return (
		<div className="fixed left-0 top-0 w-full h-4 z-50 flex flex-col space-y-1 justify-center items-center">
			<div
				className="h-1 bg-blue-500 transition-[width] ease-out rounded-xl"
				style={{
					width: `${progressRightRef.current}%`,
					transitionDuration: `${stepDuration}ms`,
				}}
			/>
			<div
				className="h-1 bg-orange-500 transition-[width] ease-out rounded-xl"
				style={{
					width: `${progressLeftRef.current}%`,
					transitionDuration: `${stepDuration}ms`,
				}}
			/>
		</div>
	);
}
