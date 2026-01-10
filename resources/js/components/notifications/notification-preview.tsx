import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  Mail, 
  Smartphone, 
  Bell, 
  CheckCircle,
  AlertCircle,
  Clock,
  Heart,
  Calendar,
  Target,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NotificationTemplate {
  id: string;
  title: string;
  category: string;
  channels: string[];
  preview: {
    email?: {
      subject: string;
      body: string;
    };
    sms?: {
      message: string;
    };
    push?: {
      title: string;
      body: string;
    };
  };
}

const NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'appointment_reminder_24h',
    title: 'Appointment Reminder (24h)',
    category: 'appointment_reminders',
    channels: ['email', 'sms', 'push'],
    preview: {
      email: {
        subject: 'Reminder: Therapy Session Tomorrow',
        body: 'Hi there! This is a friendly reminder that you have a therapy session scheduled for tomorrow at 2:00 PM with Dr. Smith. We look forward to seeing you!',
      },
      sms: {
        message: 'Reminder: You have a therapy session tomorrow at 2:00 PM with Dr. Smith. Reply STOP to opt out.',
      },
      push: {
        title: 'Therapy Session Tomorrow',
        body: 'Your session with Dr. Smith is at 2:00 PM',
      },
    },
  },
  {
    id: 'mood_check_in',
    title: 'Daily Mood Check-in',
    category: 'mood_check_ins',
    channels: ['push'],
    preview: {
      push: {
        title: 'How are you feeling today?',
        body: 'Take a moment to check in with yourself and log your mood',
      },
    },
  },
  {
    id: 'goal_progress',
    title: 'Weekly Goal Reminder',
    category: 'goal_reminders',
    channels: ['email', 'push'],
    preview: {
      email: {
        subject: 'Your Weekly Goals Check-in',
        body: 'It\'s time to review your therapeutic goals for this week. You\'ve made great progress on 3 out of 5 goals. Keep up the excellent work!',
      },
      push: {
        title: 'Weekly Goals Check-in',
        body: 'Review your progress - you\'re doing great!',
      },
    },
  },
  {
    id: 'crisis_alert',
    title: 'Crisis Support Alert',
    category: 'crisis_alerts',
    channels: ['email', 'sms', 'push'],
    preview: {
      email: {
        subject: 'Crisis Support Resources Available',
        body: 'We\'re here to help. If you\'re experiencing a mental health crisis, please reach out immediately. Crisis hotline: 988. Your safety and wellbeing are our priority.',
      },
      sms: {
        message: 'Crisis support is available 24/7. Call 988 for immediate help. You are not alone.',
      },
      push: {
        title: 'Crisis Support Available',
        body: 'Immediate help is available. Tap for resources.',
      },
    },
  },
  {
    id: 'new_message',
    title: 'New Message from Care Team',
    category: 'message_notifications',
    channels: ['email', 'push'],
    preview: {
      email: {
        subject: 'New Message from Dr. Smith',
        body: 'You have received a new message from Dr. Smith in your SafeSpace account. Please log in to read and respond.',
      },
      push: {
        title: 'New message from Dr. Smith',
        body: 'Tap to read your message',
      },
    },
  },
];

interface NotificationPreviewProps {
  className?: string;
}

export function NotificationPreview({ className = '' }: NotificationPreviewProps) {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [sending, setSending] = useState(false);

  const template = NOTIFICATION_TEMPLATES.find(t => t.id === selectedTemplate);

  const sendTestNotification = async () => {
    if (!template || !selectedChannel) return;

    setSending(true);
    
    // Simulate API call
    setTimeout(() => {
      setSending(false);
      toast({
        title: 'Test Notification Sent',
        description: `A test ${selectedChannel} notification has been sent to your ${selectedChannel === 'sms' ? 'phone' : selectedChannel === 'email' ? 'email' : 'browser'}.`,
      });
    }, 1500);
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'appointment_reminders':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'mood_check_ins':
        return <Heart className="h-5 w-5 text-red-500" />;
      case 'goal_reminders':
        return <Target className="h-5 w-5 text-green-500" />;
      case 'crisis_alerts':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'message_notifications':
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const renderPreview = () => {
    if (!template || !selectedChannel) return null;

    const preview = template.preview[selectedChannel as keyof typeof template.preview];
    if (!preview) return null;

    switch (selectedChannel) {
      case 'email':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-gray-900">Email Preview</span>
            </div>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium text-gray-700">Subject: </span>
                <span className="text-gray-900">{(preview as any).subject}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-700">Body: </span>
                <p className="text-gray-900 mt-1">{(preview as any).body}</p>
              </div>
            </div>
          </motion.div>
        );

      case 'sms':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg p-4 bg-green-50 shadow-sm"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Smartphone className="h-5 w-5 text-green-500" />
              <span className="font-medium text-gray-900">SMS Preview</span>
            </div>
            <div className="bg-white rounded-lg p-3 border">
              <p className="text-sm text-gray-900">{(preview as any).message}</p>
            </div>
          </motion.div>
        );

      case 'push':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border rounded-lg p-4 bg-purple-50 shadow-sm"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Bell className="h-5 w-5 text-purple-500" />
              <span className="font-medium text-gray-900">Push Notification Preview</span>
            </div>
            <div className="bg-white rounded-lg p-3 border shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{(preview as any).title}</p>
                  <p className="text-sm text-gray-600">{(preview as any).body}</p>
                  <p className="text-xs text-gray-400 mt-1">SafeSpace • now</p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Test Notifications</h3>
        <p className="text-gray-600">Preview and test your notification settings</p>
      </div>

      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>Send Test Notification</span>
          </CardTitle>
          <CardDescription>
            Choose a notification type and delivery method to test
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Notification Type</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_TEMPLATES.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(template.category)}
                        <span>{template.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Delivery Method</label>
              <Select 
                value={selectedChannel} 
                onValueChange={setSelectedChannel}
                disabled={!template}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select delivery method" />
                </SelectTrigger>
                <SelectContent>
                  {template?.channels.map((channel) => (
                    <SelectItem key={channel} value={channel}>
                      <div className="flex items-center space-x-2">
                        {getChannelIcon(channel)}
                        <span className="capitalize">{channel}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={sendTestNotification}
              disabled={!template || !selectedChannel || sending}
            >
              {sending ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Test
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {template && selectedChannel && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preview</CardTitle>
            <CardDescription>
              This is how your notification will appear
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderPreview()}
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Statistics</CardTitle>
          <CardDescription>
            Overview of your notification activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">18</div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-gray-600">Opened</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-600">Clicked</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}