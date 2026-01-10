import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, Settings, Calendar, MessageCircle, Heart, Shield, AlertTriangle, UserCheck } from 'lucide-react';
import { usePanicAlerts } from '@/hooks/use-panic-alerts';
import AppLogo from './app-logo';

const getNavItemsForUser = (user: User, unviewedCount: number): NavItem[] => {
    const baseItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    // Check if user has roles array
    const userRoles = user.roles || [];
    const hasRole = (role: string) => userRoles.includes(role);

    // Admin navigation
    if (hasRole('admin')) {
        return [
            ...baseItems,
            {
                title: 'Emergency Alerts',
                href: '/panic-alerts',
                icon: AlertTriangle,
                badge: unviewedCount > 0 ? unviewedCount.toString() : undefined,
            },
            {
                title: 'User Management',
                href: '/admin/users',
                icon: Users,
            },
            {
                title: 'Connection Management',
                href: '/admin/connections',
                icon: UserCheck,
            },
            {
                title: 'Groups',
                href: '/messages/groups',
                icon: Users,
            },
            {
                title: 'Group Monitoring',
                href: '/admin/groups/monitoring',
                icon: Shield,
            },
            {
                title: 'Messages',
                href: '/messages',
                icon: MessageCircle,
            },
            {
                title: 'Articles',
                href: '/articles',
                icon: BookOpen,
            },
            {
                title: 'System Settings',
                href: '/settings',
                icon: Settings,
            },
        ];
    }

    // Therapist navigation
    if (hasRole('therapist')) {
        return [
            ...baseItems,
            {
                title: 'Emergency Alerts',
                href: '/panic-alerts',
                icon: AlertTriangle,
                badge: unviewedCount > 0 ? unviewedCount.toString() : undefined,
            },
            {
                title: 'Appointments',
                href: '/appointments',
                icon: Calendar,
            },
            {
                title: 'Messages',
                href: '/messages',
                icon: MessageCircle,
            },
            {
                title: 'Groups',
                href: '/messages/groups',
                icon: Users,
            },
            {
                title: 'Articles',
                href: '/articles',
                icon: BookOpen,
            },
            {
                title: 'Analytics',
                href: '/analytics/therapist',
                icon: LayoutGrid,
            },
        ];
    }

    // Guardian navigation
    if (hasRole('guardian')) {
        return [
            ...baseItems,
            {
                title: 'Emergency Alerts',
                href: '/panic-alerts',
                icon: AlertTriangle,
                badge: unviewedCount > 0 ? unviewedCount.toString() : undefined,
            },
            {
                title: 'My Children',
                href: '/guardian/children',
                icon: Users,
            },
            {
                title: 'Mood Tracking',
                href: '/mood/overview',
                icon: Heart,
            },
            {
                title: 'Appointments',
                href: '/appointments',
                icon: Calendar,
            },
            {
                title: 'Messages',
                href: '/messages',
                icon: MessageCircle,
            },
            {
                title: 'Articles',
                href: '/articles',
                icon: BookOpen,
            },
        ];
    }

    // Child navigation
    if (hasRole('child')) {
        return [
            ...baseItems,
            {
                title: 'My Mood',
                href: '/mood',
                icon: Heart,
            },
            {
                title: 'Appointments',
                href: '/appointments',
                icon: Calendar,
            },
            {
                title: 'Games',
                href: '/games',
                icon: Folder,
            },
            {
                title: 'Messages',
                href: '/messages',
                icon: MessageCircle,
            },
            {
                title: 'Articles',
                href: '/articles',
                icon: BookOpen,
            },
            {
                title: 'Emergency',
                href: '/emergency',
                icon: Shield,
            },
        ];
    }

    return baseItems;
};

const footerNavItems: NavItem[] = [
    {
        title: 'SafeSpace',
        href: 'https://safespace.com',
        icon: Folder,
    },
    {
        title: 'Help & Support',
        href: '/help',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as { auth: { user: User } };
    const { unviewedCount } = usePanicAlerts();

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={getNavItemsForUser(auth.user, unviewedCount)} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
