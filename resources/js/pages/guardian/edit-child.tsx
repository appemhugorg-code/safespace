import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, User, Save, X } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

interface Child {
    id: number;
    name: string;
    email: string;
    status: 'pending' | 'active' | 'suspended';
    created_at: string;
    guardian_id: number;
    roles: Array<{ name: string }>;
}

interface Props {
    child: Child;
}

export default function EditChild({ child }: Props) {
    const { data, setData, patch, processing, errors, reset, isDirty } = useForm({
        name: child.name,
        email: child.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('guardian.children.update', child.id), {
            onSuccess: () => {
                toast.success('Child account updated successfully!', {
                    description: 'The changes have been saved.',
                });
            },
            onError: () => {
                toast.error('Failed to update child account', {
                    description: 'Please check the form for errors and try again.',
                });
            },
        });
    };

    const handleCancel = () => {
        if (isDirty) {
            if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                reset();
                window.history.back();
            }
        } else {
            window.history.back();
        }
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

    return (
        <AppLayout>
            <Head title={`Edit ${child.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex items-center gap-3">
                        <User className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold">Edit {child.name}</h1>
                            <p className="text-muted-foreground">
                                Update your child's account information
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status Information */}
                {child.status === 'pending' && (
                    <Card className="border-yellow-200 bg-yellow-50">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <h3 className="font-medium text-yellow-800">Account Pending Approval</h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        This account is waiting for admin approval. Changes will be saved but the account will remain pending until approved.
                                    </p>
                                </div>
                                {getStatusBadge(child.status)}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Edit Form */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                                <CardDescription>
                                    Update your child's basic account details. Changes will be saved immediately.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={errors.name ? 'border-red-500' : ''}
                                                placeholder="Enter your child's full name"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={errors.email ? 'border-red-500' : ''}
                                                placeholder="Enter your child's email address"
                                                required
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                                            )}
                                            <p className="text-sm text-muted-foreground mt-1">
                                                This email will be used for account notifications and login.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6 border-t">
                                        <Button type="submit" disabled={processing || !isDirty}>
                                            <Save className="h-4 w-4 mr-2" />
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={handleCancel}>
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Information */}
                    <div className="space-y-6">
                        {/* Current Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Current Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Account Status</span>
                                    {getStatusBadge(child.status)}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Account ID</span>
                                    <span className="font-mono text-sm">#{child.id}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Created</span>
                                    <span className="text-sm">{new Date(child.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Account Type</span>
                                    <div className="flex gap-1">
                                        {child.roles.map((role) => (
                                            <Badge key={role.name} variant="outline" className="text-xs">
                                                {role.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Important Notes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Important Notes</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="text-sm text-muted-foreground space-y-2">
                                    <p>
                                        • Changes to the email address will require your child to verify the new email before they can log in.
                                    </p>
                                    <p>
                                        • The account status can only be changed by administrators.
                                    </p>
                                    <p>
                                        • All changes are logged for security purposes.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link href={`/guardian/children/${child.id}`}>
                                        View Details
                                    </Link>
                                </Button>
                                {child.status === 'active' && (
                                    <>
                                        <Button variant="outline" size="sm" className="w-full" asChild>
                                            <Link href={`/child/${child.id}/mood`}>
                                                View Mood History
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" className="w-full" asChild>
                                            <Link href={`/guardian/children/${child.id}/progress`}>
                                                View Progress
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}