import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NotificationPreferences } from './notification-preferences';
import { NotificationSchedule } from './notification-schedule';
import { NotificationPreview } from './notification-preview';
import { 
  Bell, 
  Clock, 
  Send, 
  Settings,
  Smartphone,
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NotificationSettingsProps {
  className?: string;
}

export function NotificationSettings({ className = '' }: NotificationSettingsProps) {
  const [activeTab, setActiveTab] = useState('preferences');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center space-x-2">
          <Bell className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Customize how and when you receive notifications to create the perfect balance 
          between staying informed and maintaining your peace of mind.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span className="font-medium text-blue-900">Email</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">Enabled</div>
                <div className="text-sm text-blue-700">Primary channel</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Smartphone className="h-5 w-5 text-green-500" />
                  <span className="font-medium text-green-900">SMS</span>
                </div>
                <div className="text-2xl font-bold text-green-900">Optional</div>
                <div className="text-sm text-green-700">For urgent alerts</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Bell className="h-5 w-5 text-purple-500" />
                  <span className="font-medium text-purple-900">Push</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">Enabled</div>
                <div className="text-sm text-purple-700">Real-time updates</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Settings Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preferences" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Test & Preview</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <NotificationPreferences />
            </motion.div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <NotificationSchedule />
            </motion.div>
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <NotificationPreview />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">💡 Notification Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
              <div>
                <h4 className="font-medium mb-2">For Better Mental Health:</h4>
                <ul className="space-y-1 text-green-700">
                  <li>• Enable mood check-in reminders for consistency</li>
                  <li>• Keep crisis alerts always active for safety</li>
                  <li>• Use quiet hours to protect your sleep</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Managing Overwhelm:</h4>
                <ul className="space-y-1 text-green-700">
                  <li>• Start with essential notifications only</li>
                  <li>• Use weekend mode for work-life balance</li>
                  <li>• Test notifications to find your preference</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}