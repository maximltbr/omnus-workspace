import { Database, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function DataSection() {
  const navigate = useNavigate();

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full justify-start"
        onClick={() => navigate('/data')}
      >
        <Database className="h-4 w-4 mr-2" />
        View Data Catalog
      </Button>
      
      <Button variant="outline" size="sm" className="w-full">
        <Plus className="h-4 w-4 mr-1" />
        New Dataset
      </Button>
    </div>
  );
}
