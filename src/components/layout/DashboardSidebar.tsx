'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FlameKindling, LayoutDashboard, ShoppingCart, Package, Users, LogOut, Settings, HardHat } from 'lucide-react';

const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
    { href: '/dashboard/orders', label: 'Orders', icon: <ShoppingCart /> },
    { href: '/dashboard/products', label: 'Products', icon: <Package /> },
    { href: '/dashboard/drivers', label: 'Drivers', icon: <Users /> },
    { href: '/dashboard/users', label: 'Users', icon: <Users /> },
    { href: '/dashboard/settings', label: 'Settings', icon: <Settings /> },
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
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarSeparator className="my-4" />
         <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton asChild tooltip="Driver Dashboard">
                    <Link href="/driver/dashboard">
                        <HardHat />
                        <span>Driver View</span>
                    </Link>
                 </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton asChild tooltip="Log Out">
                    <Link href="/login">
                        <LogOut />
                        <span>Log Out</span>
                    </Link>
                 </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
