// ./src/components/ui/skeleton.tsx
import { cn } from '@/lib/utils';
import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  loading: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, loading, ...props }) => {
  if (loading) {
    return <div className={cn(className)} {...props} />;
  }
  return null;
};

export { Skeleton };
