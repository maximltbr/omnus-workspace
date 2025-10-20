import { ChevronRight, FolderOpen, FileText, FolderPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '@/stores/useDataStore';
import { useUIStore } from '@/stores/useUIStore';
import { CreateSpaceDialog } from './CreateSpaceDialog';
import { CreateFolderDialog } from './CreateFolderDialog';
import { CreatePageDialog } from './CreatePageDialog';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useState } from 'react';

export function SpacesTree() {
  const navigate = useNavigate();
  const { spaces } = useDataStore();
  const { leftExpanded, setLeftExpanded } = useUIStore();
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<{ id: string; name: string } | null>(null);

  const toggleSpace = (spaceId: string) => {
    setLeftExpanded(spaceId, !leftExpanded[spaceId]);
  };

  const toggleFolder = (folderId: string) => {
    setLeftExpanded(folderId, !leftExpanded[folderId]);
  };

  const handleAddFolder = (spaceId: string, spaceName: string) => {
    setSelectedSpace({ id: spaceId, name: spaceName });
    setFolderDialogOpen(true);
  };

  return (
    <div className="space-y-1">
      {spaces.map((space) => {
        const spaceExpanded = leftExpanded[space.id] ?? space.expanded;
        
        return (
          <div key={space.id} className="space-y-1">
            {/* Space */}
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <button
                  onClick={() => toggleSpace(space.id)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-sidebar-hover text-sm text-sidebar-foreground transition-colors"
                >
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${spaceExpanded ? 'rotate-90' : ''}`}
                  />
                  <span className="font-medium truncate">{space.name}</span>
                </button>
              </ContextMenuTrigger>
              <ContextMenuContent className="bg-popover">
                <ContextMenuItem onClick={() => handleAddFolder(space.id, space.name)}>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Add Folder
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>

            {/* Folders */}
            {spaceExpanded && (
              <div className="ml-4 space-y-1">
                {space.folders.map((folder) => {
                  const folderExpanded = leftExpanded[folder.id] ?? folder.expanded;
                  
                  return (
                    <div key={folder.id} className="space-y-1">
                      <button
                        onClick={() => toggleFolder(folder.id)}
                        className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-sidebar-hover text-sm text-sidebar-foreground transition-colors"
                      >
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{folder.name}</span>
                        <ChevronRight
                          className={`h-3 w-3 ml-auto transition-transform ${
                            folderExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </button>

                      {/* Pages */}
                      {folderExpanded && (
                        <div className="ml-6 space-y-0.5">
                          {folder.pages.map((page) => (
                            <button
                              key={page.id}
                              onClick={() => navigate(`/page/${page.id}`)}
                              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-sidebar-hover text-sm text-sidebar-foreground transition-colors"
                            >
                              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="truncate">{page.name}</span>
                            </button>
                          ))}
                          <CreatePageDialog 
                            spaceId={space.id} 
                            folderId={folder.id}
                            folderName={folder.name}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <CreateSpaceDialog />
      
      {selectedSpace && (
        <CreateFolderDialog 
          spaceId={selectedSpace.id} 
          spaceName={selectedSpace.name}
          open={folderDialogOpen}
          onOpenChange={setFolderDialogOpen}
        />
      )}
    </div>
  );
}
