'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedSkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'default' | 'circular' | 'text';
  lines?: number;
}

export function AnimatedSkeleton({ 
  className, 
  width, 
  height, 
  variant = 'default',
  lines = 1 
}: AnimatedSkeletonProps) {
  const shimmerVariants = {
    shimmer: {
      x: ['-100%', '100%'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "h-4 bg-gray-200 dark:bg-gray-800 rounded relative overflow-hidden",
              className
            )}
            style={{ width: i === lines - 1 ? '60%' : '100%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
              variants={shimmerVariants}
              animate="shimmer"
            />
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === 'circular') {
    return (
      <motion.div
        className={cn(
          "bg-gray-200 dark:bg-gray-800 rounded-full relative overflow-hidden",
          className
        )}
        style={{ width, height }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
          variants={shimmerVariants}
          animate="shimmer"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn(
        "bg-gray-200 dark:bg-gray-800 rounded relative overflow-hidden",
        className
      )}
      style={{ width, height }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
        variants={shimmerVariants}
        animate="shimmer"
      />
    </motion.div>
  );
}

export function TableRowSkeleton({ lines = 5 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        >
          <AnimatedSkeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <AnimatedSkeleton height={16} width="60%" />
            <AnimatedSkeleton height={12} width="40%" />
          </div>
          <div className="flex space-x-2">
            <AnimatedSkeleton height={16} width={60} />
            <AnimatedSkeleton height={16} width={80} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function TokenHeaderSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <AnimatedSkeleton variant="circular" width={48} height={48} />
        <div className="space-y-2">
          <AnimatedSkeleton height={32} width={120} />
          <AnimatedSkeleton height={20} width={200} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="p-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <AnimatedSkeleton height={16} width="40%" className="mb-2" />
            <AnimatedSkeleton height={24} width="60%" className="mb-2" />
            <AnimatedSkeleton height={14} width="80%" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
