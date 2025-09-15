import { create }  from 'zustand';

export const useLoadingStore = create((set) => ({
	progress: 0,
	setProgress: (p) => set({ progress: p }),
}));
