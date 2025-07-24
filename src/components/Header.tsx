'use client';

import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Flame className="h-8 w-8 text-primary" />
          <span className="inline-block font-bold text-2xl font-headline text-foreground">GasyGo</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-lg">
          <Button variant="link" asChild className="text-foreground">
            <Link href="/">Home</Link>
          </Button>
          <Button variant="link" asChild className="text-foreground">
             <Link href="/ai-order">Order Now</Link>
          </Button>
           <Button variant="link" asChild className="text-foreground">
            <Link href="#">Contact Us</Link>
          </Button>
        </nav>
        <Button variant="ghost" asChild className="hidden md:flex items-center gap-2">
            <Link href="#">
                <span className="sr-only">Login</span>
                <ArrowRight className="h-6 w-6"/>
            </Link>
        </Button>
      </div>
    </header>
  );
}
