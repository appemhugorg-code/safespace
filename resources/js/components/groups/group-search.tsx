import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Search, Users, UserPlus, Clock, CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface Group {
    id: number;
    name: string;
    description: string;
    creator: {
        id: number;
        name: string;
    };
    members_count: number;
    created_at: string;
}

interface JoinRequest {
    id: number;
    group: Group;
    status: 'pending' | 'approved' | 'rejected';
    message?: string;
    created_at: string;
    reviewed_at?: string;
    reviewer?: {
        id: number;
        name: string;
    };
}

interface GroupSearchProps {
    onJoinRequest?: (groupId: number) => void;
}

export default function GroupSearch({ onJoinRequest }: GroupSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Group[]>([]);
    const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
    });

    // Load user's join requests on component mount
    useEffect(() => {
        fetchJoinRequests();
    }, []);

    const fetchJoinRequests = async () => {
        try {
            const response = await fetch('/api/my-join-requests');
            if (response.ok) {
                const data = await response.json();
                setJoinRequests(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch join requests:', error);
        }
    };

    const searchGroups = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/groups/search/available?q=${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data.data || []);
            }
        } catch (error) {
            console.error('Failed to search groups:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            searchGroups(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleJoinRequest = (group: Group) => {
        setSelectedGroup(group);
        setJoinDialogOpen(true);
    };

    const submitJoinRequest = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedGroup) return;

        post(`/api/groups/${selectedGroup.id}/join-request`, {
            onSuccess: () => {
                reset();
                setJoinDialogOpen(false);
                setSelectedGroup(null);
                fetchJoinRequests(); // Refresh join requests
                onJoinRequest?.(selectedGroup.id);
            },
        });
    };

    const getJoinRequestStatus = (groupId: number) => {
        return joinRequests.find(request => request.group.id === groupId);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </Badge>
                );
            case 'approved':
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approved
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                    </Badge>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Search Input */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Find Groups
                    </CardTitle>
                    <CardDescription>
                        Search for groups you'd like to join
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                            placeholder="Search groups by name or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Search Results */}
            {searchQuery && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Search Results</CardTitle>
                        <CardDescription>
                            {loading ? 'Searching...' : `Found ${searchResults.length} groups`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : searchResults.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No groups found</h3>
                                <p className="text-muted-foreground">
                                    Try searching with different keywords
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {searchResults.map((group) => {
                                    const joinRequest = getJoinRequestStatus(group.id);

                                    return (
                                        <div
                                            key={group.id}
                                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-semibold">{group.name}</h4>
                                                        <Badge variant="outline" className="text-xs">
                                                            {group.members_count} members
                                                        </Badge>
                                                    </div>

                                                    {group.description && (
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            {group.description}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                        <span>Created by {group.creator.name}</span>
                                                        <span>
                                                            {new Date(group.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {joinRequest ? (
                                                        getStatusBadge(joinRequest.status)
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleJoinRequest(group)}
                                                        >
                                                            <UserPlus className="w-4 h-4 mr-1" />
                                                            Request to Join
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* My Join Requests */}
            {joinRequests.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>My Join Requests</CardTitle>
                        <CardDescription>
                            Track the status of your group join requests
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {joinRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="border rounded-lg p-3"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium">{request.group.name}</h4>
                                        {getStatusBadge(request.status)}
                                    </div>

                                    {request.message && (
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Your message: "{request.message}"
                                        </p>
                                    )}

                                    <div className="text-xs text-muted-foreground">
                                        Requested on {new Date(request.created_at).toLocaleDateString()}
                                        {request.reviewed_at && request.reviewer && (
                                            <span className="ml-2">
                                                • Reviewed by {request.reviewer.name} on{' '}
                                                {new Date(request.reviewed_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Join Request Dialog */}
            <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request to Join Group</DialogTitle>
                        <DialogDescription>
                            Send a request to join "{selectedGroup?.name}". You can include a message explaining why you'd like to join.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitJoinRequest} className="space-y-4">
                        <div>
                            <Label htmlFor="message">Message (Optional)</Label>
                            <Textarea
                                id="message"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                placeholder="Tell the group admins why you'd like to join..."
                                rows={3}
                                className={errors.message ? 'border-red-500' : ''}
                            />
                            {errors.message && (
                                <p className="text-sm text-red-600 mt-1">{errors.message}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setJoinDialogOpen(false)}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                ) : (
                                    <UserPlus className="w-4 h-4 mr-2" />
                                )}
                                Send Request
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
