import { Clock, FileText, Database, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/stores/useDataStore';
import { useUIStore } from '@/stores/useUIStore';

export default function Home() {
  const navigate = useNavigate();
  const { spaces, datasets } = useDataStore();
  const { recentPages } = useUIStore();

  const allPages = spaces.flatMap((space) =>
    space.folders.flatMap((folder) =>
      folder.pages.map((page) => ({ ...page, spaceName: space.name, folderName: folder.name }))
    )
  );

  const recentPagesData = recentPages
    .map((id) => allPages.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Hero */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Welcome to omnus</h1>
        <p className="text-lg text-muted-foreground">
          Your FP&amp;A workspace for modeling, planning, and analysis
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spaces</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spaces.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Datasets</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{datasets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pages</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allPages.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Pages
          </CardTitle>
          <CardDescription>Pick up where you left off</CardDescription>
        </CardHeader>
        <CardContent>
          {recentPagesData.length > 0 ? (
            <div className="space-y-2">
              {recentPagesData.map((page: any) => (
                <Button
                  key={page.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/page/${page.id}`)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <div className="flex-1 text-left">
                    <div className="font-medium">{page.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {page.spaceName} / {page.folderName}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No recent pages yet. Start exploring!</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get started</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={() => navigate('/data')}>View Data Catalog</Button>
          <Button variant="outline">Create New Page</Button>
          <Button variant="outline">Upload Dataset</Button>
        </CardContent>
      </Card>
    </div>
  );
}
