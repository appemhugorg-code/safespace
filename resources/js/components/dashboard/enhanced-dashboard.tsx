import React, { useState, useCallback } from 'react';
import { CustomizableDashboard } from './customizable-dashboard';
import { WidgetLibrary, WidgetTemplate } from './widget-library';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { useToast } from '@/hooks/use-toast';
import { Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface EnhancedDashboardProps {
  userRole?: 'child' | 'guardian' | 'therapist' | 'admin';
  className?: string;
}

export function EnhancedDashboard({ userRole = 'child', className = '' }: EnhancedDashboardProps) {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);

  const existingWidgetIds = preferences?.dashboard_layout?.widgets?.map(w => w.id) || [];

  const handleAddWidget = useCallback(async (widgetTemplate: WidgetTemplate) => {
    if (!preferences) return;

    // Check if widget already exists
    if (existingWidgetIds.includes(widgetTemplate.id)) {
      toast({
        title: 'Widget Already Added',
        description: 'This widget is already on your dashboard.',
        variant: 'destructive',
      });
      return;
    }

    // Add widget to layout
    const newWidget = {
      id: widgetTemplate.id,
      position: (preferences.dashboard_layout?.widgets?.length || 0) + 1,
      visible: true,
    };

    const updatedLayout = {
      ...preferences.dashboard_layout,
      widgets: [...(preferences.dashboard_layout?.widgets || []), newWidget],
    };

    const updatedWidgets = {
      ...preferences.dashboard_widgets,
      [widgetTemplate.id]: {
        enabled: true,
        size: widgetTemplate.defaultSize,
      },
    };

    const success = await updatePreferences({
      dashboard_layout: updatedLayout,
      dashboard_widgets: updatedWidgets,
    });

    if (success) {
      setShowWidgetLibrary(false);
      toast({
        title: 'Widget Added',
        description: `${widgetTemplate.title} has been added to your dashboard.`,
      });
    } else {
      toast({
        title: 'Failed to Add Widget',
        description: 'There was an error adding the widget. Please try again.',
        variant: 'destructive',
      });
    }
  }, [preferences, updatePreferences, existingWidgetIds, toast]);

  const getRoleSpecificWelcome = () => {
    const welcomeMessages = {
      child: {
        title: 'Welcome to Your Safe Space',
        subtitle: 'Track your mood, connect with support, and explore helpful resources',
        icon: <Sparkles className="h-6 w-6 text-purple-500" />,
      },
      guardian: {
        title: 'Family Dashboard',
        subtitle: 'Monitor your family\'s wellbeing and stay connected with their care team',
        icon: <Sparkles className="h-6 w-6 text-blue-500" />,
      },
      therapist: {
        title: 'Therapist Dashboard',
        subtitle: 'Manage your clients, track progress, and access therapeutic tools',
        icon: <Sparkles className="h-6 w-6 text-green-500" />,
      },
      admin: {
        title: 'Admin Dashboard',
        subtitle: 'Platform overview, user management, and system analytics',
        icon: <Sparkles className="h-6 w-6 text-orange-500" />,
      },
    };

    return welcomeMessages[userRole];
  };

  const welcome = getRoleSpecificWelcome();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {welcome.icon}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{welcome.title}</h1>
              <p className="text-gray-600">{welcome.subtitle}</p>
            </div>
          </div>
          
          <Button
            onClick={() => setShowWidgetLibrary(true)}
            variant="outline"
            className="bg-white/80 hover:bg-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Widget
          </Button>
        </div>
      </motion.div>

      {/* Customizable Dashboard */}
      <CustomizableDashboard className="min-h-[400px]">
        {/* Additional role-specific content can go here */}
        {existingWidgetIds.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
          >
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Customize Your Dashboard
                </h3>
                <p className="text-gray-600 mb-6">
                  Add widgets to personalize your SafeSpace experience. Track your mood, 
                  view appointments, monitor goals, and access resources that matter to you.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button
                  onClick={() => setShowWidgetLibrary(true)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Browse Widget Library
                </Button>
                
                <p className="text-xs text-gray-500">
                  You can always customize your layout later by clicking "Customize"
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </CustomizableDashboard>

      {/* Widget Library Modal */}
      <WidgetLibrary
        isOpen={showWidgetLibrary}
        onClose={() => setShowWidgetLibrary(false)}
        onAddWidget={handleAddWidget}
        existingWidgets={existingWidgetIds}
      />
    </div>
  );
}