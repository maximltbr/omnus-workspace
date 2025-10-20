import { Pin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUIStore } from '@/stores/useUIStore';

export function RightSidebar() {
  const { rightPinned, toggleRightPin, paneWidths } = useUIStore();

  return (
    <aside
      className="h-full border-l border-sidebar-border bg-sidebar shadow-lg sidebar-reveal flex flex-col"
      style={{ width: `${paneWidths.right}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-sidebar-foreground">AI Assistant</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRightPin}
          className={`h-7 w-7 pin-button ${rightPinned ? 'text-primary' : 'text-muted-foreground'}`}
          title="Pin assistant (P)"
        >
          <Pin className="h-4 w-4" fill={rightPinned ? 'currentColor' : 'none'} />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <div className="rounded-lg bg-accent/50 border border-accent-foreground/20 p-4">
            <p className="text-sm text-accent-foreground">
              <strong>LLM Assistant</strong> powered by transformers.js with read access to your data warehouse.
            </p>
          </div>
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm">
              Summarize dataset
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              Explain variance
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              Build headcount plan
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              Write SQL query
            </Button>
          </div>

          <div className="text-xs text-muted-foreground mt-6 space-y-1">
            <p>• Read-only data access</p>
            <p>• Local processing</p>
            <p>• Context-aware suggestions</p>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
