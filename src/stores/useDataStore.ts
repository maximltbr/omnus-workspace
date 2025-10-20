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

const initialDatasets: Dataset[] = [];

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
