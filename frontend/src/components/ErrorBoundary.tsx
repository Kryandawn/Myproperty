import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-light-gray'>
      <div className='max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-dark-blue mb-2'>Something went wrong</h2>
          <p className='text-steel-blue mb-4'>{error.message}</p>
          <button
            onClick={resetErrorBoundary}
            className='bg-steel-blue text-white px-4 py-2 rounded hover:bg-dark-blue transition-colors'
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export function withErrorBoundary(Component) {
  return function WithErrorBoundary(props) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
