# Design Document

## Overview

The SafeSpace chat system requires debugging and enhancement to ensure reliable real-time messaging between users and to add group chat functionality. The current implementation has the basic infrastructure in place (Laravel backend, React frontend, Reverb WebSocket server) but needs improvements in real-time message handling, error management, and the addition of group chat features.

The enhanced system will support both direct messaging between users and group chats where multiple users can participate in discussions. All communications will be monitored for safety and moderated by administrators.

## Architecture

### Current System Analysis

The existing chat system consists of:
- **Backend**: Laravel with Message model, MessageController, and MessageSent event
- **Database**: Messages table with sender/recipient relationships
- **Real-time**: Laravel Reverb WebSocket server with broadcasting
- **Frontend**: React components for conversation display and message input
- **Authentication**: Laravel Sanctum with role-based permissions

### Issues Identified

1. **Frontend Real-time Listening**: The conversation component doesn't listen for incoming messages
2. **Error Handling**: Limited error feedback for failed message sends
3. **Connection Management**: No handling of WebSocket connection drops
4. **Message State**: No loading states or send confirmations
5. **Group Chat**: Missing group chat functionality entirely

### Enhanced Architecture

```
Frontend (React/TypeScript)
├── Chat Components
│   ├── DirectMessageInterface
│   ├── GroupChatInterface
│   ├── MessageInput (with real-time listeners)
│   └── ConversationList
├── Real-time Services
│   ├── EchoService (WebSocket management)
│   ├── MessageService (API calls)
│   └── ConnectionManager (reconnection logic)
└── State Management
    ├── MessageStore (conversation state)
    ├── GroupStore (group management)
    └── ConnectionStore (WebSocket status)

Backend (Laravel)
├── Models
│   ├── Message (enhanced)
│   ├── Group (new)
│   ├── GroupMember (new)
│   └── GroupJoinRequest (new)
├── Controllers
│   ├── MessageController (enhanced)
│   ├── GroupController (new)
│   └── GroupMemberController (new)
├── Events
│   ├── MessageSent (enhanced)
│   ├── GroupMessageSent (new)
│   ├── GroupMemberAdded (new)
│   └── GroupMemberRemoved (new)
└── Broadcasting Channels
    ├── User Channels (user.{id})
    ├── Group Channels (group.{id})
    └── Admin Channels (admin-monitoring)
```

## Components and Interfaces

### Enhanced Message System

#### Message Model Extensions
```php
class Message extends Model
{
    // Add group support
    protected $fillable = [
        'sender_id',
        'recipient_id',
        'group_id',        // New: for group messages
        'content',
        'message_type',    // New: 'direct' or 'group'
        'is_read',
        'read_at',
        'is_flagged',
        'flag_reason',
    ];
    
    // New relationship
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }
}
```

#### New Group Models
```php
class Group extends Model
{
    protected $fillable = [
        'name',
        'description',
        'created_by',
        'is_active',
    ];
    
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_members')
                    ->withPivot('role', 'joined_at')
                    ->withTimestamps();
    }
    
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
    
    public function joinRequests(): HasMany
    {
        return $this->hasMany(GroupJoinRequest::class);
    }
}

class GroupJoinRequest extends Model
{
    protected $fillable = [
        'group_id',
        'user_id',
        'status',      // 'pending', 'approved', 'rejected'
        'message',     // Optional message from requester
        'reviewed_by',
        'reviewed_at',
    ];
}
```

### Frontend Components

#### Enhanced Conversation Component
```typescript
interface ConversationProps {
    contact?: User;
    group?: Group;
    messages: Message[];
    currentUser: User;
    type: 'direct' | 'group';
}

export default function Conversation({ contact, group, messages, currentUser, type }: ConversationProps) {
    const [localMessages, setLocalMessages] = useState<Message[]>(messages);
    const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');
    const [sendingMessage, setSendingMessage] = useState(false);
    
    // Real-time message listening
    useEffect(() => {
        if (!window.Echo) return;
        
        let channel;
        
        if (type === 'direct' && contact) {
            // Listen to user's private channel for direct messages
            channel = window.Echo.private(`user.${currentUser.id}`);
            channel.listen('.message.sent', handleNewMessage);
        } else if (type === 'group' && group) {
            // Listen to group channel for group messages
            channel = window.Echo.private(`group.${group.id}`);
            channel.listen('.group-message.sent', handleNewMessage);
        }
        
        return () => {
            if (channel) {
                channel.stopListening('.message.sent');
                channel.stopListening('.group-message.sent');
            }
        };
    }, [contact, group, currentUser.id, type]);
    
    const handleNewMessage = (event: any) => {
        setLocalMessages(prev => [...prev, event.message]);
        scrollToBottom();
    };
}
```

#### Group Management Components
```typescript
// Group creation form
interface GroupCreationFormProps {
    onGroupCreated: (group: Group) => void;
}

// Group member management
interface GroupMembersProps {
    group: Group;
    currentUser: User;
    canManageMembers: boolean;
}

// Group search and join
interface GroupSearchProps {
    onJoinRequest: (groupId: number) => void;
}
```

### API Design

#### Enhanced Message Endpoints
```
POST /api/messages - Send direct message
POST /api/groups/{group}/messages - Send group message
GET /api/conversations - List all conversations (direct + groups)
GET /api/conversations/{contact} - Get direct conversation
GET /api/groups/{group}/messages - Get group conversation
```

