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
import { usePathname, useRouter } from 'next/navigation';
import { FlameKindling, LayoutDashboard, Truck, LogOut, UserCircle, ShieldCheck } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

const menuItems = [
    { href: '/driver/dashboard', label: 'My Deliveries', icon: <LayoutDashboard /> },
];

export function DriverSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [user, loading] = useAuthState(auth);

  const handleLogout = async () => {
      await signOut(auth);
      toast({
          title: "Logged Out",
          description: "You have been successfully logged out."
      });
      router.push('/driver/login');
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col items-center text-center p-4 group-data-[collapsible=icon]:hidden">
            {loading ? (
                <>
                    <Skeleton className="h-16 w-16 rounded-full mb-2" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-16 mt-1" />
                </>
            ) : user ? (
                 <>
                    <UserCircle className="h-16 w-16 text-primary mb-2" />
                    <h2 className="font-semibold text-lg">{user.displayName || 'Driver'}</h2>
                    <p className="text-xs text-sidebar-foreground/70">On Duty</p>
                </>
            ) : (
                <>
                    <UserCircle className="h-16 w-16 text-muted-foreground mb-2" />
                    <h2 className="font-semibold text-lg">Not Logged In</h2>
                </>
            )}
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
                 <SidebarMenuButton onClick={handleLogout} tooltip="Log Out">
                    <LogOut />
                    <span>Log Out</span>
                 </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

    