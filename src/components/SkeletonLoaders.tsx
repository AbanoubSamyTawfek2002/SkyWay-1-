import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export const SkeletonHotelCard = () => (
  <Card className="overflow-hidden rounded-[40px] border-none shadow-xl bg-card">
    <div className="aspect-[4/5] bg-muted animate-pulse" />
    <CardContent className="p-8 space-y-4">
      <div className="h-4 w-1/3 bg-muted animate-pulse rounded-full" />
      <div className="h-8 w-2/3 bg-muted animate-pulse rounded-xl" />
      <div className="h-4 w-full bg-muted animate-pulse rounded-full" />
      <div className="flex justify-between items-center pt-4">
        <div className="h-8 w-20 bg-muted animate-pulse rounded-xl" />
        <div className="h-10 w-24 bg-muted animate-pulse rounded-full" />
      </div>
    </CardContent>
  </Card>
);

export const SkeletonFlightCard = () => (
  <Card className="overflow-hidden rounded-[40px] border-none shadow-xl bg-card p-8">
    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-6 w-full md:w-1/3">
        <div className="w-12 h-12 bg-muted animate-pulse rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-24 bg-muted animate-pulse rounded-full" />
          <div className="h-3 w-16 bg-muted animate-pulse rounded-full" />
        </div>
      </div>
      <div className="flex-1 w-full flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
          <div className="h-4 w-12 bg-muted animate-pulse rounded-full" />
        </div>
        <div className="flex-1 px-8">
          <div className="h-1 bg-muted animate-pulse w-full rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
          <div className="h-4 w-12 bg-muted animate-pulse rounded-full" />
        </div>
      </div>
      <div className="w-full md:w-48 flex items-center justify-between gap-4 md:justify-end">
        <div className="h-8 w-20 bg-muted animate-pulse rounded-full" />
        <div className="h-12 w-32 bg-muted animate-pulse rounded-full" />
      </div>
    </div>
  </Card>
);
