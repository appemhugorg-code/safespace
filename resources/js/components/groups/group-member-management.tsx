import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Users,
    UserPlus,
    UserMinus,
    Crown,
    Shield,
    MoreVertical,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface User {
    id: number;
    name: string;
    email: string;
    roles?: string[];
}

interface GroupMember extends User {
    pivot: {
        role: 'member' | 'admin';
        joined_at: string;
    };
}

interface JoinRequest {
    id: number;
    user: User;
    message?: string;
    created_at: string;
}

interface Group {
    id: number;
    name: string;
    description: string;
    members: GroupMember[];
    creator: User;
}

interface GroupMemberManagementProps {
    group: Group;
    currentUser: User;
    canManageMembers: boolean;
    onMemberUpdate?: () => void;
}

export default function GroupMemberManagement({
    group,
    currentUser,
    canManageMembers,
    onMemberUpdate
}: GroupMemberManagementProps) {
    const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<GroupMember | null>(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        action: '' as 'approve' | 'reject',
        reason: '',
    });

    // Load join requests if user can manage members
    useEffect(() => {
        if (canManageMembers) {
            fetchJoinRequests();
        }
    }, [canManageMembers, group.id]);

    const fetchJoinRequests = async () => {
        try {
            const response = await fetch(`/api/groups/${group.id}/join-requests?status=pending`);
            if (response.ok) {
                const data = await response.json();
                setJoinRequests(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch join requests:', error);
        }
    };

    const handleReviewRequest = (request: JoinRequest, action: 'approve' | 'reject') => {
        setSelectedRequest(request);
        setData('action', action);
        setReviewDialogOpen(true);
    };

    const submitReview = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedRequest) return;

        post(`/api/groups/${group.id}/join-requests/${selectedRequest.id}`, {
            data: {
                action: data.action,
                reason: data.reason,
            },
            onSuccess: () => {
                reset();
                setReviewDialogOpen(false);
                setSelectedRequest(null);
                fetchJoinRequests();
                onMemberUpdate?.();
            },
        });
    };

    const handleRemoveMember = (member: GroupMember) => {
        setMemberToRemove(member);
        setRemoveDialogOpen(true);
    };

    const confirmRemoveMember = async () => {
        if (!memberToRemove) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/groups/${group.id}/members/${memberToRemove.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                setRemoveDialogOpen(false);
                setMemberToRemove(null);
                onMemberUpdate?.();
            }
        } catch (error) {
            console.error('Failed to remove member:', error);
        } finally {
            setLoading(false);
        }
    };

    const promoteToAdmin = async (member: GroupMember) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/groups/${group.id}/members/${member.id}/promote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                onMemberUpdate?.();
            }
        } catch (error) {
            console.error('Failed to promote member:', error);
        } finally {
            setLoading(false);
        }
    };

    const demoteToMember = async (member: GroupMember) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/groups/${group.id}/members/${member.id}/demote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                onMemberUpdate?.();
            }
        } catch (error) {
            console.error('Failed to demote member:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadgeColor = (roles: string[] = []) => {
        const role = roles[0];
        switch (role) {
            case 'therapist': return 'bg-green-100 text-green-800 border-green-200';
            case 'guardian': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'child': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'admin': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const canRemoveMember = (member: GroupMember) => {
        // Can't remove yourself
        if (member.id === currentUser.id) return false;
        // Can't remove the group creator
        if (member.id === group.creator.id) return false;
        // Must be able to manage members
        return canManageMembers;
    };

    const canPromoteMember = (member: GroupMember) => {
        return canManageMembers && member.pivot.role === 'member' && member.id !== currentUser.id;
    };

    const canDemoteMember = (member: GroupMember) => {
        // Can't demote yourself or the creator
        if (member.id === currentUser.id || member.id === group.creator.id) return false;
        return canManageMembers && member.pivot.role === 'admin';
    };

    return (
        <div className="space-y-6">
            {/* Group Members */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Group Members ({group.members.length})
                    </CardTitle>
                    <CardDescription>
                        Manage group members and their roles
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {group.members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="font-semibold text-primary">
                                            {member.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium">{member.name}</p>
                                            {member.id === group.creator.id && (
                                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                                    <Crown className="w-3 h-3 mr-1" />
                                                    Creator
                                                </Badge>
                                            )}
                                            {member.pivot.role === 'admin' && member.id !== group.creator.id && (
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                                    <Shield className="w-3 h-3 mr-1" />
                                                    Admin
                                                </Badge>
                                            )}
                                            {member.roles && member.roles.length > 0 && (
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${getRoleBadgeColor(member.roles)}`}
                                                >
                                                    {member.roles[0]}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{member.email}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Joined {new Date(member.pivot.joined_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {canManageMembers && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {canPromoteMember(member) && (
                                                <DropdownMenuItem onClick={() => promoteToAdmin(member)}>
                                                    <Shield className="w-4 h-4 mr-2" />
                                                    Promote to Admin
                                                </DropdownMenuItem>
                                            )}
                                            {canDemoteMember(member) && (
                                                <DropdownMenuItem onClick={() => demoteToMember(member)}>
                                                    <Users className="w-4 h-4 mr-2" />
                                                    Demote to Member
                                                </DropdownMenuItem>
                                            )}
                                            {(canPromoteMember(member) || canDemoteMember(member)) && canRemoveMember(member) && (
                                                <DropdownMenuSeparator />
                                            )}
                                            {canRemoveMember(member) && (
                                                <DropdownMenuItem
                                                    onClick={() => handleRemoveMember(member)}
                                                    className="text-red-600"
                                                >
                                                    <UserMinus className="w-4 h-4 mr-2" />
                                                    Remove from Group
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Pending Join Requests */}
            {canManageMembers && joinRequests.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Pending Join Requests ({joinRequests.length})
                        </CardTitle>
                        <CardDescription>
                            Review and approve or reject join requests
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {joinRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="border rounded-lg p-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                <span className="font-semibold text-primary">
                                                    {request.user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium">{request.user.name}</p>
                                                    {request.user.roles && request.user.roles.length > 0 && (
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs ${getRoleBadgeColor(request.user.roles)}`}
                                                        >
                                                            {request.user.roles[0]}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">{request.user.email}</p>
                                                {request.message && (
                                                    <p className="text-sm bg-gray-50 p-2 rounded border-l-2 border-gray-200">
                                                        "{request.message}"
                                                    </p>
                                                )}
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    Requested {new Date(request.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleReviewRequest(request, 'reject')}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <XCircle className="w-4 h-4 mr-1" />
                                                Reject
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleReviewRequest(request, 'approve')}
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Approve
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Review Join Request Dialog */}
            <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {data.action === 'approve' ? 'Approve' : 'Reject'} Join Request
                        </DialogTitle>
                        <DialogDescription>
                            {data.action === 'approve'
                                ? `Approve ${selectedRequest?.user.name}'s request to join the group?`
                                : `Reject ${selectedRequest?.user.name}'s request to join the group?`
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitReview} className="space-y-4">
                        {data.action === 'reject' && (
                            <div>
                                <Label htmlFor="reason">Reason for rejection (Optional)</Label>
                                <Textarea
                                    id="reason"
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                    placeholder="Explain why this request is being rejected..."
                                    rows={3}
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setReviewDialogOpen(false)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                variant={data.action === 'reject' ? 'destructive' : 'default'}
                            >
                                {processing ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                ) : data.action === 'approve' ? (
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                ) : (
                                    <XCircle className="w-4 h-4 mr-2" />
                                )}
                                {data.action === 'approve' ? 'Approve Request' : 'Reject Request'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Remove Member Confirmation Dialog */}
            <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Remove Member
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to remove {memberToRemove?.name} from the group?
                            This action cannot be undone and they will lose access to all group messages.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmRemoveMember}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                                <UserMinus className="w-4 h-4 mr-2" />
                            )}
                            Remove Member
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
