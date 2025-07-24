'use client';

import Link from 'next/link';
import { Flame, ArrowRight, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CartContent } from './CartContent';
import { Badge } from './ui/badge';

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Flame className="h-8 w-8 text-primary" />
          <span className="inline-block font-bold text-2xl font-headline text-foreground">
            GasyGo
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-lg font-medium">
          <Button variant="link" asChild className="text-foreground text-base">
            <Link href="/">Home</Link>
          </Button>
          <Button variant="link" asChild className="text-foreground text-base">
            <Link href="/ai-order">Order Now</Link>
          </Button>
          <Button variant="link" asChild className="text-foreground text-base">
            <Link href="#">Contact Us</Link>
          </Button>
        </nav>
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </Badge>
                )}
                <span className="sr-only">Open cart</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Your Shopping Cart</SheetTitle>
              </SheetHeader>
              <CartContent />
            </SheetContent>
          </Sheet>
          <Button variant="ghost" asChild className="hidden md:flex items-center gap-2">
              <Link href="#">
                  <span>Login</span>
                  <ArrowRight className="h-5 w-5"/>
              </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
