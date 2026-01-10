import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferences {
    email_notifications: boolean;
    push_notifications: boolean;
    sound_enabled: boolean;
    appointment_notifications: boolean;
    message_notifications: boolean;
    panic_alert_notifications: boolean;
    content_notifications: boolean;
    system_notifications: boolean;
    quiet_hours_start: string | null;
    quiet_hours_end: string | null;
}

interface Props {
    preferences: NotificationPreferences;
}

export default function NotificationPreferences({ preferences }: Props) {
    const { toast } = useToast();
    const { data, setData, post, processing, errors } = useForm<NotificationPreferences>(preferences);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('settings.notification-preferences.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast({
                    title: 'Success',
                    description: 'Notification preferences updated successfully',
                });
            },
            onError: () => {
                toast({
                    title: 'Error',
                    description: 'Failed to update notification preferences',
                    variant: 'destructive',
                });
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Notification Preferences" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                                Manage how and when you receive notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* General Settings */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">General Settings</h3>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="email_notifications">Email Notifications</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receive notifications via email
                                            </p>
                                        </div>
                                        <Switch
                                            id="email_notifications"
                                            checked={data.email_notifications}
                                            onCheckedChange={(checked) => setData('email_notifications', checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="push_notifications">Push Notifications</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Receive browser push notifications
                                            </p>
                                        </div>
                                        <Switch
                                            id="push_notifications"
                                            checked={data.push_notifications}
                                            onCheckedChange={(checked) => setData('push_notifications', checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="sound_enabled">Notification Sounds</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Play sound when notifications arrive
                                            </p>
                                        </div>
                                        <Switch
                                            id="sound_enabled"
                                            checked={data.sound_enabled}
                                            onCheckedChange={(checked) => setData('sound_enabled', checked)}
                                        />
                                    </div>
                                </div>

                                {/* Notification Types */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Notification Types</h3>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="appointment_notifications">Appointments</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Notifications about appointments and reminders
                                            </p>
                                        </div>
                                        <Switch
                                            id="appointment_notifications"
                                            checked={data.appointment_notifications}
                                            onCheckedChange={(checked) => setData('appointment_notifications', checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="message_notifications">Messages</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Notifications about new messages
                                            </p>
                                        </div>
                                        <Switch
                                            id="message_notifications"
                                            checked={data.message_notifications}
                                            onCheckedChange={(checked) => setData('message_notifications', checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="panic_alert_notifications">Panic Alerts</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Critical notifications about panic alerts
                                            </p>
                                        </div>
                                        <Switch
                                            id="panic_alert_notifications"
                                            checked={data.panic_alert_notifications}
                                            onCheckedChange={(checked) => setData('panic_alert_notifications', checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="content_notifications">Content Updates</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Notifications about new articles and content
                                            </p>
                                        </div>
                                        <Switch
                                            id="content_notifications"
                                            checked={data.content_notifications}
                                            onCheckedChange={(checked) => setData('content_notifications', checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="system_notifications">System Notifications</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Important system announcements and updates
                                            </p>
                                        </div>
                                        <Switch
                                            id="system_notifications"
                                            checked={data.system_notifications}
                                            onCheckedChange={(checked) => setData('system_notifications', checked)}
                                        />
                                    </div>
                                </div>

                                {/* Quiet Hours */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">Quiet Hours</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Set times when you don't want to receive notifications
                                    </p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="quiet_hours_start">Start Time</Label>
                                            <Input
                                                id="quiet_hours_start"
                                                type="time"
                                                value={data.quiet_hours_start || ''}
                                                onChange={(e) => setData('quiet_hours_start', e.target.value || null)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="quiet_hours_end">End Time</Label>
                                            <Input
                                                id="quiet_hours_end"
                                                type="time"
                                                value={data.quiet_hours_end || ''}
                                                onChange={(e) => setData('quiet_hours_end', e.target.value || null)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Saving...' : 'Save Preferences'}
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
