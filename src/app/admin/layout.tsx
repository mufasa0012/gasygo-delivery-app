
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Package,
  Truck,
  Users,
  Settings,
  LogOut,
  LayoutGrid,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const menuItems = [
  { href: '/admin/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/admin/orders', icon: Package, label: 'Orders' },
  { href: '/admin/products', icon: Flame, label: 'Products' },
  { href: '/admin/drivers', icon: Truck, label: 'Drivers' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
           <Link href="/" className="flex items-center space-x-2">
                <Flame className="h-8 w-8 text-primary" />
            </Link>
          <h2
            className={cn(
              'text-xl font-semibold transition-opacity duration-200',
              state === 'collapsed' ? 'opacity-0' : 'opacity-100'
            )}
          >
            GasyGo Admin
          </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{
                      children: item.label,
                  }}
                >
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex-col !items-start gap-4">
        <div className="w-full h-px bg-sidebar-border" />
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={{children: "Driver View"}} asChild>
                    <Link href="/driver/deliveries">
                        <Truck/>
                        <span>Driver View</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={{children: "Log Out"}} asChild>
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <SidebarInset>
            <header className="flex h-16 items-center justify-between border-b px-6">
                <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold">Admin Panel</h1>
                </div>
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </header>
            <main className="flex-1">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
