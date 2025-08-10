'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedValueProps {
  value: string | number;
  className?: string;
  format?: 'currency' | 'percentage' | 'number';
  showChange?: boolean;
  previousValue?: string | number;
}

export function AnimatedValue({ 
  value, 
  className, 
  format = 'number',
  showChange = false,
  previousValue 
}: AnimatedValueProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      setDisplayValue(value);
      
      // Reset animation state after animation completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  const formatValue = (val: string | number) => {
    if (format === 'currency') {
      return typeof val === 'number' ? `$${val.toFixed(2)}` : val;
    }
    if (format === 'percentage') {
      return typeof val === 'number' ? `${val.toFixed(2)}%` : val;
    }
    return val;
  };

  const getChangeColor = () => {
    if (!previousValue || !showChange) return '';
    
    const current = typeof value === 'number' ? value : parseFloat(value.toString());
    const previous = typeof previousValue === 'number' ? previousValue : parseFloat(previousValue.toString());
    
    if (current > previous) return 'text-green-600 dark:text-green-400';
    if (current < previous) return 'text-red-600 dark:text-red-400';
    return '';
  };

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={displayValue}
        initial={{ 
          opacity: 0, 
          y: -10,
          scale: 1.1,
          color: getChangeColor() || 'inherit'
        }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: 1,
          color: 'inherit'
        }}
        exit={{ 
          opacity: 0, 
          y: 10,
          scale: 0.9
        }}
        transition={{ 
          duration: 0.3,
          ease: 'easeOut'
        }}
        className={cn(
          'inline-block',
          isAnimating && 'font-semibold',
          className
        )}
      >
        {formatValue(displayValue)}
      </motion.span>
    </AnimatePresence>
  );
}

interface AnimatedPercentageProps {
  value: number;
  className?: string;
  showSign?: boolean;
}

export function AnimatedPercentage({ 
  value, 
  className,
  showSign = true 
}: AnimatedPercentageProps) {
  const [isPositive, setIsPositive] = useState(value >= 0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if ((value >= 0) !== isPositive) {
      setIsAnimating(true);
      setIsPositive(value >= 0);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [value, isPositive]);

  const getColorClass = () => {
    if (isPositive) return 'text-green-600 dark:text-green-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <motion.span
      className={cn(
        'inline-flex items-center gap-1',
        getColorClass(),
        isAnimating && 'font-semibold',
        className
      )}
      animate={isAnimating ? {
        scale: [1, 1.1, 1],
        transition: { duration: 0.6, ease: 'easeInOut' }
      } : {}}
    >
      {showSign && (isPositive ? '+' : '')}
      {value.toFixed(2)}%
    </motion.span>
  );
}

interface AnimatedPriceProps {
  value: number;
  className?: string;
  currency?: string;
}

export function AnimatedPrice({ 
  value, 
  className,
  currency = '$' 
}: AnimatedPriceProps) {
  const [previousValue, setPreviousValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== previousValue) {
      setIsAnimating(true);
      setPreviousValue(value);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [value, previousValue]);

  const getChangeColor = () => {
    if (value > previousValue) return 'text-green-600 dark:text-green-400';
    if (value < previousValue) return 'text-red-600 dark:text-red-400';
    return '';
  };

  return (
    <motion.span
      className={cn(
        'inline-block',
        isAnimating && getChangeColor(),
        isAnimating && 'font-semibold',
        className
      )}
      animate={isAnimating ? {
        scale: [1, 1.05, 1],
        transition: { duration: 0.6, ease: 'easeInOut' }
      } : {}}
    >
      {currency}{value.toFixed(2)}
    </motion.span>
  );
}
