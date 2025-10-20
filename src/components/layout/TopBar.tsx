import { Search, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AccountPopover } from '@/components/account/AccountPopover';
import { useDataStore } from '@/stores/useDataStore';

export function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getPage, getSpace } = useDataStore();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const crumbs: { label: string; path?: string }[] = [{ label: 'omnus', path: '/' }];

    if (path.startsWith('/page/')) {
      const pageId = path.split('/')[2];
      const result = getPage(pageId);
      if (result) {
        crumbs.push(
          { label: result.space.name, path: `/space/${result.space.id}` },
          { label: result.folder.name },
          { label: result.page.name }
        );
      }
    } else if (path.startsWith('/space/')) {
      const spaceId = path.split('/')[2];
      const space = getSpace(spaceId);
      if (space) crumbs.push({ label: space.name });
    } else if (path === '/data') {
      crumbs.push({ label: 'Data Catalog' });
    } else if (path.startsWith('/data/')) {
      crumbs.push({ label: 'Data Catalog', path: '/data' }, { label: 'Dataset' });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 shadow-sm">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm">
        {breadcrumbs.map((crumb, idx) => (
          <div key={idx} className="flex items-center gap-1">
            {idx > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            {crumb.path ? (
              <button
                onClick={() => navigate(crumb.path!)}
                className="text-foreground hover:text-primary transition-colors"
              >
                {crumb.label}
              </button>
            ) : (
              <span className="text-muted-foreground">{crumb.label}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Search & Account */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search (press /)"
            className="w-64 pl-8 bg-secondary border-border"
          />
        </div>
        <AccountPopover />
      </div>
    </header>
  );
}
