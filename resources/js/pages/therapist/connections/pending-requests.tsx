import { Head, Link, router, useForm } from '@inertiajs/react';
import { Clock, Check, X, User, Users, MessageCircle, Calendar } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';

interface Requester {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

interface TargetClient {
    id: number;
    name: string;
    age?: number;
}

interface PendingRequest {
    id: number;
    requester: Requester;
    target_client: TargetClient | null;
    request_type: string;
    message: string | null;
    created_at: string;
    is_guardian_to_therapist: boolean;
    is_child_assignment: boolean;
}

interface Stats {
    total_pending: number;
    guardian_requests: number;
    child_assignments: number;
}

interface Props {
    requests: PendingRequest[];
    stats: Stats;
}

export default function TherapistPendingRequests({ requests, stats }: Props) {
    const [processingRequests, setProcessingRequests] = useState<Set<number>>(new Set());
    const { toast } = useToast();

    // Use Inertia forms for approve and decline actions
    const approveForm = useForm({});
    const declineForm = useForm({});

    const handleRequestAction = (requestId: number, action: 'approve' | 'decline') => {
        if (processingRequests.has(requestId)) return;

        setProcessingRequests(prev => new Set(prev).add(requestId));

        const form = action === 'approve' ? approveForm : declineForm;
        const url = `/therapist/requests/${requestId}/${action}`;

        form.post(url, {
            onSuccess: (page) => {
                toast({
                    title: action === 'approve' ? 'Request Approved' : 'Request Declined',
                    description: `Connection request ${action}d successfully.`,
                });
                setProcessingRequests(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(requestId);
                    return newSet;
                });
            },
            onError: (errors) => {
                toast({
                    title: 'Error',
                    description: `Failed to ${action} request. Please try again.`,
                    variant: 'destructive',
                });
                setProcessingRequests(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(requestId);
                    return newSet;
                });
            },
            onFinish: () => {
                setProcessingRequests(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(requestId);
                    return newSet;
                });
            }
        });
    };

    const getRequestTypeBadge = (request: PendingRequest) => {
        if (request.is_guardian_to_therapist) {
            return <Badge className="bg-yellow-100 text-yellow-800">Guardian Connection</Badge>;
        } else if (request.is_child_assignment) {
            return <Badge className="bg-orange-100 text-orange-800">Child Assignment</Badge>;
        }
        return <Badge>{request.request_type}</Badge>;
    };

    const getRequestDescription = (request: PendingRequest) => {
        if (request.is_guardian_to_therapist) {
            return `${request.requester.name} is requesting to connect with you for therapeutic support.`;
        } else if (request.is_child_assignment) {
            return `${request.requester.name} wants to assign their child ${request.target_client?.name} to your care.`;
        }
        return 'Connection request';
    };

    return (
        <AppLayout>
            <Head title="Pending Connection Requests" />

            <div className="container-mobile space-y-6 sm:space-y-8 py-4 sm:py-6 animate-fade-in">
                <div className="animate-slide-up">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Pending Requests</h1>
                            <p className="text-muted-foreground">
                                Review and respond to connection requests
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/therapist/connections">
                                ← Back to Connections
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_pending}</div>
                            <p className="text-xs text-muted-foreground">
                                requests awaiting response
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Guardian Requests</CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.guardian_requests}</div>
                            <p className="text-xs text-muted-foreground">
                                direct connections
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Child Assignments</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.child_assignments}</div>
                            <p className="text-xs text-muted-foreground">
                                child care requests
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Requests List */}
                <Card className="animate-scale-in">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Connection Requests
                        </CardTitle>
                        <CardDescription>
                            Review each request carefully before making a decision
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {requests.length === 0 ? (
                            <div className="text-center py-12">
                                <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No pending requests</h3>
                                <p className="text-muted-foreground mb-6">
                                    You have no connection requests awaiting your response.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button asChild>
                                        <Link href="/therapist/connections">
                                            <Users className="h-4 w-4 mr-2" />
                                            View My Connections
                                        </Link>
                                    </Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/appointments/create">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            Schedule Session
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {requests.map((request) => (
                                    <Card key={request.id} className="border-l-4 border-l-yellow-400">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <span className="text-lg font-semibold text-blue-600">
                                                                {request.requester.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold">{request.requester.name}</h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                {request.requester.email}
                                                            </p>
                                                            {request.requester.phone && (
                                                                <p className="text-sm text-muted-foreground">
                                                                    📞 {request.requester.phone}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {getRequestTypeBadge(request)}
                                                    </div>

                                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                        <h4 className="font-medium mb-2">Request Details</h4>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            {getRequestDescription(request)}
                                                        </p>

                                                        {request.target_client && (
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                                <span className="text-sm">
                                                                    Child: {request.target_client.name}
                                                                    {request.target_client.age && ` (Age: ${request.target_client.age})`}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {request.message && (
                                                            <div className="mt-3 p-3 bg-white rounded border-l-4 border-l-blue-400">
                                                                <div className="flex items-start gap-2">
                                                                    <MessageCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                                                    <div>
                                                                        <p className="text-sm font-medium text-blue-900 mb-1">Message from Guardian:</p>
                                                                        <p className="text-sm text-gray-700 italic">"{request.message}"</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                        <span>
                                                            Requested on {new Date(request.created_at).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-col gap-3 ml-6">
                                                    <Button
                                                        onClick={() => handleRequestAction(request.id, 'approve')}
                                                        disabled={processingRequests.has(request.id)}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        <Check className="h-4 w-4 mr-2" />
                                                        {processingRequests.has(request.id) ? 'Processing...' : 'Approve'}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => handleRequestAction(request.id, 'decline')}
                                                        disabled={processingRequests.has(request.id)}
                                                        className="border-red-300 text-red-600 hover:bg-red-50"
                                                    >
                                                        <X className="h-4 w-4 mr-2" />
                                                        {processingRequests.has(request.id) ? 'Processing...' : 'Decline'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Professional Guidelines */}
                <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">⚠</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-amber-900 mb-2">Professional Guidelines</h4>
                                <ul className="text-sm text-amber-800 space-y-1">
                                    <li>• Review each request carefully and consider your current caseload capacity</li>
                                    <li>• Ensure you can provide appropriate care for the client's specific needs</li>
                                    <li>• Declining a request should be done professionally with consideration for the family's needs</li>
                                    <li>• All therapeutic relationships must comply with professional standards and regulations</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}