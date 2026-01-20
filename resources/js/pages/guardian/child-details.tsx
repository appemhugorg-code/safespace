import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, User, Mail, Calendar, Shield, Edit, TrendingUp, Heart, MessageSquare } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import TherapistAssignment from '@/components/child/therapist-assignment';

interface Child {
    id: number;
    name: string;
    email: string;
    status: 'pending' | 'active' | 'suspended';
    created_at: string;
    guardian_id: number;
    roles: Array<{ name: string }>;
}

interface ConnectedTherapist {
    id: number;
    name: string;
    connection_id: number;
    assigned_at: string;
    specialization?: string;
}

interface PendingAssignment {
    id: number;
    therapist_name: string;
    created_at: string;
}

interface AvailableTherapist {
    id: number;
    name: string;
    email: string;
    specialization?: string;
    connection_id: number;
    assigned_at: string;
}

interface TherapistAssignmentData {
    connectedTherapists: ConnectedTherapist[];
    pendingAssignments: PendingAssignment[];
    availableTherapists: AvailableTherapist[];
}

interface Props {
    child: Child;
    therapistAssignment: TherapistAssignmentData;
}

export default function ChildDetails({ child, therapistAssignment }: Props) {
    const { props } = usePage();
    const { flash } = props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleAssignmentUpdate = () => {
        // Refresh the page data to show updated assignments
        router.reload({ only: ['therapistAssignment'] });
    };
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
            case 'active':
                return <Badge className="bg-green-100 text-green-800">Active</Badge>;
            case 'suspended':
                return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getStatusDescription = (status: string) => {
        switch (status) {
            case 'pending':
                return 'This account is waiting for admin approval. Your child will be able to access SafeSpace once approved by an administrator.';
            case 'active':
                return 'This account is active and your child can access all SafeSpace features.';
            case 'suspended':
                return 'This account has been suspended and your child cannot currently access SafeSpace.';
            default:
                return 'Account status unknown.';
        }
    };

    return (
        <AppLayout>
            <Head title={`${child.name} - Child Details`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/guardian/children">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Children
                        </Link>
                    </Button>
                    <div className="flex items-center gap-3">
                        <User className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold">{child.name}</h1>
                            <p className="text-muted-foreground">
                                Child Account Details
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Alert */}
                {child.status === 'pending' && (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-yellow-800">Account Pending Approval</h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        This account is waiting for admin approval. Your child will receive an email notification once their account is approved and they can start using SafeSpace.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {child.status === 'suspended' && (
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                                <div>
                                    <h3 className="font-medium text-red-800">Account Suspended</h3>
                                    <p className="text-sm text-red-700 mt-1">
                                        This account has been suspended. Please contact support if you believe this is an error.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Account Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Account Information
                                    </CardTitle>
                                    <Button size="sm" asChild>
                                        <Link href={`/guardian/children/${child.id}/edit`}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                        <p className="text-lg font-medium">{child.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                                        <p className="text-lg font-medium flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            {child.email}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                                        <div className="mt-1">
                                            {getStatusBadge(child.status)}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                                        <p className="text-lg font-medium flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(child.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                                    <div className="mt-1 flex gap-2">
                                        {child.roles.map((role) => (
                                            <Badge key={role.name} variant="outline">
                                                {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <label className="text-sm font-medium text-muted-foreground">Status Description</label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {getStatusDescription(child.status)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        {child.status === 'active' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Quick Actions</CardTitle>
                                    <CardDescription>
                                        Access your child's data and manage their account
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Button asChild className="h-auto p-4">
                                            <Link href={`/child/${child.id}/mood`}>
                                                <div className="flex items-center gap-3">
                                                    <Heart className="h-6 w-6 text-red-500" />
                                                    <div className="text-left">
                                                        <div className="font-medium">View Mood History</div>
                                                        <div className="text-sm opacity-80">Track emotional well-being</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </Button>

                                        <Button asChild variant="outline" className="h-auto p-4">
                                            <Link href={`/guardian/children/${child.id}/progress`}>
                                                <div className="flex items-center gap-3">
                                                    <TrendingUp className="h-6 w-6 text-blue-500" />
                                                    <div className="text-left">
                                                        <div className="font-medium">View Progress</div>
                                                        <div className="text-sm opacity-80">Overall activity overview</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Therapist Assignment Section */}
                        <TherapistAssignment
                            child={child}
                            connectedTherapists={therapistAssignment.connectedTherapists}
                            pendingAssignments={therapistAssignment.pendingAssignments}
                            availableTherapists={therapistAssignment.availableTherapists}
                            onAssignmentUpdate={handleAssignmentUpdate}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Account Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Account Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Account ID</span>
                                    <span className="font-mono text-sm">#{child.id}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Status</span>
                                    {getStatusBadge(child.status)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Created</span>
                                    <span className="text-sm">{new Date(child.created_at).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Support Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Need Help?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    If you have questions about your child's account or need assistance, please contact our support team.
                                </p>
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link href="/help">
                                        <MessageSquare className="h-4 w-4 mr-2" />
                                        Contact Support
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}