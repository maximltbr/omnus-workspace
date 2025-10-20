import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Upload, MoreVertical, Lock, Zap, AlertCircle, CheckCircle } from 'lucide-react';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDataStore } from '@/stores/useDataStore';
import type { Dataset } from '@/types';

export default function DataCatalog() {
  const navigate = useNavigate();
  const { datasets } = useDataStore();
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);

  const filteredDatasets = datasets.filter((ds) => {
    const matchesSearch = ds.name.toLowerCase().includes(search.toLowerCase());
    const matchesSource = !sourceFilter || ds.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const sources = Array.from(new Set(datasets.map((ds) => ds.source)));

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
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Dataset
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Input
          placeholder="Search datasets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2">
          <Button
            variant={sourceFilter === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSourceFilter(null)}
          >
            All Sources
          </Button>
          {sources.map((source) => (
            <Button
              key={source}
              variant={sourceFilter === source ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSourceFilter(source)}
            >
              {source}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-table-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-table-header hover:bg-table-header">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Source</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Environment</TableHead>
              <TableHead className="font-semibold">Automation</TableHead>
              <TableHead className="font-semibold">Last Updated</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDatasets.map((dataset) => (
              <TableRow
                key={dataset.id}
                className="cursor-pointer hover:bg-table-hover transition-colors"
                onClick={() => navigate(`/data/${dataset.id}`)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {dataset.name}
                    {dataset.restricted && <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{dataset.source}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={dataset.type === 'snapshot' ? 'secondary' : 'default'}>
                    {dataset.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">{dataset.environment}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {dataset.automation.enabled && <Zap className="h-4 w-4 text-primary" />}
                    {getStatusIcon(dataset.automation.status)}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(dataset.audit.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuItem>Change Type</DropdownMenuItem>
                      <DropdownMenuItem>Manage Permissions</DropdownMenuItem>
                      <DropdownMenuItem>View Audit Log</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
