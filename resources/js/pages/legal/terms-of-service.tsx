import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Heart } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function TermsOfService() {
    return (
        <AppLayout>
            <Head title="Terms of Service" />

            <div className="py-8 lg:py-12 px-4 lg:px-0">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 text-center lg:text-left">
                        <h1 className="text-display font-bold text-primary mb-2">Terms of Service</h1>
                        <p className="text-body text-muted-foreground">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <div className="space-y-8 lg:space-y-12">
                        {/* Introduction */}
                        <Card variant="elevated" spacing="spacious">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-sm text-heading">
                                    <Heart className="h-5 w-5 text-blue-600" />
                                    Welcome to SafeSpace
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none text-body">
                                <p>
                                    SafeSpace is a mental health platform designed to support children, families, and mental health professionals. 
                                    By using our services, you agree to these Terms of Service ("Terms"). Please read them carefully.
                                </p>
                                <p>
                                    These Terms apply to all users of SafeSpace, including children, guardians, therapists, and administrators. 
                                    If you are under 18, your parent or guardian must agree to these Terms on your behalf.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Service Description */}
                        <Card spacing="comfortable">
                            <CardHeader>
                                <CardTitle className="text-heading">1. Our Services</CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none text-body">
                                <p>SafeSpace provides:</p>
                                <ul>
                                    <li><strong>Mood Tracking:</strong> Tools for children to log and track their emotional wellbeing</li>
                                    <li><strong>Therapy Sessions:</strong> Platform for scheduling and conducting therapy appointments</li>
                                    <li><strong>Educational Content:</strong> Articles and interactive games focused on mental health</li>
                                    <li><strong>Communication Tools:</strong> Secure messaging between users, therapists, and guardians</li>
                                    <li><strong>Emergency Features:</strong> Panic alert system for immediate support</li>
                                    <li><strong>Progress Tracking:</strong> Analytics and insights for therapeutic progress</li>
                                </ul>
                                <p>
                                    Our services are designed to supplement, not replace, professional mental health care. 
                                    Always consult with qualified healthcare providers for medical advice.
                                </p>
                            </CardContent>
                        </Card>

                        {/* User Responsibilities */}
                        <Card spacing="comfortable">
                            <CardHeader>
                                <CardTitle className="text-heading">2. User Responsibilities</CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none text-body">
                                <h4>All Users Must:</h4>
                                <ul>
                                    <li>Provide accurate and truthful information</li>
                                    <li>Keep login credentials secure and confidential</li>
                                    <li>Use the platform respectfully and appropriately</li>
                                    <li>Report any safety concerns or inappropriate behavior</li>
                                    <li>Comply with all applicable laws and regulations</li>
                                </ul>

                                <h4>Guardians Must:</h4>
                                <ul>
                                    <li>Supervise their child's use of the platform</li>
                                    <li>Ensure their child understands how to use SafeSpace safely</li>
                                    <li>Monitor their child's interactions and progress</li>
                                    <li>Respond promptly to any alerts or notifications</li>
                                </ul>

                                <h4>Therapists Must:</h4>
                                <ul>
                                    <li>Maintain professional standards and ethics</li>
                                    <li>Keep all client information confidential</li>
                                    <li>Respond appropriately to emergency situations</li>
                                    <li>Maintain current professional licenses and certifications</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Privacy and Data Protection */}
                        <Card spacing="comfortable">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-sm text-heading">
                                    <Lock className="h-5 w-5 text-green-600" />
                                    3. Privacy and Data Protection
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none text-body">
                                <p>
                                    Your privacy is extremely important to us. We are committed to protecting your personal information 
                                    and maintaining the confidentiality of all therapeutic communications.
                                </p>
                                <ul>
                                    <li><strong>Data Security:</strong> All data is encrypted in transit and at rest</li>
                                    <li><strong>No Third-Party Sharing:</strong> We do not share your data with third parties for marketing or commercial purposes</li>
                                    <li><strong>HIPAA Compliance:</strong> We maintain HIPAA-compliant practices for all health information</li>
                                    <li><strong>Secure Communications:</strong> All messages and sessions are encrypted end-to-end</li>
                                    <li><strong>Data Retention:</strong> We retain data only as long as necessary for therapeutic purposes</li>
                                </ul>
                                <p>
                                    For detailed information about our privacy practices, please review our 
                                    <a href="/privacy-policy" className="text-blue-600 hover:underline"> Privacy Policy</a>.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Emergency Situations */}
                        <Card spacing="comfortable">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-sm text-heading">
                                    <Shield className="h-5 w-5 text-red-600" />
                                    4. Emergency Situations
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none text-body">
                                <p>
                                    SafeSpace includes emergency features designed to provide immediate support in crisis situations.
                                </p>
                                <ul>
                                    <li><strong>Panic Alerts:</strong> Immediately notify guardians and therapists</li>
                                    <li><strong>Crisis Response:</strong> We may contact emergency services if there is imminent danger</li>
                                    <li><strong>24/7 Support:</strong> Emergency contacts are available around the clock</li>
                                    <li><strong>Documentation:</strong> All emergency incidents are logged for safety purposes</li>
                                </ul>
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                                    <p className="text-red-800 font-medium text-body-sm">
                                        <strong>Important:</strong> If you are experiencing a mental health emergency, 
                                        please contact emergency services (911) or the National Suicide Prevention Lifeline (988) immediately.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Prohibited Activities */}
                        <Card spacing="comfortable">
                            <CardHeader>
                                <CardTitle className="text-heading">5. Prohibited Activities</CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none text-body">
                                <p>The following activities are strictly prohibited on SafeSpace:</p>
                                <ul>
                                    <li>Sharing personal contact information or attempting to meet offline</li>
                                    <li>Bullying, harassment, or inappropriate communication</li>
                                    <li>Sharing content that is harmful, offensive, or inappropriate for children</li>
                                    <li>Attempting to access other users' accounts or data</li>
                                    <li>Using the platform for any illegal activities</li>
                                    <li>Impersonating other users or providing false information</li>
                                    <li>Attempting to circumvent safety features or monitoring</li>
                                </ul>
                                <p>
                                    Violation of these terms may result in account suspension or termination, 
                                    and may be reported to appropriate authorities.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Limitation of Liability */}
                        <Card spacing="comfortable">
                            <CardHeader>
                                <CardTitle className="text-heading">6. Limitation of Liability</CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none text-body">
                                <p>
                                    SafeSpace is a platform that facilitates mental health support but does not provide direct medical treatment. 
                                    We make no warranties about the effectiveness of any therapeutic interventions conducted through our platform.
                                </p>
                                <ul>
                                    <li>We are not liable for the actions or advice of therapists using our platform</li>
                                    <li>We cannot guarantee the prevention of all mental health crises</li>
                                    <li>Users are responsible for seeking appropriate professional help when needed</li>
                                    <li>Technical issues or service interruptions may occur despite our best efforts</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Changes to Terms */}
                        <Card spacing="comfortable">
                            <CardHeader>
                                <CardTitle className="text-heading">7. Changes to These Terms</CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none text-body">
                                <p>
                                    We may update these Terms from time to time to reflect changes in our services or legal requirements. 
                                    We will notify users of significant changes through the platform or via email.
                                </p>
                                <p>
                                    Continued use of SafeSpace after changes are posted constitutes acceptance of the updated Terms.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card spacing="comfortable">
                            <CardHeader>
                                <CardTitle className="text-heading">8. Contact Us</CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none text-body">
                                <p>
                                    If you have questions about these Terms of Service, please contact us:
                                </p>
                                <ul>
                                    <li><strong>Email:</strong> legal@safespace.com</li>
                                    <li><strong>Support:</strong> Available through the platform help center</li>
                                    <li><strong>Emergency:</strong> Use the panic alert feature or contact 911</li>
                                </ul>
                                <p>
                                    By using SafeSpace, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}