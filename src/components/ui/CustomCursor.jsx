import React, { useEffect, useState } from "react";
import mouseIcon from "@/assets/icons/mouse.svg";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e) => setPosition({ x: e.clientX, y: e.clientY });
    const hide = () => setHidden(true);
    const show = () => setHidden(false);
    const down = () => setClicked(true);
    const up = () => setClicked(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseenter", show);
    window.addEventListener("mouseleave", hide);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    const hoverables = document.querySelectorAll("a, button, [data-cursor='hover']");
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", () => setHovering(true));
      el.addEventListener("mouseleave", () => setHovering(false));
    });

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseenter", show);
      window.removeEventListener("mouseleave", hide);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", () => setHovering(true));
        el.removeEventListener("mouseleave", () => setHovering(false));
      });
    };
  }, []);

  if (hidden) return null;

  return (
    <>
      <img
        src={mouseIcon}
        alt="Custom Cursor"
        className={`w-6 h-6 fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-0 ${hovering ? "opacity-80" : "opacity-100"}`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      />
    </>
  );
}
