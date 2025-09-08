import React from "react";

export default function HeroSection({
  title,
  subtitle,
  buttonText,
  buttonLink,
  imageSrc,
}) {
  return (
    <section className="w-full bg-white flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-12 lg:py-20 gap-10">
      {/* Left Content */}
      <div className="flex-1 flex flex-col items-start text-left">
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary leading-tight mb-4">
          {title}
        </h1>
        <p className="font-body text-secondary text-base sm:text-lg mb-6 max-w-xl">
          {subtitle}
        </p>
        <a
          href={buttonLink}
          className="bg-accent text-black px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
        >
          {buttonText}
        </a>
      </div>

      {/* Right Image */}
      <div className="flex-1 flex justify-center">
        <img
          src={imageSrc}
          alt="Hero"
          className="w-full max-w-lg object-contain"
        />
      </div>
    </section>
  );
}
