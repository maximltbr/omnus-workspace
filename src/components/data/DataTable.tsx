import { Lock, ChevronDown, ChevronRight, GripVertical, MoreVertical } from 'lucide-react';
import { NavigateFunction } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import type { Dataset, Environment } from '@/types';

interface DataTableProps {
  datasets: Dataset[];
  navigate: NavigateFunction;
  handleDelete: (id: string, name: string, e: React.MouseEvent) => void;
  toggleAutomation: (id: string, enabled: boolean, e: React.MouseEvent) => void;
  toggleRestricted: (id: string, restricted: boolean, e: React.MouseEvent) => void;
}

const getSourceIcon = (source: string) => {
  const iconClass = "h-4 w-4 flex-shrink-0";
  switch (source) {
    case 'Excel':
      return (
        <div className="h-5 w-5 rounded flex items-center justify-center bg-green-600">
          <svg className={iconClass} viewBox="0 0 24 24" fill="white">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
            <path d="M14 2v6h6M9.5 11.5l-1.5 3 1.5 3M14.5 11.5l1.5 3-1.5 3" stroke="white" fill="none" />
          </svg>
        </div>
      );
    case 'NetSuite':
      return <div className="h-5 w-5 rounded-full bg-foreground flex-shrink-0" />;
    case 'Sage Intacct':
      return <div className="h-5 w-5 rounded-full bg-foreground flex-shrink-0" />;
    case 'Rippling':
      return (
        <div className="h-5 w-5 rounded flex items-center justify-center bg-amber-500">
          <span className="text-white text-xs font-bold">R</span>
        </div>
      );
    case 'Looker':
      return (
        <div className="h-5 w-5 rounded flex items-center justify-center bg-blue-500">
          <span className="text-white text-xs font-bold">L</span>
        </div>
      );
    case 'Google Sheets':
      return (
        <div className="h-5 w-5 rounded flex items-center justify-center bg-green-500">
          <span className="text-white text-xs font-bold">G</span>
        </div>
      );
    default:
      return <div className="h-5 w-5 rounded-full bg-muted flex-shrink-0" />;
  }
};

const getUserInitials = (email: string) => {
  const name = email.split('@')[0];
  const parts = name.split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMonths = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));
  
  if (diffInMonths === 0) {
    return 'this month';
  } else if (diffInMonths === 1) {
    return '1 month ago';
  } else if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  } else {
    return `${Math.floor(diffInMonths / 12)} year${Math.floor(diffInMonths / 12) > 1 ? 's' : ''} ago`;
  }
};

export function DataTable({
  datasets,
  navigate,
  handleDelete,
  toggleAutomation,
  toggleRestricted,
}: DataTableProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    CRM: true,
    ERP: true,
    Headcount: true,
    BI: true,
    Other: true,
  });

  // Group datasets by environment
  const groupedDatasets = datasets.reduce((acc, ds) => {
    const env = ds.environment || 'Other';
    if (!acc[env]) acc[env] = [];
    acc[env].push(ds);
    return acc;
  }, {} as Record<string, Dataset[]>);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="font-medium text-muted-foreground w-[300px]">Name</TableHead>
            <TableHead className="font-medium text-muted-foreground">Source</TableHead>
            <TableHead className="font-medium text-muted-foreground">Type</TableHead>
            <TableHead className="font-medium text-muted-foreground">Last modified</TableHead>
            <TableHead className="font-medium text-muted-foreground">Last modified by</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupedDatasets).map(([section, sectionDatasets]) => (
            <>
              <TableRow
                key={`section-${section}`}
                className="border-b hover:bg-muted/50 cursor-pointer"
                onClick={() => toggleSection(section)}
              >
                <TableCell colSpan={6} className="py-2.5">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    {expandedSections[section] ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-semibold text-sm">{section}</span>
                  </div>
                </TableCell>
              </TableRow>
              {expandedSections[section] &&
                sectionDatasets.map((dataset) => (
                  <TableRow
                    key={dataset.id}
                    className="cursor-pointer hover:bg-muted/30 transition-colors border-b"
                    onClick={() => navigate(`/data/${dataset.id}`)}
                  >
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-2 pl-10">
                        <span className="text-sm">{dataset.name}</span>
                        {dataset.restricted && (
                          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-2">
                        {getSourceIcon(dataset.source)}
                        <span className="text-sm">{dataset.source}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span className="text-sm text-muted-foreground capitalize">
                        {dataset.type}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <span className="text-sm text-muted-foreground">
                        {formatTimeAgo(dataset.audit.updatedAt)}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[10px] bg-muted">
                            {getUserInitials(dataset.audit.updatedBy)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          {dataset.audit.updatedBy.split('@')[0].replace(/[._-]/g, ' ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/data/${dataset.id}`)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Rename</DropdownMenuItem>
                          <DropdownMenuItem>Change Type</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) =>
                              toggleAutomation(dataset.id, dataset.automation.enabled, e)
                            }
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
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
