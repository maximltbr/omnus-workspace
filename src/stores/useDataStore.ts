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

const initialSpaces: SpaceNode[] = [];

const initialDatasets: Dataset[] = [
  {
    id: 'ds-1',
    name: 'MRR - Billings & Existing',
    source: 'Excel',
    type: 'snapshot',
    automation: { enabled: false, status: 'ok' },
    audit: {
      updatedAt: new Date(Date.now() - 5 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'agent.abacum@company.com',
    },
    restricted: true,
    environment: 'CRM',
  },
  {
    id: 'ds-2',
    name: 'MRR - Contraction & Churn',
    source: 'Excel',
    type: 'transactional',
    automation: { enabled: false, status: 'ok' },
    audit: {
      updatedAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'agent.abacum@company.com',
    },
    restricted: true,
    environment: 'CRM',
  },
  {
    id: 'ds-3',
    name: 'MRR - New & Existing',
    source: 'Excel',
    type: 'transactional',
    automation: { enabled: false, status: 'ok' },
    audit: {
      updatedAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'agent.abacum@company.com',
    },
    restricted: true,
    environment: 'CRM',
  },
  {
    id: 'ds-4',
    name: 'GL Spain',
    source: 'Sage Intacct',
    type: 'transactional',
    automation: { enabled: true, status: 'ok' },
    audit: {
      updatedAt: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'agent.abacum@company.com',
    },
    restricted: true,
    environment: 'ERP',
  },
  {
    id: 'ds-5',
    name: 'GL US',
    source: 'NetSuite',
    type: 'transactional',
    automation: { enabled: true, status: 'ok' },
    audit: {
      updatedAt: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'george.weeks@company.com',
    },
    restricted: true,
    environment: 'ERP',
  },
  {
    id: 'ds-6',
    name: 'TB Spain',
    source: 'Sage Intacct',
    type: 'transactional',
    automation: { enabled: true, status: 'ok' },
    audit: {
      updatedAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'agent.abacum@company.com',
    },
    restricted: true,
    environment: 'ERP',
  },
  {
    id: 'ds-7',
    name: 'TB US',
    source: 'NetSuite',
    type: 'transactional',
    automation: { enabled: true, status: 'ok' },
    audit: {
      updatedAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'agent.abacum@company.com',
    },
    restricted: true,
    environment: 'ERP',
  },
  {
    id: 'ds-8',
    name: 'Staff Roster',
    source: 'Rippling',
    type: 'snapshot',
    automation: { enabled: true, status: 'ok' },
    audit: {
      updatedAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'agent.abacum@company.com',
    },
    restricted: true,
    environment: 'Headcount',
  },
  {
    id: 'ds-9',
    name: 'tax pension rates',
    source: 'Excel',
    type: 'transactional',
    automation: { enabled: false, status: 'ok' },
    audit: {
      updatedAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'agent.abacum@company.com',
    },
    restricted: false,
    environment: 'Headcount',
  },
  {
    id: 'ds-10',
    name: 'KPIs',
    source: 'Looker',
    type: 'transactional',
    automation: { enabled: true, status: 'ok' },
    audit: {
      updatedAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'george.weeks@company.com',
    },
    restricted: true,
    environment: 'BI',
  },
  {
    id: 'ds-11',
    name: 'Marketing Spend Tracking',
    source: 'Excel',
    type: 'transactional',
    automation: { enabled: false, status: 'ok' },
    audit: {
      updatedAt: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'agent.abacum@company.com',
    },
    restricted: true,
    environment: 'BI',
  },
  {
    id: 'ds-12',
    name: '3YP Pipe',
    source: 'Google Sheets',
    type: 'snapshot',
    automation: { enabled: false, status: 'ok' },
    audit: {
      updatedAt: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'auto-updated@company.com',
    },
    restricted: true,
    environment: 'Other',
  },
  {
    id: 'ds-13',
    name: '3YP Pipeline',
    source: 'Excel',
    type: 'transactional',
    automation: { enabled: false, status: 'ok' },
    audit: {
      updatedAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'agent.abacum@company.com',
    },
    restricted: true,
    environment: 'Other',
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
