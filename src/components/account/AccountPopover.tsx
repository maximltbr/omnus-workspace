import { User, Settings, Keyboard, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface Profile {
  first_name: string | null;
  last_name: string | null;
  title: string | null;
}

export function AccountPopover() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string>('');
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // Get user session and profile
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserEmail(session.user.email || '');
        
        // Fetch profile data
        setTimeout(() => {
          supabase
            .from('profiles')
            .select('first_name, last_name, title')
            .eq('id', session.user.id)
            .maybeSingle()
            .then(({ data }) => {
              if (data) {
                setProfile(data);
              }
            });
        }, 0);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email || '');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/auth');
    }
  };

  const displayName = profile?.first_name && profile?.last_name
    ? `${profile.first_name} ${profile.last_name}`
    : userEmail.split('@')[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">{displayName}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 bg-popover" align="end">
        <div className="p-3 space-y-1">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-muted-foreground">{userEmail}</p>
          {profile?.title && (
            <p className="text-xs text-muted-foreground">{profile.title}</p>
          )}
        </div>
        
        <Separator />
        
        <div className="p-1">
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start" size="sm">
            <Keyboard className="h-4 w-4 mr-2" />
            Keyboard Shortcuts
          </Button>
        </div>
        
        <Separator />
        
        <div className="p-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            size="sm"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
