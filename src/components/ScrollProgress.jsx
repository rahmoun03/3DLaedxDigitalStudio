import React, { useEffect, useRef, useState } from "react";

/**
 * ScrollProgress (Horizontal)
 * - Works with pointer (recommended), touch fallback, and wheel
 * - Computes progress as percentage of the viewport width (so a full-width swipe ~100%)
 * - Two independent bars: "left" (right->left swipe) and "right" (left->right swipe)
 * - Bars decay step-by-step when the user stops interacting; interacting during decay stops it and resumes progress
 *
 * Usage: import and place <ScrollProgress /> at root of your app
 */
export default function ScrollProgress({
  step = 6, // percent reduced each decay step
  sensitivity = 1.0, // multiplier for how aggressive pixel->percent mapping is
  idleDelay = 180, // ms before decay begins
  stepDuration = 220, // ms for the width transition and wait between steps
  max = 100,
}) {
	const [progressLeft, setProgressLeft] = useState(0);
	const [progressRight, setProgressRight] = useState(0);

	const progressLeftRef = useRef(0);
	const progressRightRef = useRef(0);
	const isDecayingRef = useRef(false);
	const idleTimeoutRef = useRef(null);
	const lastXRef = useRef(null);
	const isPointerDownRef = useRef(false);

	// Update state + ref together
	const setProgressValue = (dir, value) => {
		const v = Math.max(0, Math.min(max, Number(value)));
		if (dir === "left") {
		progressLeftRef.current = v;
		setProgressLeft(v);
		} else {
		progressRightRef.current = v;
		setProgressRight(v);
		}
	};

	const wait = (ms) => new Promise((r) => setTimeout(r, ms));

	const cancelDecayAndIdle = () => {
		if (idleTimeoutRef.current) {
		clearTimeout(idleTimeoutRef.current);
		idleTimeoutRef.current = null;
		}
		isDecayingRef.current = false;
	};

	// Normalize pixel delta to viewport percentage
	const deltaPxToPercent = (px) => {
		const vw = Math.max(1, window.innerWidth || document.documentElement.clientWidth);
		return (Math.abs(px) / vw) * 100 * sensitivity;
	};

	const startDecay = () => {
		if (isDecayingRef.current) return;
		isDecayingRef.current = true;

		(async function decayLoop() {
		// small initial delay so UI doesn't feel jumpy
		await wait(60);
		while (
			isDecayingRef.current &&
			(progressLeftRef.current > 0 || progressRightRef.current > 0)
		) {
			if (progressLeftRef.current > 0) {
			setProgressValue("left", Math.max(0, progressLeftRef.current - step));
			}
			if (progressRightRef.current > 0) {
			setProgressValue("right", Math.max(0, progressRightRef.current - step));
			}
			await wait(stepDuration);
		}
		isDecayingRef.current = false;
		})();
	};

	useEffect(() => {
		const onWheel = (e) => {
			console.log('you are scrolling ....');
			
			// Prefer horizontal deltaX. If user uses vertical wheel, ignore (since this component is horizontal-based)
			const dy = e.deltaY;
			if (dy === 0) return;
			const percent = deltaPxToPercent(dy);
			console.log("percent : ", percent);
			if (dy > 0) {
				setProgressValue("right", progressRightRef.current + percent);
				setProgressValue("left", 0);
			} else {
				setProgressValue("left", progressLeftRef.current + percent);
				setProgressValue("right", 0);
			}
			// reset idle timer
			if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
			isDecayingRef.current = false;
			idleTimeoutRef.current = setTimeout(() => startDecay(), idleDelay);
		};

		// Pointer handlers (works for touch & mouse where supported)
		const onPointerDown = (e) => {
			isPointerDownRef.current = true;
			lastXRef.current = e.clientX;
			cancelDecayAndIdle();
		};

		const onPointerMove = (e) => {
			if (!isPointerDownRef.current || lastXRef.current == null) return;
			const currentX = e.clientX;
			const deltaX = lastXRef.current - currentX; // positive when moving left
			lastXRef.current = currentX;
			if (Math.abs(deltaX) < 2) return; // ignore micro-movements
			const percent = deltaPxToPercent(deltaX);
			if (deltaX > 0) {
				setProgressValue("left", progressLeftRef.current + percent);
				setProgressValue("right", 0);
			} else {
				setProgressValue("right", progressRightRef.current + percent);
				setProgressValue("left", 0);
			}
			if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
			isDecayingRef.current = false;
			idleTimeoutRef.current = setTimeout(() => startDecay(), idleDelay);
		};

		const onPointerUp = () => {
			isPointerDownRef.current = false;
			lastXRef.current = null;
			if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
			idleTimeoutRef.current = setTimeout(() => startDecay(), idleDelay);
		};

		// Touch fallback for older browsers (use named functions so we can remove them cleanly)
		const onTouchStart = (e) => {
			if (e.touches && e.touches[0]) {
				isPointerDownRef.current = true;
				lastXRef.current = e.touches[0].clientX;
				cancelDecayAndIdle();
			}
		};

		const onTouchMove = (e) => {
			if (!isPointerDownRef.current || !e.touches || !e.touches[0]) return;
			const currentX = e.touches[0].clientX;
			const deltaX = lastXRef.current - currentX;
			lastXRef.current = currentX;
			if (Math.abs(deltaX) < 2) return;
			const percent = deltaPxToPercent(deltaX);
			if (deltaX > 0) {
				setProgressValue("left", progressLeftRef.current + percent);
				setProgressValue("right", 0);
			} else {
				setProgressValue("right", progressRightRef.current + percent);
				setProgressValue("left", 0);
			}
			if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
			isDecayingRef.current = false;
			idleTimeoutRef.current = setTimeout(() => startDecay(), idleDelay);
		};

		const onTouchEnd = () => {
			isPointerDownRef.current = false;
			lastXRef.current = null;
			if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
			idleTimeoutRef.current = setTimeout(() => startDecay(), idleDelay);
		};

		window.addEventListener("wheel", onWheel, { passive: true });
		window.addEventListener("pointerdown", onPointerDown);
		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", onPointerUp);

		window.addEventListener("touchstart", onTouchStart, { passive: true });
		window.addEventListener("touchmove", onTouchMove, { passive: true });
		window.addEventListener("touchend", onTouchEnd, { passive: true });

		return () => {
			window.removeEventListener("wheel", onWheel);
			window.removeEventListener("pointerdown", onPointerDown);
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);

			window.removeEventListener("touchstart", onTouchStart);
			window.removeEventListener("touchmove", onTouchMove);
			window.removeEventListener("touchend", onTouchEnd);

			cancelDecayAndIdle();
			};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sensitivity, idleDelay, step, stepDuration, max]);

	return (
		<>
			{/* Stacked bars - left swipe (top) and right swipe (bottom) */}
			<div className="fixed left-0 top-0 w-full z-50 pointer-events-none space-y-1 p-2">
				<div className="w-full h-2 bg-black/10 rounded overflow-hidden">
				<div
					className="h-full"
					style={{
					width: `${progressLeft}%`,
					transition: `width ${stepDuration}ms ease`,
					background: "linear-gradient(90deg, #06b6d4, #3b82f6)",
					}}
				/>
				</div>
				<div className="w-full h-2 bg-black/10 rounded overflow-hidden">
				<div
					className="h-full"
					style={{
					width: `${progressRight}%`,
					transition: `width ${stepDuration}ms ease`,
					background: "linear-gradient(90deg, #f97316, #f43f5e)",
					}}
				/>
				</div>
			</div>

			{/* Optional small debug percent (remove if you don't want it) */}
			<div className="fixed right-3 top-3 z-50 select-none text-xs text-white bg-black/50 px-2 py-1 rounded">
				L: {Math.round(progressLeft)}% • R: {Math.round(progressRight)}%
			</div>
		</>
	);
}
