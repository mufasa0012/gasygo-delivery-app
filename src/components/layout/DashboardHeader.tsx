// This component is new
'use client';

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { useNotificationSound } from '@/hooks/use-notification-sound';
import { Bell, BellOff } from 'lucide-react';

function getPageTitle(pathname: string): string {
  if (pathname.includes('/orders')) return 'Orders';
  if (pathname.includes('/products')) return 'Products';
  if (pathname.includes('/drivers')) return 'Drivers';
  if (pathname.includes('/users')) return 'Users';
  if (pathname.includes('/settings')) return 'Settings';
  return 'Dashboard';
}


export function DashboardHeader() {
  const { isMobile } = useSidebar();
  const { isMuted, toggleMute } = useNotificationSound();
  const pathname = usePathname();
  const title = getPageTitle(pathname);


  if (!isMobile) return null;

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold font-headline">{title}</h1>
      </div>
       <Button variant="ghost" size="icon" onClick={toggleMute} title={isMuted ? "Unmute Sounds" : "Mute Sounds"}>
        {isMuted ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
       </Button>
    </header>
  );
}
