import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageEditor } from '@/components/editor/PageEditor';
import { useDataStore } from '@/stores/useDataStore';
import { useUIStore } from '@/stores/useUIStore';
import { toast } from 'sonner';

export default function PageView() {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { getPage, updatePage } = useDataStore();
  const { addRecentPage } = useUIStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (pageId) addRecentPage(pageId);
  }, [pageId, addRecentPage]);

  const result = pageId ? getPage(pageId) : undefined;

  useEffect(() => {
    if (result) {
      setTitle(result.page.name);
    }
  }, [result]);

  const handleTitleSave = useCallback(() => {
    if (pageId && title.trim() && title !== result?.page.name) {
      updatePage(pageId, { name: title.trim() });
      toast.success('Title updated');
    }
    setIsEditingTitle(false);
  }, [pageId, title, result?.page.name, updatePage]);

  const handleContentChange = useCallback((content: string) => {
    if (pageId) {
      updatePage(pageId, { content });
    }
  }, [pageId, updatePage]);

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
    <div className="h-full overflow-auto">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <span>/</span>
          <span>{space.name}</span>
          <span>/</span>
          <span>{folder.name}</span>
        </div>

        {/* Page Title */}
        {isEditingTitle ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSave();
              if (e.key === 'Escape') {
                setTitle(page.name);
                setIsEditingTitle(false);
              }
            }}
            className="text-4xl font-bold border-none focus-visible:ring-0 px-0"
            autoFocus
          />
        ) : (
          <h1
            className="text-4xl font-bold cursor-pointer hover:bg-muted/50 rounded px-2 -mx-2 py-1"
            onClick={() => setIsEditingTitle(true)}
          >
            {page.name}
          </h1>
        )}

        {/* Editor */}
        <PageEditor
          content={page.content || ''}
          onChange={handleContentChange}
          placeholder="Start writing your page..."
        />
      </div>
    </div>
  );
}
