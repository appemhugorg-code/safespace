import { Clock, CheckCircle, XCircle, Users, Crown, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface User {
    id: number;
    name: string;
    roles?: string[];
}

interface GroupMember extends User {
    pivot: {
        role: 'member' | 'admin';
        joined_at: string;
    };
}

interface JoinRequest {
    id: number;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    reviewed_at?: string;
    reviewer?: User;
}

interface Group {
    id: number;
    name: string;
    creator: User;
    members: GroupMember[];
}

interface GroupMembershipStatusProps {
    group: Group;
    currentUser: User;
    joinRequest?: JoinRequest;
    className?: string;
}

export default function GroupMembershipStatus({
    group,
    currentUser,
    joinRequest,
    className = ''
}: GroupMembershipStatusProps) {
    const currentUserMember = group.members.find(m => m.id === currentUser.id);

    // User is a member
    if (currentUserMember) {
        const isCreator = currentUser.id === group.creator.id;
        const isAdmin = currentUserMember.pivot.role === 'admin';

        if (isCreator) {
            return (
                <Badge variant="outline" className={`bg-yellow-50 text-yellow-700 border-yellow-200 ${className}`}>
                    <Crown className="w-3 h-3 mr-1" />
                    Creator
                </Badge>
            );
        }

        if (isAdmin) {
            return (
                <Badge variant="outline" className={`bg-blue-50 text-blue-700 border-blue-200 ${className}`}>
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                </Badge>
            );
        }

        return (
            <Badge variant="outline" className={`bg-green-50 text-green-700 border-green-200 ${className}`}>
                <Users className="w-3 h-3 mr-1" />
                Member
            </Badge>
        );
    }

    // User has a join request
    if (joinRequest) {
        switch (joinRequest.status) {
            case 'pending':
                return (
                    <Badge variant="outline" className={`bg-yellow-50 text-yellow-700 border-yellow-200 ${className}`}>
                        <Clock className="w-3 h-3 mr-1" />
                        Request Pending
                    </Badge>
                );
            case 'approved':
                return (
                    <Badge variant="outline" className={`bg-green-50 text-green-700 border-green-200 ${className}`}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Request Approved
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="outline" className={`bg-red-50 text-red-700 border-red-200 ${className}`}>
                        <XCircle className="w-3 h-3 mr-1" />
                        Request Rejected
                    </Badge>
                );
        }
    }

    // User is not a member and has no join request
    return null;
}

// Helper component for displaying detailed membership info
interface MembershipInfoProps {
    group: Group;
    currentUser: User;
    joinRequest?: JoinRequest;
}

export function GroupMembershipInfo({ group, currentUser, joinRequest }: MembershipInfoProps) {
    const currentUserMember = group.members.find(m => m.id === currentUser.id);

    if (currentUserMember) {
        return (
            <div className="text-sm text-muted-foreground">
                <p>
                    Joined on {new Date(currentUserMember.pivot.joined_at).toLocaleDateString()}
                </p>
                {currentUser.id === group.creator.id && (
                    <p className="text-yellow-700">You created this group</p>
                )}
            </div>
        );
    }

    if (joinRequest) {
        return (
            <div className="text-sm text-muted-foreground">
                <p>
                    Request sent on {new Date(joinRequest.created_at).toLocaleDateString()}
                </p>
                {joinRequest.status === 'approved' && joinRequest.reviewed_at && (
                    <p className="text-green-700">
                        Approved on {new Date(joinRequest.reviewed_at).toLocaleDateString()}
                        {joinRequest.reviewer && ` by ${joinRequest.reviewer.name}`}
                    </p>
                )}
                {joinRequest.status === 'rejected' && joinRequest.reviewed_at && (
                    <p className="text-red-700">
                        Rejected on {new Date(joinRequest.reviewed_at).toLocaleDateString()}
                        {joinRequest.reviewer && ` by ${joinRequest.reviewer.name}`}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="text-sm text-muted-foreground">
            <p>You are not a member of this group</p>
        </div>
    );
}
