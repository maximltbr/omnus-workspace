import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Lock, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useDataStore } from '@/stores/useDataStore';
import { useEffect } from 'react';

export default function DatasetDetails() {
  const { datasetId } = useParams<{ datasetId: string }>();
  const navigate = useNavigate();
  const { datasets, loading, fetchDatasets } = useDataStore();

  useEffect(() => {
    if (datasets.length === 0) {
      fetchDatasets();
    }
  }, [datasets.length, fetchDatasets]);

  const dataset = datasets.find((ds) => ds.id === datasetId);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Dataset not found</h2>
          <Button onClick={() => navigate('/data')}>Back to Catalog</Button>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (dataset.automation.status) {
      case 'ok':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'stale':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
  };

  return (
    <div className="h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/data')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">{dataset.name}</h1>
            {dataset.restricted && <Lock className="h-5 w-5 text-muted-foreground" />}
          </div>
          <p className="text-muted-foreground mt-1">
            {dataset.environment} · {dataset.source}
          </p>
        </div>
        <Button>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={dataset.type === 'snapshot' ? 'secondary' : 'default'}>
              {dataset.type}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Automation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {dataset.automation.enabled && <Zap className="h-4 w-4 text-primary" />}
              {getStatusIcon()}
              <span className="text-sm">
                {dataset.automation.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{new Date(dataset.audit.updatedAt).toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">by {dataset.audit.updatedBy}</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      {dataset.data && (
        <Card>
          <CardHeader>
            <CardTitle>Data</CardTitle>
            <CardDescription>
              {dataset.data.rowCount} rows × {dataset.data.headers.length} columns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-table-header border-b border-table-border">
                      {dataset.data.headers.map((header, i) => (
                        <th key={i} className="px-4 py-3 text-left font-medium">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.data.rows.map((row, i) => (
                      <tr 
                        key={i} 
                        className="border-b border-table-border hover:bg-table-hover transition-colors"
                      >
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-3">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schema */}
      <Card>
        <CardHeader>
          <CardTitle>Schema</CardTitle>
          <CardDescription>Column definitions and data types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            {dataset.data ? (
              <div className="space-y-2">
                {dataset.data.headers.map((header, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{header}</span>
                    <span className="text-muted-foreground">string</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Schema preview would appear here with column names, types, and sample data
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lineage */}
      <Card>
        <CardHeader>
          <CardTitle>Lineage</CardTitle>
          <CardDescription>Data flow and dependencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              Lineage diagram showing upstream and downstream dependencies
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>Recent changes and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start gap-3 text-sm">
              <div className="flex h-2 w-2 mt-1.5 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="font-medium">Dataset refreshed</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(dataset.audit.updatedAt).toLocaleString()} by {dataset.audit.updatedBy}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
