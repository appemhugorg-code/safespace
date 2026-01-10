import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Search, BookmarkIcon, Clock, Eye, Filter, Star, TrendingUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string | null;
    status: 'draft' | 'pending' | 'published' | 'archived';
    author?: {
        name: string;
    };
    reading_time?: number;
    view_count?: number;
    published_at: string;
    created_at: string;
    categories: string[];
    tags: string[];
    is_bookmarked?: boolean;
}

interface Props {
    articles: Article[];
    featuredArticles: Article[];
    popularArticles: Article[];
    recentArticles: Article[];
    categories: string[];
    canCreate: boolean;
    isAdmin: boolean;
    pendingCount: number;
}

export default function ArticlesIndex({
    articles,
    featuredArticles = [],
    popularArticles = [],
    recentArticles = [],
    categories = [],
    canCreate,
    isAdmin = false,
    pendingCount = 0
}: Props) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    const rejectForm = useForm({
        reason: '',
    });

    const filteredArticles = articles.filter(article => {
        const matchesSearch = search === '' ||
            article.title.toLowerCase().includes(search.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(search.toLowerCase());

        const matchesCategory = selectedCategory === 'all' ||
            article.categories.includes(selectedCategory);

        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        if (sortBy === 'popular') {
            return b.view_count - a.view_count;
        }
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

    const handleBookmark = (articleId: number) => {
        router.post(`/api/user/bookmarks/${articleId}`, {}, {
            preserveScroll: true,
        });
    };

    const handleApprove = (article: Article) => {
        if (confirm(`Approve and publish "${article.title}"?`)) {
            router.post(`/articles/${article.slug}/publish`, {}, {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload();
                }
            });
        }
    };

    const handleReject = (article: Article) => {
        setSelectedArticle(article);
        setRejectDialogOpen(true);
    };

    const submitRejection = () => {
        if (!selectedArticle) return;

        rejectForm.post(`/articles/${selectedArticle.slug}/reject`, {
            preserveScroll: true,
            onSuccess: () => {
                setRejectDialogOpen(false);
                rejectForm.reset();
                setSelectedArticle(null);
                router.reload();
            }
        });
    };

    const handleArchive = (article: Article) => {
        if (confirm(`Archive "${article.title}"?`)) {
            router.post(`/articles/${article.slug}/archive`, {}, {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload();
                }
            });
        }
    };

    const statusColors = {
        draft: 'bg-gray-100 text-gray-800',
        pending: 'bg-yellow-100 text-yellow-800',
        published: 'bg-green-100 text-green-800',
        archived: 'bg-red-100 text-red-800',
    };

    const ArticleCard = ({ article }: { article: Article }) => (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            {article.featured_image && (
                <div className="aspect-video w-full overflow-hidden bg-muted">
                    <img
                        src={article.featured_image}
                        alt={article.title}
                        className="h-full w-full object-cover"
                    />
                </div>
            )}
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className={statusColors[article.status]}>
                                {article.status}
                            </Badge>
                        </div>
                        <CardTitle className="line-clamp-2 hover:text-primary">
                            <Link href={`/articles/${article.slug}`}>
                                {article.title}
                            </Link>
                        </CardTitle>
                        <CardDescription className="mt-2 line-clamp-2">
                            {article.excerpt}
                        </CardDescription>
                    </div>
                    {!isAdmin && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleBookmark(article.id)}
                        >
                            <BookmarkIcon
                                className={`h-4 w-4 ${article.is_bookmarked ? 'fill-current' : ''}`}
                            />
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                    {article.categories.slice(0, 2).map(category => (
                        <Badge key={category} variant="secondary">
                            {category}
                        </Badge>
                    ))}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span>By {article.author?.name || 'Unknown'}</span>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.reading_time || 0} min
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.view_count || 0}
                        </span>
                    </div>
                </div>

                {/* Admin Actions */}
                {isAdmin && article.status === 'pending' && (
                    <div className="flex gap-2 pt-3 border-t">
                        <Button
                            size="sm"
                            variant="default"
                            className="flex-1"
                            onClick={() => handleApprove(article)}
                        >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleReject(article)}
                        >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                        </Button>
                    </div>
                )}

                {isAdmin && article.status === 'published' && (
                    <div className="pt-3 border-t">
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => handleArchive(article)}
                        >
                            Archive
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <AppLayout>
            <Head title="Articles & Resources" />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden">
                {/* Pending Articles Alert for Admin */}
                {isAdmin && pendingCount > 0 && (
                    <Alert className="bg-yellow-50 border-yellow-200">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800">
                            You have <strong>{pendingCount}</strong> article{pendingCount !== 1 ? 's' : ''} pending review.
                            Scroll down to review and approve/reject them.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Articles & Resources</h1>
                        <p className="text-muted-foreground mt-1">
                            {isAdmin
                                ? 'Review and manage articles submitted by therapists'
                                : 'Explore helpful articles and resources for mental health'
                            }
                        </p>
                    </div>
                    {canCreate && (
                        <Button asChild>
                            <Link href="/articles/create">Create Article</Link>
                        </Button>
                    )}
                </div>

                {/* Featured Articles */}
                {featuredArticles.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                <CardTitle>Featured Articles</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {featuredArticles.slice(0, 3).map(article => (
                                    <ArticleCard key={article.id} article={article} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Search and Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search articles..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-[180px]">
                                        <Filter className="mr-2 h-4 w-4" />
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map(category => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="recent">Most Recent</SelectItem>
                                        <SelectItem value="popular">Most Popular</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs for different views */}
                <Tabs defaultValue="all" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="all">All Articles</TabsTrigger>
                        <TabsTrigger value="popular">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Popular
                        </TabsTrigger>
                        <TabsTrigger value="recent">Recent</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4">
                        {filteredArticles.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <p className="text-muted-foreground">
                                        No articles found. Try adjusting your search or filters.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredArticles.map(article => (
                                    <ArticleCard key={article.id} article={article} />
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="popular" className="space-y-4">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {popularArticles.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="recent" className="space-y-4">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {recentArticles.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Rejection Dialog */}
            <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Article</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejecting "{selectedArticle?.title}".
                            This will help the author improve their content.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Rejection Reason</Label>
                            <Textarea
                                id="reason"
                                placeholder="Explain why this article is being rejected..."
                                value={rejectForm.data.reason}
                                onChange={(e) => rejectForm.setData('reason', e.target.value)}
                                rows={4}
                                className={rejectForm.errors.reason ? 'border-red-500' : ''}
                            />
                            {rejectForm.errors.reason && (
                                <p className="text-red-500 text-sm">{rejectForm.errors.reason}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setRejectDialogOpen(false);
                                rejectForm.reset();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={submitRejection}
                            disabled={rejectForm.processing || !rejectForm.data.reason}
                        >
                            Reject Article
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
