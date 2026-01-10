import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Users, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface User {
    id: number;
    name: string;
    email: string;
    roles?: string[];
}

interface GroupCreationFormProps {
    availableUsers: User[];
    onGroupCreated?: (group: any) => void;
    trigger?: React.ReactNode;
}

export default function GroupCreationForm({
    availableUsers,
    onGroupCreated,
    trigger
}: GroupCreationFormProps) {
    const [open, setOpen] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
    const { toast } = useToast();

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        initial_members: [] as number[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/groups', {
            ...data,
            initial_members: selectedMembers.map(member => member.id),
        }, {
            onSuccess: (page: any) => {
                console.log('Group created successfully:', page);
                
                // Show success toast
                toast({
                    title: 'Success!',
                    description: 'Group created successfully!',
                    variant: 'success',
                });
                
                // Reset form
                reset();
                setSelectedMembers([]);
                setOpen(false);
                
                // Refresh the groups list
                setTimeout(() => {
                    router.reload({ only: ['userGroups'] });
                }, 1000); // Give time for toast to show
                
                onGroupCreated?.(page);
            },
            onError: (errors) => {
                console.error('Group creation failed:', errors);
                
                // Show error toast with better error handling
                let errorMessage = 'Failed to create group. Please try again.';
                
                if (errors && typeof errors === 'object') {
                    if (errors.name) {
                        errorMessage = Array.isArray(errors.name) ? errors.name[0] : errors.name;
                    } else if (errors.message) {
                        errorMessage = errors.message;
                    } else {
                        const allErrors = Object.values(errors).flat();
                        if (allErrors.length > 0) {
                            errorMessage = allErrors.join(', ');
                        }
                    }
                }
                    
                toast({
                    title: 'Error',
                    description: errorMessage,
                    variant: 'destructive',
                });
            },
        });
    };

    const addMember = (user: User) => {
        if (!selectedMembers.find(member => member.id === user.id)) {
            setSelectedMembers([...selectedMembers, user]);
        }
    };

    const removeMember = (userId: number) => {
        setSelectedMembers(selectedMembers.filter(member => member.id !== userId));
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

    const defaultTrigger = (
        <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Group
        </Button>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || defaultTrigger}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Create New Group
                    </DialogTitle>
                    <DialogDescription>
                        Create a new group for discussions and support. You'll be automatically added as an admin.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Group Details */}
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Group Name *</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter group name"
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
                    </div>

                    {/* Member Selection */}
                    <div className="space-y-4">
                        <div>
                            <Label>Add Initial Members (Optional)</Label>
                            <p className="text-sm text-muted-foreground">
                                Select users to add to the group. You can add more members later.
                            </p>
                        </div>

                        {/* Selected Members */}
                        {selectedMembers.length > 0 && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm">Selected Members ({selectedMembers.length})</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMembers.map((member) => (
                                            <Badge
                                                key={member.id}
                                                variant="secondary"
                                                className="flex items-center gap-1 pr-1"
                                            >
                                                <span>{member.name}</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-4 w-4 p-0 hover:bg-red-100"
                                                    onClick={() => removeMember(member.id)}
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Available Users */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Available Users</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="max-h-48 overflow-y-auto space-y-2">
                                    {availableUsers
                                        .filter(user => !selectedMembers.find(member => member.id === user.id))
                                        .map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-semibold text-primary">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                    {user.roles && user.roles.length > 0 && (
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs ${getRoleBadgeColor(user.roles)}`}
                                                        >
                                                            {user.roles[0]}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addMember(user)}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing || !data.name.trim()}>
                            {processing ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                                <Users className="w-4 h-4 mr-2" />
                            )}
                            Create Group
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
