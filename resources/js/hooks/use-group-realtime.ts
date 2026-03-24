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
        let pollTimer: ReturnType<typeof setInterval> | undefined;
        let teardown: (() => void) | undefined;

        const setup = (): boolean => {
            if (!window.Echo || !groupId) return false;

            const channelName = `group.${groupId}`;
            const groupChannel = window.Echo.private(channelName);

            groupChannel.subscribed(() => {
                setIsListening(true);
                updateConnectionStatus('connected');
            });

            groupChannel.error(() => {
                setIsListening(false);
                updateConnectionStatus('disconnected');
            });

            const handleNewGroupMessage = (event: any) => {
                if (event.message?.group?.id === groupId) onNewMessage?.(event.message);
            };
            const handleMemberAdded = (event: GroupMemberEvent) => {
                if (event.group?.id === groupId) onMemberAdded?.(event);
            };
            const handleMemberRemoved = (event: GroupMemberEvent) => {
                if (event.group?.id === groupId) onMemberRemoved?.(event);
            };

            groupChannel.listen('.group-message.sent', handleNewGroupMessage);
            groupChannel.listen('.group-member.added', handleMemberAdded);
            groupChannel.listen('.group-member.removed', handleMemberRemoved);

            const connection = window.Echo.connector?.pusher?.connection;
            const handleConnected = () => updateConnectionStatus('connected');
            const handleDisconnected = () => { setIsListening(false); updateConnectionStatus('disconnected'); };
            const handleConnecting = () => updateConnectionStatus('reconnecting');

            if (connection) {
                connection.bind('connected', handleConnected);
                connection.bind('disconnected', handleDisconnected);
                connection.bind('connecting', handleConnecting);
            }

            teardown = () => {
                groupChannel.stopListening('.group-message.sent');
                groupChannel.stopListening('.group-member.added');
                groupChannel.stopListening('.group-member.removed');
                if (connection) {
                    connection.unbind('connected', handleConnected);
                    connection.unbind('disconnected', handleDisconnected);
                    connection.unbind('connecting', handleConnecting);
                }
                setIsListening(false);
            };

            return true;
        };

        if (!setup()) {
            pollTimer = setInterval(() => {
                if (setup()) clearInterval(pollTimer);
            }, 200);
        }

        return () => {
            clearInterval(pollTimer);
            teardown?.();
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
