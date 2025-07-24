'use client';

import * as React from 'react';
import { products } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';
import { Header } from '@/components/Header';
import { CartContent } from '@/components/CartContent';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const isMobile = useIsMobile();
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const { totalItems } = useCart();

  const mobileCart = (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 h-16 w-16 rounded-full shadow-lg flex md:hidden"
          aria-label="Open cart"
        >
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full justify-center bg-accent text-accent-foreground">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-center text-2xl font-bold">Your Cart</SheetTitle>
        </SheetHeader>
        <CartContent />
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <div className="flex flex-1">
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-4 md:p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight text-foreground font-headline">Our Products</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Everything you need for your gas supply, delivered fast.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </main>
        </div>
        {!isMobile && (
          <aside className="hidden w-[400px] border-l bg-background/80 p-6 md:flex md:flex-col">
             <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-headline">Your Cart</h2>
             </div>
            <CartContent />
          </aside>
        )}
      </div>
      {isMobile && mobileCart}
    </div>
  );
}
