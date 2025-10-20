import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreateDatasetDialog } from '@/components/data/CreateDatasetDialog';
import { UploadDataDialog } from '@/components/data/UploadDataDialog';
import { DataTable } from '@/components/data/DataTable';
import { useDataStore } from '@/stores/useDataStore';
import { toast } from 'sonner';

export default function DataCatalog() {
  const navigate = useNavigate();
  const { datasets, deleteDataset, updateDataset } = useDataStore();

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete dataset "${name}"?`)) {
      deleteDataset(id);
      toast.success('Dataset deleted');
    }
  };

  const toggleAutomation = (id: string, enabled: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    updateDataset(id, {
      automation: { enabled: !enabled, status: 'ok' },
    });
    toast.success(enabled ? 'Automation disabled' : 'Automation enabled');
  };

  const toggleRestricted = (id: string, restricted: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    updateDataset(id, { restricted: !restricted });
    toast.success(restricted ? 'Access opened' : 'Access restricted');
  };

  return (
    <div className="h-full p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Datasets</h1>
        <Button variant="ghost" className="text-primary hover:text-primary">
          <Plus className="h-4 w-4 mr-1" />
          Create dataset
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        datasets={datasets}
        navigate={navigate}
        handleDelete={handleDelete}
        toggleAutomation={toggleAutomation}
        toggleRestricted={toggleRestricted}
      />

      {/* Add Section Button */}
      <Button variant="ghost" className="text-primary hover:text-primary">
        <Plus className="h-4 w-4 mr-1" />
        Add section
      </Button>
    </div>
  );
}
