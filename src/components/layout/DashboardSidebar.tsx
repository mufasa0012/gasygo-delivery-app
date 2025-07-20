'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FlameKindling, LayoutDashboard, ShoppingCart, Truck, Package, Users, LogOut, Settings } from 'lucide-react';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
    { href: '/dashboard/orders', label: 'Orders', icon: <ShoppingCart /> },
    { href: '/dashboard/products', label: 'Products', icon: <Package /> },
    { href: '/dashboard/drivers', label: 'Drivers', icon: <Truck /> },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
            <FlameKindling className="h-7 w-7 text-primary" />
            <span className="font-headline text-xl font-bold text-primary group-data-[collapsible=icon]:hidden">GasyGo</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  tooltip={item.label}
                  asChild
                >
                  <a>
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton tooltip="Settings">
                    <Settings />
                    <span>Settings</span>
                 </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/" legacyBehavior passHref>
                 <SidebarMenuButton tooltip="Log Out">
                    <LogOut />
                    <span>Log Out</span>
                 </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
