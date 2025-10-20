import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDataStore } from '@/stores/useDataStore';
import { toast } from 'sonner';
import type { SourceSystem, DatasetType, Environment } from '@/types';

interface CreateDatasetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function CreateDatasetDialog({ open, onOpenChange, children }: CreateDatasetDialogProps) {
  const [name, setName] = useState('');
  const [source, setSource] = useState<SourceSystem>('Excel');
  const [type, setType] = useState<DatasetType>('snapshot');
  const [environment, setEnvironment] = useState<Environment>('CRM');
  const { addDataset } = useDataStore();

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('Please enter a dataset name');
      return;
    }

    addDataset({
      name: name.trim(),
      source,
      type,
      environment,
      automation: { enabled: false, status: 'ok' },
      restricted: false,
    });

    toast.success('Dataset created successfully');
    onOpenChange(false);
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
      <DialogContent className="bg-popover">
        <DialogHeader>
          <DialogTitle>Create New Dataset</DialogTitle>
          <DialogDescription>
            Add a new dataset connection to your data catalog
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Dataset Name</Label>
            <Input
              id="name"
              placeholder="e.g., Sales Pipeline"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source System</Label>
            <Select value={source} onValueChange={(v) => setSource(v as SourceSystem)}>
              <SelectTrigger id="source">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="Excel">Excel</SelectItem>
                <SelectItem value="NetSuite">NetSuite</SelectItem>
                <SelectItem value="Sage Intacct">Sage Intacct</SelectItem>
                <SelectItem value="Rippling">Rippling</SelectItem>
                <SelectItem value="Looker">Looker</SelectItem>
                <SelectItem value="Google Sheets">Google Sheets</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
                <SelectItem value="XLSX">XLSX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as DatasetType)}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="snapshot">Snapshot (Static)</SelectItem>
                <SelectItem value="transactional">Transactional (Live)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="environment">Environment</Label>
            <Select value={environment} onValueChange={(v) => setEnvironment(v as Environment)}>
              <SelectTrigger id="environment">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="CRM">CRM</SelectItem>
                <SelectItem value="ERP">ERP</SelectItem>
                <SelectItem value="Headcount">Headcount</SelectItem>
                <SelectItem value="BI">BI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create Dataset</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
