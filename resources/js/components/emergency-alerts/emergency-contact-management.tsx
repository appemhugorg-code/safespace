import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MessageSquare, 
  Bell, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  User,
  Shield,
  Settings,
  TestTube
} from 'lucide-react';
import { EmergencyContact } from '@/services/emergency-alert-service';
import { useEmergencyAlerts } from '@/hooks/use-emergency-alerts';

interface EmergencyContactManagementProps {
  userId: string;
  userRole: string;
  authToken: string;
  onContactChange?: (contacts: EmergencyContact[]) => void;
}

export function EmergencyContactManagement({ 
  userId, 
  userRole, 
  authToken, 
  onContactChange 
}: EmergencyContactManagementProps) {
  const {
    emergencyContacts,
    isLoading,
    error,
    addEmergencyContact,
    updateEmergencyContact,
    removeEmergencyContact,
    testEmergencyContact,
    getContactAvailability,
    refreshContacts,
  } = useEmergencyAlerts({
    authToken,
    userId,
    userRole,
    autoLoadAlerts: false,
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState<Partial<EmergencyContact>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    onContactChange?.(emergencyContacts);
  }, [emergencyContacts, onContactChange]);

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: 'emergency_contact',
      contactMethods: [{
        type: 'phone',
        value: '',
        priority: 1,
        verified: false,
        active: true,
      }],
      availability: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        schedule: [],
        emergencyOnly: false,
        alwaysAvailable: true,
      },
      escalationLevel: 'primary',
      permissions: {
        canReceiveAlerts: true,
        canAcknowledgeAlerts: false,
        canEscalateAlerts: false,
        canAccessUserData: false,
      },
    });
  };

  const handleAddContact = () => {
    resetForm();
    setShowAddForm(true);
    setEditingContact(null);
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setFormData(contact);
    setEditingContact(contact);
    setShowAddForm(true);
  };

  const handleSaveContact = async () => {
    if (!formData.name || !formData.contactMethods?.[0]?.value) return;

    setActionLoading('save');
    try {
      if (editingContact) {
        await updateEmergencyContact(editingContact.id, formData);
      } else {
        await addEmergencyContact({
          ...formData,
          userId,
        } as Omit<EmergencyContact, 'id' | 'metadata'>);
      }
      setShowAddForm(false);
      setEditingContact(null);
      resetForm();
    } catch (err) {
      console.error('Failed to save contact:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this emergency contact?')) return;

    setActionLoading(contactId);
    try {
      await removeEmergencyContact(contactId);
    } catch (err) {
      console.error('Failed to delete contact:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleTestContact = async (contactId: string, method: string) => {
    setActionLoading(`test_${contactId}_${method}`);
    try {
      const success = await testEmergencyContact(contactId, method);
      setTestResults(prev => ({
        ...prev,
        [`${contactId}_${method}`]: success,
      }));
    } catch (err) {
      console.error('Failed to test contact:', err);
      setTestResults(prev => ({
        ...prev,
        [`${contactId}_${method}`]: false,
      }));
    } finally {
      setActionLoading(null);
    }
  };

  const addContactMethod = () => {
    const methods = formData.contactMethods || [];
    setFormData({
      ...formData,
      contactMethods: [
        ...methods,
        {
          type: 'email',
          value: '',
          priority: methods.length + 1,
          verified: false,
          active: true,
        },
      ],
    });
  };

  const updateContactMethod = (index: number, updates: any) => {
    const methods = [...(formData.contactMethods || [])];
    methods[index] = { ...methods[index], ...updates };
    setFormData({ ...formData, contactMethods: methods });
  };

  const removeContactMethod = (index: number) => {
    const methods = [...(formData.contactMethods || [])];
    methods.splice(index, 1);
    setFormData({ ...formData, contactMethods: methods });
  };

  const getRelationshipIcon = (relationship: EmergencyContact['relationship']) => {
    switch (relationship) {
      case 'therapist':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'guardian':
        return <Shield className="w-4 h-4 text-green-600" />;
      case 'crisis_team':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'professional':
        return <Settings className="w-4 h-4 text-purple-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'push':
        return <Bell className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Emergency Contacts</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage contacts for crisis notifications and escalation
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={refreshContacts}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Refresh
            </button>
            <button
              onClick={handleAddContact}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400">
          <div className="flex">
            <XCircle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Contact List */}
      <div className="divide-y divide-gray-200">
        {emergencyContacts.length === 0 ? (
          <div className="p-8 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Emergency Contacts</h3>
            <p className="text-gray-600 mb-4">
              Add emergency contacts to receive notifications during crisis situations.
            </p>
            <button
              onClick={handleAddContact}
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Contact</span>
            </button>
          </div>
        ) : (
          emergencyContacts.map((contact) => {
            const availability = getContactAvailability(contact);
            
            return (
              <div key={contact.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Contact Icon */}
                    <div className="flex-shrink-0">
                      {getRelationshipIcon(contact.relationship)}
                    </div>

                    {/* Contact Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {contact.name}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {contact.relationship.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          contact.escalationLevel === 'primary' ? 'bg-red-100 text-red-800' :
                          contact.escalationLevel === 'secondary' ? 'bg-yellow-100 text-yellow-800' :
                          contact.escalationLevel === 'emergency' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {contact.escalationLevel}
                        </span>
                      </div>

                      {/* Contact Methods */}
                      <div className="space-y-2 mb-3">
                        {contact.contactMethods.map((method, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              {getMethodIcon(method.type)}
                              <span className="text-sm text-gray-700">{method.value}</span>
                              {method.verified && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                              {!method.active && (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            
                            {/* Test Button */}
                            <button
                              onClick={() => handleTestContact(contact.id, method.type)}
                              disabled={actionLoading === `test_${contact.id}_${method.type}`}
                              className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                              <TestTube className="w-3 h-3" />
                              <span>
                                {actionLoading === `test_${contact.id}_${method.type}` ? 'Testing...' : 'Test'}
                              </span>
                            </button>

                            {/* Test Result */}
                            {testResults[`${contact.id}_${method.type}`] !== undefined && (
                              <div className={`flex items-center space-x-1 ${
                                testResults[`${contact.id}_${method.type}`] ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {testResults[`${contact.id}_${method.type}`] ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                                <span className="text-xs">
                                  {testResults[`${contact.id}_${method.type}`] ? 'Success' : 'Failed'}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Availability */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span className={`font-medium ${
                            availability === 'available' ? 'text-green-600' :
                            availability === 'emergency_only' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {availability === 'available' ? 'Available' :
                             availability === 'emergency_only' ? 'Emergency Only' :
                             'Unavailable'}
                          </span>
                        </div>
                        
                        <div className="text-xs">
                          Response Rate: {Math.round(contact.metadata.responseRate * 100)}%
                        </div>
                        
                        <div className="text-xs">
                          Avg Response: {contact.metadata.averageResponseTime}min
                        </div>
                      </div>

                      {/* Permissions */}
                      <div className="flex items-center space-x-2 mt-2">
                        {contact.permissions.canReceiveAlerts && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Receive Alerts
                          </span>
                        )}
                        {contact.permissions.canAcknowledgeAlerts && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                            Acknowledge
                          </span>
                        )}
                        {contact.permissions.canEscalateAlerts && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                            Escalate
                          </span>
                        )}
                        {contact.permissions.canAccessUserData && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            Access Data
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEditContact(contact)}
                      className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      disabled={actionLoading === contact.id}
                      className="p-2 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Contact Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  {editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
                </h3>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Contact name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship
                      </label>
                      <select
                        value={formData.relationship || 'emergency_contact'}
                        onChange={(e) => setFormData({ ...formData, relationship: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="emergency_contact">Emergency Contact</option>
                        <option value="therapist">Therapist</option>
                        <option value="guardian">Guardian</option>
                        <option value="crisis_team">Crisis Team</option>
                        <option value="family">Family</option>
                        <option value="friend">Friend</option>
                        <option value="professional">Professional</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Methods */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Contact Methods *
                      </label>
                      <button
                        type="button"
                        onClick={addContactMethod}
                        className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Method</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(formData.contactMethods || []).map((method, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
                          <select
                            value={method.type}
                            onChange={(e) => updateContactMethod(index, { type: e.target.value })}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="phone">Phone</option>
                            <option value="sms">SMS</option>
                            <option value="email">Email</option>
                            <option value="push">Push</option>
                          </select>

                          <input
                            type="text"
                            value={method.value}
                            onChange={(e) => updateContactMethod(index, { value: e.target.value })}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={
                              method.type === 'phone' || method.type === 'sms' ? 'Phone number' :
                              method.type === 'email' ? 'Email address' :
                              'Contact value'
                            }
                          />

                          <select
                            value={method.priority}
                            onChange={(e) => updateContactMethod(index, { priority: parseInt(e.target.value) })}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value={1}>Priority 1</option>
                            <option value={2}>Priority 2</option>
                            <option value={3}>Priority 3</option>
                            <option value={4}>Priority 4</option>
                            <option value={5}>Priority 5</option>
                          </select>

                          {formData.contactMethods!.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeContactMethod(index)}
                              className="p-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Escalation Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Escalation Level
                    </label>
                    <select
                      value={formData.escalationLevel || 'primary'}
                      onChange={(e) => setFormData({ ...formData, escalationLevel: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="emergency">Emergency</option>
                      <option value="crisis">Crisis</option>
                    </select>
                  </div>

                  {/* Permissions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Permissions
                    </label>
                    <div className="space-y-2">
                      {[
                        { key: 'canReceiveAlerts', label: 'Can receive alerts' },
                        { key: 'canAcknowledgeAlerts', label: 'Can acknowledge alerts' },
                        { key: 'canEscalateAlerts', label: 'Can escalate alerts' },
                        { key: 'canAccessUserData', label: 'Can access user data' },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.permissions?.[key as keyof typeof formData.permissions] || false}
                            onChange={(e) => setFormData({
                              ...formData,
                              permissions: {
                                ...formData.permissions,
                                [key]: e.target.checked,
                              },
                            })}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                          <span className="ml-2 text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveContact}
                    disabled={!formData.name || !formData.contactMethods?.[0]?.value || actionLoading === 'save'}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {actionLoading === 'save' ? 'Saving...' : editingContact ? 'Update Contact' : 'Add Contact'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}