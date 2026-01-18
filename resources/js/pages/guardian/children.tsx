import { Head, Link, router } from '@inertiajs/react';
import { Plus, User, Clock, CheckCircle, Pause } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

interface Child {
    id: number;
    name: string;
    email: string;
    status: 'pending' | 'active' | 'suspended';
    created_at: string;
    roles: Array<{ name: string }>;
}

interface Props {
    children: Child[];
}

export default function GuardianChildren({ children }: Props) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
            case 'active':
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
            case 'suspended':
                return <Badge className="bg-red-100 text-red-800"><Pause className="h-3 w-3 mr-1" />Suspended</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title="My Children" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Children</h1>
                        <p className="text-muted-foreground">
                            Manage your children's accounts and monitor their progress
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/guardian/children/create">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Child
                        </Link>
                    </Button>
                </div>

                {children.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <User className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No children added yet</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Create your first child account to get started with SafeSpace
                            </p>
                            <Button asChild>
                                <Link href="/guardian/children/create">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Child
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {children.map((child) => (
                            <Card key={child.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{child.name}</CardTitle>
                                        {getStatusBadge(child.status)}
                                    </div>
                                    <CardDescription>{child.email}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="text-sm text-muted-foreground">
                                            Added: {new Date(child.created_at).toLocaleDateString()}
                                        </div>

                                        {child.status === 'pending' && (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                                                <p className="text-sm text-yellow-800">
                                                    Account is pending admin approval. Your child will be able to access SafeSpace once approved.
                                                </p>
                                            </div>
                                        )}

                                        {child.status === 'active' && (
                                            <div className="space-y-2">
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
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="flex-1" asChild>
                                                <Link href={`/guardian/children/${child.id}`}>
                                                    View Details
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" className="flex-1" asChild>
                                                <Link href={`/guardian/children/${child.id}/edit`}>
                                                    Edit
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}