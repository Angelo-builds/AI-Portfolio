import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import React from 'react';

interface SkeletonProps {
  className?: string;
  delay?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={cn("animate-pulse bg-slate-200 dark:bg-slate-800 rounded", className)}
    />
  );
}
