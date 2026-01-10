import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Shield, Users, MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="SafeSpace - Mental Health Support for Children">
                <meta name="description" content="A safe, supportive platform connecting children, guardians, and therapists for mental health support and emotional well-being." />
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
                {/* Navigation */}
                <nav className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50 animate-slide-up">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-blue-900">SafeSpace</span>
                            </div>

                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Button asChild>
                                        <Link href={dashboard()}>
                                            Go to Dashboard
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button variant="outline" asChild>
                                            <Link href={login()}>
                                                Log In
                                            </Link>
                                        </Button>
                                        <Button asChild>
                                            <Link href={register()}>
                                                Get Started
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Hero Content */}
                            <div className="text-center lg:text-left animate-fade-in">
                                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                    <Shield className="h-4 w-4" />
                                    Safe • Secure • Supportive
                                </div>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                                    A Safe Space for
                                    <span className="text-blue-600 block">Mental Wellness</span>
                                </h1>

                                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl lg:max-w-none">
                                    Connecting children, families, and mental health professionals in a secure,
                                    supportive environment designed for emotional growth and healing.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Button size="lg" asChild className="text-lg px-8 py-4">
                                        <Link href={register()}>
                                            Start Your Journey
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                                        Learn More
                                    </Button>
                                </div>
                            </div>

                            {/* Hero Images */}
                            <div className="relative animate-slide-up">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Main large image - Happy African family */}
                                    <div className="col-span-2 relative overflow-hidden rounded-2xl shadow-lg">
                                        <img 
                                            src="https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                                            alt="Happy African family with children enjoying quality time together"
                                            className="w-full h-64 sm:h-80 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
                                    </div>

                                    {/* Smaller supporting images */}
                                    <div className="relative overflow-hidden rounded-xl shadow-md">
                                        <img 
                                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                            alt="Person practicing mindfulness and mental wellness activities"
                                            className="w-full h-32 sm:h-40 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent"></div>
                                    </div>

                                    <div className="relative overflow-hidden rounded-xl shadow-md">
                                        <img 
                                            src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                            alt="Peaceful meditation and mindfulness for mental wellness"
                                            className="w-full h-32 sm:h-40 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
                                    </div>
                                </div>

                                {/* Floating elements for visual interest */}
                                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse-gentle">
                                    <Shield className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 relative overflow-hidden">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}></div>
                    </div>
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                How SafeSpace Helps
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Our platform provides comprehensive support for children's mental health
                                through innovative tools and caring professionals.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 relative z-10">
                            <Card className="border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" interactive>
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
                                        <MessageCircle className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <CardTitle className="text-blue-900">Mood Tracking</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-center">
                                        Child-friendly tools to help kids understand and express their emotions
                                        with colorful, engaging interfaces designed just for them.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" interactive>
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
                                        <Users className="h-8 w-8 text-green-600" />
                                    </div>
                                    <CardTitle className="text-green-900">Professional Support</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-center">
                                        Connect with licensed therapists who specialize in children's mental health
                                        through secure video sessions and messaging.
                                    </CardDescription>
                                </CardContent>
                            </Card>

                            <Card className="border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" interactive>
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform duration-300 hover:scale-110">
                                        <Shield className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <CardTitle className="text-purple-900">Family Connection</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-center">
                                        Keep families connected with progress tracking, appointment scheduling,
                                        and secure communication between all care team members.
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* User Types Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Built for Everyone in the Care Team
                            </h2>
                            <p className="text-xl text-gray-600">
                                SafeSpace serves children, families, and mental health professionals
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">For Children</h3>
                                        <p className="text-gray-600">
                                            Express feelings safely, track moods, play therapeutic games,
                                            and connect with caring adults who want to help.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Users className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">For Parents & Guardians</h3>
                                        <p className="text-gray-600">
                                            Monitor your child's emotional well-being, schedule appointments,
                                            and stay connected with their care team.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MessageCircle className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">For Therapists</h3>
                                        <p className="text-gray-600">
                                            Manage your young clients, track their progress, conduct secure sessions,
                                            and collaborate with families effectively.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative overflow-hidden rounded-2xl shadow-lg">
                                <img 
                                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                                    alt="Caring hands offering support and comfort in a moment of emotional connection"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent"></div>
                                <div className="absolute inset-0 p-8 flex flex-col justify-end text-center text-white">
                                    <div className="text-4xl mb-4">🌈</div>
                                    <h3 className="text-2xl font-bold mb-4">
                                        Safe, Secure, & Supportive
                                    </h3>
                                    <p className="text-blue-100 mb-6">
                                        Every interaction is monitored for safety, with emergency features
                                        and 24/7 crisis support resources always available.
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-sm text-blue-200">
                                        <Shield className="h-4 w-4" />
                                        <span>HIPAA Compliant & Encrypted</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Ready to Create a SafeSpace?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Join thousands of families and professionals who trust SafeSpace
                            for children's mental health support.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-4">
                                <Link href={register()}>
                                    <Users className="h-5 w-5 mr-2" />
                                    I'm a Parent/Guardian
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-blue-50">
                                <Link href={register()}>
                                    <MessageCircle className="h-5 w-5 mr-2" />
                                    I'm a Therapist
                                </Link>
                            </Button>
                        </div>

                        <p className="text-blue-200 text-sm mt-6">
                            Already have an account? <Link href={login()} className="text-white underline hover:no-underline">Sign in here</Link>
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center gap-2 mb-4 md:mb-0">
                                <span className="text-xl font-bold">SafeSpace</span>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-400">
                                <span>© 2024 SafeSpace. All rights reserved.</span>
                                <span>•</span>
                                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                                <span>•</span>
                                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                            <p className="text-gray-400 text-sm">
                                <strong className="text-red-400">Crisis Support:</strong> If you or someone you know is in immediate danger,
                                please call 911 or contact the National Suicide Prevention Lifeline at 988.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}