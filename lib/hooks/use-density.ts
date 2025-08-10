'use client';

import { useState, useEffect } from 'react';

type Density = 'compact' | 'comfortable' | 'spacious';

export function useDensity() {
  const [density, setDensity] = useState<Density>('comfortable');

  useEffect(() => {
    // Load density preference from localStorage
    const savedDensity = localStorage.getItem('table-density') as Density;
    if (savedDensity && ['compact', 'comfortable', 'spacious'].includes(savedDensity)) {
      setDensity(savedDensity);
    }
  }, []);

  const updateDensity = (newDensity: Density) => {
    setDensity(newDensity);
    localStorage.setItem('table-density', newDensity);
  };

  const densityClasses = {
    compact: {
      row: 'py-2',
      cell: 'px-2 py-1 text-sm',
      header: 'px-2 py-2 text-sm font-medium'
    },
    comfortable: {
      row: 'py-3',
      cell: 'px-4 py-2',
      header: 'px-4 py-3 font-medium'
    },
    spacious: {
      row: 'py-4',
      cell: 'px-6 py-3 text-base',
      header: 'px-6 py-4 text-base font-medium'
    }
  };

  return {
    density,
    updateDensity,
    densityClasses: densityClasses[density]
  };
}
