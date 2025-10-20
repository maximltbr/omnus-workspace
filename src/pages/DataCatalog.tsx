import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, MoreVertical, Lock, Zap, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateDatasetDialog } from '@/components/data/CreateDatasetDialog';
import { UploadDataDialog } from '@/components/data/UploadDataDialog';
import { DataTable } from '@/components/data/DataTable';
import { useDataStore } from '@/stores/useDataStore';
import { toast } from 'sonner';
import type { Dataset, Environment } from '@/types';

export default function DataCatalog() {
  const navigate = useNavigate();
  const { datasets, deleteDataset, updateDataset } = useDataStore();
  const [search, setSearch] = useState('');
  const [activeEnv, setActiveEnv] = useState<Environment | 'all'>('all');

  const environments: (Environment | 'all')[] = ['all', 'CRM', 'ERP', 'Headcount', 'BI'];

  const filteredDatasets = datasets.filter((ds) => {
    const matchesSearch = ds.name.toLowerCase().includes(search.toLowerCase());
    const matchesEnv = activeEnv === 'all' || ds.environment === activeEnv;
    return matchesSearch && matchesEnv;
  });

  const groupedDatasets = filteredDatasets.reduce((acc, ds) => {
    const env = ds.environment;
    if (!acc[env]) acc[env] = [];
    acc[env].push(ds);
    return acc;
  }, {} as Record<string, Dataset[]>);

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

  const getStatusIcon = (status: Dataset['automation']['status']) => {
    switch (status) {
      case 'ok':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'stale':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
  };

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Database className="h-8 w-8" />
            Data Catalog
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all connected data sources
          </p>
        </div>
        <div className="flex gap-2">
          <UploadDataDialog />
          <CreateDatasetDialog />
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search datasets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Tabs value={activeEnv} onValueChange={(v) => setActiveEnv(v as Environment | 'all')}>
          <TabsList>
            {environments.map((env) => (
              <TabsTrigger key={env} value={env} className="capitalize">
                {env === 'all' ? 'All' : env}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Grouped Tables by Environment */}
      <div className="space-y-6">
        {activeEnv === 'all' ? (
          // Show grouped by environment
          Object.entries(groupedDatasets).map(([env, envDatasets]) => (
            <div key={env} className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{env}</h2>
                <Badge variant="secondary">{envDatasets.length}</Badge>
              </div>
              <DataTable
                datasets={envDatasets}
                navigate={navigate}
                getStatusIcon={getStatusIcon}
                handleDelete={handleDelete}
                toggleAutomation={toggleAutomation}
                toggleRestricted={toggleRestricted}
              />
            </div>
          ))
        ) : (
          // Show single environment
          <DataTable
            datasets={filteredDatasets}
            navigate={navigate}
            getStatusIcon={getStatusIcon}
            handleDelete={handleDelete}
            toggleAutomation={toggleAutomation}
            toggleRestricted={toggleRestricted}
          />
        )}
        
        {filteredDatasets.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>No datasets found</p>
          </div>
        )}
      </div>
    </div>
  );
}
