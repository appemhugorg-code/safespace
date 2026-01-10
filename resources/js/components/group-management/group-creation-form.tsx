import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Shield, 
  Settings, 
  UserPlus, 
  Clock, 
  MessageCircle,
  Video,
  FileText,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { GroupConversation, GroupTemplate, GroupParticipant } from '@/services/group-management-service';
import { useGroupManagement } from '@/hooks/use-group-management';
import { motion, AnimatePresence } from 'framer-motion';

interface GroupCreationFormProps {
  authToken: string;
  userId: string;
  userRole: string;
  templates?: GroupTemplate[];
  onGroupCreated?: (group: GroupConversation) => void;
  onCancel?: () => void;
  className?: string;
}

interface FormData {
  name: string;
  description: string;
  type: GroupConversation['type'];
  templateId?: string;
  settings: {
    isPrivate: boolean;
    requireApproval: boolean;
    allowInvites: boolean;
    allowFileSharing: boolean;
    allowVoiceCalls: boolean;
    allowVideoCalls: boolean;
    maxParticipants: number;
    messageRetention: number;
    moderationLevel: 'none' | 'basic' | 'strict' | 'therapeutic';
    autoModeration: boolean;
    profanityFilter: boolean;
    crisisDetection: boolean;
    hipaaCompliant: boolean;
    sessionRecording: boolean;
    anonymousMode: boolean;
  };
  initialParticipants: Array<{
    userId: string;
    email?: string;
    role: GroupParticipant['role'];
  }>;
}

