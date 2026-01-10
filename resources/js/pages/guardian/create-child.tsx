import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';

export default function CreateChild() {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        age: '',
        terms_accepted: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/guardian/children', data, {
            onSuccess: () => {
                // Redirect will be handled by the controller
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Add Child Account" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/guardian/children">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Children
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Add Child Account</h1>
                        <p className="text-muted-foreground">
                            Create a SafeSpace account for your child
                        </p>
                    </div>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Child Account Information</CardTitle>
                        <CardDescription>
                            Please provide your child's information to create their SafeSpace account.
                            The account will need admin approval before your child can access the platform.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Child's Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData({ ...data, name: e.target.value })}
                                        placeholder="Enter your child's full name"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData({ ...data, email: e.target.value })}
                                        placeholder="child@example.com"
                                    />
                                    <InputError message={errors.email} />
                                    <p className="text-sm text-muted-foreground">
                                        This will be used for your child to log in to SafeSpace
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        min="5"
                                        max="18"
                                        required
                                        value={data.age}
                                        onChange={(e) => setData({ ...data, age: e.target.value })}
                                        placeholder="Enter your child's age"
                                    />
                                    <InputError message={errors.age} />
                                    <p className="text-sm text-muted-foreground">
                                        SafeSpace is designed for children ages 5-18
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={data.password}
                                        onChange={(e) => setData({ ...data, password: e.target.value })}
                                        placeholder="Create a secure password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        value={data.password_confirmation}
                                        onChange={(e) => setData({ ...data, password_confirmation: e.target.value })}
                                        placeholder="Confirm the password"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-start space-x-2">
                                        <input
                                            type="checkbox"
                                            id="terms_accepted"
                                            checked={data.terms_accepted}
                                            onChange={(e) => setData({ ...data, terms_accepted: e.target.checked })}
                                            required
                                            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <Label htmlFor="terms_accepted" className="text-sm leading-5">
                                            I agree to the{' '}
                                            <Link href="/terms-of-service" target="_blank" className="text-blue-600 hover:underline">
                                                Terms of Service
                                            </Link>
                                            {' '}and{' '}
                                            <Link href="/privacy-policy" target="_blank" className="text-blue-600 hover:underline">
                                                Privacy Policy
                                            </Link>
                                            {' '}on behalf of my child
                                        </Label>
                                    </div>
                                    <InputError message={errors.terms_accepted} />
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">Important Information</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• The child account will be pending admin approval</li>
                                    <li>• You'll receive a notification when the account is approved</li>
                                    <li>• Your child will be able to track their mood and communicate with therapists</li>
                                    <li>• You'll have access to view your child's progress and mood history</li>
                                </ul>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing} className="flex-1">
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    Create Child Account
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/guardian/children">Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
