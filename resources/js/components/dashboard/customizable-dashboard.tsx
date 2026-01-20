import React, { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardWidget, DashboardWidgetData } from './dashboard-widget';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { useToast } from '@/hooks/use-toast';
import { 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Grid3X3, 
  List, 
  RotateCcw,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomizableDashboardProps {
  children?: React.ReactNode;
  className?: string;
}

export function CustomizableDashboard({ children, className = '' }: CustomizableDashboardProps) {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [widgets, setWidgets] = useState<DashboardWidgetData[]>([]);
  const [layoutType, setLayoutType] = useState<'grid' | 'list'>('grid');
  const [columns, setColumns] = useState(2);

  // Initialize widgets from preferences
  useEffect(() => {
    if (preferences?.dashboard_layout && preferences?.dashboard_widgets) {
      const widgetList = preferences.dashboard_layout.widgets.map((widget) => ({
        id: widget.id,
        title: getWidgetTitle(widget.id),
        type: widget.id,
        size: preferences.dashboard_widgets[widget.id]?.size || 'medium',
        position: widget.position,
        visible: widget.visible,
        enabled: preferences.dashboard_widgets[widget.id]?.enabled || false,
        content: getWidgetContent(widget.id),
      }));
      
      setWidgets(widgetList.sort((a, b) => a.position - b.position));
      setLayoutType(preferences.dashboard_layout.layout_type);
      setColumns(preferences.dashboard_layout.columns);
    }
  }, [preferences]);

  const getWidgetTitle = (widgetId: string): string => {
    const titles: Record<string, string> = {
      'mood-tracker': 'Mood Tracker',
      'recent-sessions': 'Recent Sessions',
      'goals-progress': 'Goals Progress',
      'upcoming-appointments': 'Upcoming Appointments',
      'resource-recommendations': 'Resource Recommendations',
      'crisis-resources': 'Crisis Resources',
      'activity-feed': 'Activity Feed',
      'wellness-insights': 'Wellness Insights',
    };
    return titles[widgetId] || widgetId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getWidgetContent = (widgetId: string): React.ReactNode => {
    // This would be replaced with actual widget components
    const contents: Record<string, React.ReactNode> = {
      'mood-tracker': (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Today's Mood</span>
            <Badge variant="outline" className="bg-green-50 text-green-700">Good</Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      ),
      'recent-sessions': (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">Last session: 2 days ago</div>
          <div className="text-sm text-gray-600">Next session: Tomorrow at 2:00 PM</div>
        </div>
      ),
      'goals-progress': (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Weekly Goals</span>
            <Badge variant="outline">3/5</Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>
      ),
      'upcoming-appointments': (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">Next appointment:</div>
          <div className="text-sm font-medium">Dr. Smith - Tomorrow 2:00 PM</div>
        </div>
      ),
      'resource-recommendations': (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">Recommended for you:</div>
          <div className="text-sm font-medium">Mindfulness Exercises</div>
        </div>
      ),
    };
    
    return contents[widgetId] || (
      <div className="text-sm text-gray-500">Widget content loading...</div>
    );
  };

  const moveWidget = useCallback((dragIndex: number, dropIndex: number) => {
    setWidgets((prevWidgets) => {
      const newWidgets = [...prevWidgets];
      const draggedWidget = newWidgets[dragIndex];
      newWidgets.splice(dragIndex, 1);
      newWidgets.splice(dropIndex, 0, draggedWidget);
      
      // Update positions
      return newWidgets.map((widget, index) => ({
        ...widget,
        position: index + 1,
      }));
    });
  }, []);

  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.id === widgetId
          ? { ...widget, visible: !widget.visible }
          : widget
      )
    );
  }, []);

  const changeWidgetSize = useCallback((widgetId: string, size: 'small' | 'medium' | 'large') => {
    setWidgets((prevWidgets) =>
      prevWidgets.map((widget) =>
        widget.id === widgetId
          ? { ...widget, size }
          : widget
      )
    );
  }, []);

  const saveLayout = async () => {
    if (!preferences) return;

    const dashboardLayout = {
      widgets: widgets.map((widget) => ({
        id: widget.id,
        position: widget.position,
        visible: widget.visible,
      })),
      layout_type: layoutType,
      columns,
    };

    const dashboardWidgets = widgets.reduce((acc, widget) => {
      acc[widget.id] = {
        enabled: widget.enabled,
        size: widget.size,
      };
      return acc;
    }, {} as Record<string, { enabled: boolean; size: 'small' | 'medium' | 'large' }>);

    const success = await updatePreferences({
      dashboard_layout: dashboardLayout,
      dashboard_widgets: dashboardWidgets,
    });

    if (success) {
      setIsEditing(false);
      toast({
        title: 'Layout Saved',
        description: 'Your dashboard layout has been saved successfully.',
      });
    } else {
      toast({
        title: 'Save Failed',
        description: 'Failed to save dashboard layout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const resetLayout = () => {
    if (preferences?.dashboard_layout && preferences?.dashboard_widgets) {
      const widgetList = preferences.dashboard_layout.widgets.map((widget) => ({
        id: widget.id,
        title: getWidgetTitle(widget.id),
        type: widget.id,
        size: preferences.dashboard_widgets[widget.id]?.size || 'medium',
        position: widget.position,
        visible: widget.visible,
        enabled: preferences.dashboard_widgets[widget.id]?.enabled || false,
        content: getWidgetContent(widget.id),
      }));
      
      setWidgets(widgetList.sort((a, b) => a.position - b.position));
      setLayoutType(preferences.dashboard_layout.layout_type);
      setColumns(preferences.dashboard_layout.columns);
    }
  };

  const getGridClasses = () => {
    const baseClasses = 'grid gap-4 auto-rows-min';
    if (layoutType === 'list') {
      return `${baseClasses} grid-cols-1`;
    }
    // Use static classes instead of dynamic ones
    const gridClass = columns === 1 ? 'grid-cols-1' :
                     columns === 2 ? 'grid-cols-2' :
                     columns === 3 ? 'grid-cols-3' :
                     columns === 4 ? 'grid-cols-4' : 'grid-cols-2';
    return `${baseClasses} ${gridClass}`;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`space-y-4 ${className}`}>
        {/* Dashboard Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg">Dashboard</CardTitle>
                {isEditing && (
                  <Badge variant="secondary" className="text-xs">
                    Editing Mode
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={resetLayout}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={saveLayout}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          {isEditing && (
            <CardContent className="pt-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Layout:</span>
                  <Select
                    value={layoutType}
                    onValueChange={(value: 'grid' | 'list') => setLayoutType(value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">
                        <div className="flex items-center space-x-2">
                          <Grid3X3 className="h-4 w-4" />
                          <span>Grid</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="list">
                        <div className="flex items-center space-x-2">
                          <List className="h-4 w-4" />
                          <span>List</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {layoutType === 'grid' && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Columns:</span>
                    <Select
                      value={columns.toString()}
                      onValueChange={(value) => setColumns(parseInt(value))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Dashboard Widgets */}
        <div className={getGridClasses()}>
          <AnimatePresence>
            {widgets.map((widget, index) => (
              <DashboardWidget
                key={widget.id}
                widget={widget}
                index={index}
                isEditing={isEditing}
                onMove={moveWidget}
                onToggleVisibility={toggleWidgetVisibility}
                onChangeSize={changeWidgetSize}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Custom children content */}
        {children}
      </div>
    </DndProvider>
  );
}