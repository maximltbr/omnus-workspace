import { create } from 'zustand';
import type { SpaceNode, Dataset, ID } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DataStore {
  spaces: SpaceNode[];
  datasets: Dataset[];
  loading: boolean;
  addSpace: (name: string) => void;
  addFolder: (spaceId: ID, name: string) => void;
  addPage: (spaceId: ID, folderId: ID, name: string) => void;
  updatePage: (pageId: ID, updates: Partial<{ name: string; content: string }>) => void;
  getSpace: (id: ID) => SpaceNode | undefined;
  getPage: (id: ID) => { space: SpaceNode; folder: any; page: any } | undefined;
  fetchDatasets: () => Promise<void>;
  addDataset: (dataset: Omit<Dataset, 'id' | 'audit'>) => Promise<void>;
  updateDataset: (id: ID, updates: Partial<Dataset>) => Promise<void>;
  deleteDataset: (id: ID) => Promise<void>;
  getDataset: (id: ID) => Dataset | undefined;
}

const initialSpaces: SpaceNode[] = [
  {
    id: 'space-1',
    name: 'Marketing',
    expanded: true,
    folders: [
      {
        id: 'folder-1',
        name: 'Campaigns',
        expanded: true,
        pages: [
          {
            id: 'page-1',
            name: 'Q1 Campaign Strategy',
            content: '<h1>Q1 Campaign Strategy</h1><p>Welcome to your first page! Start typing to add content...</p>',
            lastModified: new Date().toISOString(),
          },
          {
            id: 'page-2',
            name: 'Social Media Plan',
            content: '',
            lastModified: new Date().toISOString(),
          },
        ],
      },
      {
        id: 'folder-2',
        name: 'Analytics',
        expanded: false,
        pages: [
          {
            id: 'page-3',
            name: 'Monthly Report',
            content: '',
            lastModified: new Date().toISOString(),
          },
        ],
      },
    ],
  },
];

const initialDatasets: Dataset[] = [];

export const useDataStore = create<DataStore>((set, get) => ({
  spaces: initialSpaces,
  datasets: initialDatasets,
  loading: false,
  
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
                          content: '',
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
  
  updatePage: (pageId, updates) => {
    set((state) => ({
      spaces: state.spaces.map((space) => ({
        ...space,
        folders: space.folders.map((folder) => ({
          ...folder,
          pages: folder.pages.map((page) =>
            page.id === pageId
              ? {
                  ...page,
                  ...updates,
                  lastModified: new Date().toISOString(),
                }
              : page
          ),
        })),
      })),
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
  
  fetchDatasets: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('datasets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const datasets: Dataset[] = (data || []).map((row) => ({
        id: row.id,
        name: row.name,
        source: row.source as any,
        type: row.type as any,
        automation: {
          enabled: row.automation_enabled,
          status: row.automation_status as any,
        },
        audit: {
          updatedAt: row.updated_at,
          updatedBy: row.updated_by,
        },
        restricted: row.restricted,
        environment: row.environment,
        data: row.data as any,
      }));

      set({ datasets, loading: false });
    } catch (error) {
      console.error('Error fetching datasets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load datasets',
        variant: 'destructive',
      });
      set({ loading: false });
    }
  },

  addDataset: async (dataset) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('datasets')
        .insert({
          user_id: user.id,
          name: dataset.name,
          source: dataset.source,
          type: dataset.type,
          automation_enabled: dataset.automation.enabled,
          automation_status: dataset.automation.status,
          restricted: dataset.restricted,
          environment: dataset.environment,
          data: dataset.data as any,
          updated_by: user.email || 'unknown',
        })
        .select()
        .single();

      if (error) throw error;

      const newDataset: Dataset = {
        id: data.id,
        name: data.name,
        source: data.source as any,
        type: data.type as any,
        automation: {
          enabled: data.automation_enabled,
          status: data.automation_status as any,
        },
        audit: {
          updatedAt: data.updated_at,
          updatedBy: data.updated_by,
        },
        restricted: data.restricted,
        environment: data.environment,
        data: data.data as any,
      };

      set((state) => ({ datasets: [...state.datasets, newDataset] }));
      toast({
        title: 'Success',
        description: 'Dataset added successfully',
      });
    } catch (error) {
      console.error('Error adding dataset:', error);
      toast({
        title: 'Error',
        description: 'Failed to add dataset',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  updateDataset: async (id, updates) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const updateData: any = {
        updated_by: user.email || 'unknown',
      };

      if (updates.name) updateData.name = updates.name;
      if (updates.source) updateData.source = updates.source;
      if (updates.type) updateData.type = updates.type;
      if (updates.automation) {
        updateData.automation_enabled = updates.automation.enabled;
        updateData.automation_status = updates.automation.status;
      }
      if (updates.restricted !== undefined) updateData.restricted = updates.restricted;
      if (updates.environment) updateData.environment = updates.environment;
      if (updates.data) updateData.data = updates.data;

      const { error } = await supabase
        .from('datasets')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        datasets: state.datasets.map((ds) =>
          ds.id === id
            ? {
                ...ds,
                ...updates,
                audit: {
                  ...ds.audit,
                  updatedAt: new Date().toISOString(),
                  updatedBy: user.email || 'unknown',
                },
              }
            : ds
        ),
      }));
    } catch (error) {
      console.error('Error updating dataset:', error);
      toast({
        title: 'Error',
        description: 'Failed to update dataset',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  deleteDataset: async (id) => {
    try {
      const { error } = await supabase
        .from('datasets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        datasets: state.datasets.filter((ds) => ds.id !== id),
      }));
      toast({
        title: 'Success',
        description: 'Dataset deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting dataset:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete dataset',
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  getDataset: (id) => get().datasets.find((ds) => ds.id === id),
}));
