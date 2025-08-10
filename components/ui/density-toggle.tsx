'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  TableIcon, 
  RowsIcon, 
  SquareIcon 
} from 'lucide-react';
import { motion } from 'framer-motion';

type Density = 'compact' | 'comfortable' | 'spacious';

interface DensityToggleProps {
  value: Density;
  onValueChange: (density: Density) => void;
  className?: string;
}

const densityOptions: { value: Density; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'compact',
    label: 'Compact',
    icon: <RowsIcon className="h-4 w-4" />,
    description: 'More rows per view'
  },
  {
    value: 'comfortable',
    label: 'Comfortable',
    icon: <TableIcon className="h-4 w-4" />,
    description: 'Balanced spacing'
  },
  {
    value: 'spacious',
    label: 'Spacious',
    icon: <SquareIcon className="h-4 w-4" />,
    description: 'Easy to read'
  }
];

export function DensityToggle({ value, onValueChange, className }: DensityToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = densityOptions.find(option => option.value === value);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={className}
          aria-label="Toggle table density"
        >
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {currentOption?.icon}
          </motion.div>
          <span className="ml-2 hidden sm:inline-block">
            {currentOption?.label}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {densityOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => {
              onValueChange(option.value);
              setIsOpen(false);
            }}
            className={cn(
              "flex items-center gap-3 p-3 cursor-pointer",
              value === option.value && "bg-accent text-accent-foreground"
            )}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: densityOptions.indexOf(option) * 0.05 }}
            >
              {option.icon}
            </motion.div>
            <div className="flex flex-col">
              <span className="font-medium">{option.label}</span>
              <span className="text-xs text-muted-foreground">
                {option.description}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Helper function for conditional classes
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
