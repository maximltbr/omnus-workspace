import { useEffect } from 'react';
import { useUIStore } from '@/stores/useUIStore';

export function useKeyboardShortcuts() {
  const { toggleLeftPin, toggleRightPin } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + L → toggle left sidebar pin
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        toggleLeftPin();
      }

      // Cmd/Ctrl + R → toggle right sidebar pin
      if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
        e.preventDefault();
        toggleRightPin();
      }

      // P → pin focused sidebar (simplified for now)
      if (e.key === 'p' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          // Would need focus tracking to determine which sidebar
        }
      }

      // / → focus search
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
          searchInput?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleLeftPin, toggleRightPin]);
}
