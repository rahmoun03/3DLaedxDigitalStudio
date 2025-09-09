import { ChevronsLeft } from "lucide-react";
import { useSections } from "../../../Laedx";

export default function Header() {

	const WWD = [
		'Figma Designs',
		'React, Three.js, Gsap',
		'Django, Next.js',
		'Android, iOS',
	]

	const { products, setActiveProduct } = useSections();


	return (
		<header className="w-full text-gray-400 flex flex-row items-start justify-between p-4 gap-10 font-[JetBrains]">

			{/* logo + email       */}
			<div className="flex flex-row items-start text-left gap-30 items-start justify-start ">
				<h1 className="text-white text-xl sm:text-2xl lg:text-3xl flex items-center justify-center font-[AudioWide]">
					<span className="">LDS</span>
				</h1>
				<div className="hidden lg:flex flex-col">
					<span>contact us</span>
					<span className="text-white" >Contact@laedxdigitalstudio.com</span>
				</div>
			</div>

			{/* what we have */}
			<div className="flex flex-row gap-30 items-start justify-start">
				<div className="hidden lg:flex flex-col">
					<span>Location</span>
					<span className="text-white" >ground floor, Laedx digital studio, </span>
					<span className="text-white" >Bd Allal Al Fassi, Marrakech 40000</span>
				</div>
				<div className="flex flex-col justify-start items-end">
					{products.map((product, index) => (
						<div
							key={index}
							className="flex flex-row gap-2 place-center"
						>
							<button
								className={`hover:text-white cursor-pointer ${product.active ? 'text-white' : ''}`}
								onClick={() => setActiveProduct(product.name)}
							>
								{product.name}
							</button>
							{product.active
								? <ChevronsLeft className={`text-white transition-all duration-500`}/>
								: <></>
							}
						</div>
					))}
				</div>
			</div>

		</header>
	);
}
