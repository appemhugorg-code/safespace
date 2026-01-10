import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Settings, Edit, Trash2, AlertTriangle, Save, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Group {
    id: number;
    name: string;
    description: string;
    creator: User;
    created_at: string;
    is_active: boolean;
}

interface GroupSettingsProps {
    group: Group;
    currentUser: User;
    canManageGroup: boolean;
    onGroupUpdated?: (group: Group) => void;
    onGroupDeleted?: () => void;
}

export default function GroupSettings({
    group,
    currentUser,
    canManageGroup,
    onGroupUpdated,
    onGroupDeleted
}: GroupSettingsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: group.name,
        description: group.description || '',
    });

    const handleEdit = () => {
        setIsEditing(true);
        setData({
            name: group.name,
            description: group.description || '',
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        reset();
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/api/groups/${group.id}`, {
            onSuccess: (response) => {
                setIsEditing(false);
                onGroupUpdated?.(response.data);
            },
        });
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/groups/${group.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                setDeleteDialogOpen(false);
                onGroupDeleted?.();
            }
        } catch (error) {
            console.error('Failed to delete group:', error);
        }
    };

    const isCreator = currentUser.id === group.creator.id;
    const isAdmin = currentUser.roles?.includes('admin');

    return (
        <div className="space-y-6">
            {/* Group Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Group Settings
                    </CardTitle>
                    <CardDescription>
                        Manage group information and settings
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isEditing ? (
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Group Name *</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe the purpose of this group"
                                    rows={3}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={processing || !data.name.trim()}>
                                    {processing ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    Save Changes
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={processing}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Group Name</Label>
                                <p className="text-lg font-semibold">{group.name}</p>
                            </div>

                            {group.description && (
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                                    <p className="text-sm">{group.description}</p>
                                </div>
                            )}

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Created By</Label>
                                <p className="text-sm">{group.creator.name}</p>
                            </div>

                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Created On</Label>
                                <p className="text-sm">{new Date(group.created_at).toLocaleDateString()}</p>
                            </div>

                            {canManageGroup && (
                                <div className="flex gap-3 pt-4">
                                    <Button variant="outline" onClick={handleEdit}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Group
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Danger Zone */}
            {(isCreator || isAdmin) && (
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            Danger Zone
                        </CardTitle>
                        <CardDescription>
                            Irreversible and destructive actions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-semibold text-red-900">Delete Group</h4>
                                        <p className="text-sm text-red-700 mt-1">
                                            Permanently delete this group and all its messages. This action cannot be undone.
                                        </p>
                                        <p className="text-xs text-red-600 mt-2">
                                            All members will lose access and message history will be permanently lost.
                                        </p>
                                    </div>
                                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Group
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="flex items-center gap-2">
                                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                                    Delete Group
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you absolutely sure you want to delete "{group.name}"?
                                                    <br /><br />
                                                    This will:
                                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                                        <li>Permanently delete all group messages</li>
                                                        <li>Remove all members from the group</li>
                                                        <li>Delete all group data and history</li>
                                                    </ul>
                                                    <br />
                                                    <strong>This action cannot be undone.</strong>
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={handleDelete}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete Group
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>

                            {!isCreator && isAdmin && (
                                <div className="text-xs text-muted-foreground bg-yellow-50 p-3 rounded border border-yellow-200">
                                    <strong>Admin Note:</strong> You can delete this group as an administrator,
                                    but consider contacting the group creator ({group.creator.name}) first.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Group Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle>Group Statistics</CardTitle>
                    <CardDescription>
                        Overview of group activity and information
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 border rounded-lg">
                            <p className="text-2xl font-bold text-primary">
                                {group.members?.length || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">Members</p>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                            <p className="text-2xl font-bold text-primary">
                                {Math.floor((Date.now() - new Date(group.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                            </p>
                            <p className="text-sm text-muted-foreground">Days Active</p>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                            <p className="text-2xl font-bold text-green-600">
                                {group.is_active ? 'Active' : 'Inactive'}
                            </p>
                            <p className="text-sm text-muted-foreground">Status</p>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                            <p className="text-2xl font-bold text-blue-600">
                                {group.creator.name === currentUser.name ? 'Owner' : 'Member'}
                            </p>
                            <p className="text-sm text-muted-foreground">Your Role</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
