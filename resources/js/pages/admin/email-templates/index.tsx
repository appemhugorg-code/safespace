import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Search, Edit, Eye, Trash2, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    body_html: string;
    body_text?: string;
    variables: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props {
    templates: {
        data: EmailTemplate[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    search?: string;
}

export default function EmailTemplatesIndex({ templates, search = '' }: Props) {
    const [searchQuery, setSearchQuery] = useState(search);
    const [loading, setLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        router.get('/admin/email-templates',
            { search: searchQuery },
            {
                preserveState: true,
                onFinish: () => setLoading(false)
            }
        );
    };

    const handleDelete = (template: EmailTemplate) => {
        if (confirm(`Are you sure you want to delete the "${template.name}" template?`)) {
            router.delete(`/admin/email-templates/${template.id}`, {
                onSuccess: () => {
                    // Template deleted successfully
                },
                onError: (errors) => {
                    alert(errors.message || 'Failed to delete template');
                }
            });
        }
    };

    const handleToggleActive = (template: EmailTemplate) => {
        router.patch(`/admin/email-templates/${template.id}`, {
            is_active: !template.is_active
        });
    };

    return (
        <AppLayout>
            <Head title="Email Templates" />

            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Email Templates</h1>
                        <p className="text-muted-foreground">
                            Manage email templates for notifications and communications
                        </p>
                    </div>
                    <Link href="/admin/email-templates/create">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create Template
                        </Button>
                    </Link>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Search Templates
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <Input
                                placeholder="Search by name or subject..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1"
                            />
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Searching...' : 'Search'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Templates List */}
                <div className="grid gap-4">
                    {templates.data.length === 0 ? (
                        <Card>
                            <CardContent className="p-6 text-center">
                                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No templates found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {search ? 'No templates match your search criteria.' : 'Get started by creating your first email template.'}
                                </p>
                                <Link href="/admin/email-templates/create">
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Template
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        templates.data.map((template) => (
                            <Card key={template.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-lg">{template.name}</CardTitle>
                                                <Badge
                                                    variant={template.is_active ? "default" : "secondary"}
                                                    className="cursor-pointer"
                                                    onClick={() => handleToggleActive(template)}
                                                >
                                                    {template.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>
                                            <CardDescription className="text-base">
                                                {template.subject}
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/email-templates/${template.id}/preview`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Preview
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/email-templates/${template.id}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(template)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm font-medium text-muted-foreground">Variables:</span>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {template.variables && template.variables.length > 0 ? (
                                                    template.variables.map((variable, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {`{${variable}}`}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">No variables</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Last updated: {new Date(template.updated_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {templates.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {((templates.current_page - 1) * templates.per_page) + 1} to{' '}
                            {Math.min(templates.current_page * templates.per_page, templates.total)} of{' '}
                            {templates.total} templates
                        </div>
                        <div className="flex items-center gap-2">
                            {templates.current_page > 1 && (
                                <Link
                                    href={`/admin/email-templates?page=${templates.current_page - 1}${search ? `&search=${search}` : ''}`}
                                >
                                    <Button variant="outline" size="sm">Previous</Button>
                                </Link>
                            )}
                            {templates.current_page < templates.last_page && (
                                <Link
                                    href={`/admin/email-templates?page=${templates.current_page + 1}${search ? `&search=${search}` : ''}`}
                                >
                                    <Button variant="outline" size="sm">Next</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}