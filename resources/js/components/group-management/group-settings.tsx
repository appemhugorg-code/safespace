import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Shield, 
  Users, 
  MessageCircle,
  Video,
  FileText,
  Clock,
  AlertTriangle,
  Save,
  RotateCcw,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  Globe,
  UserCheck,
  UserPlus,
  Filter
} from 'lucide-react';
import { GroupConversation, GroupSettings } from '@/services/group-management-service';
import { useGroupManagement } from '@/hooks/use-group-management';
import { motion, AnimatePresence } from 'framer-motion';

interface GroupSettingsProps {
  group: GroupConversation;
  authToken: string;
  userId: string;
  userRole: string;
  onGroupUpdate?: (group: GroupConversation) => void;
  onGroupDelete?: (groupId: string) => void;
  className?: string;
}

type SettingsSection = 'general' | 'privacy' | 'features' | 'moderation' | 'advanced' | 'danger';

export function GroupSettingsComponent({
  group,
  authToken,
  userId,
  userRole,
  onGroupUpdate,
  onGroupDelete,
  className = '',
}: GroupSettingsProps) {
  const {
    updateGroup,
    deleteGroup,
    hasPermission,
  } = useGroupManagement({
    authToken,
    userId,
    userRole,
  });

  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [formData, setFormData] = useState({
    name: group.name,
    description: group.description || '',
    settings: { ...group.settings },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const canManageSettings = hasPermission(group.id, 'manage_settings');

  // Update form data and track changes
  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      setHasChanges(
        newData.name !== group.name ||
        newData.description !== (group.description || '') ||
        JSON.stringify(newData.settings) !== JSON.stringify(group.settings)
      );
      return newData;
    });
  }, [group]);

  const updateSettings = useCallback((updates: Partial<GroupSettings>) => {
    updateFormData({
      settings: { ...formData.settings, ...updates },
    });
  }, [formData.settings, updateFormData]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!canManageSettings || !hasChanges) return;

    setIsLoading(true);
    setError(null);

    try {
      const updatedGroup = await updateGroup(group.id, {
        name: formData.name,
        description: formData.description || undefined,
        settings: formData.settings,
      });

      onGroupUpdate?.(updatedGroup);
      setHasChanges(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update group settings');
    } finally {
      setIsLoading(false);
    }
  }, [canManageSettings, hasChanges, updateGroup, group.id, formData, onGroupUpdate]);

  // Handle reset
  const handleReset = useCallback(() => {
    setFormData({
      name: group.name,
      description: group.description || '',
      settings: { ...group.settings },
    });
    setHasChanges(false);
    setError(null);
  }, [group]);

  // Handle delete group
  const handleDeleteGroup = useCallback(async () => {
    if (!canManageSettings) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this group? This action cannot be undone.'
    );

    if (!confirmed) return;

    setIsLoading(true);
    setError(null);

    try {
      await deleteGroup(group.id);
      onGroupDelete?.(group.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete group');
    } finally {
      setIsLoading(false);
    }
  }, [canManageSettings, deleteGroup, group.id, onGroupDelete]);

  // Render general settings
  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Basic Information</h4>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              disabled={!canManageSettings}
              placeholder="Enter group name"
            />
          </div>

          <div>
            <Label htmlFor="groupDescription">Description</Label>
            <textarea
              id="groupDescription"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              disabled={!canManageSettings}
              placeholder="Describe the purpose of this group"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Group Type</Label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">
                <Badge variant="secondary">
                  {group.type.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            <div>
              <Label>Created</Label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                {new Date(group.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-4">Limits & Capacity</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="maxParticipants">Maximum Participants</Label>
            <Input
              id="maxParticipants"
              type="number"
              min="2"
              max="1000"
              value={formData.settings.maxParticipants}
              onChange={(e) => updateSettings({ maxParticipants: parseInt(e.target.value) || 2 })}
              disabled={!canManageSettings}
            />
            <div className="text-xs text-gray-500 mt-1">
              Current: {group.participants.length} participants
            </div>
          </div>

          <div>
            <Label htmlFor="messageRetention">Message Retention (days)</Label>
            <Input
              id="messageRetention"
              type="number"
              min="1"
              value={formData.settings.messageRetention}
              onChange={(e) => updateSettings({ messageRetention: parseInt(e.target.value) || 1 })}
              disabled={!canManageSettings}
            />
            <div className="text-xs text-gray-500 mt-1">
              Messages older than this will be automatically deleted
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render privacy settings
  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Access Control</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {formData.settings.isPrivate ? <Lock className="h-5 w-5 text-gray-600" /> : <Globe className="h-5 w-5 text-gray-600" />}
              <div>
                <Label className="text-sm font-medium">Private Group</Label>
                <p className="text-xs text-gray-600">Only invited members can join this group</p>
              </div>
            </div>
            <Switch
              checked={formData.settings.isPrivate}
              onCheckedChange={(checked) => updateSettings({ isPrivate: checked })}
              disabled={!canManageSettings}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <UserCheck className="h-5 w-5 text-gray-600" />
              <div>
                <Label className="text-sm font-medium">Require Approval</Label>
                <p className="text-xs text-gray-600">New members need approval to join</p>
              </div>
            </div>
            <Switch
              checked={formData.settings.requireApproval}
              onCheckedChange={(checked) => updateSettings({ requireApproval: checked })}
              disabled={!canManageSettings}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <UserPlus className="h-5 w-5 text-gray-600" />
              <div>
                <Label className="text-sm font-medium">Allow Member Invites</Label>
                <p className="text-xs text-gray-600">Members can invite others to join</p>
              </div>
            </div>
            <Switch
              checked={formData.settings.allowInvites}
              onCheckedChange={(checked) => updateSettings({ allowInvites: checked })}
              disabled={!canManageSettings}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {formData.settings.anonymousMode ? <EyeOff className="h-5 w-5 text-gray-600" /> : <Eye className="h-5 w-5 text-gray-600" />}
              <div>
                <Label className="text-sm font-medium">Anonymous Mode</Label>
                <p className="text-xs text-gray-600">Hide member identities in discussions</p>
              </div>
            </div>
            <Switch
              checked={formData.settings.anonymousMode}
              onCheckedChange={(checked) => updateSettings({ anonymousMode: checked })}
              disabled={!canManageSettings}
            />
          </div>
        </div>
      </div>

      {group.type === 'therapy_group' && (
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Healthcare Compliance</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <Label className="text-sm font-medium text-green-900">HIPAA Compliant</Label>
                  <p className="text-xs text-green-700">Enable healthcare data protection</p>
                </div>
              </div>
              <Switch
                checked={formData.settings.hipaaCompliant}
                onCheckedChange={(checked) => updateSettings({ hipaaCompliant: checked })}
                disabled={!canManageSettings}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Video className="h-5 w-5 text-gray-600" />
                <div>
                  <Label className="text-sm font-medium">Session Recording</Label>
                  <p className="text-xs text-gray-600">Record therapy sessions for review</p>
                </div>
              </div>
              <Switch
                checked={formData.settings.sessionRecording}
                onCheckedChange={(checked) => updateSettings({ sessionRecording: checked })}
                disabled={!canManageSettings}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render features settings
  const renderFeaturesSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Communication Features</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-600" />
              <div>
                <Label className="text-sm font-medium">File Sharing</Label>
                <p className="text-xs text-gray-600">Allow file uploads</p>
              </div>
            </div>
            <Switch
              checked={formData.settings.allowFileSharing}
              onCheckedChange={(checked) => updateSettings({ allowFileSharing: checked })}
              disabled={!canManageSettings}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {formData.settings.allowVoiceCalls ? <Volume2 className="h-5 w-5 text-gray-600" /> : <VolumeX className="h-5 w-5 text-gray-600" />}
              <div>
                <Label className="text-sm font-medium">Voice Calls</Label>
                <p className="text-xs text-gray-600">Enable voice calling</p>
              </div>
            </div>
            <Switch
              checked={formData.settings.allowVoiceCalls}
              onCheckedChange={(checked) => updateSettings({ allowVoiceCalls: checked })}
              disabled={!canManageSettings}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {formData.settings.allowVideoCalls ? <Camera className="h-5 w-5 text-gray-600" /> : <CameraOff className="h-5 w-5 text-gray-600" />}
              <div>
                <Label className="text-sm font-medium">Video Calls</Label>
                <p className="text-xs text-gray-600">Enable video calling</p>
              </div>
            </div>
            <Switch
              checked={formData.settings.allowVideoCalls}
              onCheckedChange={(checked) => updateSettings({ allowVideoCalls: checked })}
              disabled={!canManageSettings}
            />
          </div>
        </div>
      </div>

      {formData.settings.quietHours && (
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Quiet Hours</h4>
          
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Enable Quiet Hours</Label>
              <Switch
                checked={formData.settings.quietHours.enabled}
                onCheckedChange={(checked) => updateSettings({
                  quietHours: { ...formData.settings.quietHours!, enabled: checked }
                })}
                disabled={!canManageSettings}
              />
            </div>

            {formData.settings.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quietStart" className="text-sm">Start Time</Label>
                  <Input
                    id="quietStart"
                    type="time"
                    value={formData.settings.quietHours.start}
                    onChange={(e) => updateSettings({
                      quietHours: { ...formData.settings.quietHours!, start: e.target.value }
                    })}
                    disabled={!canManageSettings}
                  />
                </div>

                <div>
                  <Label htmlFor="quietEnd" className="text-sm">End Time</Label>
                  <Input
                    id="quietEnd"
                    type="time"
                    value={formData.settings.quietHours.end}
                    onChange={(e) => updateSettings({
                      quietHours: { ...formData.settings.quietHours!, end: e.target.value }
                    })}
                    disabled={!canManageSettings}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Render moderation settings
  const renderModerationSettings = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Content Moderation</h4>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="moderationLevel" className="text-sm font-medium">Moderation Level</Label>
            <Select
              value={formData.settings.moderationLevel}
              onValueChange={(value) => updateSettings({ moderationLevel: value as any })}
              disabled={!canManageSettings}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None - No automatic moderation</SelectItem>
                <SelectItem value="basic">Basic - Standard content filtering</SelectItem>
                <SelectItem value="strict">Strict - Enhanced content moderation</SelectItem>
                <SelectItem value="therapeutic">Therapeutic - Mental health focused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Filter className="h-5 w-5 text-gray-600" />
              <div>
                <Label className="text-sm font-medium">Auto Moderation</Label>
                <p className="text-xs text-gray-600">Automatically moderate content</p>
              </div>
            </div>
            <Switch
              checked={formData.settings.autoModeration}
              onCheckedChange={(checked) => updateSettings({ autoModeration: checked })}
              disabled={!canManageSettings}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <MessageCircle className="h-5 w-5 text-gray-600" />
              <div>
                <Label className="text-sm font-medium">Profanity Filter</Label>
                <p className="text-xs text-gray-600">Filter inappropriate language</p>
              </div>
            </div>
            <Switch
              checked={formData.settings.profanityFilter}
              onCheckedChange={(checked) => updateSettings({ profanityFilter: checked })}
              disabled={!canManageSettings}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <Label className="text-sm font-medium text-red-900">Crisis Detection</Label>
                <p className="text-xs text-red-700">Monitor for crisis situations</p>
              </div>
            </div>
            <Switch
              checked={formData.settings.crisisDetection}
              onCheckedChange={(checked) => updateSettings({ crisisDetection: checked })}
              disabled={!canManageSettings}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render danger zone
  const renderDangerZone = () => (
    <div className="space-y-6">
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h4 className="font-medium text-red-900 mb-4">Danger Zone</h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="text-sm font-medium text-red-900">Delete Group</h5>
            <p className="text-xs text-red-700 mb-3">
              Permanently delete this group and all its data. This action cannot be undone.
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteGroup}
              disabled={!canManageSettings || isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Group
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'features', label: 'Features', icon: Users },
    { id: 'moderation', label: 'Moderation', icon: AlertTriangle },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ];

  if (!canManageSettings) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Settings className="h-8 w-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-600">You don't have permission to manage group settings</p>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Sidebar */}
        <div className="lg:w-64 mb-6 lg:mb-0">
          <nav className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as SettingsSection)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-left text-sm font-medium rounded-lg transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <section.icon className="h-4 w-4" />
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-lg">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {sections.find(s => s.id === activeSection)?.label} Settings
                </h3>
                
                {hasChanges && (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={handleReset} disabled={isLoading}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeSection === 'general' && renderGeneralSettings()}
                  {activeSection === 'privacy' && renderPrivacySettings()}
                  {activeSection === 'features' && renderFeaturesSettings()}
                  {activeSection === 'moderation' && renderModerationSettings()}
                  {activeSection === 'danger' && renderDangerZone()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}