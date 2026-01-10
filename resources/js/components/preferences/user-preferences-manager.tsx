import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Palette, 
  Bell, 
  Shield, 
  Accessibility, 
  Globe, 
  Download, 
  Upload,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

export function UserPreferencesManager() {
  const { 
    preferences, 
    loading, 
    error, 
    conflicts,
    updatePreferences, 
    exportPreferences, 
    importPreferences,
    resolveConflicts,
    refreshPreferences 
  } = useUserPreferences();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handlePreferenceUpdate = async (category: string, updates: any) => {
    setSaving(true);
    try {
      const success = await updatePreferences({ [category]: updates });
      if (success) {
        toast({
          title: 'Preferences Updated',
          description: 'Your preferences have been saved successfully.',
        });
      } else {
        toast({
          title: 'Update Failed',
          description: 'Failed to update preferences. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An error occurred while updating preferences.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const backup = await exportPreferences();
      if (backup) {
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `safespace-preferences-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: 'Export Successful',
          description: 'Your preferences have been exported successfully.',
        });
      }
    } catch (err) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export preferences.',
        variant: 'destructive',
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backupData = JSON.parse(text);
      
      const success = await importPreferences(backupData);
      if (success) {
        toast({
          title: 'Import Successful',
          description: 'Your preferences have been imported successfully.',
        });
      } else {
        toast({
          title: 'Import Failed',
          description: 'Failed to import preferences.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      toast({
        title: 'Import Error',
        description: 'Invalid backup file format.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading preferences...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Error loading preferences: {error}</span>
          </div>
          <Button 
            onClick={refreshPreferences} 
            variant="outline" 
            className="mt-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!preferences) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Preferences</h1>
          <p className="text-gray-600">Customize your SafeSpace experience</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <label>
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Sync Conflicts Detected
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Your preferences have conflicts between devices. Please resolve them below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conflicts.map((conflict, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <p className="font-medium">{conflict.category}.{conflict.key}</p>
                    <p className="text-sm text-gray-600">
                      Server: {JSON.stringify(conflict.server_value)} | 
                      Device: {JSON.stringify(conflict.device_value)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveConflicts([{
                        field: `${conflict.category}.${conflict.key}`,
                        chosen_value: conflict.server_value
                      }])}
                    >
                      Use Server
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => resolveConflicts([{
                        field: `${conflict.category}.${conflict.key}`,
                        chosen_value: conflict.device_value
                      }])}
                    >
                      Use Device
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preferences Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center space-x-2">
            <Accessibility className="h-4 w-4" />
            <span>Accessibility</span>
          </TabsTrigger>
          <TabsTrigger value="interface" className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>Interface</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="therapeutic" className="flex items-center space-x-2">
            <Palette className="h-4 w-4" />
            <span>Therapeutic</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Preferences */}
        <TabsContent value="dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Layout</CardTitle>
              <CardDescription>
                Customize how your dashboard widgets are arranged and displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="layout-type">Layout Type</Label>
                  <Select
                    value={preferences.dashboard_layout.layout_type}
                    onValueChange={(value) => 
                      handlePreferenceUpdate('dashboard_layout', {
                        ...preferences.dashboard_layout,
                        layout_type: value
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid Layout</SelectItem>
                      <SelectItem value="list">List Layout</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="columns">Columns</Label>
                  <Select
                    value={preferences.dashboard_layout.columns.toString()}
                    onValueChange={(value) => 
                      handlePreferenceUpdate('dashboard_layout', {
                        ...preferences.dashboard_layout,
                        columns: parseInt(value)
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Column</SelectItem>
                      <SelectItem value="2">2 Columns</SelectItem>
                      <SelectItem value="3">3 Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Widget Visibility</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {Object.entries(preferences.dashboard_widgets).map(([widgetId, settings]) => (
                    <div key={widgetId} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium capitalize">{widgetId.replace('-', ' ')}</p>
                        <Badge variant="outline" className="text-xs">
                          {settings.size}
                        </Badge>
                      </div>
                      <Switch
                        checked={settings.enabled}
                        onCheckedChange={(checked) =>
                          handlePreferenceUpdate('dashboard_widgets', {
                            ...preferences.dashboard_widgets,
                            [widgetId]: { ...settings, enabled: checked }
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Preferences */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how and when you receive notifications from SafeSpace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={preferences.notifications?.email_notifications ?? true}
                    onCheckedChange={(checked) =>
                      handlePreferenceUpdate('notifications', {
                        ...preferences.notifications,
                        email_notifications: checked
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-600">Receive browser notifications</p>
                  </div>
                  <Switch
                    checked={preferences.notifications?.push_notifications ?? true}
                    onCheckedChange={(checked) =>
                      handlePreferenceUpdate('notifications', {
                        ...preferences.notifications,
                        push_notifications: checked
                      })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive text message notifications</p>
                  </div>
                  <Switch
                    checked={preferences.notifications?.sms_notifications ?? false}
                    onCheckedChange={(checked) =>
                      handlePreferenceUpdate('notifications', {
                        ...preferences.notifications,
                        sms_notifications: checked
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>
    </div>
  );
}