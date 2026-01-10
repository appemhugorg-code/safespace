import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Send,
    Users,
    MoreVertical,
    AlertTriangle,
    Crown,
    Shield,
    Settings,
    UserMinus,
    LogOut
} from 'lucide-react';

import { useGroupRealtime } from '@/hooks/use-group-realtime';
import ConnectionStatus, { ConnectionWarning } from './connection-status';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

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
}

interface GroupConversationProps {
    group: Group;
    messages: Message[];
    currentUser: User;
    canManageGroup?: boolean;
    onLeaveGroup?: () => void;
    onSettingsOpen?: () => void;
}

export default function GroupConversation({
    group,
    messages: initialMessages,
    currentUser,
    canManageGroup = false,
    onLeaveGroup,
    onSettingsOpen
}: GroupConversationProps) {
    const [localMessages, setLocalMessages] = useState<Message[]>(initialMessages);
    const [membersPanelOpen, setMembersPanelOpen] = useState(false);
    const [showConnectionWarning, setShowConnectionWarning] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Handle new messages from real-time updates
    const handleNewMessage = useCallback((message: Message) => {
        setLocalMessages(prev => {
            // Check if message already exists to prevent duplicates
            const messageExists = prev.some(msg => msg.id === message.id);
            if (messageExists) {
                console.log('Group message already exists, skipping');
                return prev;
            }

            console.log('Adding new group message to conversation');
            return [...prev, message];
        });
        scrollToBottom();
    }, []);

    // Handle member updates
    const handleMemberAdded = useCallback((event: any) => {
        console.log('Member added to group:', event);
        // Could show a notification or update member list
    }, []);

    const handleMemberRemoved = useCallback((event: any) => {
        console.log('Member removed from group:', event);
        // Could show a notification or update member list
    }, []);

    const handleConnectionStatusChange = useCallback((status: 'connected' | 'disconnected' | 'reconnecting') => {
        setShowConnectionWarning(status !== 'connected');
    }, []);

    // Use the real-time hook
    const { connectionStatus, isListening } = useGroupRealtime({
        groupId: group.id,
        currentUserId: currentUser.id,
        onNewMessage: handleNewMessage,
        onMemberAdded: handleMemberAdded,
        onMemberRemoved: handleMemberRemoved,
        onConnectionStatusChange: handleConnectionStatusChange,
    });

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        content: '',
        group_id: group.id,
    });

    const [sendError, setSendError] = useState<string | null>(null);
    const [sendSuccess, setSendSuccess] = useState(false);
    const [sendWarning, setSendWarning] = useState<string | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [localMessages]);

    // Real-time message listening for group messages
    useEffect(() => {
        console.log('Setting up group Echo listener for group:', group.id);

        if (!window.Echo || !group) {
            console.log('Echo not available or no group:', { echo: !!window.Echo, group: !!group });
            return;
        }

        // Listen to group channel for group messages
        const channelName = `group.${group.id}`;
        console.log('Subscribing to group channel:', channelName);

        const groupChannel = window.Echo.private(channelName);

        // Test channel subscription
        groupChannel.subscribed(() => {
            console.log('Successfully subscribed to group channel:', channelName);
        });

        groupChannel.error((error: any) => {
            console.error('Group channel subscription error:', error);
            setConnectionStatus('disconnected');
        });

        const handleNewGroupMessage = (event: any) => {
            console.log('Received new group message event:', event);

            // Add message if it's for this group and not from current user (to avoid duplicates)
            if (event.message.group.id === group.id) {
                setLocalMessages(prev => {
                    // Check if message already exists to prevent duplicates
                    const messageExists = prev.some(msg => msg.id === event.message.id);
                    if (messageExists) {
                        console.log('Group message already exists, skipping');
                        return prev;
                    }

                    console.log('Adding new group message to conversation');
                    return [...prev, event.message];
                });
                scrollToBottom();
            }
        };

        const handleMemberAdded = (event: any) => {
            console.log('Member added to group:', event);
            // You could update the members list here if needed
        };

        const handleMemberRemoved = (event: any) => {
            console.log('Member removed from group:', event);
            // You could update the members list here if needed
        };

        groupChannel.listen('.group-message.sent', handleNewGroupMessage);
        groupChannel.listen('.group-member.added', handleMemberAdded);
        groupChannel.listen('.group-member.removed', handleMemberRemoved);

        // Connection status monitoring
        if (window.Echo.connector?.pusher?.connection) {
            const connection = window.Echo.connector.pusher.connection;

            connection.bind('connected', () => {
                console.log('WebSocket connected');
                setConnectionStatus('connected');
            });

            connection.bind('disconnected', () => {
                console.log('WebSocket disconnected');
                setConnectionStatus('disconnected');
            });

            connection.bind('connecting', () => {
                console.log('WebSocket reconnecting');
                setConnectionStatus('reconnecting');
            });

            connection.bind('error', (error: any) => {
                console.error('WebSocket error:', error);
                setConnectionStatus('disconnected');
            });
        }

        return () => {
            console.log('Cleaning up group Echo listener');
            groupChannel.stopListening('.group-message.sent');
            groupChannel.stopListening('.group-member.added');
            groupChannel.stopListening('.group-member.removed');
        };
    }, [group.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.content.trim() || processing) return;

        // Clear previous messages
        setSendError(null);
        setSendSuccess(false);
        setSendWarning(null);
        clearErrors();

        console.log('Sending group message:', data.content, 'to group:', group.id);

        post('/api/messages', {
            preserveScroll: true,
            onSuccess: (response: any) => {
                console.log('Group message response:', response);

                // Temporarily disable optimistic updates to test Echo
                // TODO: Re-enable after confirming Echo is working
                /*
                // Add the message optimistically to show immediate feedback
                // Check both props and flash for the message (Inertia can put it in either place)
                const sentMessage = response.props?.message || response.props?.flash?.message;
                if (sentMessage) {
                    setLocalMessages(prev => {
                        // Check if message already exists to prevent duplicates
                        const messageExists = prev.some(msg => msg.id === sentMessage.id);
                        if (!messageExists) {
                            console.log('Adding sent group message optimistically');
                            return [...prev, sentMessage];
                        }
                        return prev;
                    });
                    scrollToBottom();
                }
                */

                reset('content');

                // Check if there's a warning (broadcast failed)
                if (response.props?.flash?.warning) {
                    setSendWarning(response.props.flash.warning);
                    setTimeout(() => setSendWarning(null), 8000);
                } else {
                    setSendSuccess(true);
                    setTimeout(() => setSendSuccess(false), 2000);
                }

                // Check for moderation notice
                if (response.props?.moderation_notice) {
                    setSendWarning(response.props.moderation_notice);
                    setTimeout(() => setSendWarning(null), 10000);
                }
            },
            onError: (errors) => {
                console.error('Failed to send group message:', errors);

                if (errors.content && errors.content.includes('inappropriate')) {
                    setSendError('Your message contains inappropriate content and cannot be sent.');
                } else if (errors.broadcast) {
                    setSendWarning('Message saved but real-time delivery failed. Refreshing to show your message...');
                } else {
                    setSendError('Failed to send message. Please try again.');
                }

                // Clear messages after 5 seconds
                setTimeout(() => {
                    setSendError(null);
                    setSendWarning(null);
                }, 5000);
            }
        });
    };

    const reportMessage = (messageId: number) => {
        post(`/api/messages/${messageId}/flag`, {
            data: { reason: 'Inappropriate content' },
            preserveScroll: true,
            onSuccess: () => {
                // Message reported successfully
            }
        });
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

    const getMemberRole = (member: GroupMember) => {
        if (member.id === group.creator.id) return 'creator';
        return member.pivot.role;
    };

    const getMemberBadge = (member: GroupMember) => {
        const role = getMemberRole(member);

        if (role === 'creator') {
            return (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    <Crown className="w-3 h-3 mr-1" />
                    Creator
                </Badge>
            );
        }

        if (role === 'admin') {
            return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                </Badge>
            );
        }

        return null;
    };

    const currentUserMember = group.members.find(m => m.id === currentUser.id);
    const canLeaveGroup = currentUserMember && currentUserMember.id !== group.creator.id;

    return (
        <Card className="flex flex-col min-h-0 h-full">
            {/* Chat Header */}
            <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{group.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {group.members.length} members
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Connection Status Indicator */}
                        <ConnectionStatus
                            status={connectionStatus}
                            isListening={isListening}
                        />

                        {/* Members Panel Toggle */}
                        <Sheet open={membersPanelOpen} onOpenChange={setMembersPanelOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Users className="w-4 h-4 mr-1" />
                                    Members
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Group Members</SheetTitle>
                                    <SheetDescription>
                                        {group.members.length} members in {group.name}
                                    </SheetDescription>
                                </SheetHeader>
                                <ScrollArea className="h-[calc(100vh-120px)] mt-6">
                                    <div className="space-y-3">
                                        {group.members.map((member) => (
                                            <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-primary">
                                                        {member.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-sm">{member.name}</p>
                                                        {getMemberBadge(member)}
                                                        {member.roles && member.roles.length > 0 && (
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-xs ${getRoleBadgeColor(member.roles)}`}
                                                            >
                                                                {member.roles[0]}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Joined {new Date(member.pivot.joined_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </SheetContent>
                        </Sheet>

                        {/* Group Options */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {canManageGroup && (
                                    <>
                                        <DropdownMenuItem onClick={onSettingsOpen}>
                                            <Settings className="w-4 h-4 mr-2" />
                                            Group Settings
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}
                                {canLeaveGroup && (
                                    <DropdownMenuItem
                                        onClick={onLeaveGroup}
                                        className="text-red-600"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Leave Group
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Connection Warning */}
                {showConnectionWarning && (
                    <ConnectionWarning
                        status={connectionStatus}
                        onDismiss={() => setShowConnectionWarning(false)}
                    />
                )}
                {localMessages.length === 0 ? (
                    <div className="text-center py-8">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Welcome to {group.name}!</h3>
                        <p className="text-muted-foreground">
                            Start the conversation by sending the first message.
                        </p>
                    </div>
                ) : (
                    localMessages.map((message) => {
                        const isCurrentUser = message.sender.id === currentUser.id;
                        const senderMember = group.members.find(m => m.id === message.sender.id);

                        return (
                            <div key={message.id} className="space-y-2">
                                {/* Message Header */}
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-semibold text-primary">
                                            {message.sender.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="font-medium text-sm">{message.sender.name}</span>
                                    {senderMember && getMemberBadge(senderMember)}
                                    {message.sender.roles && message.sender.roles.length > 0 && (
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${getRoleBadgeColor(message.sender.roles)}`}
                                        >
                                            {message.sender.roles[0]}
                                        </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(message.created_at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>

                                {/* Message Content */}
                                <div className="ml-8">
                                    <div className="bg-muted p-3 rounded-lg max-w-2xl">
                                        <p className="text-sm">{message.content}</p>

                                        {message.is_flagged && (
                                            <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                                                ⚠️ This message has been flagged for review
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Actions */}
                                    {!isCurrentUser && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                                                    >
                                                        <MoreVertical className="h-3 w-3" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start">
                                                    <DropdownMenuItem
                                                        onClick={() => reportMessage(message.id)}
                                                        className="text-red-600"
                                                    >
                                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                                        Report Message
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </CardContent>

            {/* Message Input */}
            <div className="border-t p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={data.content}
                        onChange={(e) => {
                            setData('content', e.target.value);
                            // Clear messages when user starts typing
                            if (sendError) setSendError(null);
                            if (sendWarning) setSendWarning(null);
                        }}
                        placeholder={connectionStatus === 'connected' ? "Type your message..." : "Connecting..."}
                        className="flex-1"
                        disabled={processing || connectionStatus === 'disconnected'}
                        maxLength={1000}
                    />
                    <Button
                        type="submit"
                        disabled={processing || !data.content.trim() || connectionStatus === 'disconnected'}
                    >
                        {processing ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </form>

                {/* Status Messages */}
                {sendError && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {sendError}
                    </div>
                )}

                {sendSuccess && (
                    <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                        Message sent successfully!
                    </div>
                )}

                {sendWarning && (
                    <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                        ⚠️ {sendWarning}
                    </div>
                )}

                {errors.content && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                        {errors.content}
                    </div>
                )}

                {connectionStatus === 'disconnected' && (
                    <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                        ⚠️ Connection lost. Messages will be sent when connection is restored.
                    </div>
                )}

                {/* Character Count and Safety Notice */}
                <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-muted-foreground">
                        💡 All messages are monitored for safety. Be respectful and kind.
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {data.content.length}/1000
                    </div>
                </div>
            </div>
        </Card>
    );
}
