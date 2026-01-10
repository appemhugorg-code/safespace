import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Edit, User, Calendar, CheckCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { useEffect, useState } from 'react';

interface Article {
    id: number;
    title: string;
    body: string;
    excerpt: string;
    author: {
        id: number;
        name: string;
    };
    status: 'draft' | 'pending' | 'published' | 'archived';
    target_audience: 'children' | 'guardians' | 'both';
    published_at: string | null;
    created_at: string;
}

interface Props {
    article: Article;
    auth: {
        user: {
            id: number;
            roles: Array<{ name: string }>;
        };
    };
}

const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-red-100 text-red-800',
};

const audienceColors = {
    children: 'bg-blue-100 text-blue-800',
    guardians: 'bg-purple-100 text-purple-800',
    both: 'bg-indigo-100 text-indigo-800',
};

export default function ShowArticle({ article, auth }: Props) {
    const { flash } = usePage().props as any;
    const [showSuccess, setShowSuccess] = useState(false);

    const userRoles = auth.user.roles.map(role => role.name);
    const canEdit = userRoles.includes('admin') ||
        (userRoles.includes('therapist') && article.author.id === auth.user.id);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <AppLayout>
            <Head title={article.title} />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden">
                <div className="max-w-4xl mx-auto">
                    {showSuccess && flash?.success && (
                        <Alert className="mb-6 bg-green-50 border-green-200">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                                {flash.success}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div>
                        <Link href="/articles">
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Articles
                            </Button>
                        </Link>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-2">
                                    <Badge className={statusColors[article.status]}>
                                        {article.status}
                                    </Badge>
                                    <Badge className={audienceColors[article.target_audience]}>
                                        {article.target_audience}
                                    </Badge>
                                </div>
                                {canEdit && (
                                    <Link href={`/articles/${article.id}/edit`}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            <CardTitle className="text-3xl mb-4">
                                {article.title}
                            </CardTitle>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    <span>By {article.author.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        {article.published_at
                                            ? `Published ${new Date(article.published_at).toLocaleDateString()}`
                                            : `Created ${new Date(article.created_at).toLocaleDateString()}`
                                        }
                                    </span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {article.excerpt && (
                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                                    <p className="text-blue-800 font-medium">{article.excerpt}</p>
                                </div>
                            )}

                            <div className="prose prose-lg max-w-none">
                                <div
                                    className="text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: article.body }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
