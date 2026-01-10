import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  UserPlus, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle,
  Send,
  Copy,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  Users,
  AlertCircle,
  Trash2,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { 
  GroupConversation, 
  GroupParticipant, 
  GroupInvitation 
} from '@/services/group-management-service';
import { useGroupManagement } from '@/hooks/use-group-management';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';

interface InvitationManagementProps {
  group: GroupConversation;
  authToken: string;
  userId: string;
  userRole: string;
  onInvitationSent?: (invitation: GroupInvitation) => void;
  className?: string;
}

interface InvitationFilters {
  status?: GroupInvitation['status'];
  search: string;
}

interface InviteForm {
  email: string;
  role: GroupParticipant['role'];
  message: string;
  expiresIn: number; // hours
}

export function InvitationManagement({
  group,
  authToken,
  userId,
  userRole,
  onInvitationSent,
  className = '',
}: InvitationManagementProps) {
  const {
    sendInvitation,
    getInvitations,
    hasPermission,
  } = useGroupManagement({
    authToken,
    userId,
    userRole,
  });

  const [invitations, setInvitations] = useState<GroupInvitation[]>([]);
  const [filters, setFilters] = useState<InvitationFilters>({ search: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const [inviteForm, setInviteForm] = useState<InviteForm>({
    email: '',
    role: 'client',
    message: '',
    expiresIn: 168, // 7 days
  });

  const canInvite = hasPermission(group.id, 'invite');

  // Load invitations
  const loadInvitations = useCallback(async () => {
    setIsLoading(true);
    try {
      const groupInvitations = await getInvitations({ groupId: group.id });
      setInvitations(groupInvitations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invitations');
    } finally {
      setIsLoading(false);
    }
  }, [getInvitations, group.id]);

  // Load on mount
  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  // Handle send invitation
  const handleSendInvitation = useCallback(async () => {
    if (!canInvite || !inviteForm.email.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const invitation = await sendInvitation({
        groupId: group.id,
        email: inviteForm.email,
        role: inviteForm.role,
        message: inviteForm.message || undefined,
        expiresIn: inviteForm.expiresIn,
      });

      onInvitationSent?.(invitation);
      
      // Reset form
      setInviteForm({
        email: '',
        role: 'client',
        message: '',
        expiresIn: 168,
      });
      
      setShowInviteForm(false);
      
      // Refresh invitations
      await loadInvitations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  }, [canInvite, inviteForm, sendInvitation, group.id, onInvitationSent, loadInvitations]);

  // Copy invitation link
  const copyInvitationLink = useCallback((invitationId: string) => {
    const link = `${window.location.origin}/groups/join/${invitationId}`;
    navigator.clipboard.writeText(link);
    // You could show a toast notification here
  }, []);

  // Filter invitations
  const filteredInvitations = invitations.filter(invitation => {
    const matchesSearch = !filters.search || 
      (invitation.invitedEmail && invitation.invitedEmail.toLowerCase().includes(filters.search.toLowerCase()));
    const matchesStatus = !filters.status || invitation.status === filters.status;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge color
  const getStatusBadgeColor = (status: GroupInvitation['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status: GroupInvitation['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'accepted':
        return <CheckCircle className="h-3 w-3" />;
      case 'declined':
        return <XCircle className="h-3 w-3" />;
      case 'expired':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  // Check if invitation is expired
  const isExpired = (invitation: GroupInvitation) => {
    return new Date() > invitation.expiresAt;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Group Invitations</h3>
          <p className="text-sm text-gray-600">
            Manage invitations for {group.name}
          </p>
        </div>

        {canInvite && (
          <Button onClick={() => setShowInviteForm(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Send Invitation
          </Button>
        )}
      </div>

      {/* Invite Form Modal */}
      <AnimatePresence>
        {showInviteForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInviteForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Send Invitation</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInviteForm(false)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="inviteEmail">Email Address *</Label>
                  <Input
                    id="inviteEmail"
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <Label htmlFor="inviteRole">Role</Label>
                  <Select
                    value={inviteForm.role}
                    onValueChange={(value) => setInviteForm(prev => ({ ...prev, role: value as GroupParticipant['role'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                      <SelectItem value="observer">Observer</SelectItem>
                      {(userRole === 'therapist' || userRole === 'moderator') && (
                        <SelectItem value="moderator">Moderator</SelectItem>
                      )}
                      {userRole === 'therapist' && (
                        <SelectItem value="therapist">Therapist</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="inviteExpiry">Expires In</Label>
                  <Select
                    value={inviteForm.expiresIn.toString()}
                    onValueChange={(value) => setInviteForm(prev => ({ ...prev, expiresIn: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="72">3 days</SelectItem>
                      <SelectItem value="168">1 week</SelectItem>
                      <SelectItem value="336">2 weeks</SelectItem>
                      <SelectItem value="720">1 month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="inviteMessage">Personal Message (Optional)</Label>
                  <textarea
                    id="inviteMessage"
                    value={inviteForm.message}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Add a personal message to the invitation"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowInviteForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendInvitation}
                    disabled={isLoading || !inviteForm.email.trim()}
                    className="flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isLoading ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by email..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="pl-10"
          />
        </div>

        <Select
          value={filters.status || 'all'}
          onValueChange={(value) => setFilters(prev => ({ 
            ...prev, 
            status: value === 'all' ? undefined : value as GroupInvitation['status']
          }))}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" onClick={loadInvitations}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Invitations List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredInvitations.length > 0 ? (
          filteredInvitations.map((invitation) => {
            const expired = isExpired(invitation);
            
            return (
              <motion.div
                key={invitation.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-gray-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {invitation.invitedEmail}
                        </h4>
                        <Badge className={`text-xs ${getStatusBadgeColor(expired ? 'expired' : invitation.status)}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(expired ? 'expired' : invitation.status)}
                            <span>{expired ? 'expired' : invitation.status}</span>
                          </div>
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>Role: {invitation.role || 'client'}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Sent {formatDistanceToNow(invitation.createdAt, { addSuffix: true })}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            Expires {formatDistanceToNow(invitation.expiresAt, { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      {invitation.message && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                          "{invitation.message}"
                        </p>
                      )}

                      {invitation.acceptedAt && (
                        <div className="text-xs text-green-600 mt-1">
                          Accepted {formatDistanceToNow(invitation.acceptedAt, { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {invitation.status === 'pending' && !expired && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyInvitationLink(invitation.id)}
                        title="Copy invitation link"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      title="View details"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>

                    {canInvite && (
                      <Button
                        variant="ghost"
                        size="sm"
                        title="More actions"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <UserPlus className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              {filters.search || filters.status ? 'No invitations found' : 'No invitations sent'}
            </h4>
            <p className="text-xs text-gray-600">
              {filters.search || filters.status
                ? 'Try adjusting your search or filters'
                : canInvite
                ? 'Send your first invitation to grow the group'
                : 'No invitations have been sent for this group'
              }
            </p>
            {!filters.search && !filters.status && canInvite && (
              <Button
                className="mt-3"
                size="sm"
                onClick={() => setShowInviteForm(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Statistics */}
      {invitations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">
              {invitations.filter(inv => inv.status === 'pending' && !isExpired(inv)).length}
            </div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {invitations.filter(inv => inv.status === 'accepted').length}
            </div>
            <div className="text-xs text-gray-600">Accepted</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">
              {invitations.filter(inv => inv.status === 'declined').length}
            </div>
            <div className="text-xs text-gray-600">Declined</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-600">
              {invitations.filter(inv => isExpired(inv)).length}
            </div>
            <div className="text-xs text-gray-600">Expired</div>
          </div>
        </div>
      )}
    </div>
  );
}