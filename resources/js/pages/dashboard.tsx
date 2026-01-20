import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { ThemeConfiguration } from '@/components/theme/theme-configuration';
import { DarkModeShowcase } from '@/components/theme/dark-mode-showcase';
import { ThemePersistenceDemo } from '@/components/theme/theme-persistence-demo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/contexts/theme-context';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { theme, effectiveMode } = useTheme();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 md:p-6 lg:p-8">
                {/* Theme System Status Card */}
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            🎨 Theme System Status
                        </CardTitle>
                        <CardDescription>
                            Comprehensive theme system is active and working
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <strong>Mode:</strong> {theme.mode}
                            </div>
                            <div>
                                <strong>Effective:</strong> {effectiveMode}
                            </div>
                            <div>
                                <strong>Font Size:</strong> {theme.accessibility.fontSize}
                            </div>
                            <div>
                                <strong>Reduced Motion:</strong> {theme.animations.reducedMotion ? 'Yes' : 'No'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Dark Mode Showcase */}
                <DarkModeShowcase />

                {/* Theme Persistence Demo */}
                <ThemePersistenceDemo />

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
