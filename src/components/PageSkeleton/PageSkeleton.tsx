import type { ReactNode } from 'react';

interface PageSkeletonProps {
  children?: ReactNode;
}

const PageSkeleton = ({ children }: PageSkeletonProps) => (
  <div className="min-h-screen bg-slate-50 p-8">
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="h-16 w-40 animate-pulse rounded-2xl bg-slate-200" />
      <div className="space-y-4">
        <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-8 w-1/2 animate-pulse rounded bg-slate-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-48 animate-pulse rounded-3xl bg-slate-200" />
        ))}
      </div>
    </div>
    {children}
  </div>
);

export default PageSkeleton;
