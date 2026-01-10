import { Head, Link } from '@inertiajs/react';
import { MessageCircle, Users, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Message {
    id: number;
    content: string;
    sender: User;
    recipient: User;
    created_at: string;
    is_read: boolean;
}

interface Props {
    conversations: Record<string, Message>;
    contacts: User[];
}

export default function MessagesIndex({ conversations, contacts }: Props) {
    const conversationList = Object.values(conversations);

    return (
        <AppLayout>
            <Head title="Messages" />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Messages</h1>
                        <p className="text-muted-foreground">
                            Communicate safely with therapists and family
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Conversations List */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" />
                                    Recent Conversations
                                </CardTitle>
                                <CardDescription>
                                    Your recent message conversations
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {conversationList.length === 0 ? (
                                    <div className="text-center py-8">
                                        <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Start a conversation with someone from your contacts
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {conversationList.map((message) => {
                                            const isCurrentUserSender = message.sender.id === (window as any).auth?.user?.id;
                                            const otherUser = isCurrentUserSender ? message.recipient : message.sender;

                                            return (
                                                <Link
                                                    key={message.id}
                                                    href={`/messages/conversation/${otherUser.id}`}
                                                    className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h4 className="font-semibold">{otherUser.name}</h4>
                                                        <span className="text-sm text-muted-foreground">
                                                            {new Date(message.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {isCurrentUserSender ? 'You: ' : ''}{message.content}
                                                    </p>
                                                    {!message.is_read && !isCurrentUserSender && (
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Contacts List */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Contacts
                                </CardTitle>
                                <CardDescription>
                                    People you can message
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {contacts.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p className="text-muted-foreground text-sm">
                                            No contacts available
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {contacts.map((contact) => (
                                            <Link
                                                key={contact.id}
                                                href={`/messages/conversation/${contact.id}`}
                                                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-primary">
                                                        {contact.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{contact.name}</p>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {contact.email}
                                                    </p>
                                                </div>
                                                <MessageCircle className="h-4 w-4 text-muted-foreground" />
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Safety Notice */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">ℹ</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-1">Safe Communication</h4>
                                <p className="text-sm text-blue-800">
                                    All messages are monitored for safety. If you're in immediate danger,
                                    please use the emergency button or contact emergency services directly.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
