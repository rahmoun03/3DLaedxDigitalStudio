import React from "react";
import "@/styles/HexLoader.css";

export default function HexLoader() {
  // Define the positions (c1–c37) and rows (r1–r3)
  const gels = [
    { c: 1, r: "r1" }, { c: 2, r: "r1" }, { c: 3, r: "r1" },
    { c: 4, r: "r1" }, { c: 5, r: "r1" }, { c: 6, r: "r1" },
    { c: 7, r: "r2" }, { c: 8, r: "r2" }, { c: 9, r: "r2" },
    { c: 10, r: "r2" }, { c: 11, r: "r2" }, { c: 12, r: "r2" },
    { c: 13, r: "r2" }, { c: 14, r: "r2" }, { c: 15, r: "r2" },
    { c: 16, r: "r2" }, { c: 17, r: "r2" }, { c: 18, r: "r2" },
    { c: 19, r: "r3" }, { c: 20, r: "r3" }, { c: 21, r: "r3" },
    { c: 22, r: "r3" }, { c: 23, r: "r3" }, { c: 24, r: "r3" },
    { c: 25, r: "r3" }, { c: 26, r: "r3" }, { c: 28, r: "r3" },
    { c: 29, r: "r3" }, { c: 30, r: "r3" }, { c: 31, r: "r3" },
    { c: 32, r: "r3" }, { c: 33, r: "r3" }, { c: 34, r: "r3" },
    { c: 35, r: "r3" }, { c: 36, r: "r3" }, { c: 37, r: "r3" },
  ];

  return (
    <div className="relative w-52 h-52 mx-auto my-32">
      <div className="gel center-gel">
        <div className="hex-brick h1" />
        <div className="hex-brick h2" />
        <div className="hex-brick h3" />
      </div>

      {gels.map(({ c, r }) => (
        <div key={c} className={`gel c${c} ${r}`}>
          <div className="hex-brick h1" />
          <div className="hex-brick h2" />
          <div className="hex-brick h3" />
        </div>
      ))}
    </div>
  );
}
