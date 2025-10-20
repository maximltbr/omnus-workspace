import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, BarChart3, Type, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/stores/useDataStore';
import { useUIStore } from '@/stores/useUIStore';

export default function PageView() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { getPage } = useDataStore();
  const { addRecentPage } = useUIStore();

  useEffect(() => {
    if (pageId) addRecentPage(pageId);
  }, [pageId, addRecentPage]);

  const result = pageId ? getPage(pageId) : undefined;

  if (!result) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Page not found</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const { page, space, folder } = result;

  return (
    <div className="h-full p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">{page.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {space.name} / {folder.name}
        </p>
      </div>

      {/* Canvas Placeholder */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Page Canvas</CardTitle>
          <CardDescription>
            Excel-like editor with blocks: Tables, Charts, Text, Formulas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Table className="h-8 w-8" />
              <span>Add Table</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <BarChart3 className="h-8 w-8" />
              <span>Add Chart</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Type className="h-8 w-8" />
              <span>Add Text</span>
            </Button>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
            <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Canvas area - drag blocks to build your model
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
