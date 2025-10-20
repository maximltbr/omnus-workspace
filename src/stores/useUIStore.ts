import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ID, UIState } from '@/types';

interface UIStore extends UIState {
  toggleLeftPin: () => void;
  toggleRightPin: () => void;
  setLeftExpanded: (id: ID, expanded: boolean) => void;
  setRightExpanded: (expanded: boolean) => void;
  setPaneWidth: (side: 'left' | 'right', width: number) => void;
  setCurrentPage: (pageId: ID) => void;
  addRecentPage: (pageId: ID) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      leftPinned: false,
      rightPinned: false,
      leftExpanded: {},
      rightExpanded: false,
      paneWidths: { left: 280, right: 360 },
      recentPages: [],
      
      toggleLeftPin: () => set((state) => ({ leftPinned: !state.leftPinned })),
      toggleRightPin: () => set((state) => ({ rightPinned: !state.rightPinned })),
      
      setLeftExpanded: (id, expanded) =>
        set((state) => ({
          leftExpanded: { ...state.leftExpanded, [id]: expanded },
        })),
      
      setRightExpanded: (expanded) => set({ rightExpanded: expanded }),
      
      setPaneWidth: (side, width) =>
        set((state) => ({
          paneWidths: { ...state.paneWidths, [side]: Math.max(240, Math.min(480, width)) },
        })),
      
      setCurrentPage: (pageId) => set({ currentPage: pageId }),
      
      addRecentPage: (pageId) =>
        set((state) => ({
          recentPages: [pageId, ...state.recentPages.filter((id) => id !== pageId)].slice(0, 5),
        })),
    }),
    {
      name: 'omnus:ui-state',
    }
  )
);
