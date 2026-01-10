import { Head, router } from '@inertiajs/react';
import { CheckCircle, XCircle, Pause, Play, Clock, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
    status: 'pending' | 'active' | 'suspended';
    created_at: string;
    roles: Array<{ name: string }>;
    suspensions?: Array<{
        id: number;
        reason: string | null;
        suspended_at: string;
        suspended_until: string | null;
        suspended_by: {
            id: number;
            name: string;
        };
    }>;
}

interface Props {
    pendingUsers: User[];
    activeUsers: User[];
    suspendedUsers: User[];
}

export default function UserManagement({ pendingUsers, activeUsers, suspendedUsers }: Props) {
    const [rejectReason, setRejectReason] = useState('');
    const [suspendReason, setSuspendReason] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);

    // Loading states
    const [loadingStates, setLoadingStates] = useState<{
        approving: number | null;
        rejecting: boolean;
        suspending: boolean;
        reactivating: number | null;
    }>({
        approving: null,
        rejecting: false,
        suspending: false,
        reactivating: null,
    });

    const handleApprove = (user: User) => {
        setLoadingStates(prev => ({ ...prev, approving: user.id }));

        router.patch(`/admin/users/${user.id}/approve`, {}, {
            onSuccess: () => {
                toast.success(`${user.name} has been approved successfully!`, {
                    description: 'The user can now access the system.',
                });
                setLoadingStates(prev => ({ ...prev, approving: null }));
            },
            onError: (errors) => {
                toast.error('Failed to approve user', {
                    description: 'Please try again or contact support.',
                });
                setLoadingStates(prev => ({ ...prev, approving: null }));
            }
        });
    };

    const handleReject = () => {
        if (!selectedUser) return;

        setLoadingStates(prev => ({ ...prev, rejecting: true }));

        router.post(`/admin/users/${selectedUser.id}/reject`, {
            _method: 'DELETE',
            reason: rejectReason
        }, {
            onSuccess: () => {
                toast.success(`${selectedUser.name} has been rejected`, {
                    description: rejectReason ? `Reason: ${rejectReason}` : 'User has been removed from the system.',
                });
                setRejectReason('');
                setSelectedUser(null);
                setRejectDialogOpen(false);
                setLoadingStates(prev => ({ ...prev, rejecting: false }));
            },
            onError: (errors) => {
                toast.error('Failed to reject user', {
                    description: 'Please try again or contact support.',
                });
                setLoadingStates(prev => ({ ...prev, rejecting: false }));
            }
        });
    };

    const handleSuspend = () => {
        if (!selectedUser) return;

        setLoadingStates(prev => ({ ...prev, suspending: true }));

        router.patch(`/admin/users/${selectedUser.id}/suspend`, {
            reason: suspendReason
        }, {
            onSuccess: () => {
                toast.success(`${selectedUser.name} has been suspended`, {
                    description: suspendReason ? `Reason: ${suspendReason}` : 'User can no longer access the system.',
                });
                setSuspendReason('');
                setSelectedUser(null);
                setSuspendDialogOpen(false);
                setLoadingStates(prev => ({ ...prev, suspending: false }));
            },
            onError: (errors) => {
                toast.error('Failed to suspend user', {
                    description: 'Please try again or contact support.',
                });
                setLoadingStates(prev => ({ ...prev, suspending: false }));
            }
        });
    };

    const handleReactivate = (user: User) => {
        setLoadingStates(prev => ({ ...prev, reactivating: user.id }));

        router.patch(`/admin/users/${user.id}/reactivate`, {}, {
            onSuccess: () => {
                toast.success(`${user.name} has been reactivated!`, {
                    description: 'The user can now access the system again.',
                });
                setLoadingStates(prev => ({ ...prev, reactivating: null }));
            },
            onError: (errors) => {
                toast.error('Failed to reactivate user', {
                    description: 'Please try again or contact support.',
                });
                setLoadingStates(prev => ({ ...prev, reactivating: null }));
            }
        });
    };

    const getRoleBadgeColor = (roleName: string) => {
        switch (roleName) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'therapist': return 'bg-blue-100 text-blue-800';
            case 'guardian': return 'bg-green-100 text-green-800';
            case 'child': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const UserCard = ({ user, actions }: { user: User; actions: React.ReactNode }) => {
        const currentSuspension = user.suspensions?.[0];

        return (
            <Card className="mb-4">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            {user.roles.map((role) => (
                                <Badge key={role.name} className={getRoleBadgeColor(role.name)}>
                                    {role.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Registered: {new Date(user.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex gap-2">
                                {actions}
                            </div>
                        </div>

                        {/* Show suspension details for suspended users */}
                        {user.status === 'suspended' && currentSuspension && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium text-red-800">
                                            Suspended by {currentSuspension.suspended_by.name}
                                        </div>
                                        <div className="text-sm text-red-600">
                                            {new Date(currentSuspension.suspended_at).toLocaleDateString()}
                                            {currentSuspension.suspended_until && (
                                                <span> - {new Date(currentSuspension.suspended_until).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                        {currentSuspension.reason && (
                                            <div className="text-sm text-red-700 mt-2">
                                                <strong>Reason:</strong> {currentSuspension.reason}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <AppLayout>
            <Head title="User Management" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage user registrations, approvals, and account status
                    </p>
                </div>

                <Tabs defaultValue="pending" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="pending" className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Pending ({pendingUsers.length})
                        </TabsTrigger>
                        <TabsTrigger value="active" className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Active ({activeUsers.length})
                        </TabsTrigger>
                        <TabsTrigger value="suspended" className="flex items-center gap-2">
                            <Pause className="h-4 w-4" />
                            Suspended ({suspendedUsers.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pending Approvals</CardTitle>
                                <CardDescription>
                                    Users waiting for admin approval to access the system
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {pendingUsers.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No pending users
                                    </p>
                                ) : (
                                    pendingUsers.map((user) => (
                                        <UserCard
                                            key={user.id}
                                            user={user}
                                            actions={
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApprove(user)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                        disabled={loadingStates.approving === user.id}
                                                    >
                                                        {loadingStates.approving === user.id ? (
                                                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                        ) : (
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                        )}
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setRejectReason('');
                                                            setRejectDialogOpen(true);
                                                        }}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </>
                                            }
                                        />
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="active" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Active Users</CardTitle>
                                <CardDescription>
                                    Users with active accounts who can access the system
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {activeUsers.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No active users
                                    </p>
                                ) : (
                                    activeUsers.map((user) => (
                                        <UserCard
                                            key={user.id}
                                            user={user}
                                            actions={
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setSuspendReason('');
                                                        setSuspendDialogOpen(true);
                                                    }}
                                                    disabled={loadingStates.suspending}
                                                >
                                                    <Pause className="h-4 w-4 mr-1" />
                                                    Suspend
                                                </Button>
                                            }
                                        />
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="suspended" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Suspended Users</CardTitle>
                                <CardDescription>
                                    Users who have been suspended and cannot access the system
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {suspendedUsers.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        No suspended users
                                    </p>
                                ) : (
                                    suspendedUsers.map((user) => (
                                        <UserCard
                                            key={user.id}
                                            user={user}
                                            actions={
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleReactivate(user)}
                                                    className="bg-green-600 hover:bg-green-700"
                                                    disabled={loadingStates.reactivating === user.id}
                                                >
                                                    {loadingStates.reactivating === user.id ? (
                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                    ) : (
                                                        <Play className="h-4 w-4 mr-1" />
                                                    )}
                                                    Reactivate
                                                </Button>
                                            }
                                        />
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Reject User Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent onKeyDown={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Reject User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reject {selectedUser?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="reject-reason">Reason (optional)</Label>
                            <Input
                                id="reject-reason"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Reason for rejection..."
                                onKeyDown={(e) => {
                                    e.stopPropagation();
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleReject();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRejectDialogOpen(false)}
                            disabled={loadingStates.rejecting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={loadingStates.rejecting}
                        >
                            {loadingStates.rejecting && (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            )}
                            Reject User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Suspend User Dialog */}
            <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
                <DialogContent onKeyDown={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Suspend User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to suspend {selectedUser?.name}? They will not be able to access the system until reactivated.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="suspend-reason">Reason (optional)</Label>
                            <Input
                                id="suspend-reason"
                                value={suspendReason}
                                onChange={(e) => setSuspendReason(e.target.value)}
                                placeholder="Reason for suspension..."
                                onKeyDown={(e) => {
                                    e.stopPropagation();
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSuspend();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSuspendDialogOpen(false)}
                            disabled={loadingStates.suspending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleSuspend}
                            disabled={loadingStates.suspending}
                        >
                            {loadingStates.suspending && (
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            )}
                            Suspend User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
