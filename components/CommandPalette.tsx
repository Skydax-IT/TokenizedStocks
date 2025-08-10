'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  SearchIcon, 
  TrendingUpIcon, 
  TrendingDownIcon,
  BarChart3Icon,
  FileTextIcon,
  SettingsIcon,
  HomeIcon,
  StarIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const commandItems: CommandItem[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      subtitle: 'Go to main dashboard',
      icon: <HomeIcon className="h-4 w-4" />,
      action: () => router.push('/'),
      category: 'Navigation'
    },
    {
      id: 'tokens',
      title: 'All Tokens',
      subtitle: 'View all tokenized stocks',
      icon: <BarChart3Icon className="h-4 w-4" />,
      action: () => router.push('/tokens'),
      category: 'Navigation'
    },
    {
      id: 'docs',
      title: 'Documentation',
      subtitle: 'API documentation and guides',
      icon: <FileTextIcon className="h-4 w-4" />,
      action: () => router.push('/docs'),
      category: 'Navigation'
    },
    {
      id: 'styleguide',
      title: 'Styleguide',
      subtitle: 'Design system and components',
      icon: <SettingsIcon className="h-4 w-4" />,
      action: () => router.push('/styleguide'),
      category: 'Navigation'
    },
    {
      id: 'watchlist',
      title: 'Watchlist',
      subtitle: 'Manage your watchlist',
      icon: <StarIcon className="h-4 w-4" />,
      category: 'Features'
    },
    {
      id: 'trending-up',
      title: 'Top Gainers',
      subtitle: 'View top performing tokens',
      icon: <TrendingUpIcon className="h-4 w-4" />,
      category: 'Features'
    },
    {
      id: 'trending-down',
      title: 'Top Losers',
      subtitle: 'View declining tokens',
      icon: <TrendingDownIcon className="h-4 w-4" />,
      category: 'Features'
    }
  ];

  const filteredItems = commandItems.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <>
      <Button
        variant="outline"
        className="relative justify-start text-sm text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4" />
        <span>Search or jump to...</span>
        <Badge variant="secondary" className="ml-auto">
          ⌘K
        </Badge>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Command Palette</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Search for pages, actions, or jump to any section
            </p>
          </DialogHeader>
          
          <Command className="overflow-hidden">
            <div className="flex items-center border-b px-3">
              <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Command.Input
                placeholder="Type a command or search..."
                value={search}
                onValueChange={setSearch}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            
            <Command.List className="max-h-[400px] overflow-y-auto p-2">
              <AnimatePresence>
                {Object.entries(groupedItems).map(([category, items]) => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Command.Group heading={category} className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Command.Item
                            value={item.id}
                            onSelect={() => {
                              item.action();
                              setOpen(false);
                            }}
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground"
                          >
                            <div className="mr-2 flex h-4 w-4 items-center justify-center">
                              {item.icon}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">{item.title}</span>
                              <span className="text-xs text-muted-foreground">{item.subtitle}</span>
                            </div>
                          </Command.Item>
                        </motion.div>
                      ))}
                    </Command.Group>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredItems.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-6 text-center text-sm text-muted-foreground"
                >
                  No results found.
                </motion.div>
              )}
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