#### New Group Management Endpoints
```
POST /api/groups - Create group (therapist/admin only)
GET /api/groups - List available groups
GET /api/groups/{group} - Get group details
POST /api/groups/{group}/members - Add member (admin only)
DELETE /api/groups/{group}/members/{user} - Remove member
POST /api/groups/{group}/join-request - Request to join group
PUT /api/groups/{group}/join-requests/{request} - Approve/reject join request
POST /api/groups/{group}/leave - Leave group with reason
```

## Data Models

### Enhanced Database Schema

#### Messages Table (Enhanced)
```sql
ALTER TABLE messages ADD COLUMN group_id BIGINT UNSIGNED NULL;
ALTER TABLE messages ADD COLUMN message_type ENUM('direct', 'group') DEFAULT 'direct';
ALTER TABLE messages ADD FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE;
```

#### New Tables
```sql
CREATE TABLE groups (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by BIGINT UNSIGNED NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE group_members (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    group_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    role ENUM('member', 'admin') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_group_user (group_id, user_id)
);

CREATE TABLE group_join_requests (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    group_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    message TEXT NULL,
    reviewed_by BIGINT UNSIGNED NULL,
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE group_leave_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    group_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    reason ENUM('no_longer_relevant', 'too_busy', 'found_better_support', 'privacy_concerns', 'other') NOT NULL,
    custom_reason TEXT NULL,
    left_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Real-time Communication Design

### Broadcasting Channels

#### User Channels
- `user.{user_id}` - Private channel for direct messages and notifications
- Used for: Direct messages, group invitations, system notifications

#### Group Channels
- `group.{group_id}` - Private channel for group members only
- Used for: Group messages, member additions/removals, group updates

#### Admin Monitoring Channels
- `admin-monitoring` - Channel for all administrators
- Used for: Flagged messages, group activity monitoring, system alerts

### Event Broadcasting

#### Message Events
```php
class MessageSent implements ShouldBroadcast
{
    public function broadcastOn(): array
    {
        if ($this->message->message_type === 'direct') {
            return [new PrivateChannel('user.'.$this->message->recipient_id)];
        } else {
            return [new PrivateChannel('group.'.$this->message->group_id)];
        }
    }
}

class GroupMessageSent implements ShouldBroadcast
{
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('group.'.$this->message->group_id),
            new PrivateChannel('admin-monitoring'), // For admin oversight
        ];
    }
}
```

## Error Handling and Connection Management

### Frontend Error Handling

#### Connection Status Management
```typescript
class ConnectionManager {
    private echo: Echo;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    
    constructor() {
        this.setupConnectionListeners();
    }
    
    private setupConnectionListeners() {
        this.echo.connector.pusher.connection.bind('connected', () => {
            this.handleConnectionEstablished();
        });
        
        this.echo.connector.pusher.connection.bind('disconnected', () => {
            this.handleConnectionLost();
        });
        
        this.echo.connector.pusher.connection.bind('error', (error: any) => {
            this.handleConnectionError(error);
        });
    }
    
    private handleConnectionLost() {
        // Show connection lost indicator
        // Attempt reconnection with exponential backoff
        this.attemptReconnection();
    }
}
```

#### Message Send Error Handling
```typescript
const sendMessage = async (content: string) => {
    setSendingMessage(true);
    setMessageError(null);
    
    try {
        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({
                content,
                recipient_id: contact?.id,
                group_id: group?.id,
            }),
        });
        
        if (!response.ok) {
            throw new Error('Failed to send message');
        }
        
        // Clear input on success
        setMessageContent('');
        
    } catch (error) {
        setMessageError('Failed to send message. Please try again.');
        // Keep message in input for retry
    } finally {
        setSendingMessage(false);
    }
};
```

### Backend Error Handling

#### Message Validation
```php
class SendMessageRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'content' => 'required|string|max:1000',
            'recipient_id' => 'required_without:group_id|exists:users,id',
            'group_id' => 'required_without:recipient_id|exists:groups,id',
        ];
    }
    
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->group_id) {
                $this->validateGroupMembership($validator);
            } else {
                $this->validateDirectMessagePermissions($validator);
            }
        });
    }
}
```

## Security Considerations

### Group Chat Security

#### Access Control
- Only therapists and admins can create groups
- Group membership is controlled by group admins
- All group messages are visible to system admins for monitoring

#### Content Moderation
- All messages (direct and group) are subject to content filtering
- Automated flagging for inappropriate content
- Admin review workflow for flagged messages
- Group dissolution capability for admins

#### Privacy Protection
- Group join requests include reason/message
- Leave reasons are logged for analysis
- Member addition/removal is logged and auditable

## Testing Strategy

### Real-time Testing
- WebSocket connection establishment and maintenance
- Message delivery across different user sessions
- Connection recovery after network interruptions
- Broadcasting to multiple group members simultaneously

### Group Chat Testing
- Group creation by different user roles
- Member management (add/remove/promote)
- Join request workflow
- Leave group functionality with reason tracking
- Admin monitoring and moderation capabilities

### Error Scenario Testing
- Network disconnection during message send
- Invalid recipient/group scenarios
- Permission violations (unauthorized group access)
- Malformed message content
- WebSocket server unavailability

### Performance Testing
- Large group message broadcasting
- Multiple concurrent conversations
- Message history loading for large conversations
- Real-time updates with many active users

## Deployment Considerations

### WebSocket Server
- Ensure Laravel Reverb is running in production
- Configure proper SSL certificates for WSS connections
- Set up monitoring for WebSocket server health
- Implement graceful restart procedures

### Database Optimization
- Index optimization for message queries
- Group membership lookup optimization
- Message history pagination
- Archive old messages for performance

### Monitoring and Logging
- Real-time connection monitoring
- Message delivery success rates
- Group activity analytics
- Error rate tracking and alerting
