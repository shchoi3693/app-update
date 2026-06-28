'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ReactNode, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
interface AsyncBoundaryProps {
  children: ReactNode;
  pendingFallback: ReactNode;
}
export default function QueryAsyncBoundary({ children, pendingFallback }: AsyncBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div className="flex h-full items-center justify-center">
              <button
                className="cursor-pointer border border-gray-200 px-6 py-2.5"
                onClick={resetErrorBoundary}
              >
                다시 시도
              </button>
            </div>
          )}
        >
          <Suspense fallback={pendingFallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
