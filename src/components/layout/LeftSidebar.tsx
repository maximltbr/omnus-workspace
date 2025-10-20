import { Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SpacesTree } from '@/components/spaces/SpacesTree';
import { DataSection } from '@/components/data/DataSection';
import { useUIStore } from '@/stores/useUIStore';

export function LeftSidebar() {
  const { leftPinned, toggleLeftPin, paneWidths } = useUIStore();

  return (
    <aside
      className="h-full border-r border-sidebar-border bg-sidebar shadow-lg sidebar-reveal flex flex-col"
      style={{ width: `${paneWidths.left}px` }}
    >
      {/* Header with Pin */}
      <div className="flex items-center justify-between p-3 border-b border-sidebar-border">
        <h2 className="text-sm font-semibold text-sidebar-foreground">Menu</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLeftPin}
          className={`h-7 w-7 pin-button ${leftPinned ? 'text-primary' : 'text-muted-foreground'}`}
          title="Pin sidebar (P)"
        >
          <Pin className="h-4 w-4" fill={leftPinned ? 'currentColor' : 'none'} />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Spaces Section */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Spaces
            </h3>
            <SpacesTree />
          </div>

          <Separator className="bg-sidebar-border" />

          {/* Data Section */}
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
              Data
            </h3>
            <DataSection />
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
