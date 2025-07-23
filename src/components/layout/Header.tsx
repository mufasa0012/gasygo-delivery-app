
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FlameKindling, LogIn, Menu } from 'lucide-react';
import { useState, useRef, MouseEvent } from 'react';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false);
  
  // State for double-click detection
  const clickCount = useRef(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);


  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/order', label: 'Order Now' },
    { href: '/contact', label: 'Contact Us' },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = (e: MouseEvent) => {
    e.preventDefault(); // Prevent navigation on single click
    clickCount.current += 1;

    if (clickCount.current === 1) {
        clickTimer.current = setTimeout(() => {
            clickCount.current = 0; // Reset after 300ms
        }, 300);
    } else if (clickCount.current === 2) {
        if(clickTimer.current) clearTimeout(clickTimer.current);
        clickCount.current = 0;
        setIsNavVisible(prev => !prev); // Toggle visibility on double-click
    }
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" onClick={handleLogoClick} className="flex items-center gap-2">
          <FlameKindling className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-primary">GasyGo</span>
        </Link>

        <nav className={cn("hidden md:flex items-center gap-6", { "hidden": !isNavVisible })}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground">
             <LogIn className="h-5 w-5" />
          </Link>
        </nav>

        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="mb-8">
                <SheetTitle>
                    <Link href="/" onClick={handleLinkClick} className="flex items-center gap-2">
                        <FlameKindling className="h-7 w-7 text-primary" />
                        <span className="font-headline text-2xl font-bold text-primary">GasyGo</span>
                    </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={handleLinkClick} className="text-lg font-medium">
                    {link.label}
                  </Link>
                ))}
                 <Link href="/login" onClick={handleLinkClick} className="text-lg font-medium flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    Login
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
