'use client';

import { useState, useEffect } from 'react';
import { Wordmark, LogoMark } from '@/components/Brand';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { GithubIcon, Search, Mail, Command } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CommandPalette from './CommandPalette';

export default function Navigation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tokens?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo + Wordmark */}
          <div className="flex items-center gap-3">
            <LogoMark size="md" />
            <Wordmark size="md" />
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search-input"
                type="text"
                placeholder="Search tokens... (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-10 pr-20 h-10 bg-muted/50 border-border focus:bg-background transition-colors"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <Command className="h-3 w-3" />
                  K
                </kbd>
              </div>
            </form>
          </div>

          {/* Right: Command Palette + Theme + GitHub + Subscribe */}
          <div className="flex items-center gap-3">
            <CommandPalette />
            <ThemeToggle />
            
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/Skydax-IT/TokenizedStocks"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9"
                aria-label="GitHub repository"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            </Button>

            <Button variant="default" size="sm" className="gap-2">
              <Mail className="h-4 w-4" />
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
