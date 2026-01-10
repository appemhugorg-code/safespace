import { Head, router } from '@inertiajs/react';
import { Shield, Phone, AlertTriangle, Heart } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

interface PanicAlert {
    id: number;
    triggered_at: string;
    status: 'active' | 'acknowledged' | 'resolved';
    resolved_at?: string;
    resolved_by?: {
        id: number;
        name: string;
    };
    location_data?: {
        latitude: number;
        longitude: number;
        accuracy: number;
    };
    notes?: string;
}

interface Props {
    panicActivated?: boolean;
    contactsNotified?: number;
    message?: string;
    panicAlerts?: PanicAlert[];
    latestAlert?: PanicAlert;
}

export default function Emergency({
    panicActivated: initialPanicActivated = false,
    contactsNotified = 0,
    message,
    panicAlerts = [],
    latestAlert
}: Props) {
    const [panicActivated, setPanicActivated] = useState(initialPanicActivated);
    const [isActivating, setIsActivating] = useState(false);

    const handlePanicButton = () => {
        if (panicActivated) return;

        setIsActivating(true);

        // Try to get location data
        const sendPanicAlert = (locationData = null) => {
            router.post('/emergency/panic', {
                location: locationData
            }, {
                onSuccess: () => {
                    setPanicActivated(true);
                    setIsActivating(false);
                },
                onError: () => {
                    setIsActivating(false);
                },
                onFinish: () => {
                    setIsActivating(false);
                }
            });
        };

        // Attempt to get geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    sendPanicAlert(locationData);
                },
                (error) => {
                    console.warn('Location access denied or failed:', error);
                    // Send alert without location data
                    sendPanicAlert();
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 60000
                }
            );
        } else {
            // Browser doesn't support geolocation
            sendPanicAlert();
        }
    };

    const emergencyNumbers = [
        { name: 'Emergency Services', number: '911', description: 'Police, Fire, Medical Emergency' },
        { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: '24/7 crisis support via text' },
        { name: 'National Suicide Prevention Lifeline', number: '988', description: '24/7 suicide prevention and crisis support' },
        { name: 'SAMHSA National Helpline', number: '1-800-662-4357', description: 'Mental health and substance abuse support' },
    ];

    return (
        <AppLayout>
            <Head title="Emergency Help" />

            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-600">Emergency Help</h1>
                    <p className="text-muted-foreground mt-2">
                        If you're in immediate danger or need urgent help
                    </p>
                </div>

                {/* Panic Button */}
                <Card className="border-red-200 bg-red-50">
                    <CardHeader className="text-center">
                        <CardTitle className="text-red-800 flex items-center justify-center gap-2">
                            <Shield className="h-6 w-6" />
                            Emergency Alert
                        </CardTitle>
                        <CardDescription className="text-red-700">
                            Press this button if you need immediate help from your support team
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        {panicActivated ? (
                            <div className="space-y-4">
                                <div className="text-6xl">✅</div>
                                <h3 className="text-xl font-bold text-green-800">Help is on the way!</h3>
                                <p className="text-green-700">
                                    {message || 'Your support team has been notified and will contact you soon.'}
                                </p>
                                {contactsNotified > 0 && (
                                    <p className="text-sm text-green-600">
                                        {contactsNotified} emergency contact{contactsNotified !== 1 ? 's' : ''} notified
                                    </p>
                                )}
                                <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                                    <p className="text-sm text-green-800">
                                        <strong>What happens next:</strong><br />
                                        • Your guardian and therapists have been alerted<br />
                                        • Someone will contact you within minutes<br />
                                        • Stay where you are and wait for help
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Button
                                    onClick={handlePanicButton}
                                    disabled={isActivating}
                                    className="w-32 h-32 rounded-full bg-red-600 hover:bg-red-700 text-white text-xl font-bold shadow-lg"
                                >
                                    {isActivating ? (
                                        <div className="animate-spin">⏳</div>
                                    ) : (
                                        <div>
                                            <Shield className="h-8 w-8 mb-2" />
                                            <div>HELP</div>
                                        </div>
                                    )}
                                </Button>
                                <p className="text-sm text-red-700">
                                    This will immediately alert your support team
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Emergency Numbers */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5" />
                            Emergency Contacts
                        </CardTitle>
                        <CardDescription>
                            Important phone numbers for immediate help
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4">
                            {emergencyNumbers.map((contact, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h4 className="font-semibold">{contact.name}</h4>
                                        <p className="text-sm text-muted-foreground">{contact.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-bold text-lg">{contact.number}</p>
                                        <Button size="sm" asChild>
                                            <a href={`tel:${contact.number.replace(/\D/g, '')}`}>
                                                Call Now
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Safety Resources */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-pink-500" />
                            You Are Not Alone
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">Remember:</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Your feelings are valid and important</li>
                                    <li>• There are people who care about you and want to help</li>
                                    <li>• It's okay to ask for help - it shows strength, not weakness</li>
                                    <li>• This difficult moment will pass</li>
                                    <li>• You have survived difficult times before</li>
                                </ul>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-semibold text-green-900 mb-2">Immediate Coping Strategies:</h4>
                                <ul className="text-sm text-green-800 space-y-1">
                                    <li>• Take slow, deep breaths (in for 4, hold for 4, out for 4)</li>
                                    <li>• Name 5 things you can see, 4 you can touch, 3 you can hear</li>
                                    <li>• Hold an ice cube or splash cold water on your face</li>
                                    <li>• Call or text someone you trust</li>
                                    <li>• Go to a safe, public place if you're not already there</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Panic Alert History for Children */}
                {panicAlerts.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-blue-500" />
                                Your Alert History
                            </CardTitle>
                            <CardDescription>
                                See when you asked for help and who responded
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {panicAlerts.slice(0, 5).map((alert) => (
                                    <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${alert.status === 'resolved' ? 'bg-green-500' :
                                                    alert.status === 'acknowledged' ? 'bg-yellow-500' : 'bg-red-500'
                                                }`} />
                                            <div>
                                                <p className="font-medium">
                                                    {new Date(alert.triggered_at).toLocaleDateString()} at{' '}
                                                    {new Date(alert.triggered_at).toLocaleTimeString()}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {alert.status === 'resolved' && alert.resolved_by
                                                        ? `Helped by ${alert.resolved_by.name}`
                                                        : alert.status === 'acknowledged'
                                                            ? 'Someone is helping you'
                                                            : 'Help is coming'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${alert.status === 'resolved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : alert.status === 'acknowledged'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                {alert.status === 'resolved' ? 'Resolved' :
                                                    alert.status === 'acknowledged' ? 'Acknowledged' : 'Active'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Warning */}
                <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-orange-900 mb-1">Important</h4>
                                <p className="text-sm text-orange-800">
                                    If you are in immediate physical danger, please call 911 or your local emergency services right away.
                                    SafeSpace is not a substitute for emergency medical or psychiatric care.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
