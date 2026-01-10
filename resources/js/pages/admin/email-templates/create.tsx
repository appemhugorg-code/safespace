import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Save, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';

interface Props {
    template?: {
        id: number;
        name: string;
        subject: string;
        body_html: string;
        body_text?: string;
        variables: string[];
        is_active: boolean;
    };
}

export default function CreateEmailTemplate({ template }: Props) {
    const isEditing = !!template;
    const [formData, setFormData] = useState({
        name: template?.name || '',
        subject: template?.subject || '',
        body_html: template?.body_html || '',
        body_text: template?.body_text || '',
        variables: template?.variables?.join(', ') || '',
        is_active: template?.is_active ?? true,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    const commonVariables = [
        'user_name', 'platform_url', 'verification_url', 'reset_url',
        'appointment_date', 'appointment_time', 'therapist_name', 'client_name',
        'duration', 'meet_link', 'child_name', 'alert_time', 'alert_message',
        'alert_url', 'sender_name', 'message_preview', 'conversation_url',
        'article_title', 'author_name', 'article_excerpt', 'article_url'
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});

        const data = {
            ...formData,
            variables: formData.variables.split(',').map(v => v.trim()).filter(v => v),
        };

        const url = isEditing ? `/admin/email-templates/${template.id}` : '/admin/email-templates';
        const method = isEditing ? 'put' : 'post';

        router[method](url, data, {
            onSuccess: () => {
                router.visit('/admin/email-templates');
            },
            onError: (errors) => {
                setErrors(errors);
                setSaving(false);
            },
            onFinish: () => setSaving(false),
        });
    };

    const handlePreview = () => {
        if (isEditing) {
            window.open(`/admin/email-templates/${template.id}/preview`, '_blank');
        } else {
            // For new templates, we could implement a client-side preview
            alert('Save the template first to preview it');
        }
    };

    const insertVariable = (variable: string) => {
        const textarea = document.getElementById('body_html') as HTMLTextAreaElement;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const before = text.substring(0, start);
            const after = text.substring(end, text.length);
            const newText = before + `{${variable}}` + after;

            setFormData({ ...formData, body_html: newText });

            // Set cursor position after inserted variable
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + variable.length + 2, start + variable.length + 2);
            }, 0);
        }
    };

    return (
        <AppLayout>
            <Head title={isEditing ? 'Edit Email Template' : 'Create Email Template'} />

            <div className="container mx-auto p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => router.visit('/admin/email-templates')}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Templates
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">
                            {isEditing ? 'Edit Email Template' : 'Create Email Template'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEditing ? 'Update the email template' : 'Create a new email template for notifications'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Template Details</CardTitle>
                                    <CardDescription>
                                        Basic information about the email template
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Template Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g., welcome_email"
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-destructive">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Email Subject</Label>
                                        <Input
                                            id="subject"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            placeholder="e.g., Welcome to SafeSpace"
                                            required
                                        />
                                        {errors.subject && (
                                            <p className="text-sm text-destructive">{errors.subject}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="variables">Template Variables</Label>
                                        <Input
                                            id="variables"
                                            value={formData.variables}
                                            onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
                                            placeholder="user_name, platform_url, verification_url"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Comma-separated list of variables that can be used in this template
                                        </p>
                                        {errors.variables && (
                                            <p className="text-sm text-destructive">{errors.variables}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Email Content</CardTitle>
                                    <CardDescription>
                                        HTML and text content for the email
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="body_html">HTML Content</Label>
                                        <Textarea
                                            id="body_html"
                                            value={formData.body_html}
                                            onChange={(e) => setFormData({ ...formData, body_html: e.target.value })}
                                            placeholder="Enter HTML content for the email..."
                                            rows={15}
                                            className="font-mono text-sm"
                                            required
                                        />
                                        {errors.body_html && (
                                            <p className="text-sm text-destructive">{errors.body_html}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="body_text">Text Content (Optional)</Label>
                                        <Textarea
                                            id="body_text"
                                            value={formData.body_text}
                                            onChange={(e) => setFormData({ ...formData, body_text: e.target.value })}
                                            placeholder="Enter plain text version of the email..."
                                            rows={8}
                                            className="font-mono text-sm"
                                        />
                                        {errors.body_text && (
                                            <p className="text-sm text-destructive">{errors.body_text}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button type="submit" disabled={saving} className="w-full">
                                        <Save className="h-4 w-4 mr-2" />
                                        {saving ? 'Saving...' : (isEditing ? 'Update Template' : 'Create Template')}
                                    </Button>

                                    {isEditing && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handlePreview}
                                            className="w-full"
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Preview Template
                                        </Button>
                                    )}

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="rounded"
                                        />
                                        <Label htmlFor="is_active" className="text-sm">
                                            Template is active
                                        </Label>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Available Variables</CardTitle>
                                    <CardDescription>
                                        Click to insert into template
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {commonVariables.map((variable) => (
                                            <Badge
                                                key={variable}
                                                variant="outline"
                                                className="cursor-pointer hover:bg-muted mr-1 mb-1"
                                                onClick={() => insertVariable(variable)}
                                            >
                                                {`{${variable}}`}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Template Guidelines</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm space-y-2">
                                    <p>• Use variables in curly braces: <code>{`{user_name}`}</code></p>
                                    <p>• Keep HTML simple and email-client compatible</p>
                                    <p>• Always provide a text version for accessibility</p>
                                    <p>• Test templates before activating them</p>
                                    <p>• Use SafeSpace branding colors: #2563eb (blue)</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
