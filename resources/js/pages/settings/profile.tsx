import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { User, Phone, Mail, Shield, Save, Camera, CheckCircle, AlertCircle } from 'lucide-react';

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
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        user.avatar ? `/storage/${user.avatar}` : null
    );
    const [sendingVerification, setSendingVerification] = useState(false);
    const [sendingPhoneVerification, setSendingPhoneVerification] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [verifyingCode, setVerifyingCode] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm<ProfileData & { avatar?: File }>({
        name: user.name || '',
        email: user.email || '',
        country_code: user.country_code || '+256',
        phone_number: user.phone_number || '',
        phone_verified_at: user.phone_verified_at,
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const sendEmailVerification = () => {
        setSendingVerification(true);
        router.post('/email/verification-notification', {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: "Verification email sent",
                    description: "Please check your email for the verification link.",
                });
                setSendingVerification(false);
            },
            onError: () => {
                toast({
                    title: "Error",
                    description: "Failed to send verification email. Please try again.",
                    variant: "destructive",
                });
                setSendingVerification(false);
            },
        });
    };

    const sendPhoneVerification = () => {
        setSendingPhoneVerification(true);
        router.post('/settings/profile/send-phone-verification', {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast({ title: "Verification code sent", description: "Please check your phone for the 6-digit code." });
                setCodeSent(true);
                setSendingPhoneVerification(false);
            },
            onError: () => {
                toast({ title: "Error", description: "Failed to send verification code. Please try again.", variant: "destructive" });
                setSendingPhoneVerification(false);
            },
        });
    };

    const submitVerificationCode = () => {
        setVerifyingCode(true);
        router.post('/settings/profile/verify-phone', { verification_code: verificationCode }, {
            preserveScroll: true,
            onSuccess: () => {
                toast({ title: "Phone verified", description: "Your phone number has been verified successfully." });
                setCodeSent(false);
                setVerificationCode('');
                setVerifyingCode(false);
                router.reload({ only: ['auth'] });
            },
            onError: () => {
                toast({ title: "Invalid code", description: "The code you entered is incorrect or has expired.", variant: "destructive" });
                setVerifyingCode(false);
            },
        });
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        console.log('Submitting profile with data:', data);
        
        // Use POST with _method override for file uploads
        const formData = new FormData();
        formData.append('_method', 'POST');
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('country_code', data.country_code);
        formData.append('phone_number', data.phone_number);
        if (data.avatar) {
            formData.append('avatar', data.avatar);
        }
        
        router.post('/settings/profile', formData, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: (page) => {
                console.log('Profile update success:', page);
                toast({
                    title: "Profile updated",
                    description: "Your profile information has been updated successfully.",
                });
                // Reload to get updated user data with avatar
                router.reload({ only: ['auth'] });
            },
            onError: (errors) => {
                console.error('Profile update errors:', errors);
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
                    {/* Avatar Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Camera className="h-5 w-5" />
                                Profile Picture
                            </CardTitle>
                            <CardDescription>
                                Upload a profile picture to personalize your account.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-12 h-12 text-gray-400" />
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                    >
                                        <Camera className="w-4 h-4" />
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        JPG, PNG or GIF. Max size 2MB.
                                    </p>
                                    {errors.avatar && (
                                        <p className="text-sm text-red-600">{errors.avatar}</p>
                                    )}
                                    {data.avatar && (
                                        <Button
                                            type="button"
                                            onClick={handleSubmit}
                                            disabled={processing}
                                            size="sm"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {processing ? 'Saving...' : 'Save'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

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
                                                <CheckCircle className="h-4 w-4" />
                                                Email verified
                                            </p>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                                    <AlertCircle className="h-4 w-4" />
                                                    Email not verified
                                                </p>
                                                <Button
                                                    type="button"
                                                    variant="link"
                                                    size="sm"
                                                    onClick={sendEmailVerification}
                                                    disabled={sendingVerification}
                                                    className="h-auto p-0 text-blue-600"
                                                >
                                                    {sendingVerification ? 'Sending...' : 'Send verification email'}
                                                </Button>
                                            </div>
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
                                        <CheckCircle className="h-4 w-4" />
                                        Phone number verified
                                    </p>
                                ) : data.phone_number ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                Phone number not verified
                                            </p>
                                            <Button
                                                type="button"
                                                variant="link"
                                                size="sm"
                                                onClick={sendPhoneVerification}
                                                disabled={sendingPhoneVerification}
                                                className="h-auto p-0 text-blue-600"
                                            >
                                                {sendingPhoneVerification ? 'Sending...' : codeSent ? 'Resend code' : 'Send verification code'}
                                            </Button>
                                        </div>
                                        {codeSent && (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={6}
                                                    placeholder="Enter 6-digit code"
                                                    value={verificationCode}
                                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                                    className="w-40"
                                                />
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={submitVerificationCode}
                                                    disabled={verifyingCode || verificationCode.length !== 6}
                                                >
                                                    {verifyingCode ? 'Verifying...' : 'Verify'}
                                                </Button>
                                            </div>
                                        )}
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