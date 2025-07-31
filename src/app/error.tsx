
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Header } from '@/components/Header';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body>
         <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center text-center p-4 bg-muted/20">
              <div className="max-w-md">
                <AlertTriangle className="h-16 w-16 mx-auto text-destructive" />
                <h1 className="mt-6 text-3xl font-bold font-headline">
                  Oops! Something went wrong.
                </h1>
                <p className="mt-4 text-muted-foreground">
                  An unexpected error occurred. We've been notified and are working to fix it. Please try again in a few moments.
                </p>
                <Button onClick={() => reset()} className="mt-8" size="lg">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try again
                </Button>
              </div>
            </main>
        </div>
      </body>
    </html>
  );
}
