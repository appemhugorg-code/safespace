import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { User, Phone, Mail, Shield, Save } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import InputError from '@/components/input-error';
import { toast } from '@/hooks/use-toast';

interface ProfileData {
    name: string;
    email: string;
    country_code: string;
    phone_number: string;
    phone_verified_at: string | null;
}

export default function Profile() {
    const { auth } = usePage().props as any;
    const user = auth.user;

    const [countryCode, setCountryCode] = useState(user.country_code || '+256');
    const [phoneNumber, setPhoneNumber] = useState(user.phone_number || '');

    const { data, setData, patch, processing, errors, reset } = useForm<ProfileData>({
        name: user.name || '',
        email: user.email || '',
        country_code: user.country_code || '+256',
        phone_number: user.phone_number || '',
        phone_verified_at: user.phone_verified_at,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        patch(route('profile.update'), {
            onSuccess: () => {
                toast({
                    title: "Profile updated",
                    description: "Your profile information has been updated successfully.",
                });
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "There was an error updating your profile. Please try again.",
                    variant: "destructive",
                });
            },
        });
    };

    const isPhoneRequired = user.roles?.some((role: any) => 
        ['therapist', 'guardian'].includes(role.name)
    );

    return (
        <AppLayout>
            <Head title="Profile Settings" />
            
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage your account information and contact details.
                    </p>
                </div>

                <div className="grid gap-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Basic Information
                            </CardTitle>
                            <CardDescription>
                                Update your name and email address.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                            className="touch-target"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                                className="pl-10 touch-target"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                        {user.email_verified_at ? (
                                            <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                                <Shield className="h-3 w-3" />
                                                Email verified
                                            </p>
                                        ) : (
                                            <p className="text-sm text-amber-600 dark:text-amber-400">
                                                Email not verified
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <Button type="submit" disabled={processing} className="w-full md:w-auto">
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Phone Number */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                Phone Number
                            </CardTitle>
                            <CardDescription>
                                {isPhoneRequired 
                                    ? 'Phone number is required for your account type for emergency contact purposes.'
                                    : 'Add a phone number for account security and notifications.'
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <PhoneInput
                                    countryCode={countryCode}
                                    phoneNumber={phoneNumber}
                                    onCountryCodeChange={(code) => {
                                        setCountryCode(code);
                                        setData('country_code', code);
                                    }}
                                    onPhoneNumberChange={(phone) => {
                                        setPhoneNumber(phone);
                                        setData('phone_number', phone);
                                    }}
                                    required={isPhoneRequired}
                                    error={errors.phone_number || errors.country_code}
                                    placeholder="Enter your phone number"
                                />

                                {data.phone_verified_at ? (
                                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                                        <Shield className="h-3 w-3" />
                                        Phone number verified
                                    </p>
                                ) : data.phone_number ? (
                                    <div className="space-y-2">
                                        <p className="text-sm text-amber-600 dark:text-amber-400">
                                            Phone number not verified
                                        </p>
                                        <Button type="button" variant="outline" size="sm">
                                            Send Verification Code
                                        </Button>
                                    </div>
                                ) : null}

                                <Button type="submit" disabled={processing} className="w-full md:w-auto">
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Saving...' : 'Save Phone Number'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Account Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Status</CardTitle>
                            <CardDescription>
                                Your current account status and role information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Account Status
                                    </Label>
                                    <p className="text-sm font-medium capitalize">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            user.status === 'active' 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                : user.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Account Type
                                    </Label>
                                    <p className="text-sm font-medium capitalize">
                                        {user.roles?.map((role: any) => role.name).join(', ') || 'No role assigned'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}