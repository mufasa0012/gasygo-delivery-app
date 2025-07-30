
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Truck,
  LogOut,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [driverName, setDriverName] = React.useState('');

  React.useEffect(() => {
    // Ensure this runs only on the client
    const name = localStorage.getItem('driverName') || '';
    setDriverName(name);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('driverId');
    localStorage.removeItem('driverName');
    router.push('/login');
  }

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
          <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full">
            <Link
              href="/driver/deliveries"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Flame className="h-6 w-6 text-primary" />
              <span className="font-headline">GasyGo Driver</span>
            </Link>
             <Link
              href="/driver/deliveries"
              className={`transition-colors hover:text-foreground ${pathname === '/driver/deliveries' ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Deliveries
            </Link>
          </nav>
           <div className="flex items-center gap-4 md:ml-auto">
              <Button onClick={handleLogout} variant="outline">
                  <LogOut className="mr-2 h-4 w-4" /> Log Out
              </Button>
            <Avatar>
                <AvatarFallback>{driverName ? getInitials(driverName) : 'DR'}</AvatarFallback>
            </Avatar>
           </div>
        </header>
        <main className="flex-1 bg-muted/20">{children}</main>
      </div>
  );
}
