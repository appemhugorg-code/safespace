import React from 'react';
import { Head } from '@inertiajs/react';
import { ThemePersistenceTest } from '@/components/theme/theme-persistence-test';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

          {/* Responsive Grid Test */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Responsive Grid Test</h2>
            <p className="text-muted-foreground mb-6">
              This section tests the responsive grid component to ensure mobile responsiveness is working correctly.
            </p>
            
            <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md" className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Card 1</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This should be 1 column on mobile, 2 on tablet, 4 on desktop</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Card 2</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Resize your browser to test responsiveness</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Card 3</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Cards should not be squashed together</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Card 4</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Proper spacing and responsive behavior</p>
                </CardContent>
              </Card>
            </ResponsiveGrid>

            <ResponsiveGrid columns={{ mobile: 2, tablet: 3, desktop: 6 }} gap="sm" className="mb-8">
              {Array.from({ length: 6 }, (_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{i + 1}</div>
                      <div className="text-sm text-muted-foreground">Item {i + 1}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </ResponsiveGrid>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Testing Instructions:</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Resize your browser window to test different breakpoints</li>
                <li>On mobile (less than 640px): First grid should show 1 column, second grid should show 2 columns</li>
                <li>On tablet (640px - 1024px): First grid should show 2 columns, second grid should show 3 columns</li>
                <li>On desktop (greater than 1024px): First grid should show 4 columns, second grid should show 6 columns</li>
                <li>Cards should have proper spacing and not be squashed together</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}