import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AddDataPopover } from '@/components/data/AddDataPopover';
import { DataTable } from '@/components/data/DataTable';
import { useDataStore } from '@/stores/useDataStore';
import { toast } from 'sonner';
export default function DataCatalog() {
  const navigate = useNavigate();
  const {
    datasets,
    loading,
    fetchDatasets,
    deleteDataset,
    updateDataset
  } = useDataStore();
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets]);
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
      automation: {
        enabled: !enabled,
        status: 'ok'
      }
    });
    toast.success(enabled ? 'Automation disabled' : 'Automation enabled');
  };
  const toggleRestricted = (id: string, restricted: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    updateDataset(id, {
      restricted: !restricted
    });
    toast.success(restricted ? 'Access opened' : 'Access restricted');
  };
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <div className="h-full p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Data</h1>
        <AddDataPopover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <Button variant="ghost" className="text-primary hover:text-primary">
            <svg className="h-4 w-4 mr-1" viewBox="0 0 18.3398 17.9785" fill="none">
              <path d="M3.06641 17.9785L14.9121 17.9785C16.9629 17.9785 17.9785 16.9727 17.9785 14.9609L17.9785 3.02734C17.9785 1.01562 16.9629 0 14.9121 0L3.06641 0C1.02539 0 0 1.01562 0 3.02734L0 14.9609C0 16.9727 1.02539 17.9785 3.06641 17.9785ZM3.08594 16.4062C2.10938 16.4062 1.57227 15.8887 1.57227 14.873L1.57227 3.11523C1.57227 2.09961 2.10938 1.57227 3.08594 1.57227L14.8926 1.57227C15.8594 1.57227 16.4062 2.09961 16.4062 3.11523L16.4062 14.873C16.4062 15.8887 15.8594 16.4062 14.8926 16.4062Z" fill="currentColor" fillOpacity="0.85" />
              <path d="M9.81445 12.666L9.81445 5.2832C9.81445 4.78516 9.47266 4.44336 8.98438 4.44336C8.50586 4.44336 8.17383 4.78516 8.17383 5.2832L8.17383 12.666C8.17383 13.1543 8.50586 13.4961 8.98438 13.4961C9.47266 13.4961 9.81445 13.1641 9.81445 12.666ZM5.30273 9.78516L12.6953 9.78516C13.1836 9.78516 13.5254 9.46289 13.5254 8.98438C13.5254 8.49609 13.1836 8.1543 12.6953 8.1543L5.30273 8.1543C4.80469 8.1543 4.47266 8.49609 4.47266 8.98438C4.47266 9.46289 4.80469 9.78516 5.30273 9.78516Z" fill="currentColor" fillOpacity="0.85" />
            </svg>
            Add data
          </Button>
        </AddDataPopover>
      </div>

      {/* Data Table */}
      <DataTable datasets={datasets} navigate={navigate} handleDelete={handleDelete} toggleAutomation={toggleAutomation} toggleRestricted={toggleRestricted} />
    </div>;
}