
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
import { usePathname } from 'next/navigation';

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
              <Button asChild variant="outline">
                <Link href="/login">
                  <LogOut className="mr-2 h-4 w-4" /> Log Out
                </Link>
              </Button>
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>DR</AvatarFallback>
            </Avatar>
           </div>
        </header>
        <main className="flex-1 bg-muted/20">{children}</main>
      </div>
  );
}
