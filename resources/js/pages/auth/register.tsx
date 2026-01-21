import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneInput } from '@/components/ui/phone-input';
import AuthLayout from '@/layouts/auth-layout';

interface FormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    country_code: string;
    phone_number: string;
    terms_accepted: boolean;
}

export default function Register() {
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [countryCode, setCountryCode] = useState<string>('+256');
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        country_code: '+256',
        phone_number: '',
        terms_accepted: false,
    });

    const isPhoneRequired = selectedRole === 'guardian' || selectedRole === 'therapist';

    const handleCountryCodeChange = (code: string) => {
        setCountryCode(code);
        setData('country_code', code);
    };

    const handlePhoneNumberChange = (phone: string) => {
        setPhoneNumber(phone);
        setData('phone_number', phone);
    };

    const handleRoleChange = (value: string) => {
        setSelectedRole(value);
        setData('role', value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/register', {
            onSuccess: () => {
                reset('password', 'password_confirmation');
            },
        });
    };
    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
        >
            <Head title="Register" />
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-lg animate-fade-in"
            >
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
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
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
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            className="touch-target"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-sm">
                        <PhoneInput
                            label="Phone Number"
                            countryCode={countryCode}
                            phoneNumber={phoneNumber}
                            onCountryCodeChange={handleCountryCodeChange}
                            onPhoneNumberChange={handlePhoneNumberChange}
                            required={isPhoneRequired}
                            error={errors.phone_number || errors.country_code}
                            placeholder="Enter your phone number"
                        />
                        {isPhoneRequired && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Phone number is required for {selectedRole === 'guardian' ? 'parents/guardians' : 'therapists'} for emergency contact purposes.
                            </p>
                        )}
                    </div>

                    <div className="grid gap-sm">
                        <Label htmlFor="password" className="text-body font-medium">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
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
                            tabIndex={5}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Confirm password"
                            className="touch-target"
                        />
                        <InputError
                            message={errors.password_confirmation}
                        />
                    </div>

                    <div className="grid gap-sm">
                        <Label htmlFor="role" className="text-body font-medium">I am a...</Label>
                        <Select 
                            value={data.role}
                            onValueChange={handleRoleChange}
                        >
                            <SelectTrigger tabIndex={6} className="touch-target">
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
                                checked={data.terms_accepted}
                                onCheckedChange={(checked) => setData('terms_accepted', !!checked)}
                                required
                                tabIndex={7}
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
                        tabIndex={8}
                        disabled={processing}
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
                    <TextLink href={login()} tabIndex={9} className="text-primary hover:underline font-medium">
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