const GROUP_TYPES: Array<{ value: GroupConversation['type']; label: string; description: string; icon: React.ReactNode }> = [
  {
    value: 'therapy_group',
    label: 'Therapy Group',
    description: 'Professional therapy sessions with HIPAA compliance',
    icon: <Shield className="h-4 w-4" />,
  },
  {
    value: 'support_group',
    label: 'Support Group',
    description: 'Peer support and community discussions',
    icon: <Users className="h-4 w-4" />,
  },
  {
    value: 'family_group',
    label: 'Family Group',
    description: 'Family therapy and communication',
    icon: <Users className="h-4 w-4" />,
  },
  {
    value: 'crisis_group',
    label: 'Crisis Support',
    description: 'Emergency support and crisis intervention',
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  {
    value: 'general_group',
    label: 'General Group',
    description: 'General purpose group conversations',
    icon: <MessageCircle className="h-4 w-4" />,
  },
];

const MODERATION_LEVELS = [
  { value: 'none', label: 'None', description: 'No automatic moderation' },
  { value: 'basic', label: 'Basic', description: 'Basic content filtering' },
  { value: 'strict', label: 'Strict', description: 'Strict content moderation' },
  { value: 'therapeutic', label: 'Therapeutic', description: 'Mental health focused moderation' },
];

export function GroupCreationForm({
  authToken,
  userId,
  userRole,
  templates = [],
  onGroupCreated,
  onCancel,
  className = '',
}: GroupCreationFormProps) {
  const { createGroup, isLoading } = useGroupManagement({
    authToken,
    userId,
    userRole,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    type: 'general_group',
    settings: {
      isPrivate: false,
      requireApproval: false,
      allowInvites: true,
      allowFileSharing: true,
      allowVoiceCalls: true,
      allowVideoCalls: true,
      maxParticipants: 50,
      messageRetention: 365,
      moderationLevel: 'basic',
      autoModeration: true,
      profanityFilter: true,
      crisisDetection: false,
      hipaaCompliant: false,
      sessionRecording: false,
      anonymousMode: false,
    },
    initialParticipants: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [participantEmail, setParticipantEmail] = useState('');
  const [participantRole, setParticipantRole] = useState<GroupParticipant['role']>('client');

  // Apply template
  const applyTemplate = useCallback((template: GroupTemplate) => {
    setFormData(prev => ({
      ...prev,
      type: template.type,
      settings: {
        ...prev.settings,
        ...template.settings,
        maxParticipants: template.recommendedSize.optimal,
      },
    }));
  }, []);

  // Validation
  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Group name is required';
      } else if (formData.name.length < 3) {
        newErrors.name = 'Group name must be at least 3 characters';
      } else if (formData.name.length > 50) {
        newErrors.name = 'Group name must be less than 50 characters';
      }

      if (formData.description.length > 500) {
        newErrors.description = 'Description must be less than 500 characters';
      }
    }

    if (step === 2) {
      if (formData.settings.maxParticipants < 2) {
        newErrors.maxParticipants = 'Group must allow at least 2 participants';
      } else if (formData.settings.maxParticipants > 1000) {
        newErrors.maxParticipants = 'Maximum participants cannot exceed 1000';
      }

      if (formData.settings.messageRetention < 1) {
        newErrors.messageRetention = 'Message retention must be at least 1 day';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateStep(currentStep)) return;

    try {
      const group = await createGroup({
        name: formData.name,
        description: formData.description || undefined,
        type: formData.type,
        settings: formData.settings,
        initialParticipants: formData.initialParticipants.map(p => p.userId || p.email!),
        templateId: formData.templateId,
      });

      onGroupCreated?.(group);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to create group' });
    }
  }, [currentStep, validateStep, createGroup, formData, onGroupCreated]);

  // Add participant
  const addParticipant = useCallback(() => {
    if (!participantEmail.trim()) return;

    const newParticipant = {
      userId: '', // Will be resolved by email
      email: participantEmail,
      role: participantRole,
    };

    setFormData(prev => ({
      ...prev,
      initialParticipants: [...prev.initialParticipants, newParticipant],
    }));

    setParticipantEmail('');
  }, [participantEmail, participantRole]);

  // Remove participant
  const removeParticipant = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      initialParticipants: prev.initialParticipants.filter((_, i) => i !== index),
    }));
  }, []);

  // Navigation
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  // Update form data
  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSettings = useCallback((updates: Partial<FormData['settings']>) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, []);

  // Auto-configure based on group type
  const handleTypeChange = useCallback((type: GroupConversation['type']) => {
    const typeSettings: Partial<FormData['settings']> = {};

    switch (type) {
      case 'therapy_group':
        typeSettings.hipaaCompliant = true;
        typeSettings.sessionRecording = true;
        typeSettings.crisisDetection = true;
        typeSettings.moderationLevel = 'therapeutic';
        typeSettings.requireApproval = true;
        typeSettings.maxParticipants = 12;
        break;
      case 'crisis_group':
        typeSettings.crisisDetection = true;
        typeSettings.moderationLevel = 'strict';
        typeSettings.requireApproval = false;
        typeSettings.maxParticipants = 20;
        break;
      case 'family_group':
        typeSettings.moderationLevel = 'basic';
        typeSettings.requireApproval = true;
        typeSettings.maxParticipants = 8;
        break;
      case 'support_group':
        typeSettings.moderationLevel = 'basic';
        typeSettings.anonymousMode = true;
        typeSettings.maxParticipants = 25;
        break;
      default:
        typeSettings.moderationLevel = 'basic';
        typeSettings.maxParticipants = 50;
    }

    updateFormData({ type });
    updateSettings(typeSettings);
  }, [updateFormData, updateSettings]);

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        
        {/* Templates */}
        {templates.length > 0 && (
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">Use Template (Optional)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  className="p-3 border border-gray-200 rounded-lg text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {template.type.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {template.recommendedSize.min}-{template.recommendedSize.max} members
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Group Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Group Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="Enter group name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            placeholder="Describe the purpose of this group"
            rows={3}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-500' : ''
            }`}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{errors.description || ''}</span>
            <span>{formData.description.length}/500</span>
          </div>
        </div>

        {/* Group Type */}
        <div className="space-y-2">
          <Label>Group Type *</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {GROUP_TYPES.map(type => (
              <button
                key={type.value}
                onClick={() => handleTypeChange(type.value)}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  formData.type === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {type.icon}
                  <span className="font-medium text-sm">{type.label}</span>
                </div>
                <p className="text-xs text-gray-600">{type.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Group Settings</h3>

        {/* Privacy Settings */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm">Privacy & Access</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Private Group</Label>
                <p className="text-xs text-gray-600">Only invited members can join</p>
              </div>
              <Switch
                checked={formData.settings.isPrivate}
                onCheckedChange={(checked) => updateSettings({ isPrivate: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Require Approval</Label>
                <p className="text-xs text-gray-600">New members need approval to join</p>
              </div>
              <Switch
                checked={formData.settings.requireApproval}
                onCheckedChange={(checked) => updateSettings({ requireApproval: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Allow Invites</Label>
                <p className="text-xs text-gray-600">Members can invite others</p>
              </div>
              <Switch
                checked={formData.settings.allowInvites}
                onCheckedChange={(checked) => updateSettings({ allowInvites: checked })}
              />
            </div>
          </div>
        </div>

        {/* Feature Settings */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm">Features</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <div>
                  <Label className="text-sm">File Sharing</Label>
                  <p className="text-xs text-gray-600">Allow file uploads and sharing</p>
                </div>
              </div>
              <Switch
                checked={formData.settings.allowFileSharing}
                onCheckedChange={(checked) => updateSettings({ allowFileSharing: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Video className="h-4 w-4 text-gray-500" />
                <div>
                  <Label className="text-sm">Video Calls</Label>
                  <p className="text-xs text-gray-600">Enable video calling</p>
                </div>
              </div>
              <Switch
                checked={formData.settings.allowVideoCalls}
                onCheckedChange={(checked) => updateSettings({ allowVideoCalls: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Voice Calls</Label>
                <p className="text-xs text-gray-600">Enable voice calling</p>
              </div>
              <Switch
                checked={formData.settings.allowVoiceCalls}
                onCheckedChange={(checked) => updateSettings({ allowVoiceCalls: checked })}
              />
            </div>
          </div>
        </div>

        {/* Limits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="maxParticipants">Max Participants</Label>
            <Input
              id="maxParticipants"
              type="number"
              min="2"
              max="1000"
              value={formData.settings.maxParticipants}
              onChange={(e) => updateSettings({ maxParticipants: parseInt(e.target.value) || 2 })}
              className={errors.maxParticipants ? 'border-red-500' : ''}
            />
            {errors.maxParticipants && (
              <p className="text-sm text-red-600">{errors.maxParticipants}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="messageRetention">Message Retention (days)</Label>
            <Input
              id="messageRetention"
              type="number"
              min="1"
              value={formData.settings.messageRetention}
              onChange={(e) => updateSettings({ messageRetention: parseInt(e.target.value) || 1 })}
              className={errors.messageRetention ? 'border-red-500' : ''}
            />
            {errors.messageRetention && (
              <p className="text-sm text-red-600">{errors.messageRetention}</p>
            )}
          </div>
        </div>

        {/* Moderation */}
        <div className="space-y-2">
          <Label>Moderation Level</Label>
          <Select
            value={formData.settings.moderationLevel}
            onValueChange={(value: any) => updateSettings({ moderationLevel: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODERATION_LEVELS.map(level => (
                <SelectItem key={level.value} value={level.value}>
                  <div>
                    <div className="font-medium">{level.label}</div>
                    <div className="text-xs text-gray-600">{level.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm">Advanced Settings</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Auto Moderation</Label>
                <p className="text-xs text-gray-600">Automatically moderate content</p>
              </div>
              <Switch
                checked={formData.settings.autoModeration}
                onCheckedChange={(checked) => updateSettings({ autoModeration: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm">Crisis Detection</Label>
                <p className="text-xs text-gray-600">Monitor for crisis situations</p>
              </div>
              <Switch
                checked={formData.settings.crisisDetection}
                onCheckedChange={(checked) => updateSettings({ crisisDetection: checked })}
              />
            </div>

            {formData.type === 'therapy_group' && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <div>
                      <Label className="text-sm">HIPAA Compliant</Label>
                      <p className="text-xs text-gray-600">Enable healthcare compliance</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.settings.hipaaCompliant}
                    onCheckedChange={(checked) => updateSettings({ hipaaCompliant: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Session Recording</Label>
                    <p className="text-xs text-gray-600">Record therapy sessions</p>
                  </div>
                  <Switch
                    checked={formData.settings.sessionRecording}
                    onCheckedChange={(checked) => updateSettings({ sessionRecording: checked })}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Invite Participants</h3>
        <p className="text-sm text-gray-600 mb-6">
          Add initial participants to your group. You can always invite more people later.
        </p>

        {/* Add Participant */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm">Add Participant</h4>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Enter email address"
              value={participantEmail}
              onChange={(e) => setParticipantEmail(e.target.value)}
              className="flex-1"
            />
            <Select value={participantRole} onValueChange={(value: any) => setParticipantRole(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="guardian">Guardian</SelectItem>
                <SelectItem value="therapist">Therapist</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="observer">Observer</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addParticipant} disabled={!participantEmail.trim()}>
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Participant List */}
        {formData.initialParticipants.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Invited Participants ({formData.initialParticipants.length})</h4>
            <div className="space-y-2">
              {formData.initialParticipants.map((participant, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{participant.email}</p>
                      <Badge variant="secondary" className="text-xs">
                        {participant.role}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeParticipant(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-sm text-blue-900 mb-2">Group Summary</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p><strong>Name:</strong> {formData.name}</p>
            <p><strong>Type:</strong> {GROUP_TYPES.find(t => t.value === formData.type)?.label}</p>
            <p><strong>Privacy:</strong> {formData.settings.isPrivate ? 'Private' : 'Public'}</p>
            <p><strong>Max Members:</strong> {formData.settings.maxParticipants}</p>
            <p><strong>Initial Participants:</strong> {formData.initialParticipants.length}</p>
            {formData.settings.hipaaCompliant && (
              <div className="flex items-center space-x-1 text-green-700">
                <Shield className="h-3 w-3" />
                <span>HIPAA Compliant</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map(step => (
          <div key={step} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
            `}>
              {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 mx-2 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between mb-8 text-sm">
        <span className={currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
          Basic Info
        </span>
        <span className={currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
          Settings
        </span>
        <span className={currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}>
          Participants
        </span>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </motion.div>
      </AnimatePresence>

      {/* Error Message */}
      {errors.submit && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={prevStep}>
              Previous
            </Button>
          )}
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          
          {currentStep < 3 ? (
            <Button onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Group'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}