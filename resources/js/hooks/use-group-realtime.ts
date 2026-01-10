import { useEffect, useState, useCallback } from 'react';

interface User {
    id: number;
    name: string;
    roles?: string[];
}

interface Message {
    id: number;
    content: string;
    sender: User;
    created_at: string;
    is_read: boolean;
    is_flagged: boolean;
    message_type: 'group';
    group: {
        id: number;
        name: string;
    };
}

interface GroupMemberEvent {
    group: {
        id: number;
        name: string;
    };
    user: User;
    added_by?: User;
    removed_by?: User;
    role?: string;
    reason?: string;
    timestamp: string;
}

interface UseGroupRealtimeOptions {
    groupId: number;
    currentUserId: number;
    onNewMessage?: (message: Message) => void;
    onMemberAdded?: (event: GroupMemberEvent) => void;
    onMemberRemoved?: (event: GroupMemberEvent) => void;
    onConnectionStatusChange?: (status: 'connected' | 'disconnected' | 'reconnecting') => void;
}

export function useGroupRealtime({
    groupId,
    currentUserId,
    onNewMessage,
    onMemberAdded,
    onMemberRemoved,
    onConnectionStatusChange,
}: UseGroupRealtimeOptions) {
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');
    const [isListening, setIsListening] = useState(false);

    const updateConnectionStatus = useCallback((status: 'connected' | 'disconnected' | 'reconnecting') => {
        setConnectionStatus(status);
        onConnectionStatusChange?.(status);
    }, [onConnectionStatusChange]);

    useEffect(() => {
        if (!window.Echo || !groupId) {
            console.log('Echo not available or no group ID:', { echo: !!window.Echo, groupId });
            return;
        }

        console.log('Setting up group real-time listener for group:', groupId);

        const channelName = `group.${groupId}`;
        const groupChannel = window.Echo.private(channelName);

        // Track subscription status
        groupChannel.subscribed(() => {
            console.log('Successfully subscribed to group channel:', channelName);
            setIsListening(true);
            updateConnectionStatus('connected');
        });

        groupChannel.error((error: any) => {
            console.error('Group channel subscription error:', error);
            setIsListening(false);
            updateConnectionStatus('disconnected');
        });

        // Handle new group messages
        const handleNewGroupMessage = (event: any) => {
            console.log('Received new group message event:', event);

            if (event.message.group.id === groupId) {
                onNewMessage?.(event.message);
            }
        };

        // Handle member added events
        const handleMemberAdded = (event: GroupMemberEvent) => {
            console.log('Member added to group:', event);

            if (event.group.id === groupId) {
                onMemberAdded?.(event);
            }
        };

        // Handle member removed events
        const handleMemberRemoved = (event: GroupMemberEvent) => {
            console.log('Member removed from group:', event);

            if (event.group.id === groupId) {
                onMemberRemoved?.(event);
            }
        };

        // Set up event listeners
        groupChannel.listen('.group-message.sent', handleNewGroupMessage);
        groupChannel.listen('.group-member.added', handleMemberAdded);
        groupChannel.listen('.group-member.removed', handleMemberRemoved);

        // Connection status monitoring
        if (window.Echo.connector?.pusher?.connection) {
            const connection = window.Echo.connector.pusher.connection;

            const handleConnected = () => {
                console.log('WebSocket connected');
                updateConnectionStatus('connected');
            };

            const handleDisconnected = () => {
                console.log('WebSocket disconnected');
                setIsListening(false);
                updateConnectionStatus('disconnected');
            };

            const handleConnecting = () => {
                console.log('WebSocket reconnecting');
                updateConnectionStatus('reconnecting');
            };

            const handleError = (error: any) => {
                console.error('WebSocket error:', error);
                setIsListening(false);
                updateConnectionStatus('disconnected');
            };

            connection.bind('connected', handleConnected);
            connection.bind('disconnected', handleDisconnected);
            connection.bind('connecting', handleConnecting);
            connection.bind('error', handleError);

            // Cleanup connection listeners
            return () => {
                console.log('Cleaning up group real-time listener');
                groupChannel.stopListening('.group-message.sent');
                groupChannel.stopListening('.group-member.added');
                groupChannel.stopListening('.group-member.removed');

                connection.unbind('connected', handleConnected);
                connection.unbind('disconnected', handleDisconnected);
                connection.unbind('connecting', handleConnecting);
                connection.unbind('error', handleError);

                setIsListening(false);
            };
        }

        return () => {
            console.log('Cleaning up group real-time listener');
            groupChannel.stopListening('.group-message.sent');
            groupChannel.stopListening('.group-member.added');
            groupChannel.stopListening('.group-member.removed');
            setIsListening(false);
        };
    }, [groupId, currentUserId, onNewMessage, onMemberAdded, onMemberRemoved, updateConnectionStatus]);

    return {
        connectionStatus,
        isListening,
    };
}

// Hook for listening to user-specific group notifications
export function useUserGroupNotifications(currentUserId: number) {
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        if (!window.Echo || !currentUserId) {
            return;
        }

        console.log('Setting up user group notifications for user:', currentUserId);

        const channelName = `user.${currentUserId}`;
        const userChannel = window.Echo.private(channelName);

        // Handle group invitations
        const handleGroupInvitation = (event: any) => {
            console.log('Received group invitation:', event);
            setNotifications(prev => [...prev, {
                type: 'group_invitation',
                ...event,
                timestamp: new Date().toISOString(),
            }]);
        };

        // Handle join request responses
        const handleJoinRequestResponse = (event: any) => {
            console.log('Received join request response:', event);
            setNotifications(prev => [...prev, {
                type: 'join_request_response',
                ...event,
                timestamp: new Date().toISOString(),
            }]);
        };

        // Handle group dissolution
        const handleGroupDissolved = (event: any) => {
            console.log('Group dissolved:', event);
            setNotifications(prev => [...prev, {
                type: 'group_dissolved',
                ...event,
                timestamp: new Date().toISOString(),
            }]);
        };

        userChannel.listen('.group.invitation', handleGroupInvitation);
        userChannel.listen('.group.join-request-response', handleJoinRequestResponse);
        userChannel.listen('.group.dissolved', handleGroupDissolved);

        return () => {
            console.log('Cleaning up user group notifications');
            userChannel.stopListening('.group.invitation');
            userChannel.stopListening('.group.join-request-response');
            userChannel.stopListening('.group.dissolved');
        };
    }, [currentUserId]);

    const clearNotification = useCallback((index: number) => {
        setNotifications(prev => prev.filter((_, i) => i !== index));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return {
        notifications,
        clearNotification,
        clearAllNotifications,
    };
}
