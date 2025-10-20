import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { useUIStore } from '@/stores/useUIStore';

const EDGE_THRESHOLD = 20;
const AUTO_COLLAPSE_DELAY = 600;

export function AppShell() {
  const { leftPinned, rightPinned } = useUIStore();
  const [leftHover, setLeftHover] = useState(false);
  const [rightHover, setRightHover] = useState(false);
  const [leftTimeout, setLeftTimeout] = useState<NodeJS.Timeout | null>(null);
  const [rightTimeout, setRightTimeout] = useState<NodeJS.Timeout | null>(null);

  const showLeft = leftPinned || leftHover;
  const showRight = rightPinned || rightHover;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Left edge detection
      if (e.clientX <= EDGE_THRESHOLD && !leftPinned) {
        if (leftTimeout) clearTimeout(leftTimeout);
        setLeftHover(true);
      }

      // Right edge detection
      if (e.clientX >= window.innerWidth - EDGE_THRESHOLD && !rightPinned) {
        if (rightTimeout) clearTimeout(rightTimeout);
        setRightHover(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [leftPinned, rightPinned, leftTimeout, rightTimeout]);

  const handleLeftMouseLeave = () => {
    if (!leftPinned) {
      const timeout = setTimeout(() => setLeftHover(false), AUTO_COLLAPSE_DELAY);
      setLeftTimeout(timeout);
    }
  };

  const handleRightMouseLeave = () => {
    if (!rightPinned) {
      const timeout = setTimeout(() => setRightHover(false), AUTO_COLLAPSE_DELAY);
      setRightTimeout(timeout);
    }
  };

  const handleLeftMouseEnter = () => {
    if (leftTimeout) {
      clearTimeout(leftTimeout);
      setLeftTimeout(null);
    }
  };

  const handleRightMouseEnter = () => {
    if (rightTimeout) {
      clearTimeout(rightTimeout);
      setRightTimeout(null);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <div
          className={`absolute left-0 top-0 bottom-0 z-20 transition-transform duration-200 ${
            showLeft ? 'translate-x-0' : '-translate-x-full'
          }`}
          onMouseEnter={handleLeftMouseEnter}
          onMouseLeave={handleLeftMouseLeave}
        >
          <LeftSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>

        {/* Right Sidebar */}
        <div
          className={`absolute right-0 top-0 bottom-0 z-20 transition-transform duration-200 ${
            showRight ? 'translate-x-0' : 'translate-x-full'
          }`}
          onMouseEnter={handleRightMouseEnter}
          onMouseLeave={handleRightMouseLeave}
        >
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
