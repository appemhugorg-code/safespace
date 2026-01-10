import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Clock, 
  Moon, 
  Calendar,
  AlertTriangle,
  Target,
  BookOpen,
  Activity,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  therapeutic?: boolean;
  defaultEnabled: boolean;
  channels: ('email' | 'sms' | 'push')[];
}

const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  {
    id: 'appointment_reminders',
    title: 'Appointment Reminders',
    description: 'Notifications about upcoming therapy sessions',
    icon: <Calendar className="h-5 w-5" />,
    priority: 'high',
    therapeutic: true,
    defaultEnabled: true,
    channels: ['email', 'sms', 'push'],
  },
  {
    id: 'mood_check_ins',
    title: 'Mood Check-in Reminders',
    description: 'Daily reminders to log your mood and feelings',
    icon: <Activity className="h-5 w-5" />,
    priority: 'medium',
    therapeutic: true,
    defaultEnabled: true,
    channels: ['push'],
  },
  {
    id: 'goal_reminders',
    title: 'Goal Progress Reminders',
    description: 'Weekly reminders about your therapeutic goals',
    icon: <Target className="h-5 w-5" />,
    priority: 'medium',
    therapeutic: true,
    defaultEnabled: true,
    channels: ['email', 'push'],
  },
  {
    id: 'crisis_alerts',
    title: 'Crisis Alerts',
    description: 'Emergency notifications and crisis support',
    icon: <AlertTriangle className="h-5 w-5" />,
    priority: 'high',
    therapeutic: true,
    defaultEnabled: true,
    channels: ['email', 'sms', 'push'],
  },
  {
    id: 'message_notifications',
    title: 'Messages',
    description: 'New messages from your care team',
    icon: <MessageSquare className="h-5 w-5" />,
    priority: 'medium',
    defaultEnabled: true,
    channels: ['email', 'push'],
  },
  {
    id: 'resource_recommendations',
    title: 'Resource Recommendations',
    description: 'New articles and resources tailored for you',
    icon: <BookOpen className="h-5 w-5" />,
    priority: 'low',
    therapeutic: true,
    defaultEnabled: false,
    channels: ['email'],
  },
  {
    id: 'system_updates',
    title: 'System Updates',
    description: 'Platform updates and maintenance notifications',
    icon: <Settings className="h-5 w-5" />,
    priority: 'low',
    defaultEnabled: false,
    channels: ['email'],
  },
];

