import { useState } from 'react';
import { Plus } from 'lucide-react';
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

export function CreateSpaceDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { addSpace } = useDataStore();

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Please enter a space name');
      return;
    }

    addSpace(name.trim());
    toast.success('Space created');
    setOpen(false);
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-1" />
          New Space
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-popover">
        <DialogHeader>
          <DialogTitle>Create New Space</DialogTitle>
          <DialogDescription>
            Spaces represent top-level project environments
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="space-name">Space Name</Label>
            <Input
              id="space-name"
              placeholder="e.g., Marketing Projects"
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
          <Button onClick={handleCreate}>Create Space</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
