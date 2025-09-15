import { create } from 'zustand'

export const useProgressStore = create((set) => ({
	progressRight: 0,
	progressLeft: 0,
	setProgressRight: (value) => set({ progressRight: value }),
	setProgressLeft: (value) => set({ progressLeft: value }),
	
	// 🔥 NEW: store refs separately (not reactive)
	progressRightRef: { current: 0 },
	progressLeftRef: { current: 0 },
}))
