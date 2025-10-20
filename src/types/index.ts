export type ID = string;

export type DatasetType = 'snapshot' | 'transactional';

export type SourceSystem =
  | 'Excel'
  | 'NetSuite'
  | 'Sage Intacct'
  | 'Rippling'
  | 'Looker'
  | 'Google Sheets'
  | 'CSV'
  | 'XLSX';

export type Environment = 'CRM' | 'ERP' | 'Headcount' | 'BI' | string;

export interface Dataset {
  id: ID;
  name: string;
  source: SourceSystem;
  type: DatasetType;
  automation: {
    enabled: boolean;
    status: 'ok' | 'stale' | 'error';
  };
  audit: {
    updatedAt: string;
    updatedBy: string;
  };
  restricted: boolean;
  environment: Environment;
}

export interface PageNode {
  id: ID;
  name: string;
  content?: string;
  lastModified?: string;
}

export interface FolderNode {
  id: ID;
  name: string;
  pages: PageNode[];
  expanded?: boolean;
}

export interface SpaceNode {
  id: ID;
  name: string;
  folders: FolderNode[];
  expanded?: boolean;
}

export interface UIState {
  leftPinned: boolean;
  rightPinned: boolean;
  leftExpanded: Record<ID, boolean>;
  rightExpanded: boolean;
  paneWidths: {
    left: number;
    right: number;
  };
  currentPage?: ID;
  recentPages: ID[];
}
