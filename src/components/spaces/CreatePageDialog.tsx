import { useState } from 'react';
import { FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

interface CreatePageDialogProps {
  spaceId: string;
  folderId: string;
  folderName: string;
}

export function CreatePageDialog({ spaceId, folderId, folderName }: CreatePageDialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { addPage } = useDataStore();

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Please enter a page name');
      return;
    }

    addPage(spaceId, folderId, name.trim());
    toast.success('Page created');
    setOpen(false);
    setName('');
    
    // Navigate to the new page
    setTimeout(() => {
      const pageId = `page-${Date.now()}`;
      navigate(`/page/${pageId}`);
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-full justify-start ml-12">
          <FilePlus className="h-3.5 w-3.5 mr-1" />
          Add Page
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-popover">
        <DialogHeader>
          <DialogTitle>Create New Page</DialogTitle>
          <DialogDescription>
            Add a page to {folderName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="page-name">Page Name</Label>
            <Input
              id="page-name"
              placeholder="e.g., Meeting Notes"
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
          <Button onClick={handleCreate}>Create Page</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
