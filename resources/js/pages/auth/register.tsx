import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-lg animate-fade-in"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-lg">
                            <div className="grid gap-sm">
                                <Label htmlFor="name" className="text-body font-medium">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                    className="touch-target"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-1"
                                />
                            </div>

                            <div className="grid gap-sm">
                                <Label htmlFor="email" className="text-body font-medium">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className="touch-target"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-sm">
                                <Label htmlFor="password" className="text-body font-medium">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                    className="touch-target"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-sm">
                                <Label htmlFor="password_confirmation" className="text-body font-medium">
                                    Confirm password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    className="touch-target"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <div className="grid gap-sm">
                                <Label htmlFor="role" className="text-body font-medium">I am a...</Label>
                                <Select name="role" required>
                                    <SelectTrigger tabIndex={5} className="touch-target">
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="guardian">Parent/Guardian</SelectItem>
                                        <SelectItem value="therapist">Therapist</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.role} />
                            </div>

                            <div className="grid gap-sm">
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        id="terms_accepted"
                                        name="terms_accepted"
                                        required
                                        tabIndex={6}
                                        className="mt-0.5"
                                    />
                                    <Label htmlFor="terms_accepted" className="text-sm leading-relaxed">
                                        I agree to the{' '}
                                        <TextLink href="/terms-of-service" target="_blank" className="text-primary hover:underline font-medium">
                                            Terms of Service
                                        </TextLink>
                                        {' '}and{' '}
                                        <TextLink href="/privacy-policy" target="_blank" className="text-primary hover:underline font-medium">
                                            Privacy Policy
                                        </TextLink>
                                    </Label>
                                </div>
                                <InputError message={errors.terms_accepted} />
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="mt-lg w-full"
                                tabIndex={7}
                                data-test="register-user-button"
                            >
                                {processing && (
                                    <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                                )}
                                Create account
                            </Button>
                        </div>

                        <div className="text-center text-body-sm text-muted-foreground">
                            Already have an account?{' '}
                            <TextLink href={login()} tabIndex={8} className="text-primary hover:underline font-medium">
                                Log in
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
