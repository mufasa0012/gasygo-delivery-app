// This component is new
'use client';

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

function getPageTitle(pathname: string): string {
  if (pathname.includes('/orders')) return 'Orders';
  if (pathname.includes('/products')) return 'Products';
  if (pathname.includes('/drivers')) return 'Drivers';
  if (pathname.includes('/users')) return 'Users';
  return 'Dashboard';
}

function getAddButtonLink(pathname: string): string | null {
    if (pathname.includes('/products')) return '/dashboard/products'; // Dialog is on this page
    if (pathname.includes('/drivers')) return '/dashboard/drivers'; // Dialog is on this page
    return '/order'; // Default to new order
}


export function DashboardHeader() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const addButtonLink = getAddButtonLink(pathname);


  if (!isMobile) return null;

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold font-headline">{title}</h1>
      </div>
       
    </header>
  );
}
