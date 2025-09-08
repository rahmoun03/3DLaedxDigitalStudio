import { useEffect, useState } from "react";

export default function Footer() {
	
	const [time, setTime] = useState("");

	useEffect(() => {
		const updateTime = () => {
			const now = new Date().toLocaleTimeString("en-GB", {
				timeZone: "Africa/Casablanca",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			});
			setTime(now);
		};

		updateTime();
		const interval = setInterval(updateTime, 1000);

		return () => clearInterval(interval);
	}, []);


	const socialMedia = [
		{name: 'Instagram', link: 'https://www.instagram.com/rahmoun_03/?hl=fr'},
		{name: 'Linkedin', link: 'https://www.linkedin.com/company/laedx-digital-studio/'},
		{name: 'Twitter', link: 'https://x.com/rahmoun03'}
	]

	return (
		<header className="w-full text-gray-400 flex flex-row items-end justify-between lg:p-4 gap-10 font-[JetBrains]">

			{/* time zone */}
			<div className="hidden lg:flex flex-row items-start text-left gap-30 items-end justify-start ">
				<div className="flex flex-col">
					<span>Local time</span>
					<span className="text-white" >MAR {time} </span>
				</div>
			</div>

			{/* social media*/}
			<div className="not-lg:w-full flex flex-row lg:gap-30 items-end justify-between">
				<div className="flex flex-col">
					{socialMedia.map((media, index) => (
						<a
							key={index}
							href={media.link}
							target="_blank"
							className="hover:text-white cursor-pointer"
						>
							{media.name}
						</a>
					))}
				</div>

				<div
					className="flex flex-col"
				>
					<span>©2025</span>
					<h2 className="text-white font-[beba]" >LAEDX DIGITAL STUDIO</h2>
				</div>
			</div>

		</header>
	);
}
