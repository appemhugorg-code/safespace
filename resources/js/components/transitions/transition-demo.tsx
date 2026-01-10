/**
 * Transition Demo Component
 * 
 * Demonstrates the page transition system capabilities
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageTransition, { TransitionType } from './page-transition';
import LoadingSpinner, { LoadingType } from './loading-spinner';
import { SkeletonDashboard, SkeletonProfile, SkeletonList } from './skeleton-screen';
import { useAnimationsEnabled } from '@/hooks/use-animations';

export const TransitionDemo: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [transitionType, setTransitionType] = useState<TransitionType>('fade');
  const [showLoading, setShowLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<LoadingType>('pulse');
  const [skeletonType, setSkeletonType] = useState('dashboard');
  const animationsEnabled = useAnimationsEnabled();

  const pages = {
    dashboard: {
      title: 'Dashboard',
      content: (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Welcome to SafeSpace</h2>
          <p className="text-muted-foreground">
            Your mental health journey starts here. This is a demo of our therapeutic page transitions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>Feature {i}</CardTitle>
                  <CardDescription>Therapeutic feature description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Content for feature {i} with calming design.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    profile: {
      title: 'Profile',
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">John Doe</h2>
              <p className="text-muted-foreground">Mental Health Journey</p>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your therapeutic progress and milestones.</p>
            </CardContent>
          </Card>
        </div>
      ),
    },
    settings: {
      title: 'Settings',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Customize your SafeSpace experience</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Theme, animations, and accessibility settings.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Privacy</CardTitle>
                <CardDescription>Control your data and privacy</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Manage your privacy preferences and data sharing.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    therapy: {
      title: 'Therapy Session',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Therapy Session</h2>
          <Card>
            <CardHeader>
              <CardTitle>Current Session</CardTitle>
              <CardDescription>Mindfulness and Relaxation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Welcome to your therapy session. Take a deep breath and relax.</p>
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm">🧘‍♀️ Focus on your breathing and let your mind settle.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  };

  const handlePageChange = (newPage: string) => {
    if (showLoading) {
      // Simulate loading
      setTimeout(() => {
        setCurrentPage(newPage);
      }, 1000);
    } else {
      setCurrentPage(newPage);
    }
  };

  const renderSkeletonDemo = () => {
    switch (skeletonType) {
      case 'dashboard':
        return <SkeletonDashboard />;
      case 'profile':
        return <SkeletonProfile />;
      case 'list':
        return <SkeletonList items={4} showAvatars />;
      default:
        return <SkeletonDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Page Transition System Demo</CardTitle>
          <CardDescription>
            Therapeutic page transitions designed for mental health applications
          </CardDescription>
          <div className="flex items-center gap-2">
            <Badge variant={animationsEnabled ? 'default' : 'secondary'}>
              {animationsEnabled ? 'Animations Enabled' : 'Reduced Motion'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Transition Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Transition Type</label>
              <Select value={transitionType} onValueChange={(value: TransitionType) => setTransitionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fade">Fade</SelectItem>
                  <SelectItem value="slide">Slide</SelectItem>
                  <SelectItem value="slideUp">Slide Up</SelectItem>
                  <SelectItem value="slideDown">Slide Down</SelectItem>
                  <SelectItem value="slideLeft">Slide Left</SelectItem>
                  <SelectItem value="slideRight">Slide Right</SelectItem>
                  <SelectItem value="scale">Scale</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Loading Type</label>
              <Select value={loadingType} onValueChange={(value: LoadingType) => setLoadingType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pulse">Pulse</SelectItem>
                  <SelectItem value="spinner">Spinner</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="wave">Wave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Show Loading</label>
              <Button
                variant={showLoading ? 'default' : 'outline'}
                onClick={() => setShowLoading(!showLoading)}
                className="w-full"
              >
                {showLoading ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </div>

          {/* Page Navigation */}
          <div className="flex gap-2 flex-wrap">
            {Object.keys(pages).map((pageKey) => (
              <Button
                key={pageKey}
                variant={currentPage === pageKey ? 'default' : 'outline'}
                onClick={() => handlePageChange(pageKey)}
                size="sm"
              >
                {pages[pageKey as keyof typeof pages].title}
              </Button>
            ))}
          </div>

          {/* Page Content with Transition */}
          <div className="border rounded-lg min-h-[400px] overflow-hidden">
            <PageTransition
              pageKey={currentPage}
              transitionType={transitionType}
              showLoading={showLoading}
              loadingComponent={
                <div className="flex items-center justify-center h-[400px]">
                  <LoadingSpinner 
                    type={loadingType} 
                    size="lg" 
                    message="Loading page..." 
                  />
                </div>
              }
              className="p-6"
            >
              {pages[currentPage as keyof typeof pages].content}
            </PageTransition>
          </div>

          {/* Loading Spinner Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Loading Animations</CardTitle>
              <CardDescription>Different loading states for various scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['pulse', 'spinner', 'dots', 'wave'] as LoadingType[]).map((type) => (
                  <div key={type} className="flex flex-col items-center space-y-2 p-4 border rounded-lg">
                    <LoadingSpinner type={type} size="md" showMessage={false} />
                    <span className="text-sm capitalize">{type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skeleton Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Skeleton Loading States</CardTitle>
              <CardDescription>Skeleton screens for better perceived performance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                {['dashboard', 'profile', 'list'].map((type) => (
                  <Button
                    key={type}
                    variant={skeletonType === type ? 'default' : 'outline'}
                    onClick={() => setSkeletonType(type)}
                    size="sm"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
              <div className="border rounded-lg p-4">
                {renderSkeletonDemo()}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransitionDemo;