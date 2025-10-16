import { useEffect, useRef } from "react";

export default function useShake(onShake, threshold = 15) {
  const lastTime = useRef(0);
  const lastX = useRef(null);
  const lastY = useRef(null);
  const lastZ = useRef(null);

  useEffect(() => {
    const handleMotion = (event) => {
      const { accelerationIncludingGravity } = event;

      if (!accelerationIncludingGravity) {
        console.log("⚠️ No acceleration data available.");
        return;
      }

      const { x, y, z } = accelerationIncludingGravity;

      const currentTime = Date.now();
      if (currentTime - lastTime.current > 100) {
        const diffTime = currentTime - lastTime.current;
        lastTime.current = currentTime;

        if (lastX.current !== null) {
          const speed =
            (Math.abs(x + y + z - lastX.current - lastY.current - lastZ.current) /
              diffTime) *
            10000;

          console.log(`📊 Speed: ${speed.toFixed(2)}`); // debug log

          if (speed > threshold) {
            console.log("💥 Shake detected!");
            if (onShake) onShake();
          }
        }

        lastX.current = x;
        lastY.current = y;
        lastZ.current = z;
      }
    };

    // iOS requires permission for motion sensors
    const enableMotion = async () => {
      try {
        if (typeof DeviceMotionEvent === "undefined") {
          console.log("❌ DeviceMotionEvent not supported on this device.");
          return;
        }

        if (typeof DeviceMotionEvent.requestPermission === "function") {
          const permission = await DeviceMotionEvent.requestPermission();
          if (permission !== "granted") {
            console.log("🚫 Motion permission denied.");
            return;
          }
        }

        window.addEventListener("devicemotion", handleMotion, true);
        console.log("✅ Motion listener enabled.");
      } catch (err) {
        console.error("❌ Error enabling motion:", err);
      }
    };

    enableMotion();

    return () => {
      window.removeEventListener("devicemotion", handleMotion, true);
    };
  }, [onShake, threshold]);
}
