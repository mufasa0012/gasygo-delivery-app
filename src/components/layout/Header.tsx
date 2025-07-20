"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { FlameKindling, LayoutDashboard, Menu, Phone, ShoppingCart } from 'lucide-react';

export function Header() {
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/order', label: 'Order Now' },
    { href: '/contact', label: 'Contact Us' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <FlameKindling className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-primary">GasyGo</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <Link href="/dashboard" className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground">
             <LayoutDashboard className="h-5 w-5" />
          </Link>
        </nav>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <Link href="/" className="flex items-center gap-2 mb-8">
                <FlameKindling className="h-7 w-7 text-primary" />
                <span className="font-headline text-2xl font-bold text-primary">GasyGo</span>
              </Link>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-lg font-medium">
                    {link.label}
                  </Link>
                ))}
                 <Link href="/dashboard" className="text-lg font-medium flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5" />
                    Dashboard
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
