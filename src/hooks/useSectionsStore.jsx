import { create } from 'zustand';

export const useSections = create((set) => ({

	products: [
		{ name: "Home", active: true },
		{ name: "HiveXperience", active: false },
		{ name: "NoveXperience", active: false },
	],

	setActiveProduct: (name) =>
		set((state) => ({
		products: state.products.map((p) => ({
			...p,
			active: p.name === name,
		})),
	})),
}));
