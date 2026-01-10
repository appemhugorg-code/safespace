import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { type NavItem, type User } from '@/types';
import { 
    LayoutGrid, 
    Users, 
    Heart, 
    Calendar, 
    MessageCircle, 
    BookOpen, 
    Folder, 
    Shield, 
    AlertTriangle 
} from 'lucide-react';
import { usePanicAlerts } from '@/hooks/use-panic-alerts';

const getMobileNavItemsForUser = (user: User, unviewedCount: number): NavItem[] => {
    // Check if user has roles array
    const userRoles = user.roles || [];
    const hasRole = (role: string) => userRoles.includes(role);

    // Admin mobile navigation (top 4 items)
    if (hasRole('admin')) {
        return [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Alerts',
                href: '/panic-alerts',
                icon: AlertTriangle,
                badge: unviewedCount > 0 ? unviewedCount.toString() : undefined,
            },
            {
                title: 'Users',
                href: '/admin/users',
                icon: Users,
            },
            {
                title: 'Messages',
                href: '/messages',
                icon: MessageCircle,
            },
        ];
    }

    // Therapist mobile navigation
    if (hasRole('therapist')) {
        return [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Alerts',
                href: '/panic-alerts',
                icon: AlertTriangle,
                badge: unviewedCount > 0 ? unviewedCount.toString() : undefined,
            },
            {
                title: 'Clients',
                href: '/clients',
                icon: Users,
            },
            {
                title: 'Messages',
                href: '/messages',
                icon: MessageCircle,
            },
        ];
    }

    // Guardian mobile navigation
    if (hasRole('guardian')) {
        return [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Children',
                href: '/guardian/children',
                icon: Users,
            },
            {
                title: 'Mood',
                href: '/mood/overview',
                icon: Heart,
            },
            {
                title: 'Messages',
                href: '/messages',
                icon: MessageCircle,
            },
        ];
    }

    // Child mobile navigation
    if (hasRole('child')) {
        return [
            {
                title: 'Home',
                href: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Mood',
                href: '/mood',
                icon: Heart,
            },
            {
                title: 'Games',
                href: '/games',
                icon: Folder,
            },
            {
                title: 'Help',
                href: '/emergency',
                icon: Shield,
            },
        ];
    }

    return [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];
};

interface MobileNavItemProps {
    item: NavItem;
    isActive: boolean;
}

function MobileNavItem({ item, isActive }: MobileNavItemProps) {
    const Icon = item.icon;
    
    return (
        <Link 
            href={item.href}
            className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 touch-target relative mobile-tap active:scale-95",
                isActive 
                    ? "text-primary bg-primary/10 animate-scale-in" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
        >
            <div className="relative">
                {Icon && <Icon className="h-5 w-5 mb-1" />}
                {item.badge && (
                    <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {item.badge}
                    </span>
                )}
            </div>
            <span className="text-caption font-medium leading-none">
                {item.title}
            </span>
        </Link>
    );
}

export function MobileNavigation() {
    const page = usePage();
    const auth = page.props.auth as { user: User };
    const url = page.url;
    const { unviewedCount } = usePanicAlerts();
    
    const navItems = getMobileNavItemsForUser(auth.user, unviewedCount);
    
    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border px-4 py-2 z-50 animate-slide-up">
            <div className="flex justify-around items-center max-w-md mx-auto">
                {navItems.map((item, index) => (
                    <MobileNavItem 
                        key={`${item.href}-${index}`}
                        item={item} 
                        isActive={url.startsWith(typeof item.href === 'string' ? item.href : item.href.url || '')}
                    />
                ))}
            </div>
        </nav>
    );
}

export { getMobileNavItemsForUser };