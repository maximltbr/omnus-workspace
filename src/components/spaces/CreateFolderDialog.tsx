import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDataStore } from '@/stores/useDataStore';
import { toast } from 'sonner';

interface CreateFolderDialogProps {
  spaceId: string;
  spaceName: string;
}

export function CreateFolderDialog({ spaceId, spaceName }: CreateFolderDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { addFolder } = useDataStore();

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    addFolder(spaceId, name.trim());
    toast.success('Folder created');
    setOpen(false);
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-full justify-start ml-6">
          <FolderPlus className="h-3.5 w-3.5 mr-1" />
          Add Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-popover">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Add a folder to {spaceName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              placeholder="e.g., Q1 Reports"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create Folder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
