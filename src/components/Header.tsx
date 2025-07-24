'use client';

import Link from 'next/link';
import { Flame, ShoppingCart, Bot } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export function Header() {
  const { totalItems } = useCart();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0 md:px-8">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Flame className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold text-xl font-headline">GasyGo</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
                <Link href="/ai-order" className='flex items-center gap-2'>
                    <Bot className="h-5 w-5"/>
                    <span className="hidden sm:inline-block">AI Order</span>
                </Link>
            </Button>
            {!isMobile && (
              <Button variant="ghost" size="icon" disabled>
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute top-2 right-2 h-5 w-5 justify-center p-0 bg-accent text-accent-foreground">
                    {totalItems}
                  </Badge>
                )}
                 <span className="sr-only">Shopping Cart</span>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
