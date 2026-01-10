import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, Users, AlertTriangle } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function PrivacyPolicy() {
    return (
        <AppLayout>
            <Head title="Privacy Policy" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
                        <p className="text-gray-600">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Introduction */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-blue-600" />
                                    Our Commitment to Your Privacy
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none">
                                <p>
                                    At SafeSpace, protecting your privacy and the confidentiality of your personal information 
                                    is our highest priority. This Privacy Policy explains how we collect, use, protect, and 
                                    share information when you use our mental health platform.
                                </p>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                                    <p className="text-blue-800 font-medium">
                                        <strong>Key Promise:</strong> We do not share your personal data with third parties 
                                        for marketing, advertising, or commercial purposes. Your therapeutic information 
                                        remains confidential and secure.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Information We Collect */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="h-5 w-5 text-green-600" />
                                    1. Information We Collect
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none">
                                <h4>Personal Information:</h4>
                                <ul>
                                    <li><strong>Account Information:</strong> Name, email address, age, role (child, guardian, therapist)</li>
                                    <li><strong>Profile Data:</strong> User preferences, settings, and profile information</li>
                                    <li><strong>Contact Information:</strong> Emergency contacts and communication preferences</li>
                                </ul>

                                <h4>Health and Therapeutic Information:</h4>
                                <ul>
                                    <li><strong>Mood Data:</strong> Daily mood logs, emotional tracking, and wellbeing metrics</li>
                                    <li><strong>Session Notes:</strong> Therapy session records and progress notes (therapist-generated)</li>
                                    <li><strong>Communication Records:</strong> Messages between users, therapists, and guardians</li>
                                    <li><strong>Emergency Data:</strong> Panic alert triggers and crisis intervention records</li>
                                </ul>

                                <h4>Usage Information:</h4>
                                <ul>
                                    <li><strong>Platform Activity:</strong> Login times, feature usage, and engagement patterns</li>
                                    <li><strong>Content Interaction:</strong> Articles read, games played, and completion rates</li>
                                    <li><strong>Technical Data:</strong> Device information, IP addresses, and browser details</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* How We Use Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>2. How We Use Your Information</CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none">
                                <h4>Therapeutic Purposes:</h4>
                                <ul>
                                    <li>Facilitate therapy sessions and mental health support</li>
                                    <li>Track therapeutic progress and outcomes</li>
                                    <li>Provide personalized content and recommendations</li>
                                    <li>Enable communication between clients, therapists, and guardians</li>
                                </ul>

                                <h4>Safety and Emergency Response:</h4>
                                <ul>
                                    <li>Respond to panic alerts and crisis situations</li>
                                    <li>Monitor for safety concerns and inappropriate behavior</li>
                                    <li>Contact emergency services when necessary</li>
                                    <li>Maintain records for safety and legal compliance</li>
                                </ul>

                                <h4>Platform Improvement:</h4>
                                <ul>
                                    <li>Analyze usage patterns to improve our services</li>
                                    <li>Develop new features and therapeutic tools</li>
                                    <li>Ensure platform security and prevent abuse</li>
                                    <li>Provide technical support and troubleshooting</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Data Security */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-red-600" />
                                    3. Data Security and Protection
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none">
                                <p>
                                    We implement industry-leading security measures to protect your information:
                                </p>

                                <h4>Encryption:</h4>
                                <ul>
                                    <li><strong>Data in Transit:</strong> All communications use TLS/SSL encryption</li>
                                    <li><strong>Data at Rest:</strong> All stored data is encrypted using AES-256 encryption</li>
                                    <li><strong>End-to-End:</strong> Therapy sessions and sensitive communications are end-to-end encrypted</li>
                                </ul>

                                <h4>Access Controls:</h4>
                                <ul>
                                    <li><strong>Role-Based Access:</strong> Users can only access information appropriate to their role</li>
                                    <li><strong>Multi-Factor Authentication:</strong> Additional security layers for sensitive accounts</li>
                                    <li><strong>Regular Audits:</strong> Continuous monitoring and security assessments</li>
                                </ul>

                                <h4>Infrastructure Security:</h4>
                                <ul>
                                    <li><strong>Secure Hosting:</strong> Data hosted on HIPAA-compliant cloud infrastructure</li>
                                    <li><strong>Regular Backups:</strong> Encrypted backups with secure recovery procedures</li>
                                    <li><strong>Incident Response:</strong> 24/7 monitoring and rapid response to security threats</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Information Sharing */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-purple-600" />
                                    4. Information Sharing and Disclosure
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                    <p className="text-green-800 font-medium">
                                        <strong>No Third-Party Sharing:</strong> We do not sell, rent, or share your personal 
                                        information with third parties for marketing, advertising, or commercial purposes.
                                    </p>
                                </div>

                                <h4>Limited Sharing for Therapeutic Purposes:</h4>
                                <ul>
                                    <li><strong>Care Team:</strong> Information shared between assigned therapists and guardians</li>
                                    <li><strong>Emergency Contacts:</strong> Shared with designated emergency contacts during crises</li>
                                    <li><strong>Healthcare Providers:</strong> With explicit consent, shared with other healthcare providers</li>
                                </ul>

                                <h4>Legal Requirements:</h4>
                                <ul>
                                    <li><strong>Court Orders:</strong> When required by valid legal process</li>
                                    <li><strong>Safety Concerns:</strong> To prevent imminent harm to the user or others</li>
                                    <li><strong>Child Protection:</strong> When required by child protection laws</li>
                                    <li><strong>Regulatory Compliance:</strong> To comply with healthcare regulations</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Data Retention */}
                        <Card>
                            <CardHeader>
                                <CardTitle>5. Data Retention and Deletion</CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none">
                                <h4>Retention Periods:</h4>
                                <ul>
                                    <li><strong>Active Accounts:</strong> Data retained while account is active and for therapeutic continuity</li>
                                    <li><strong>Therapeutic Records:</strong> Maintained according to professional and legal requirements (typically 7-10 years)</li>
                                    <li><strong>Emergency Records:</strong> Retained indefinitely for safety and legal compliance</li>
                                    <li><strong>Usage Data:</strong> Aggregated and anonymized data may be retained for research and improvement</li>
                                </ul>

                                <h4>Data Deletion:</h4>
                                <ul>
                                    <li><strong>Account Closure:</strong> Personal data deleted within 30 days of account closure request</li>
                                    <li><strong>Right to Deletion:</strong> Users can request deletion of specific data (subject to legal requirements)</li>
                                    <li><strong>Automatic Cleanup:</strong> Temporary data and logs automatically deleted on schedule</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Your Rights */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="h-5 w-5 text-orange-600" />
                                    6. Your Privacy Rights
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none">
                                <p>You have the following rights regarding your personal information:</p>

                                <h4>Access and Portability:</h4>
                                <ul>
                                    <li><strong>View Your Data:</strong> Access all personal information we have about you</li>
                                    <li><strong>Download Records:</strong> Export your therapeutic records and data</li>
                                    <li><strong>Data Portability:</strong> Transfer your data to another healthcare provider</li>
                                </ul>

                                <h4>Control and Correction:</h4>
                                <ul>
                                    <li><strong>Update Information:</strong> Correct or update your personal information</li>
                                    <li><strong>Privacy Settings:</strong> Control who can see your information</li>
                                    <li><strong>Communication Preferences:</strong> Choose how and when we contact you</li>
                                </ul>

                                <h4>Deletion and Restriction:</h4>
                                <ul>
                                    <li><strong>Delete Account:</strong> Request complete account and data deletion</li>
                                    <li><strong>Restrict Processing:</strong> Limit how we use your information</li>
                                    <li><strong>Withdraw Consent:</strong> Revoke consent for specific data uses</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Children's Privacy */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                    7. Children's Privacy (COPPA Compliance)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none">
                                <p>
                                    SafeSpace is designed for children and families, and we take special care to protect children's privacy:
                                </p>

                                <h4>Parental Consent:</h4>
                                <ul>
                                    <li><strong>Guardian Approval:</strong> All child accounts require guardian consent and oversight</li>
                                    <li><strong>Supervised Access:</strong> Guardians can monitor their child's platform activity</li>
                                    <li><strong>Age Verification:</strong> We verify ages to ensure appropriate protections</li>
                                </ul>

                                <h4>Enhanced Protections:</h4>
                                <ul>
                                    <li><strong>Limited Data Collection:</strong> We collect only information necessary for therapeutic purposes</li>
                                    <li><strong>No Behavioral Advertising:</strong> We do not use children's data for advertising</li>
                                    <li><strong>Secure Communications:</strong> All child communications are monitored for safety</li>
                                    <li><strong>Educational Focus:</strong> Content and features designed for therapeutic and educational purposes</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Contact and Complaints */}
                        <Card>
                            <CardHeader>
                                <CardTitle>8. Contact Us About Privacy</CardTitle>
                            </CardHeader>
                            <CardContent className="prose max-w-none">
                                <p>
                                    If you have questions about this Privacy Policy or want to exercise your privacy rights:
                                </p>

                                <h4>Contact Information:</h4>
                                <ul>
                                    <li><strong>Privacy Officer:</strong> privacy@safespace.com</li>
                                    <li><strong>Data Protection:</strong> Available through platform settings</li>
                                    <li><strong>Support Team:</strong> Available 24/7 through the help center</li>
                                </ul>

                                <h4>Response Times:</h4>
                                <ul>
                                    <li><strong>Privacy Requests:</strong> Responded to within 30 days</li>
                                    <li><strong>Data Access:</strong> Provided within 45 days</li>
                                    <li><strong>Emergency Issues:</strong> Addressed immediately</li>
                                </ul>

                                <p>
                                    We are committed to resolving any privacy concerns quickly and transparently. 
                                    Your trust is essential to our mission of providing safe, effective mental health support.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}