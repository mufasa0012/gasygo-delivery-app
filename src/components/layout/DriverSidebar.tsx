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
import { FlameKindling, LayoutDashboard, Truck, LogOut, UserCircle, ShieldCheck } from 'lucide-react';

const menuItems = [
    { href: '/driver/dashboard', label: 'My Deliveries', icon: <LayoutDashboard /> },
];

export function DriverSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col items-center text-center p-4 group-data-[collapsible=icon]:hidden">
            <UserCircle className="h-16 w-16 text-primary mb-2" />
            <h2 className="font-semibold text-lg">John Driver</h2>
            <p className="text-xs text-sidebar-foreground/70">On Duty</p>
        </div>
        <div className="hidden group-data-[collapsible=icon]:flex justify-center p-2">
            <UserCircle className="h-8 w-8 text-primary" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || pathname.startsWith(item.href)}
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
