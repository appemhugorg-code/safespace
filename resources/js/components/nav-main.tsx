import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={(() => {
                                const href = typeof item.href === 'string' ? item.href : item.href.url;
                                
                                // Special handling for Messages vs Groups to avoid conflicts
                                if (href === '/messages' && page.url.startsWith('/messages/groups')) {
                                    return false; // Don't mark Messages as active when on Groups pages
                                }
                                if (href === '/messages/groups') {
                                    return page.url.startsWith('/messages/groups');
                                }
                                
                                // For other routes, use exact match or startsWith for nested routes
                                return page.url === href || page.url.startsWith(href + '/');
                            })()}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
