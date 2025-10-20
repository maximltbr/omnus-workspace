import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ConnectorList } from './ConnectorList';
import { ManualUpload } from './ManualUpload';

interface AddDataPopoverProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ViewMode = 'menu' | 'connector' | 'manual';

export function AddDataPopover({ children, open, onOpenChange }: AddDataPopoverProps) {
  const [view, setView] = useState<ViewMode>('menu');

  const handleClose = () => {
    setView('menu');
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setView('menu');
      }
      onOpenChange(isOpen);
    }}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-[600px] p-0" 
        align="start"
        side="bottom"
      >
        <div className="flex h-[500px]">
          {/* Side Menu */}
          <div className="w-48 border-r border-border bg-muted/30 p-2">
            <div className="space-y-1">
              <button
                onClick={() => setView('connector')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  view === 'connector' 
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-accent/50'
                }`}
              >
                <svg className="h-4 w-4" viewBox="0 0 17.5977 21.2598" fill="none">
                  <path d="M3.96484 6.73828C3.96484 7.91016 4.80469 8.75977 6.40625 9.20898L11.3184 10.5957C13.6426 11.2402 14.8535 12.6074 14.8535 14.5508L14.8535 14.8828L13.2812 14.8828L13.2812 14.5508C13.2812 13.3789 12.4512 12.5488 10.8398 12.0898L5.92773 10.7031C3.60352 10.0586 2.39258 8.69141 2.39258 6.73828L2.39258 6.39648L3.96484 6.39648Z" fill="currentColor" fillOpacity="0.85"/>
                  <path d="M1.96289 6.39648L4.42383 6.39648C5.0293 6.39648 5.51758 6.23047 5.85938 5.87891C6.2207 5.53711 6.38672 5.03906 6.38672 4.44336L6.38672 1.99219C6.38672 1.37695 6.2207 0.878906 5.85938 0.537109C5.51758 0.185547 5.0293 0.00976562 4.42383 0.00976562L1.96289 0.00976562C1.34766 0.00976562 0.849609 0.195312 0.517578 0.537109C0.175781 0.869141 0 1.36719 0 1.99219L0 4.44336C0 5.04883 0.175781 5.54688 0.517578 5.87891C0.849609 6.2207 1.34766 6.39648 1.96289 6.39648ZM12.8223 21.2598L15.2832 21.2598C15.8887 21.2598 16.377 21.0938 16.709 20.7422C17.0801 20.4102 17.2363 19.9023 17.2363 19.3066L17.2363 16.8652C17.2363 16.25 17.0801 15.752 16.709 15.4102C16.377 15.0586 15.8887 14.8828 15.2832 14.8828L12.8223 14.8828C12.207 14.8828 11.709 15.0684 11.377 15.4102C11.0352 15.7422 10.8594 16.2402 10.8594 16.8652L10.8594 19.3066C10.8594 19.9121 11.0352 20.4199 11.377 20.7422C11.709 21.0938 12.207 21.2598 12.8223 21.2598Z" fill="currentColor" fillOpacity="0.85"/>
                </svg>
                <span>Connector</span>
              </button>
              <button
                onClick={() => setView('manual')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  view === 'manual' 
                    ? 'bg-accent text-accent-foreground' 
                    : 'hover:bg-accent/50'
                }`}
              >
                <svg className="h-4 w-4" viewBox="0 0 17.6953 26.0059" fill="none">
                  <path d="M6.05469 9.35547L4.08203 9.35547C2.48047 9.35547 1.57227 10.2539 1.57227 11.8652L1.57227 19.3848C1.57227 20.9961 2.48047 21.8945 4.08203 21.8945L13.2422 21.8945C14.8535 21.8945 15.7617 20.9961 15.7617 19.3848L15.7617 11.8652C15.7617 10.2539 14.8535 9.35547 13.2422 9.35547L11.2695 9.35547L11.2695 7.7832L13.2422 7.7832C15.8691 7.7832 17.334 9.23828 17.334 11.8652L17.334 19.3848C17.334 22.002 15.8691 23.4668 13.2422 23.4668L4.08203 23.4668C1.45508 23.4668 0 22.002 0 19.3848L0 11.8652C0 9.23828 1.45508 7.7832 4.08203 7.7832L6.05469 7.7832Z" fill="currentColor" fillOpacity="0.85"/>
                  <path d="M9.37793 3.66026L9.44336 5.12695L9.44336 15.0684C9.44336 15.4785 9.08203 15.8203 8.66211 15.8203C8.24219 15.8203 7.89062 15.4785 7.89062 15.0684L7.89062 5.12695L7.95627 3.65548L8.66211 2.90039Z" fill="currentColor" fillOpacity="0.85"/>
                  <path d="M5.35156 6.09375C5.53711 6.09375 5.75195 6.01562 5.88867 5.85938L7.40234 4.24805L8.66211 2.90039L9.93164 4.24805L11.4355 5.85938C11.5723 6.01562 11.7773 6.09375 11.9629 6.09375C12.373 6.09375 12.6758 5.80078 12.6758 5.41016C12.6758 5.19531 12.5977 5.03906 12.4512 4.89258L9.22852 1.78711C9.0332 1.5918 8.86719 1.5332 8.66211 1.5332C8.4668 1.5332 8.30078 1.5918 8.0957 1.78711L4.88281 4.89258C4.73633 5.03906 4.64844 5.19531 4.64844 5.41016C4.64844 5.80078 4.94141 6.09375 5.35156 6.09375Z" fill="currentColor" fillOpacity="0.85"/>
                </svg>
                <span>Manual</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {view === 'menu' && (
              <div className="p-6 text-center text-muted-foreground">
                Select an option from the menu
              </div>
            )}
            {view === 'connector' && <ConnectorList />}
            {view === 'manual' && <ManualUpload onClose={handleClose} />}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
