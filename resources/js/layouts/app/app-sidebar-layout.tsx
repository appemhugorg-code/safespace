import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { MobileNavigation } from '@/components/mobile-navigation';
import { ToastContainer } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/sonner';
import { ThemeIntegration, ThemeAwarePage } from '@/components/theme/theme-integration';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { type PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { props } = usePage<SharedData>();
    const user = props.auth?.user;
    const initialTheme = user?.theme_preferences;

    return (
        <ThemeIntegration userId={user?.id} initialTheme={initialTheme}>
            <ThemeAwarePage>
                <AppShell variant="sidebar">
                    <AppSidebar />
                    <AppContent variant="sidebar" className="overflow-x-hidden pb-20 lg:pb-0">
                        <AppSidebarHeader breadcrumbs={breadcrumbs} />
                        {children}
                    </AppContent>
                    <MobileNavigation />
                    <ToastContainer />
                    <Toaster />
                </AppShell>
            </ThemeAwarePage>
        </ThemeIntegration>
    );
}
