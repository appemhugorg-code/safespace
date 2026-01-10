import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Heart, 
  Calendar, 
  Target, 
  BookOpen, 
  Activity, 
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Clock,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface WidgetTemplate {
  id: string;
  title: string;
  description: string;
  category: 'wellness' | 'productivity' | 'social' | 'insights';
  icon: React.ReactNode;
  defaultSize: 'small' | 'medium' | 'large';
  tags: string[];
  popular?: boolean;
  therapeutic?: boolean;
}

interface WidgetLibraryProps {
  onAddWidget: (widgetTemplate: WidgetTemplate) => void;
  existingWidgets: string[];
  isOpen: boolean;
  onClose: () => void;
}

const WIDGET_TEMPLATES: WidgetTemplate[] = [
  {
    id: 'mood-tracker',
    title: 'Mood Tracker',
    description: 'Track your daily mood and emotional patterns',
    category: 'wellness',
    icon: <Heart className="h-5 w-5" />,
    defaultSize: 'medium',
    tags: ['mood', 'emotions', 'tracking'],
    popular: true,
    therapeutic: true,
  },
  {
    id: 'upcoming-appointments',
    title: 'Upcoming Appointments',
    description: 'View your scheduled therapy sessions and appointments',
    category: 'productivity',
    icon: <Calendar className="h-5 w-5" />,
    defaultSize: 'medium',
    tags: ['appointments', 'schedule', 'therapy'],
    popular: true,
  },
  {
    id: 'goals-progress',
    title: 'Goals Progress',
    description: 'Monitor your therapeutic goals and achievements',
    category: 'productivity',
    icon: <Target className="h-5 w-5" />,
    defaultSize: 'medium',
    tags: ['goals', 'progress', 'achievements'],
    therapeutic: true,
  },
  {
    id: 'resource-recommendations',
    title: 'Resource Recommendations',
    description: 'Personalized mental health resources and articles',
    category: 'wellness',
    icon: <BookOpen className="h-5 w-5" />,
    defaultSize: 'large',
    tags: ['resources', 'articles', 'learning'],
    therapeutic: true,
  },
  {
    id: 'activity-feed',
    title: 'Activity Feed',
    description: 'Recent activities and platform updates',
    category: 'social',
    icon: <Activity className="h-5 w-5" />,
    defaultSize: 'large',
    tags: ['activity', 'updates', 'social'],
  },
  {
    id: 'crisis-resources',
    title: 'Crisis Resources',
    description: 'Quick access to emergency mental health resources',
    category: 'wellness',
    icon: <AlertCircle className="h-5 w-5" />,
    defaultSize: 'small',
    tags: ['crisis', 'emergency', 'help'],
    therapeutic: true,
  },
  {
    id: 'wellness-insights',
    title: 'Wellness Insights',
    description: 'AI-powered insights about your mental health journey',
    category: 'insights',
    icon: <TrendingUp className="h-5 w-5" />,
    defaultSize: 'large',
    tags: ['insights', 'ai', 'analytics'],
    therapeutic: true,
  },
  {
    id: 'recent-sessions',
    title: 'Recent Sessions',
    description: 'Summary of your recent therapy sessions',
    category: 'wellness',
    icon: <MessageSquare className="h-5 w-5" />,
    defaultSize: 'medium',
    tags: ['sessions', 'therapy', 'history'],
    therapeutic: true,
  },
  {
    id: 'daily-check-in',
    title: 'Daily Check-in',
    description: 'Quick daily wellness check-in and reflection',
    category: 'wellness',
    icon: <Clock className="h-5 w-5" />,
    defaultSize: 'small',
    tags: ['check-in', 'daily', 'reflection'],
    therapeutic: true,
  },
  {
    id: 'achievements',
    title: 'Achievements',
    description: 'Celebrate your mental health milestones',
    category: 'productivity',
    icon: <Star className="h-5 w-5" />,
    defaultSize: 'medium',
    tags: ['achievements', 'milestones', 'celebration'],
    therapeutic: true,
  },
];

export function WidgetLibrary({ onAddWidget, existingWidgets, isOpen, onClose }: WidgetLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredWidgets = WIDGET_TEMPLATES.filter((widget) => {
    const matchesSearch = widget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         widget.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         widget.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All Widgets', count: WIDGET_TEMPLATES.length },
    { id: 'wellness', label: 'Wellness', count: WIDGET_TEMPLATES.filter(w => w.category === 'wellness').length },
    { id: 'productivity', label: 'Productivity', count: WIDGET_TEMPLATES.filter(w => w.category === 'productivity').length },
    { id: 'social', label: 'Social', count: WIDGET_TEMPLATES.filter(w => w.category === 'social').length },
    { id: 'insights', label: 'Insights', count: WIDGET_TEMPLATES.filter(w => w.category === 'insights').length },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'wellness':
        return 'bg-green-100 text-green-800';
      case 'productivity':
        return 'bg-blue-100 text-blue-800';
      case 'social':
        return 'bg-purple-100 text-purple-800';
      case 'insights':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Widget Library</h2>
              <p className="text-gray-600 text-sm">Add widgets to customize your dashboard</p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search widgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                size="sm"
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="text-xs"
              >
                {category.label} ({category.count})
              </Button>
            ))}
          </div>
        </div>
        
        {/* Widget Grid */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWidgets.map((widget) => {
              const isAdded = existingWidgets.includes(widget.id);
              
              return (
                <motion.div
                  key={widget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`h-full ${isAdded ? 'opacity-60' : 'hover:shadow-md'} transition-shadow`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {widget.icon}
                          </div>
                          <div>
                            <CardTitle className="text-sm font-medium flex items-center space-x-2">
                              <span>{widget.title}</span>
                              {widget.popular && (
                                <Badge variant="secondary" className="text-xs">Popular</Badge>
                              )}
                              {widget.therapeutic && (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                  Therapeutic
                                </Badge>
                              )}
                            </CardTitle>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <CardDescription className="text-xs mb-3">
                        {widget.description}
                      </CardDescription>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getCategoryColor(widget.category)}`}
                          >
                            {widget.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {widget.defaultSize}
                          </Badge>
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => onAddWidget(widget)}
                          disabled={isAdded}
                          className="h-7 px-2 text-xs"
                        >
                          {isAdded ? (
                            'Added'
                          ) : (
                            <>
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {widget.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          {filteredWidgets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No widgets found matching your search.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}