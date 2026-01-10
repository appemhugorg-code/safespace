import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, LogOut, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';

import GroupConversation from '@/components/groups/group-conversation';
import GroupMemberManagement from '@/components/groups/group-member-management';
import GroupSettings from '@/components/groups/group-settings';

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

interface Message {
    id: number;
    content: string;
    sender: User;
    created_at: string;
    is_read: boolean;
    is_flagged: boolean;
    message_type: 'group';
}

interface Group {
    id: number;
    name: string;
    description: string;
    members: GroupMember[];
    creator: User;
    created_at: string;
    is_active: boolean;
}

interface Props {
    group: Group;
    messages: Message[];
    currentUser: User;
}

export default function GroupConversationPage({ group, messages, currentUser }: Props) {
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
    const [leaveReason, setLeaveReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [leaving, setLeaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const canManageGroup = () => {
        return currentUser.roles?.includes('admin') ||
            group.creator.id === currentUser.id ||
            group.members.find(m => m.id === currentUser.id)?.pivot.role === 'admin';
    };

    const canLeaveGroup = () => {
        const currentUserMember = group.members.find(m => m.id === currentUser.id);
        return currentUserMember && currentUserMember.id !== group.creator.id;
    };

    const handleLeaveGroup = () => {
        setLeaveDialogOpen(true);
    };

    const confirmLeaveGroup = async () => {
        if (!leaveReason) return;

        setLeaving(true);
        try {
            const response = await fetch(`/api/groups/${group.id}/leave`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    reason: leaveReason,
                    custom_reason: leaveReason === 'other' ? customReason : null,
                }),
            });

            if (response.ok) {
                // Redirect to groups page
                router.visit('/messages/groups');
            }
        } catch (error) {
            console.error('Failed to leave group:', error);
        } finally {
            setLeaving(false);
        }
    };

    const leaveReasons = [
        { value: 'no_longer_relevant', label: 'No longer relevant' },
        { value: 'too_busy', label: 'Too busy' },
        { value: 'found_better_support', label: 'Found better support' },
        { value: 'privacy_concerns', label: 'Privacy concerns' },
        { value: 'other', label: 'Other' },
    ];

    const getUserRole = (user: User) => {
        if (!user.roles || user.roles.length === 0) return '';
        return user.roles[0];
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'therapist': return 'bg-green-100 text-green-800 border-green-200';
            case 'guardian': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'child': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'admin': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AppLayout>
            <Head title={`${group.name} - Group Chat`} />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden h-screen flex flex-col">
                {/* Header */}
                <div className="flex-shrink-0">
                    <Link href="/messages/groups">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Groups
                        </Button>
                    </Link>
                </div>

                {/* Main Chat Layout */}
                <div className="flex-1 flex gap-4 min-h-0">
                    {/* Group Conversation */}
                    <div className="flex-1">
                        <GroupConversation
                            group={group}
                            messages={messages}
                            currentUser={currentUser}
                            canManageGroup={canManageGroup()}
                            onLeaveGroup={canLeaveGroup() ? handleLeaveGroup : undefined}
                            onSettingsOpen={() => setSettingsDialogOpen(true)}
                        />
                    </div>

                    {/* Contacts Sidebar */}
                    <Card className="w-80 flex-shrink-0 flex flex-col">
                        <CardHeader className="border-b flex-shrink-0 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Contacts
                            </CardTitle>
                            {/* Search Input */}
                            <div className="mt-3 mb-4">
                                <Input
                                    placeholder="Search contacts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-8"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-hidden">
                            <div className="space-y-1 h-full overflow-y-auto">
                                {(() => {
                                    // Get available contacts based on user role (from props or API)
                                    const getAvailableContacts = () => {
                                        const userRoles = currentUser.roles || [];
                                        const hasRole = (role: string) => userRoles.includes(role);
                                        
                                        if (hasRole('therapist')) {
                                            // Therapists can message guardians and children
                                            return [
                                                { id: 3, name: 'Emma Wilson', role: 'Child', status: 'away', lastMessage: 'Thanks for the help!', time: '1h', isActive: false },
                                                { id: 4, name: 'Michael Brown', role: 'Guardian', status: 'offline', lastMessage: 'See you tomorrow', time: '3h', isActive: false },
                                                { id: 6, name: 'Alex Thompson', role: 'Child', status: 'offline', lastMessage: 'Can we talk later?', time: '45m', isActive: false },
                                            ];
                                        }
                                        
                                        if (hasRole('guardian')) {
                                            // Guardians can message therapists and their children
                                            return [
                                                { id: 2, name: 'Dr. Sarah Johnson', role: 'Therapist', status: 'online', lastMessage: 'How are you feeling today?', time: '2m', isActive: false },
                                                { id: 5, name: 'Dr. Lisa Chen', role: 'Therapist', status: 'away', lastMessage: 'Your progress is great!', time: '30m', isActive: false },
                                                { id: 3, name: 'Emma Wilson', role: 'Child', status: 'away', lastMessage: 'Thanks for the help!', time: '1h', isActive: false },
                                            ];
                                        }
                                        
                                        if (hasRole('child')) {
                                            // Children can message therapists and their guardian
                                            return [
                                                { id: 2, name: 'Dr. Sarah Johnson', role: 'Therapist', status: 'online', lastMessage: 'How are you feeling today?', time: '2m', isActive: false },
                                                { id: 5, name: 'Dr. Lisa Chen', role: 'Therapist', status: 'away', lastMessage: 'Your progress is great!', time: '30m', isActive: false },
                                                { id: 4, name: 'Michael Brown', role: 'Guardian', status: 'offline', lastMessage: 'See you tomorrow', time: '3h', isActive: false },
                                            ];
                                        }
                                        
                                        if (hasRole('admin')) {
                                            // Admins can message everyone
                                            return [
                                                { id: 2, name: 'Dr. Sarah Johnson', role: 'Therapist', status: 'online', lastMessage: 'How are you feeling today?', time: '2m', isActive: false },
                                                { id: 3, name: 'Emma Wilson', role: 'Child', status: 'away', lastMessage: 'Thanks for the help!', time: '1h', isActive: false },
                                                { id: 4, name: 'Michael Brown', role: 'Guardian', status: 'offline', lastMessage: 'See you tomorrow', time: '3h', isActive: false },
                                                { id: 5, name: 'Dr. Lisa Chen', role: 'Therapist', status: 'away', lastMessage: 'Your progress is great!', time: '30m', isActive: false },
                                                { id: 6, name: 'Alex Thompson', role: 'Child', status: 'offline', lastMessage: 'Can we talk later?', time: '45m', isActive: false },
                                            ];
                                        }
                                        
                                        return [];
                                    };

                                    // Get user's groups (only groups they are members of)
                                    const getUserGroups = () => {
                                        // Show current group as active
                                        const groups = [
                                            { id: group.id, name: group.name, members: `${group.members.length} members`, online: '2 online', lastMessage: 'Active conversation', time: 'now', isActive: true }
                                        ];
                                        
                                        // Add other sample groups only if user has appropriate role
                                        const userRoles = currentUser.roles || [];
                                        const hasRole = (role: string) => userRoles.includes(role);
                                        
                                        if (hasRole('therapist') || hasRole('admin')) {
                                            // Only add groups that would realistically exist
                                            // In production, this would come from the backend
                                        }
                                        
                                        return groups;
                                    };

                                    const allContacts = getAvailableContacts();
                                    const allGroups = getUserGroups();

                                    // Filter contacts and groups based on search query
                                    const filteredContacts = allContacts.filter(c => 
                                        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        c.role.toLowerCase().includes(searchQuery.toLowerCase())
                                    );

                                    const filteredGroups = allGroups.filter(g => 
                                        g.name.toLowerCase().includes(searchQuery.toLowerCase())
                                    );

                                    const getStatusColor = (status: string) => {
                                        switch (status) {
                                            case 'online': return 'bg-green-500';
                                            case 'away': return 'bg-yellow-500';
                                            case 'offline': return 'bg-gray-400';
                                            default: return 'bg-gray-400';
                                        }
                                    };

                                    const getAvatarColor = (name: string) => {
                                        const colors = [
                                            'bg-blue-100 text-blue-600',
                                            'bg-purple-100 text-purple-600',
                                            'bg-green-100 text-green-600',
                                            'bg-pink-100 text-pink-600',
                                            'bg-indigo-100 text-indigo-600',
                                            'bg-yellow-100 text-yellow-600',
                                        ];
                                        const index = name.charCodeAt(0) % colors.length;
                                        return colors[index];
                                    };

                                    return (
                                        <>
                                            {/* Groups Section */}
                                            {filteredGroups.length > 0 && (
                                                <>
                                                    <div className="px-3 py-2">
                                                        <h4 className="text-sm font-medium text-muted-foreground">Groups</h4>
                                                    </div>
                                                    
                                                    {filteredGroups.map((groupItem) => (
                                                        <div key={groupItem.id}>
                                                            {groupItem.isActive ? (
                                                                <div className="p-3 bg-primary/10 border-l-4 border-primary">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(groupItem.name)}`}>
                                                                            <Users className="w-5 h-5" />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="font-medium text-sm truncate">{groupItem.name}</p>
                                                                            <p className="text-xs text-muted-foreground">{groupItem.members} • {groupItem.online}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <Link href={groupItem.id === group.id ? '#' : `/messages/groups/${groupItem.id}`} className="block">
                                                                    <div className="p-3 hover:bg-muted/50 transition-colors">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(groupItem.name)}`}>
                                                                                <Users className="w-5 h-5" />
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <p className="font-medium text-sm truncate">{groupItem.name}</p>
                                                                                <p className="text-xs text-muted-foreground">{groupItem.members} • {groupItem.online}</p>
                                                                                <p className="text-xs text-muted-foreground truncate">{groupItem.lastMessage}</p>
                                                                            </div>
                                                                            <div className="flex flex-col items-end gap-1">
                                                                                <span className="text-xs text-muted-foreground">{groupItem.time}</span>
                                                                                {groupItem.time !== 'now' && (
                                                                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            )}
                                                        </div>
                                                    ))}
                                                </>
                                            )}

                                            {/* Contacts Section */}
                                            {filteredContacts.length > 0 && (
                                                <div className="border-t mt-6 pt-4">
                                                    <div className="px-3 py-2">
                                                        <h4 className="text-sm font-medium text-muted-foreground">Contacts</h4>
                                                    </div>
                                                    
                                                    {filteredContacts.map((contactItem) => (
                                                        <Link key={contactItem.id} href={`/messages/conversation/${contactItem.id}`} className="block">
                                                            <div className="p-3 hover:bg-muted/50 transition-colors">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="relative">
                                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(contactItem.name)}`}>
                                                                            <span className="font-semibold">
                                                                                {contactItem.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2)}
                                                                            </span>
                                                                        </div>
                                                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(contactItem.status)} rounded-full border-2 border-white`}></div>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium text-sm truncate">{contactItem.name}</p>
                                                                        <p className="text-xs text-muted-foreground capitalize">{contactItem.role} • {contactItem.status}</p>
                                                                        {contactItem.lastMessage && (
                                                                            <p className="text-xs text-muted-foreground truncate">{contactItem.lastMessage}</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-col items-end gap-1">
                                                                        <span className="text-xs text-muted-foreground">{contactItem.time}</span>
                                                                        {contactItem.lastMessage && contactItem.time !== 'now' && (
                                                                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}

                                            {/* No Results */}
                                            {searchQuery && filteredContacts.length === 0 && filteredGroups.length === 0 && (
                                                <div className="p-8 text-center">
                                                    <p className="text-muted-foreground">No contacts or groups found for "{searchQuery}"</p>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Leave Group Dialog */}
                <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <LogOut className="w-5 h-5" />
                                Leave Group
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to leave "{group.name}"? You'll lose access to all group messages and won't receive new messages.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="reason">Reason for leaving *</Label>
                                <Select value={leaveReason} onValueChange={setLeaveReason}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {leaveReasons.map((reason) => (
                                            <SelectItem key={reason.value} value={reason.value}>
                                                {reason.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {leaveReason === 'other' && (
                                <div>
                                    <Label htmlFor="custom_reason">Please specify</Label>
                                    <Textarea
                                        id="custom_reason"
                                        value={customReason}
                                        onChange={(e) => setCustomReason(e.target.value)}
                                        placeholder="Tell us why you're leaving..."
                                        rows={3}
                                    />
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setLeaveDialogOpen(false)}
                                    disabled={leaving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={confirmLeaveGroup}
                                    disabled={leaving || !leaveReason || (leaveReason === 'other' && !customReason.trim())}
                                >
                                    {leaving ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    ) : (
                                        <LogOut className="w-4 h-4 mr-2" />
                                    )}
                                    Leave Group
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Settings Dialog */}
                <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Group Management</DialogTitle>
                            <DialogDescription>
                                Manage {group.name} settings and members
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            {/* Group Settings */}
                            <GroupSettings
                                group={group}
                                currentUser={currentUser}
                                canManageGroup={canManageGroup()}
                                onGroupUpdated={(updatedGroup) => {
                                    // Refresh the page to get updated data
                                    window.location.reload();
                                }}
                                onGroupDeleted={() => {
                                    setSettingsDialogOpen(false);
                                    router.visit('/messages/groups');
                                }}
                            />

                            {/* Member Management */}
                            <GroupMemberManagement
                                group={group}
                                currentUser={currentUser}
                                canManageMembers={canManageGroup()}
                                onMemberUpdate={() => {
                                    // Refresh the page to get updated data
                                    window.location.reload();
                                }}
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
