"use client";

import { useEffect, useState } from 'react';

export function LoadingSpinner({ size = 'md', className = '' }) {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] ${
        size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6'
      } ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function LoadingSkeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      {...props}
      role="status"
      aria-label="Loading..."
    />
  );
}

export function LoadingOverlay({ show, children, blur = false }) {
  return (
    <div className="relative">
      {children}
      {show && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-white/80 ${
            blur ? 'backdrop-blur-sm' : ''
          } transition-all duration-200 z-50`}
        >
          <LoadingSpinner size="lg" className="text-primary" />
        </div>
      )}
    </div>
  );
}

export function PageLoading() {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    // Add a small delay to prevent flash on fast loads
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="text-center">
        <LoadingSpinner size="lg" className="text-primary mb-4" />
        <p className="text-gray-600 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card" role="status" aria-label="Loading content">
      <div className="space-y-4">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-4 w-1/2" />
        <LoadingSkeleton className="h-32 w-full" />
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-5/6" />
          <LoadingSkeleton className="h-4 w-4/6" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }) {
  return (
    <div className="flex space-x-4 py-3" role="status" aria-label="Loading table row">
      {Array.from({ length: columns }).map((_, i) => (
        <LoadingSkeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

export default function Loading() {
  return <PageLoading />;
} 