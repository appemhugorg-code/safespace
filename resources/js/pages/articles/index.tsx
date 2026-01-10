import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Eye, BookmarkIcon, TrendingUp, BookOpen } from 'lucide-react';
import { useState } from 'react';

interface Article {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string | null;
    author: {
        name: string;
    };
    reading_time: number;
    view_count: number;
    published_at: string;
    categories: string[];
    tags: string[];
}

interface Props {
    articles: Article[];
    canCreate: boolean;
}

export default function ArticlesIndex({ articles, canCreate }: Props) {
    const [search, setSearch] = useState('');
    const [filteredArticles, setFilteredArticles] = useState(articles);

    const handleSearch = (value: string) => {
        setSearch(value);
        if (value.trim() === '') {
            setFilteredArticles(articles);
        } else {
            setFilteredArticles(
                articles.filter(
                    (article) =>
                        article.title.toLowerCase().includes(value.toLowerCase()) ||
                        article.excerpt.toLowerCase().includes(value.toLowerCase())
                )
            );
        }
    };

    return (
        <AppLayout>
            <Head title="Articles & Resources" />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden">
                <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Articles & Resources</h1>
                            <p className="text-muted-foreground">
                                Explore helpful articles and resources for mental health
                            </p>
                        </div>
                        {canCreate && (
                            <Button asChild>
                                <Link href={route('articles.create')}>Create Article</Link>
                            </Button>
                        )}
                </div>

                {/* Search */}
                <div>
                        <Input
                            type="search"
                            placeholder="Search articles..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="max-w-md"
                        />
                </div>

                {/* Articles Grid */}
                <div>
                    {filteredArticles.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">
                                    {search ? 'No articles found matching your search.' : 'No articles available yet.'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredArticles.map((article) => (
                                <Card key={article.id} className="flex flex-col">
                                    {article.featured_image && (
                                        <img
                                            src={article.featured_image}
                                            alt={article.title}
                                            className="h-48 w-full rounded-t-lg object-cover"
                                        />
                                    )}
                                    <CardHeader>
                                        <div className="mb-2 flex flex-wrap gap-2">
                                            {article.categories.map((category, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {category}
                                                </Badge>
                                            ))}
                                        </div>
                                        <CardTitle className="line-clamp-2">
                                            <Link
                                                href={route('articles.show', article.slug)}
                                                className="hover:underline"
                                            >
                                                {article.title}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription className="line-clamp-3">
                                            {article.excerpt}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="mt-auto">
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>By {article.author.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {article.reading_time} min
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Eye className="h-4 w-4" />
                                                    {article.view_count}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <Button asChild className="flex-1">
                                                <Link href={route('articles.show', article.slug)}>
                                                    Read Article
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="icon">
                                                <BookmarkIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
