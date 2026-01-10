import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import RichTextEditor from '@/components/editor/rich-text-editor';

interface FormData {
    title: string;
    body: string;
    excerpt: string;
    target_audience: 'children' | 'guardians' | 'both';
    categories: string[];
    tags: string[];
    status: 'draft' | 'pending';
}

export default function CreateArticle() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: '',
        body: '',
        excerpt: '',
        target_audience: 'both',
        categories: [],
        tags: [],
        status: 'draft',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/articles');
    };

    return (
        <AppLayout>
            <Head title="Create Article" />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden">
                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Article</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className={errors.title ? 'border-red-500' : ''}
                                        placeholder="Enter article title"
                                    />
                                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                                    <Textarea
                                        id="excerpt"
                                        value={data.excerpt}
                                        onChange={(e) => setData('excerpt', e.target.value)}
                                        className={errors.excerpt ? 'border-red-500' : ''}
                                        placeholder="Brief summary of the article"
                                        rows={3}
                                    />
                                    {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="target_audience">Target Audience</Label>
                                    <Select value={data.target_audience} onValueChange={(value) => setData('target_audience', value as any)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select target audience" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="children">Children</SelectItem>
                                            <SelectItem value="guardians">Guardians</SelectItem>
                                            <SelectItem value="both">Both</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.target_audience && <p className="text-red-500 text-sm mt-1">{errors.target_audience}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="body">Content</Label>
                                    <RichTextEditor
                                        content={data.body}
                                        onChange={(content) => setData('body', content)}
                                        placeholder="Write your article content here... Use the toolbar to format text, add images, and more."
                                        className={errors.body ? 'border-red-500' : ''}
                                    />
                                    {errors.body && <p className="text-red-500 text-sm mt-1">{errors.body}</p>}
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setData('status', 'draft');
                                            post('/articles');
                                        }}
                                        disabled={processing}
                                    >
                                        Save as Draft
                                    </Button>
                                    <Button
                                        type="submit"
                                        onClick={() => setData('status', 'pending')}
                                        disabled={processing}
                                    >
                                        Submit for Review
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
