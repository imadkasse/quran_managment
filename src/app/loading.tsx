import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Version 2: Skeleton Placeholders Loading
export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-6 shadow-sm"
            >
              {/* Card Image */}
              <Skeleton className="mb-4 h-48 w-full rounded-md" />
              
              {/* Card Title */}
              <Skeleton className="mb-2 h-6 w-3/4" />
              
              {/* Card Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              
              {/* Card Footer */}
              <div className="mt-4 flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Content Skeleton */}
        <div className="mt-12 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}