import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Plus, Users, Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';

import GroupCreationForm from '@/components/groups/group-creation-form';
import GroupSearch from '@/components/groups/group-search';
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

interface Group {
    id: number;
    name: string;
    description: string;
    members: GroupMember[];
    creator: User;
    created_at: string;
    is_active: boolean;
    latest_message?: {
        content: string;
        sender: User;
        created_at: string;
    };
}

interface Props {
    userGroups: Group[];
    availableUsers: User[];
    currentUser: User;
    canCreateGroups: boolean;
}

export default function Groups({ userGroups, availableUsers, currentUser, canCreateGroups }: Props) {
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [activeTab, setActiveTab] = useState('my-groups');
    
    // Debug logging
    console.log('Groups page props:', { 
        userGroupsCount: userGroups?.length || 0, 
        userGroups, 
        currentUser: currentUser?.name,
        canCreateGroups 
    });

    const handleGroupCreated = (group: Group) => {
        // The group creation form will handle the refresh
        console.log('Group created:', group);
    };

    const handleJoinRequest = (groupId: number) => {
        // Could show a success message or refresh data
        console.log('Join request sent for group:', groupId);
    };

    const canManageGroup = (group: Group) => {
        return currentUser.roles?.includes('admin') ||
            group.creator.id === currentUser.id ||
            group.members.find(m => m.id === currentUser.id)?.pivot.role === 'admin';
    };

    return (
        <AppLayout>
            <Head title="Groups" />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/messages">
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Messages
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Groups</h1>
                            <p className="text-muted-foreground">
                                Join group conversations and connect with others
                            </p>
                        </div>
                    </div>

                    {canCreateGroups && (
                        <GroupCreationForm
                            availableUsers={availableUsers}
                            onGroupCreated={handleGroupCreated}
                        />
                    )}
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="my-groups">My Groups</TabsTrigger>
                        <TabsTrigger value="discover">Discover Groups</TabsTrigger>
                        {selectedGroup && (
                            <TabsTrigger value="manage">Manage Group</TabsTrigger>
                        )}
                    </TabsList>

                    {/* My Groups Tab */}
                    <TabsContent value="my-groups" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    My Groups ({userGroups.length})
                                </CardTitle>
                                <CardDescription>
                                    Groups you're a member of
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {userGroups.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
                                        <p className="text-muted-foreground mb-4">
                                            {canCreateGroups
                                                ? "Create your first group or search for existing ones to join"
                                                : "Search for groups to join and start connecting with others"
                                            }
                                        </p>
                                        <div className="flex gap-3 justify-center">
                                            {canCreateGroups && (
                                                <GroupCreationForm
                                                    availableUsers={availableUsers}
                                                    onGroupCreated={handleGroupCreated}
                                                    trigger={
                                                        <Button>
                                                            <Plus className="w-4 h-4 mr-2" />
                                                            Create Group
                                                        </Button>
                                                    }
                                                />
                                            )}
                                            <Button
                                                variant="outline"
                                                onClick={() => setActiveTab('discover')}
                                            >
                                                Discover Groups
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        {userGroups.map((group) => {
                                            const userMember = group.members.find(m => m.id === currentUser.id);
                                            const isAdmin = userMember?.pivot.role === 'admin' || group.creator.id === currentUser.id;

                                            return (
                                                <Card key={group.id} className="hover:shadow-md transition-shadow">
                                                    <CardHeader className="pb-3">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <CardTitle className="text-lg">{group.name}</CardTitle>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {group.members.length} members
                                                                </p>
                                                            </div>
                                                            {isAdmin && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedGroup(group);
                                                                        setActiveTab('manage');
                                                                    }}
                                                                >
                                                                    <Settings className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="pt-0">
                                                        {group.description && (
                                                            <p className="text-sm text-muted-foreground mb-3">
                                                                {group.description}
                                                            </p>
                                                        )}

                                                        {group.latest_message && (
                                                            <div className="bg-gray-50 p-2 rounded text-xs mb-3">
                                                                <p className="font-medium">{group.latest_message.sender.name}:</p>
                                                                <p className="text-muted-foreground truncate">
                                                                    {group.latest_message.content}
                                                                </p>
                                                                <p className="text-muted-foreground mt-1">
                                                                    {new Date(group.latest_message.created_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        )}

                                                        <div className="flex gap-2">
                                                            <Link href={`/messages/groups/${group.id}`} className="flex-1">
                                                                <Button className="w-full">
                                                                    Open Chat
                                                                </Button>
                                                            </Link>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Discover Groups Tab */}
                    <TabsContent value="discover">
                        <GroupSearch onJoinRequest={handleJoinRequest} />
                    </TabsContent>

                    {/* Manage Group Tab */}
                    {selectedGroup && (
                        <TabsContent value="manage" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Settings className="w-5 h-5" />
                                        Manage {selectedGroup.name}
                                    </CardTitle>
                                    <CardDescription>
                                        Manage group settings, members, and permissions
                                    </CardDescription>
                                </CardHeader>
                            </Card>

                            <Tabs defaultValue="members" className="space-y-6">
                                <TabsList>
                                    <TabsTrigger value="members">Members</TabsTrigger>
                                    <TabsTrigger value="settings">Settings</TabsTrigger>
                                </TabsList>

                                <TabsContent value="members">
                                    <GroupMemberManagement
                                        group={selectedGroup}
                                        currentUser={currentUser}
                                        canManageMembers={canManageGroup(selectedGroup)}
                                        onMemberUpdate={() => {
                                            // Refresh the page or update the group data
                                            window.location.reload();
                                        }}
                                    />
                                </TabsContent>

                                <TabsContent value="settings">
                                    <GroupSettings
                                        group={selectedGroup}
                                        currentUser={currentUser}
                                        canManageGroup={canManageGroup(selectedGroup)}
                                        onGroupUpdated={(updatedGroup) => {
                                            setSelectedGroup(updatedGroup);
                                            // Update the groups list
                                            window.location.reload();
                                        }}
                                        onGroupDeleted={() => {
                                            setSelectedGroup(null);
                                            setActiveTab('my-groups');
                                            window.location.reload();
                                        }}
                                    />
                                </TabsContent>
                            </Tabs>
                        </TabsContent>
                    )}
                </Tabs>

                {/* Safety Notice */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">ℹ</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-1">Safe Group Communication</h4>
                                <p className="text-sm text-blue-800">
                                    All group messages are monitored for safety. Administrators can review flagged content.
                                    If you're in immediate danger, please use the emergency button or contact emergency services directly.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
