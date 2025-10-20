import { create } from 'zustand';
import type { SpaceNode, Dataset, ID } from '@/types';

interface DataStore {
  spaces: SpaceNode[];
  datasets: Dataset[];
  addSpace: (name: string) => void;
  addFolder: (spaceId: ID, name: string) => void;
  addPage: (spaceId: ID, folderId: ID, name: string) => void;
  getSpace: (id: ID) => SpaceNode | undefined;
  getPage: (id: ID) => { space: SpaceNode; folder: any; page: any } | undefined;
  addDataset: (dataset: Omit<Dataset, 'id' | 'audit'>) => void;
  updateDataset: (id: ID, updates: Partial<Dataset>) => void;
  deleteDataset: (id: ID) => void;
  getDataset: (id: ID) => Dataset | undefined;
}

// Mock data for demo
const initialSpaces: SpaceNode[] = [
  {
    id: 'space-1',
    name: 'Q1 2025 Planning',
    expanded: true,
    folders: [
      {
        id: 'folder-1',
        name: 'Revenue Forecasts',
        expanded: true,
        pages: [
          { id: 'page-1', name: 'Product Revenue', lastModified: '2025-01-15' },
          { id: 'page-2', name: 'Regional Breakdown', lastModified: '2025-01-14' },
        ],
      },
      {
        id: 'folder-2',
        name: 'Expense Planning',
        pages: [
          { id: 'page-3', name: 'Headcount Model', lastModified: '2025-01-10' },
        ],
      },
    ],
  },
  {
    id: 'space-2',
    name: 'Annual Budget 2025',
    folders: [
      {
        id: 'folder-3',
        name: 'Departmental Budgets',
        pages: [
          { id: 'page-4', name: 'Engineering', lastModified: '2024-12-20' },
          { id: 'page-5', name: 'Sales & Marketing', lastModified: '2024-12-18' },
        ],
      },
    ],
  },
];

const initialDatasets: Dataset[] = [
  {
    id: 'ds-1',
    name: 'CRM Opportunities',
    source: 'NetSuite',
    type: 'transactional',
    environment: 'CRM',
    automation: { enabled: true, status: 'ok' },
    audit: { updatedAt: '2025-01-15T10:30:00Z', updatedBy: 'john@company.com' },
    restricted: false,
  },
  {
    id: 'ds-2',
    name: 'Headcount Snapshot',
    source: 'Rippling',
    type: 'snapshot',
    environment: 'Headcount',
    automation: { enabled: true, status: 'ok' },
    audit: { updatedAt: '2025-01-15T08:00:00Z', updatedBy: 'hr@company.com' },
    restricted: true,
  },
  {
    id: 'ds-3',
    name: 'Financial Actuals',
    source: 'Sage Intacct',
    type: 'transactional',
    environment: 'ERP',
    automation: { enabled: true, status: 'stale' },
    audit: { updatedAt: '2025-01-10T14:22:00Z', updatedBy: 'finance@company.com' },
    restricted: false,
  },
  {
    id: 'ds-4',
    name: 'Revenue Dashboard',
    source: 'Looker',
    type: 'snapshot',
    environment: 'BI',
    automation: { enabled: false, status: 'ok' },
    audit: { updatedAt: '2025-01-14T16:45:00Z', updatedBy: 'analyst@company.com' },
    restricted: false,
  },
];

export const useDataStore = create<DataStore>((set, get) => ({
  spaces: initialSpaces,
  datasets: initialDatasets,
  
  addSpace: (name) => {
    const newSpace: SpaceNode = {
      id: `space-${Date.now()}`,
      name,
      folders: [],
      expanded: true,
    };
    set((state) => ({ spaces: [...state.spaces, newSpace] }));
  },
  
  addFolder: (spaceId, name) => {
    set((state) => ({
      spaces: state.spaces.map((space) =>
        space.id === spaceId
          ? {
              ...space,
              folders: [
                ...space.folders,
                {
                  id: `folder-${Date.now()}`,
                  name,
                  pages: [],
                  expanded: true,
                },
              ],
            }
          : space
      ),
    }));
  },
  
  addPage: (spaceId, folderId, name) => {
    set((state) => ({
      spaces: state.spaces.map((space) =>
        space.id === spaceId
          ? {
              ...space,
              folders: space.folders.map((folder) =>
                folder.id === folderId
                  ? {
                      ...folder,
                      pages: [
                        ...folder.pages,
                        {
                          id: `page-${Date.now()}`,
                          name,
                          lastModified: new Date().toISOString(),
                        },
                      ],
                    }
                  : folder
              ),
            }
          : space
      ),
    }));
  },
  
  getSpace: (id) => get().spaces.find((s) => s.id === id),
  
  getPage: (id) => {
    for (const space of get().spaces) {
      for (const folder of space.folders) {
        const page = folder.pages.find((p) => p.id === id);
        if (page) return { space, folder, page };
      }
    }
    return undefined;
  },
  
  addDataset: (dataset) => {
    const newDataset: Dataset = {
      ...dataset,
      id: `ds-${Date.now()}`,
      audit: {
        updatedAt: new Date().toISOString(),
        updatedBy: 'current-user@company.com',
      },
    };
    set((state) => ({ datasets: [...state.datasets, newDataset] }));
  },
  
  updateDataset: (id, updates) => {
    set((state) => ({
      datasets: state.datasets.map((ds) =>
        ds.id === id
          ? {
              ...ds,
              ...updates,
              audit: {
                ...ds.audit,
                updatedAt: new Date().toISOString(),
                updatedBy: 'current-user@company.com',
              },
            }
          : ds
      ),
    }));
  },
  
  deleteDataset: (id) => {
    set((state) => ({
      datasets: state.datasets.filter((ds) => ds.id !== id),
    }));
  },
  
  getDataset: (id) => get().datasets.find((ds) => ds.id === id),
}));
