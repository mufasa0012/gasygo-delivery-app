
'use client';

import Link from 'next/link';
import { Flame, ArrowRight, ShoppingCart, Menu, X } from 'lucide-react';
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
import React from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export function Header() {
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = [
      { href: '/', label: 'Home' },
      { href: '/products', label: 'Products' },
      { href: '/contact', label: 'Contact Us' },
  ];

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
          {navLinks.map(link => (
               <Button key={link.href} variant="link" asChild className="text-foreground text-base">
                <Link href={link.href}>{link.label}</Link>
               </Button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
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
                 <VisuallyHidden>
                    <SheetTitle>Shopping Cart</SheetTitle>
                </VisuallyHidden>
              </SheetHeader>
              <CartContent />
            </SheetContent>
          </Sheet>
          <Button variant="ghost" asChild className="hidden md:flex items-center gap-2">
              <Link href="/login">
                  <span>Login</span>
                  <ArrowRight className="h-5 w-5"/>
              </Link>
          </Button>
           <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  <span className="sr-only">Toggle menu</span>
                </Button>
           </div>
        </div>
      </div>
       {isMenuOpen && (
        <div className="md:hidden bg-background/95 pb-4">
          <nav className="container flex flex-col gap-4">
             {navLinks.map(link => (
               <Button key={link.href} variant="link" asChild className="text-foreground text-base justify-start">
                <Link href={link.href}>{link.label}</Link>
               </Button>
            ))}
             <Button asChild>
                <Link href="/login">Login</Link>
             </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
