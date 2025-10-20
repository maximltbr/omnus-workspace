import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDataStore } from '@/stores/useDataStore';
import { toast } from 'sonner';

interface CreateFolderDialogProps {
  spaceId: string;
  spaceName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateFolderDialog({ spaceId, spaceName, open, onOpenChange }: CreateFolderDialogProps) {
  const [name, setName] = useState('');
  const { addFolder } = useDataStore();

  useEffect(() => {
    if (!open) {
      setName('');
    }
  }, [open]);

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    addFolder(spaceId, name.trim());
    toast.success('Folder created');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create Folder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
