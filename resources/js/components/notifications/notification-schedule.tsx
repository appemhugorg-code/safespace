import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { useToast } from '@/hooks/use-toast';
import { 
  Moon, 
  Sun, 
  Clock, 
  Calendar,
  Plane,
  Volume2,
  VolumeX,
  Smartphone,
  Bell
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TimeSlot {
  start: string;
  end: string;
}

interface NotificationScheduleProps {
  className?: string;
}

export function NotificationSchedule({ className = '' }: NotificationScheduleProps) {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [schedule, setSchedule] = useState({
    quiet_hours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
    weekend_mode: {
      enabled: false,
    },
    vacation_mode: {
      enabled: false,
      start_date: '' as string,
      end_date: '' as string,
    },
    focus_hours: {
      enabled: false,
      slots: [] as TimeSlot[],
    },
    emergency_override: {
      enabled: true,
      categories: ['crisis_alerts', 'appointment_reminders'],
    },
  });

  // Initialize from preferences
  useEffect(() => {
    if (preferences?.notification_schedule) {
      setSchedule((prev) => ({
        ...prev,
        ...preferences.notification_schedule,
        vacation_mode: {
          enabled: preferences.notification_schedule.vacation_mode?.enabled ?? false,
          start_date: preferences.notification_schedule.vacation_mode?.start_date ?? '',
          end_date: preferences.notification_schedule.vacation_mode?.end_date ?? '',
        },
      }));
    }
  }, [preferences]);

  const handleQuietHoursToggle = (enabled: boolean) => {
    setSchedule((prev) => ({
      ...prev,
      quiet_hours: {
        ...prev.quiet_hours,
        enabled,
      },
    }));
  };

  const handleQuietHoursTime = (field: 'start' | 'end', time: string) => {
    setSchedule((prev) => ({
      ...prev,
      quiet_hours: {
        ...prev.quiet_hours,
        [field]: time,
      },
    }));
  };

  const handleWeekendModeToggle = (enabled: boolean) => {
    setSchedule((prev) => ({
      ...prev,
      weekend_mode: {
        ...prev.weekend_mode,
        enabled,
      },
    }));
  };

  const handleVacationModeToggle = (enabled: boolean) => {
    setSchedule((prev) => ({
      ...prev,
      vacation_mode: {
        ...prev.vacation_mode,
        enabled,
      },
    }));
  };

  const handleVacationDate = (field: 'start_date' | 'end_date', date: string) => {
    setSchedule((prev) => ({
      ...prev,
      vacation_mode: {
        ...prev.vacation_mode,
        [field]: date,
      },
    }));
  };

  const addFocusHour = () => {
    setSchedule((prev) => ({
      ...prev,
      focus_hours: {
        ...prev.focus_hours,
        slots: [
          ...prev.focus_hours.slots,
          { start: '09:00', end: '12:00' },
        ],
      },
    }));
  };

  const removeFocusHour = (index: number) => {
    setSchedule((prev) => ({
      ...prev,
      focus_hours: {
        ...prev.focus_hours,
        slots: prev.focus_hours.slots.filter((_, i) => i !== index),
      },
    }));
  };

  const updateFocusHour = (index: number, field: 'start' | 'end', time: string) => {
    setSchedule((prev) => ({
      ...prev,
      focus_hours: {
        ...prev.focus_hours,
        slots: prev.focus_hours.slots.map((slot, i) =>
          i === index ? { ...slot, [field]: time } : slot
        ),
      },
    }));
  };

  const handleEmergencyOverrideToggle = (enabled: boolean) => {
    setSchedule((prev) => ({
      ...prev,
      emergency_override: {
        ...prev.emergency_override,
        enabled,
      },
    }));
  };

  const saveSchedule = async () => {
    setSaving(true);
    try {
      const success = await updatePreferences({
        notification_schedule: schedule,
      });

      if (success) {
        toast({
          title: 'Schedule Saved',
          description: 'Your notification schedule has been updated successfully.',
        });
      } else {
        toast({
          title: 'Save Failed',
          description: 'Failed to save notification schedule. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while saving schedule.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isVacationActive = () => {
    if (!schedule.vacation_mode.enabled || !schedule.vacation_mode.start_date || !schedule.vacation_mode.end_date) {
      return false;
    }
    
    const now = new Date();
    const start = new Date(schedule.vacation_mode.start_date);
    const end = new Date(schedule.vacation_mode.end_date);
    
    return now >= start && now <= end;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Notification Schedule</h3>
          <p className="text-gray-600">Control when you receive notifications</p>
        </div>
        <Button onClick={saveSchedule} disabled={saving}>
          {saving ? 'Saving...' : 'Save Schedule'}
        </Button>
      </div>

      {/* Current Status */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                {schedule.quiet_hours.enabled ? (
                  <Moon className="h-5 w-5 text-blue-600" />
                ) : (
                  <Bell className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-blue-900">
                  {schedule.quiet_hours.enabled ? 'Quiet Hours Active' : 'All Notifications Enabled'}
                </h4>
                <p className="text-sm text-blue-700">
                  {schedule.quiet_hours.enabled 
                    ? `Notifications paused from ${formatTime(schedule.quiet_hours.start)} to ${formatTime(schedule.quiet_hours.end)}`
                    : 'You will receive all enabled notifications'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {isVacationActive() && (
                <Badge className="bg-orange-100 text-orange-800">
                  <Plane className="h-3 w-3 mr-1" />
                  Vacation Mode
                </Badge>
              )}
              {schedule.weekend_mode.enabled && (
                <Badge className="bg-green-100 text-green-800">
                  Weekend Mode
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Moon className="h-5 w-5" />
            <span>Quiet Hours</span>
          </CardTitle>
          <CardDescription>
            Pause non-urgent notifications during specific hours
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-medium">Enable Quiet Hours</Label>
            <Switch
              checked={schedule.quiet_hours.enabled}
              onCheckedChange={handleQuietHoursToggle}
            />
          </div>

          {schedule.quiet_hours.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <Label className="text-sm font-medium mb-2 block">Start Time</Label>
                <Input
                  type="time"
                  value={schedule.quiet_hours.start}
                  onChange={(e) => handleQuietHoursTime('start', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">End Time</Label>
                <Input
                  type="time"
                  value={schedule.quiet_hours.end}
                  onChange={(e) => handleQuietHoursTime('end', e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Weekend Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Weekend Mode</span>
          </CardTitle>
          <CardDescription>
            Reduce notifications on weekends for better work-life balance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Enable Weekend Mode</Label>
              <p className="text-sm text-gray-600">Only urgent notifications on weekends</p>
            </div>
            <Switch
              checked={schedule.weekend_mode.enabled}
              onCheckedChange={handleWeekendModeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Vacation Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plane className="h-5 w-5" />
            <span>Vacation Mode</span>
          </CardTitle>
          <CardDescription>
            Temporarily pause most notifications during vacation periods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="font-medium">Enable Vacation Mode</Label>
            <Switch
              checked={schedule.vacation_mode.enabled}
              onCheckedChange={handleVacationModeToggle}
            />
          </div>

          {schedule.vacation_mode.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <Label className="text-sm font-medium mb-2 block">Start Date</Label>
                <Input
                  type="date"
                  value={schedule.vacation_mode.start_date}
                  onChange={(e) => handleVacationDate('start_date', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">End Date</Label>
                <Input
                  type="date"
                  value={schedule.vacation_mode.end_date}
                  onChange={(e) => handleVacationDate('end_date', e.target.value)}
                />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Override */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-red-500" />
            <span>Emergency Override</span>
          </CardTitle>
          <CardDescription>
            Allow critical notifications even during quiet periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Enable Emergency Override</Label>
              <p className="text-sm text-gray-600">
                Crisis alerts and urgent appointments will always come through
              </p>
            </div>
            <Switch
              checked={schedule.emergency_override.enabled}
              onCheckedChange={handleEmergencyOverrideToggle}
            />
          </div>

          {schedule.emergency_override.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4"
            >
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  Crisis Alerts
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Appointment Reminders
                </Badge>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}