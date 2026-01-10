import { Head } from '@inertiajs/react';
import { HelpCircle, Mail, Phone, MessageCircle } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';

export default function Help() {
    return (
        <AppLayout>
            <Head title="Help & Support" />

            <div className="p-4 md:p-6 lg:p-8 space-y-6 max-w-full overflow-x-hidden">
                <div>
                    <h1 className="text-3xl font-bold">Help & Support</h1>
                    <p className="text-muted-foreground">
                        Get help with using SafeSpace and find answers to common questions
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* FAQ */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <HelpCircle className="h-5 w-5" />
                                Frequently Asked Questions
                            </CardTitle>
                            <CardDescription>
                                Common questions and answers
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">How do I track my child's mood?</h4>
                                <p className="text-sm text-muted-foreground">
                                    Children can log their daily mood using the mood tracker. Parents and therapists can view mood trends in the dashboard.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">How do I schedule an appointment?</h4>
                                <p className="text-sm text-muted-foreground">
                                    Go to the Appointments section and click "Request Appointment" to schedule a session with a therapist.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Is my data secure?</h4>
                                <p className="text-sm text-muted-foreground">
                                    Yes, all data is encrypted and we follow strict privacy guidelines to protect your information.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Support */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageCircle className="h-5 w-5" />
                                Contact Support
                            </CardTitle>
                            <CardDescription>
                                Need more help? Get in touch with our support team
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <Mail className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium">Email Support</p>
                                    <p className="text-sm text-muted-foreground">support@safespace.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                                <Phone className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-medium">Phone Support</p>
                                    <p className="text-sm text-muted-foreground">1-800-SAFESPACE</p>
                                </div>
                            </div>
                            <Button className="w-full">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Start Live Chat
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Emergency Notice */}
                <Card className="bg-red-50 border-red-200">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-sm">!</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-red-900 mb-1">Emergency Support</h4>
                                <p className="text-sm text-red-800 mb-3">
                                    If you or someone you know is in immediate danger or having thoughts of self-harm,
                                    please contact emergency services immediately or use the emergency button in the app.
                                </p>
                                <div className="space-y-2">
                                    <p className="text-sm text-red-800">
                                        <strong>Emergency Services:</strong> 911
                                    </p>
                                    <p className="text-sm text-red-800">
                                        <strong>Crisis Text Line:</strong> Text HOME to 741741
                                    </p>
                                    <p className="text-sm text-red-800">
                                        <strong>National Suicide Prevention Lifeline:</strong> 988
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
