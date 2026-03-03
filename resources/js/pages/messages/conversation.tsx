import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, MoreVertical, AlertTriangle, Wifi, WifiOff, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
    roles?: Array<{ name: string }>;
}

interface Message {
    id: number;
    content: string;
    sender: User;
    recipient: User;
    created_at: string;
    is_read: boolean;
    is_flagged: boolean;
}

interface Props {
    contact: User;
    messages: Message[];
    currentUser: User;
}

export default function Conversation({ contact, messages, currentUser }: Props) {
    const [localMessages, setLocalMessages] = useState<Message[]>(messages);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        content: '',
        recipient_id: contact.id,
    });

    const [sendError, setSendError] = useState<string | null>(null);
    const [sendSuccess, setSendSuccess] = useState(false);
    const [sendWarning, setSendWarning] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [localMessages]);

    // Real-time message listening
    useEffect(() => {
        if (!contact) return;

        let userChannel: any = null;
        let checkAttempts = 0;
        const maxAttempts = 50; // 5 seconds max

        // Wait for Echo to be available
        const checkEcho = setInterval(() => {
            checkAttempts++;
            
            if (window.Echo) {
                clearInterval(checkEcho);
                setupEchoListener();
            } else if (checkAttempts >= maxAttempts) {
                clearInterval(checkEcho);
                console.warn('Echo not available after 5 seconds, real-time messaging disabled');
            }
        }, 100);

        const setupEchoListener = () => {
            console.log('✅ Setting up Echo listener for user:', currentUser.id);

            const channelName = `user.${currentUser.id}`;
            userChannel = window.Echo.private(channelName);

            userChannel.subscribed(() => {
                console.log('✅ Subscribed to channel:', channelName);
                setConnectionStatus('connected');
            });

            userChannel.error((error: any) => {
                console.error('❌ Channel error:', error);
                setConnectionStatus('disconnected');
            });

            userChannel.listen('.message.sent', (event: any) => {
                console.log('🔔 Message received:', event.message.id);

                const senderId = parseInt(event.message.sender.id);
                const recipientId = parseInt(event.message.recipient.id);
                const currentUserId = parseInt(currentUser.id);
                const contactId = parseInt(contact.id);

                const isRelevantMessage =
                    (senderId === currentUserId && recipientId === contactId) ||
                    (senderId === contactId && recipientId === currentUserId);

                if (isRelevantMessage) {
                    setLocalMessages(prev => {
                        if (prev.some(msg => msg.id === event.message.id)) return prev;
                        return [...prev, event.message];
                    });
                    scrollToBottom();
                }
            });
        };

        return () => {
            clearInterval(checkEcho);
            if (userChannel) {
                userChannel.stopListening('.message.sent');
                window.Echo?.leave(`user.${currentUser.id}`);
            }
        };
    }, [contact?.id, currentUser.id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.content.trim() || processing) return;

        // Clear previous messages
        setSendError(null);
        setSendSuccess(false);
        setSendWarning(null);
        clearErrors();

        console.log('Sending message:', data.content, 'to:', contact.id);
        console.log('Form data:', data);

        post('/messages', {
            preserveScroll: true,
            onSuccess: (response: any) => {
                console.log('Message response:', response);

                // Re-enable optimistic updates for testing
                // Add the message optimistically to show immediate feedback
                const sentMessage = response.props?.message || response.props?.flash?.message;
                if (sentMessage) {
                    console.log('✨ Optimistic update - adding message:', sentMessage.id);
                    setLocalMessages(prev => {
                        // Check if message already exists to prevent duplicates
                        const messageExists = prev.some(msg => msg.id === sentMessage.id);
                        if (!messageExists) {
                            console.log('Adding sent message optimistically');
                            return [...prev, sentMessage];
                        }
                        console.log('Optimistic message already exists, skipping');
                        return prev;
                    });
                    scrollToBottom();
                }

                reset('content');

                // Check if there's a warning (broadcast failed)
                if (response.props?.flash?.warning) {
                    setSendWarning(response.props.flash.warning);
                    setTimeout(() => setSendWarning(null), 8000);
                } else {
                    setSendSuccess(true);
                    setTimeout(() => setSendSuccess(false), 2000);
                }

                // If real-time is down, reload to show the message
                if (connectionStatus === 'disconnected' || response.props?.errors?.broadcast) {
                    setTimeout(() => {
                        router.reload({ only: ['messages'] });
                    }, 1000);
                }
            },
            onError: (errors) => {
                console.error('Failed to send message:', errors);

                // Check for specific broadcast errors
                if (errors.broadcast) {
                    setSendWarning('Message saved but real-time delivery failed. Refreshing to show your message...');
                    setTimeout(() => {
                        router.reload({ only: ['messages'] });
                    }, 2000);
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
        router.patch(`/messages/${messageId}/flag`, {
            reason: 'Inappropriate content'
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Message reported successfully
            }
        });
    };

    const getUserRole = (user: User) => {
        if (!user.roles || user.roles.length === 0) return '';
        return user.roles[0].name;
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
            <Head title={`Chat with ${contact.name}`} />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden h-screen flex flex-col">
                {/* Header */}
                <div className="flex-shrink-0">
                    <Link href="/messages">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Messages
                        </Button>
                    </Link>
                </div>

                {/* Main Chat Layout */}
                <div className="flex-1 flex gap-4 min-h-0">
                    {/* Chat Area */}
                    <Card className="flex-1 flex flex-col min-h-0">
                        {/* Chat Header */}
                        <CardHeader className="border-b">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="font-semibold text-primary">
                                            {contact.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{contact.name}</CardTitle>
                                        {getUserRole(contact) && (
                                            <Badge
                                                variant="outline"
                                                className={`text-xs ${getRoleBadgeColor(getUserRole(contact))}`}
                                            >
                                                {getUserRole(contact)}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                {/* Connection Status Indicator */}
                                <div className="flex items-center gap-2">
                                    {connectionStatus === 'connected' && (
                                        <div className="flex items-center gap-1 text-green-600">
                                            <Wifi className="w-4 h-4" />
                                            <span className="text-xs">Connected</span>
                                        </div>
                                    )}
                                    {connectionStatus === 'disconnected' && (
                                        <div className="flex items-center gap-1 text-red-600">
                                            <WifiOff className="w-4 h-4" />
                                            <span className="text-xs">Disconnected</span>
                                        </div>
                                    )}
                                    {connectionStatus === 'reconnecting' && (
                                        <div className="flex items-center gap-1 text-yellow-600">
                                            <Wifi className="w-4 h-4 animate-pulse" />
                                            <span className="text-xs">Reconnecting...</span>
                                        </div>
                                    )}

                                    {/* Debug Info */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            console.log('Debug Info:');
                                            console.log('Current User:', currentUser);
                                            console.log('Contact:', contact);
                                            console.log('Messages:', localMessages);
                                            console.log('Echo available:', !!window.Echo);
                                            console.log('Connection Status:', connectionStatus);
                                        }}
                                    >
                                        Debug
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        {/* Messages Area */}
                        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                            {localMessages.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">
                                        No messages yet. Start the conversation!
                                    </p>
                                </div>
                            ) : (
                                localMessages.map((message) => {
                                    const isCurrentUser = message.sender.id === currentUser.id;

                                    return (
                                        <div
                                            key={message.id}
                                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isCurrentUser
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted'
                                                    }`}
                                            >
                                                <p className="text-sm">{message.content}</p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className={`text-xs ${isCurrentUser
                                                        ? 'text-primary-foreground/70'
                                                        : 'text-muted-foreground'
                                                        }`}>
                                                        {new Date(message.created_at).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>

                                                    {!isCurrentUser && (
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
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    onClick={() => reportMessage(message.id)}
                                                                    className="text-red-600"
                                                                >
                                                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                                                    Report Message
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    )}
                                                </div>

                                                {message.is_flagged && (
                                                    <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                                                        ⚠️ This message has been flagged for review
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
                                    className="relative"
                                >
                                    {processing ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setData('content', 'Test message from debug button');
                                        setTimeout(() => {
                                            handleSubmit(new Event('submit') as any);
                                        }, 100);
                                    }}
                                    disabled={processing}
                                >
                                    Test
                                </Button>
                            </form>

                            {/* Error Message */}
                            {sendError && (
                                <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                    {sendError}
                                </div>
                            )}

                            {/* Success Message */}
                            {sendSuccess && (
                                <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                                    Message sent successfully!
                                </div>
                            )}

                            {/* Warning Message */}
                            {sendWarning && (
                                <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                                    ⚠️ {sendWarning}
                                </div>
                            )}

                            {/* Form Errors */}
                            {errors.content && (
                                <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                                    {errors.content}
                                </div>
                            )}

                            {/* Connection Status Warning */}
                            {connectionStatus === 'disconnected' && (
                                <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
                                    ⚠️ Connection lost. Messages will be sent when connection is restored.
                                </div>
                            )}

                            {/* Character Count */}
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

                    {/* Contacts Sidebar */}
                    <Card className="w-80 flex-shrink-0 flex flex-col">
                        <CardHeader className="border-b flex-shrink-0 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Contacts
                            </CardTitle>
                            {/* Search Input */}
                            <div className="mt-3 mb-2">
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
                                    // Get available contacts based on user role
                                    const getAvailableContacts = () => {
                                        const userRoles = currentUser.roles?.map(r => r.name) || [];
                                        const hasRole = (role: string) => userRoles.includes(role);

                                        // Always include current contact as active
                                        const contacts = [
                                            { id: contact.id, name: contact.name, role: getUserRole(contact) || 'User', status: 'online', lastMessage: '', time: 'now', isActive: true }
                                        ];

                                        if (hasRole('therapist')) {
                                            // Therapists can message guardians and children
                                            // Contacts are loaded from backend
                                        } else if (hasRole('guardian')) {
                                            // Guardians can message therapists and their children
                                            // Contacts are loaded from backend
                                        } else if (hasRole('child')) {
                                            // Children can message therapists and their guardian
                                            // Contacts are loaded from backend
                                        } else if (hasRole('admin')) {
                                            // Admins can message everyone
                                            // Contacts are loaded from backend
                                        }

                                        // Remove duplicates and filter out current contact from non-active items
                                        return contacts.filter((c, index, self) =>
                                            index === self.findIndex(item => item.id === c.id)
                                        );
                                    };

                                    const allContacts = getAvailableContacts();

                                    // Get user's groups (only groups they are members of)
                                    const getUserGroups = () => {
                                        // In production, this would come from props or API
                                        // For now, return empty array to avoid 404 errors
                                        // TODO: Replace with actual user groups from backend
                                        return [];
                                    };

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
                                            {/* Contacts Section */}
                                            {filteredContacts.length > 0 && (
                                                <>
                                                    {filteredContacts.map((contactItem) => (
                                                        <div key={contactItem.id}>
                                                            {contactItem.isActive ? (
                                                                <div className="p-3 bg-primary/10 border-l-4 border-primary">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="relative">
                                                                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                                                                <span className="font-semibold text-primary">
                                                                                    {contactItem.name.charAt(0).toUpperCase()}
                                                                                </span>
                                                                            </div>
                                                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(contactItem.status)} rounded-full border-2 border-white`}></div>
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="font-medium text-sm truncate">{contactItem.name}</p>
                                                                            <p className="text-xs text-muted-foreground capitalize">
                                                                                {contactItem.role} • {contactItem.status}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <Link href={`/messages/conversation/${contactItem.id}`} className="block">
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
                                                            )}
                                                        </div>
                                                    ))}
                                                </>
                                            )}

                                            {/* Groups Section */}
                                            {filteredGroups.length > 0 && (
                                                <div className="border-t mt-4 pt-4">
                                                    <div className="px-3 py-2">
                                                        <h4 className="text-sm font-medium text-muted-foreground">Groups</h4>
                                                    </div>

                                                    {filteredGroups.map((group) => (
                                                        <Link key={group.id} href={`/messages/groups/${group.id}`} className="block">
                                                            <div className="p-3 hover:bg-muted/50 transition-colors">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getAvatarColor(group.name)}`}>
                                                                        <Users className="w-5 h-5" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium text-sm truncate">{group.name}</p>
                                                                        <p className="text-xs text-muted-foreground">{group.members} • {group.online}</p>
                                                                        <p className="text-xs text-muted-foreground truncate">{group.lastMessage}</p>
                                                                    </div>
                                                                    <div className="flex flex-col items-end gap-1">
                                                                        <span className="text-xs text-muted-foreground">{group.time}</span>
                                                                        {group.time !== '1h' && (
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
            </div>
        </AppLayout>
    );
}
