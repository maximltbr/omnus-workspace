import { Lock, Zap, MoreVertical } from 'lucide-react';
import { NavigateFunction } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
import type { Dataset } from '@/types';

interface DataTableProps {
  datasets: Dataset[];
  navigate: NavigateFunction;
  getStatusIcon: (status: Dataset['automation']['status']) => JSX.Element;
  handleDelete: (id: string, name: string, e: React.MouseEvent) => void;
  toggleAutomation: (id: string, enabled: boolean, e: React.MouseEvent) => void;
  toggleRestricted: (id: string, restricted: boolean, e: React.MouseEvent) => void;
}

export function DataTable({
  datasets,
  navigate,
  getStatusIcon,
  handleDelete,
  toggleAutomation,
  toggleRestricted,
}: DataTableProps) {
  return (
    <div className="rounded-lg border border-table-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-table-header hover:bg-table-header">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Source</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Automation</TableHead>
            <TableHead className="font-semibold">Last Updated</TableHead>
            <TableHead className="font-semibold">Updated By</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datasets.map((dataset) => (
            <TableRow
              key={dataset.id}
              className="cursor-pointer hover:bg-table-hover transition-colors"
              onClick={() => navigate(`/data/${dataset.id}`)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {dataset.name}
                  {dataset.restricted && (
                    <Lock className="h-3.5 w-3.5 text-amber-600" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-mono text-xs">
                  {dataset.source}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={dataset.type === 'snapshot' ? 'secondary' : 'default'}>
                  {dataset.type}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {dataset.automation.enabled && (
                    <Zap className="h-4 w-4 text-primary" />
                  )}
                  {getStatusIcon(dataset.automation.status)}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(dataset.audit.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {dataset.audit.updatedBy.split('@')[0]}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover">
                    <DropdownMenuItem onClick={() => navigate(`/data/${dataset.id}`)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Rename</DropdownMenuItem>
                    <DropdownMenuItem>Change Type</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => toggleAutomation(dataset.id, dataset.automation.enabled, e)}
                    >
                      {dataset.automation.enabled ? 'Disable' : 'Enable'} Automation
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => toggleRestricted(dataset.id, dataset.restricted, e)}
                    >
                      {dataset.restricted ? 'Remove' : 'Add'} Restrictions
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View Audit Log</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={(e) => handleDelete(dataset.id, dataset.name, e)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