export function NotificationPreferences() {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<any>({});
  const [notificationSchedule, setNotificationSchedule] = useState<any>({});
  const [globalSettings, setGlobalSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
  });

  // Initialize settings from preferences
  useEffect(() => {
    if (preferences) {
      setNotificationSettings(preferences.notification_settings || {});
      setNotificationSchedule(preferences.notification_schedule || {});
      setGlobalSettings({
        email_notifications: preferences.notifications?.email_notifications ?? true,
        sms_notifications: preferences.notifications?.sms_notifications ?? false,
        push_notifications: preferences.notifications?.push_notifications ?? true,
      });
    }
  }, [preferences]);

  const handleCategoryToggle = (categoryId: string, enabled: boolean) => {
    setNotificationSettings((prev: any) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        enabled,
      },
    }));
  };

  const handleChannelToggle = (categoryId: string, channel: string, enabled: boolean) => {
    setNotificationSettings((prev: any) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        channels: {
          ...prev[categoryId]?.channels,
          [channel]: enabled,
        },
      },
    }));
  };

  const handleTimingChange = (categoryId: string, timing: any) => {
    setNotificationSettings((prev: any) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        timing,
      },
    }));
  };

  const handleScheduleChange = (field: string, value: any) => {
    setNotificationSchedule((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGlobalToggle = (field: string, enabled: boolean) => {
    setGlobalSettings((prev) => ({
      ...prev,
      [field]: enabled,
    }));
  };

  const savePreferences = async () => {
    setSaving(true);
    try {
      const success = await updatePreferences({
        notification_settings: notificationSettings,
        notification_schedule: notificationSchedule,
        notifications: globalSettings,
      });

      if (success) {
        toast({
          title: 'Preferences Saved',
          description: 'Your notification preferences have been updated successfully.',
        });
      } else {
        toast({
          title: 'Save Failed',
          description: 'Failed to save notification preferences. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while saving preferences.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <Smartphone className="h-4 w-4" />;
      case 'push':
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Notification Preferences</h2>
          <p className="text-gray-600">Customize how and when you receive notifications</p>
        </div>
        <Button onClick={savePreferences} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Global Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Global Notification Settings</span>
          </CardTitle>
          <CardDescription>
            Master controls for all notification channels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <Label className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
              </div>
              <Switch
                checked={globalSettings.email_notifications}
                onCheckedChange={(checked) => handleGlobalToggle('email_notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-green-500" />
                <div>
                  <Label className="font-medium">SMS Notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications via text</p>
                </div>
              </div>
              <Switch
                checked={globalSettings.sms_notifications}
                onCheckedChange={(checked) => handleGlobalToggle('sms_notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-purple-500" />
                <div>
                  <Label className="font-medium">Push Notifications</Label>
                  <p className="text-sm text-gray-600">Receive browser notifications</p>
                </div>
              </div>
              <Switch
                checked={globalSettings.push_notifications}
                onCheckedChange={(checked) => handleGlobalToggle('push_notifications', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Categories</CardTitle>
          <CardDescription>
            Configure specific types of notifications and their delivery methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {NOTIFICATION_CATEGORIES.map((category, index) => {
            const categorySettings = notificationSettings[category.id] || {};
            const isEnabled = categorySettings.enabled ?? category.defaultEnabled;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {category.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Label className="font-medium">{category.title}</Label>
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(category.priority)}`}>
                          {category.priority}
                        </Badge>
                        {category.therapeutic && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                            Therapeutic
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) => handleCategoryToggle(category.id, checked)}
                  />
                </div>

                {isEnabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 pl-14"
                  >
                    {/* Delivery Channels */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Delivery Methods</Label>
                      <div className="flex flex-wrap gap-2">
                        {category.channels.map((channel) => {
                          const channelEnabled = categorySettings.channels?.[channel] ?? true;
                          const globalChannelEnabled = globalSettings[`${channel}_notifications` as keyof typeof globalSettings];
                          
                          return (
                            <Button
                              key={channel}
                              size="sm"
                              variant={channelEnabled && globalChannelEnabled ? 'default' : 'outline'}
                              onClick={() => handleChannelToggle(category.id, channel, !channelEnabled)}
                              disabled={!globalChannelEnabled}
                              className="flex items-center space-x-2"
                            >
                              {getChannelIcon(channel)}
                              <span className="capitalize">{channel}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Timing Settings */}
                    {category.id === 'appointment_reminders' && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Reminder Timing</Label>
                        <div className="flex flex-wrap gap-2">
                          {[24, 4, 1].map((hours) => {
                            const timingArray = categorySettings.timing || [24, 1];
                            const isSelected = timingArray.includes(hours);
                            
                            return (
                              <Button
                                key={hours}
                                size="sm"
                                variant={isSelected ? 'default' : 'outline'}
                                onClick={() => {
                                  const newTiming = isSelected
                                    ? timingArray.filter((h: number) => h !== hours)
                                    : [...timingArray, hours].sort((a, b) => b - a);
                                  handleTimingChange(category.id, newTiming);
                                }}
                              >
                                {hours}h before
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {category.id === 'mood_check_ins' && (
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Check-in Frequency</Label>
                        <Select
                          value={categorySettings.timing || 'daily'}
                          onValueChange={(value) => handleTimingChange(category.id, value)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="twice-daily">Twice Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}