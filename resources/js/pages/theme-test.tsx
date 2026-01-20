import React from 'react';
import { Head } from '@inertiajs/react';
import { ThemePersistenceTest } from '@/components/theme/theme-persistence-test';

export default function ThemeTestPage() {
  return (
    <>
      <Head title="Theme Persistence Test" />
      
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Theme Persistence Test</h1>
            <p className="text-muted-foreground">
              Test the enhanced theme persistence system across page navigation and browser sessions
            </p>
          </div>
          
          <ThemePersistenceTest />
        </div>
      </div>
    </>
  );
}