import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  AlertTriangle, 
  Settings, 
  CheckCircle, 
  XCircle,
  ArrowRight,
  Shield,
  Phone,
  Users,
  Timer
} from 'lucide-react';
import { EscalationProtocol, EmergencyAlert } from '@/services/emergency-alert-service';

interface EscalationProtocolConfigProps {
  authToken: string;
  userRole: string;
  onProtocolChange?: (protocols: EscalationProtocol[]) => void;
}

export function EscalationProtocolConfig({ 
  authToken, 
  userRole, 
  onProtocolChange 
}: EscalationProtocolConfigProps) {
  const [protocols, setProtocols] = useState<EscalationProtocol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProtocol, setEditingProtocol] = useState<EscalationProtocol | null>(null);
  const [formData, setFormData] = useState<Partial<EscalationProtocol>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadProtocols();
  }, []);

  useEffect(() => {
    onProtocolChange?.(protocols);
  }, [protocols, onProtocolChange]);

  const loadProtocols = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/emergency/protocols', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load protocols: ${response.status}`);
      }

      const result = await response.json();
      setProtocols(result.protocols || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load protocols');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      triggerConditions: {
        severity: ['high', 'critical', 'emergency'],
        alertTypes: ['crisis_detected', 'panic_button'],
        userRoles: ['client', 'child'],
      },
      escalationLevels: [
        {
          level: 1,
          name: 'Primary Response',
          description: 'Immediate response team',
          timeoutMinutes: 5,
          contactTypes: ['therapist', 'guardian'],
          notificationMethods: ['phone', 'sms', 'push'],
          requiresAcknowledgment: true,
          autoEscalate: true,
        },
      ],
      emergencyServices: {
        enabled: false,
        threshold: 'emergency',
        contactInfo: {
          phone: '911',
          description: 'Emergency Services',
        },
      },
      active: true,
    });
  };

  const handleAddProtocol = () => {
    resetForm();
    setShowAddForm(true);
    setEditingProtocol(null);
  };

  const handleEditProtocol = (protocol: EscalationProtocol) => {
    setFormData(protocol);
    setEditingProtocol(protocol);
    setShowAddForm(true);
  };

  const handleSaveProtocol = async () => {
    if (!formData.name || !formData.escalationLevels?.length) return;

    setActionLoading('save');
    try {
      const url = editingProtocol 
        ? `/api/emergency/protocols/${editingProtocol.id}`
        : '/api/emergency/protocols';
      
      const method = editingProtocol ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdAt: editingProtocol?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save protocol: ${response.status}`);
      }

      const result = await response.json();
      
      if (editingProtocol) {
        setProtocols(prev => prev.map(p => p.id === editingProtocol.id ? result.protocol : p));
      } else {
        setProtocols(prev => [...prev, result.protocol]);
      }

      setShowAddForm(false);
      setEditingProtocol(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save protocol');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProtocol = async (protocolId: string) => {
    if (!confirm('Are you sure you want to delete this escalation protocol?')) return;

    setActionLoading(protocolId);
    try {
      const response = await fetch(`/api/emergency/protocols/${protocolId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete protocol: ${response.status}`);
      }

      setProtocols(prev => prev.filter(p => p.id !== protocolId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete protocol');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleProtocolActive = async (protocolId: string, active: boolean) => {
    setActionLoading(protocolId);
    try {
      const response = await fetch(`/api/emergency/protocols/${protocolId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update protocol: ${response.status}`);
      }

      const result = await response.json();
      setProtocols(prev => prev.map(p => p.id === protocolId ? result.protocol : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update protocol');
    } finally {
      setActionLoading(null);
    }
  };

  const addEscalationLevel = () => {
    const levels = formData.escalationLevels || [];
    setFormData({
      ...formData,
      escalationLevels: [
        ...levels,
        {
          level: levels.length + 1,
          name: `Level ${levels.length + 1}`,
          description: '',
          timeoutMinutes: 10,
          contactTypes: ['emergency_contact'],
          notificationMethods: ['phone', 'sms'],
          requiresAcknowledgment: true,
          autoEscalate: true,
        },
      ],
    });
  };

  const updateEscalationLevel = (index: number, updates: any) => {
    const levels = [...(formData.escalationLevels || [])];
    levels[index] = { ...levels[index], ...updates };
    setFormData({ ...formData, escalationLevels: levels });
  };

  const removeEscalationLevel = (index: number) => {
    const levels = [...(formData.escalationLevels || [])];
    levels.splice(index, 1);
    // Renumber levels
    levels.forEach((level, i) => {
      level.level = i + 1;
    });
    setFormData({ ...formData, escalationLevels: levels });
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
            <h2 className="text-xl font-semibold text-gray-900">Escalation Protocols</h2>
            <p className="text-sm text-gray-600 mt-1">
              Configure automated escalation rules for emergency situations
            </p>
          </div>
          {userRole === 'admin' && (
            <button
              onClick={handleAddProtocol}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4" />
              <span>Add Protocol</span>
            </button>
          )}
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

      {/* Protocol List */}
      <div className="divide-y divide-gray-200">
        {protocols.length === 0 ? (
          <div className="p-8 text-center">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Escalation Protocols</h3>
            <p className="text-gray-600 mb-4">
              Create escalation protocols to automate crisis response procedures.
            </p>
            {userRole === 'admin' && (
              <button
                onClick={handleAddProtocol}
                className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Protocol</span>
              </button>
            )}
          </div>
        ) : (
          protocols.map((protocol) => (
            <div key={protocol.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {protocol.name}
                    </h3>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      protocol.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {protocol.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{protocol.description}</p>

                  {/* Trigger Conditions */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Trigger Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">Severity:</span>
                        {protocol.triggerConditions.severity.map((severity) => (
                          <span key={severity} className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            severity === 'emergency' || severity === 'critical' ? 'bg-red-100 text-red-800' :
                            severity === 'high' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {severity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Escalation Levels */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Escalation Levels</h4>
                    <div className="space-y-2">
                      {protocol.escalationLevels.map((level, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-medium rounded-full">
                            {level.level}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{level.name}</span>
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Timer className="w-3 h-3" />
                                <span>{level.timeoutMinutes}min</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600">
                                  {level.contactTypes.join(', ')}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Phone className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-600">
                                  {level.notificationMethods.join(', ')}
                                </span>
                              </div>
                            </div>
                          </div>
                          {index < protocol.escalationLevels.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Emergency Services */}
                  {protocol.emergencyServices.enabled && (
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
                        <Shield className="w-4 h-4 text-red-600" />
                        <div>
                          <span className="text-sm font-medium text-red-800">Emergency Services Integration</span>
                          <p className="text-xs text-red-700">
                            Automatically contacts {protocol.emergencyServices.contactInfo.description} 
                            for {protocol.emergencyServices.threshold}+ alerts
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {userRole === 'admin' && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleProtocolActive(protocol.id, !protocol.active)}
                      disabled={actionLoading === protocol.id}
                      className={`px-3 py-1 text-xs font-medium rounded focus:outline-none focus:ring-2 disabled:opacity-50 ${
                        protocol.active
                          ? 'text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500'
                          : 'text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500'
                      }`}
                    >
                      {protocol.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEditProtocol(protocol)}
                      className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProtocol(protocol.id)}
                      disabled={actionLoading === protocol.id}
                      className="p-2 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Protocol Modal */}
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
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  {editingProtocol ? 'Edit Escalation Protocol' : 'Add Escalation Protocol'}
                </h3>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Protocol Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Standard Crisis Response"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.active ? 'active' : 'inactive'}
                        onChange={(e) => setFormData({ ...formData, active: e.target.value === 'active' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Describe when and how this protocol should be used..."
                    />
                  </div>

                  {/* Trigger Conditions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Trigger Conditions
                    </label>
                    <div className="space-y-4 p-4 border border-gray-200 rounded-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Alert Severity Levels
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['low', 'medium', 'high', 'critical', 'emergency'].map((severity) => (
                            <label key={severity} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.triggerConditions?.severity?.includes(severity as any) || false}
                                onChange={(e) => {
                                  const severities = formData.triggerConditions?.severity || [];
                                  const updated = e.target.checked
                                    ? [...severities, severity]
                                    : severities.filter(s => s !== severity);
                                  setFormData({
                                    ...formData,
                                    triggerConditions: {
                                      ...formData.triggerConditions,
                                      severity: updated as any,
                                    },
                                  });
                                }}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                              />
                              <span className="ml-2 text-sm text-gray-700 capitalize">{severity}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Alert Types
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['crisis_detected', 'panic_button', 'manual_escalation', 'system_alert'].map((type) => (
                            <label key={type} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.triggerConditions?.alertTypes?.includes(type as any) || false}
                                onChange={(e) => {
                                  const types = formData.triggerConditions?.alertTypes || [];
                                  const updated = e.target.checked
                                    ? [...types, type]
                                    : types.filter(t => t !== type);
                                  setFormData({
                                    ...formData,
                                    triggerConditions: {
                                      ...formData.triggerConditions,
                                      alertTypes: updated as any,
                                    },
                                  });
                                }}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                {type.replace('_', ' ')}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Escalation Levels */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Escalation Levels *
                      </label>
                      <button
                        type="button"
                        onClick={addEscalationLevel}
                        className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Level</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(formData.escalationLevels || []).map((level, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-md">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-900">
                              Level {level.level}
                            </h4>
                            {formData.escalationLevels!.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeEscalationLevel(index)}
                                className="p-1 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Level Name
                              </label>
                              <input
                                type="text"
                                value={level.name}
                                onChange={(e) => updateEscalationLevel(index, { name: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Primary Response"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Timeout (minutes)
                              </label>
                              <input
                                type="number"
                                value={level.timeoutMinutes}
                                onChange={(e) => updateEscalationLevel(index, { timeoutMinutes: parseInt(e.target.value) || 5 })}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                min="1"
                                max="60"
                              />
                            </div>
                          </div>

                          <div className="mt-3">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Description
                            </label>
                            <input
                              type="text"
                              value={level.description}
                              onChange={(e) => updateEscalationLevel(index, { description: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Describe this escalation level..."
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">
                                Contact Types
                              </label>
                              <div className="space-y-1">
                                {['therapist', 'guardian', 'emergency_contact', 'crisis_team', 'family', 'professional'].map((type) => (
                                  <label key={type} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={level.contactTypes.includes(type as any)}
                                      onChange={(e) => {
                                        const types = e.target.checked
                                          ? [...level.contactTypes, type]
                                          : level.contactTypes.filter(t => t !== type);
                                        updateEscalationLevel(index, { contactTypes: types });
                                      }}
                                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                    <span className="ml-2 text-xs text-gray-700">
                                      {type.replace('_', ' ')}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-2">
                                Notification Methods
                              </label>
                              <div className="space-y-1">
                                {['phone', 'sms', 'email', 'push', 'in_app'].map((method) => (
                                  <label key={method} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={level.notificationMethods.includes(method)}
                                      onChange={(e) => {
                                        const methods = e.target.checked
                                          ? [...level.notificationMethods, method]
                                          : level.notificationMethods.filter(m => m !== method);
                                        updateEscalationLevel(index, { notificationMethods: methods });
                                      }}
                                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                    <span className="ml-2 text-xs text-gray-700 uppercase">
                                      {method.replace('_', ' ')}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 mt-3">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={level.requiresAcknowledgment}
                                onChange={(e) => updateEscalationLevel(index, { requiresAcknowledgment: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                              />
                              <span className="ml-2 text-xs text-gray-700">Requires acknowledgment</span>
                            </label>

                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={level.autoEscalate}
                                onChange={(e) => updateEscalationLevel(index, { autoEscalate: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                              />
                              <span className="ml-2 text-xs text-gray-700">Auto-escalate on timeout</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Emergency Services */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Emergency Services Integration
                    </label>
                    <div className="p-4 border border-gray-200 rounded-md">
                      <label className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          checked={formData.emergencyServices?.enabled || false}
                          onChange={(e) => setFormData({
                            ...formData,
                            emergencyServices: {
                              ...formData.emergencyServices,
                              enabled: e.target.checked,
                            },
                          })}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enable emergency services integration</span>
                      </label>

                      {formData.emergencyServices?.enabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Activation Threshold
                            </label>
                            <select
                              value={formData.emergencyServices?.threshold || 'emergency'}
                              onChange={(e) => setFormData({
                                ...formData,
                                emergencyServices: {
                                  ...formData.emergencyServices,
                                  threshold: e.target.value as any,
                                },
                              })}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="high">High</option>
                              <option value="critical">Critical</option>
                              <option value="emergency">Emergency</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Contact Number
                            </label>
                            <input
                              type="text"
                              value={formData.emergencyServices?.contactInfo?.phone || ''}
                              onChange={(e) => setFormData({
                                ...formData,
                                emergencyServices: {
                                  ...formData.emergencyServices,
                                  contactInfo: {
                                    ...formData.emergencyServices?.contactInfo,
                                    phone: e.target.value,
                                  },
                                },
                              })}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="911"
                            />
                          </div>
                        </div>
                      )}
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
                    onClick={handleSaveProtocol}
                    disabled={!formData.name || !formData.escalationLevels?.length || actionLoading === 'save'}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {actionLoading === 'save' ? 'Saving...' : editingProtocol ? 'Update Protocol' : 'Create Protocol'}
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