import { Sparkles } from 'lucide-react';
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
          <svg className="h-4 w-4" viewBox="0 0 23.3887 17.9785" xmlns="http://www.w3.org/2000/svg">
            <g>
              <rect height="17.9785" opacity="0" width="23.3887" x="0" y="0"/>
              <path d="M14.082 16.7188L15.6152 16.7188L15.6152 1.28906L14.082 1.28906ZM4.12109 17.9785L19.1504 17.9785C21.6113 17.9785 23.0273 16.4941 23.0273 13.8574L23.0273 4.13086C23.0273 1.49414 21.6113 0 19.1504 0L4.12109 0C1.49414 0 0 1.49414 0 4.13086L0 13.8574C0 16.4941 1.49414 17.9785 4.12109 17.9785ZM4.13086 16.4062C2.50977 16.4062 1.57227 15.4785 1.57227 13.8574L1.57227 4.13086C1.57227 2.50977 2.50977 1.57227 4.13086 1.57227L18.8965 1.57227C20.5176 1.57227 21.4551 2.50977 21.4551 4.13086L21.4551 13.8574C21.4551 15.4785 20.5176 16.4062 18.8965 16.4062ZM17.4902 5.20508L19.5801 5.20508C19.8828 5.20508 20.1367 4.94141 20.1367 4.6582C20.1367 4.36523 19.8828 4.11133 19.5801 4.11133L17.4902 4.11133C17.1973 4.11133 16.9336 4.36523 16.9336 4.6582C16.9336 4.94141 17.1973 5.20508 17.4902 5.20508ZM17.4902 7.73438L19.5801 7.73438C19.8828 7.73438 20.1367 7.4707 20.1367 7.17773C20.1367 6.88477 19.8828 6.64062 19.5801 6.64062L17.4902 6.64062C17.1973 6.64062 16.9336 6.88477 16.9336 7.17773C16.9336 7.4707 17.1973 7.73438 17.4902 7.73438ZM17.4902 10.2539L19.5801 10.2539C19.8828 10.2539 20.1367 10.0098 20.1367 9.7168C20.1367 9.42383 19.8828 9.16992 19.5801 9.16992L17.4902 9.16992C17.1973 9.16992 16.9336 9.42383 16.9336 9.7168C16.9336 10.0098 17.1973 10.2539 17.4902 10.2539Z" fill="currentColor" fillOpacity={rightPinned ? "0.85" : "0.5"}/>
            </g>
          </svg>
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
