import { Head, useForm } from '@inertiajs/react';
import { Bell, Mail, Calendar, AlertTriangle, Megaphone, Check } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface EmailPreferences {
    appointment_reminders: boolean;
    message_notifications: boolean;
    content_updates: boolean;
    emergency_alerts: boolean;
    marketing_emails: boolean;
}

interface Props {
    preferences: EmailPreferences;
}

export default function EmailPreferences({ preferences }: Props) {
    const { toast } = useToast();

    const form = useForm<EmailPreferences>({
        appointment_reminders: preferences.appointment_reminders,
        message_notifications: preferences.message_notifications,
        content_updates: preferences.content_updates,
        emergency_alerts: preferences.emergency_alerts,
        marketing_emails: preferences.marketing_emails,
    });

    const handleSave = () => {
        form.put('/api/user/email-preferences', {
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Email preferences updated successfully',
                });
            },
            onError: () => {
                toast({
                    title: 'Error',
                    description: 'Failed to update email preferences',
                    variant: 'destructive',
                });
            },
        });
    };

    const preferenceItems = [
        {
            key: 'appointment_reminders' as keyof EmailPreferences,
            icon: Calendar,
            title: 'Appointment Reminders',
            description: 'Receive reminders 24 hours and 1 hour before your appointments',
            recommended: true,
        },
        {
            key: 'message_notifications' as keyof EmailPreferences,
            icon: Mail,
            title: 'Message Notifications',
            description: 'Get notified when you receive new messages',
            recommended: true,
        },
        {
            key: 'emergency_alerts' as keyof EmailPreferences,
            icon: AlertTriangle,
            title: 'Emergency Alerts',
            description: 'Critical notifications about panic alerts and emergencies',
            recommended: true,
            locked: true,
        },
        {
            key: 'content_updates' as keyof EmailPreferences,
            icon: Bell,
            title: 'Content Updates',
            description: 'Notifications about new articles and resources',
            recommended: false,
        },
        {
            key: 'marketing_emails' as keyof EmailPreferences,
            icon: Megaphone,
            title: 'Marketing & Updates',
            description: 'Platform updates, tips, and promotional content',
            recommended: false,
        },
    ];

    return (
        <AppLayout>
            <Head title="Email Preferences" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Email Preferences</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your email notification preferences
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Notification Settings</CardTitle>
                        <CardDescription>
                            Choose which email notifications you want to receive
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {preferenceItems.map((item, index) => (
                            <div key={item.key}>
                                {index > 0 && <Separator className="my-4" />}
                                <div className="flex items-start justify-between space-x-4">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className="mt-1">
                                            <item.icon className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-2">
                                                <Label htmlFor={item.key} className="text-base font-medium cursor-pointer">
                                                    {item.title}
                                                </Label>
                                                {item.recommended && (
                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                        Recommended
                                                    </span>
                                                )}
                                                {item.locked && (
                                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                                        Required
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        id={item.key}
                                        checked={form.data[item.key]}
                                        onCheckedChange={(checked) => form.setData(item.key, checked)}
                                        disabled={item.locked || form.processing}
                                    />
                                </div>
                            </div>
                        ))}

                        <Separator className="my-6" />

                        <div className="flex items-center justify-between pt-4">
                            <div className="text-sm text-muted-foreground">
                                {form.isDirty ? (
                                    <span className="text-orange-600 font-medium">You have unsaved changes</span>
                                ) : (
                                    <span className="flex items-center gap-1">
                                        <Check className="h-4 w-4 text-green-600" />
                                        All changes saved
                                    </span>
                                )}
                            </div>
                            <Button
                                onClick={handleSave}
                                disabled={!form.isDirty || form.processing}
                            >
                                {form.processing ? 'Saving...' : 'Save Preferences'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Email Frequency</CardTitle>
                        <CardDescription>
                            Control how often you receive emails
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Digest Mode</p>
                                    <p className="text-sm text-muted-foreground">
                                        Receive a daily summary instead of individual emails
                                    </p>
                                </div>
                                <span className="text-sm text-muted-foreground">Coming Soon</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive">Unsubscribe from All</CardTitle>
                        <CardDescription>
                            Stop receiving all non-critical emails (emergency alerts will still be sent)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive" size="sm">
                            Unsubscribe from All Emails
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
