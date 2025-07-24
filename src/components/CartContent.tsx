'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/components/CartItem';
import { ShoppingCart, Package } from 'lucide-react';
import Link from 'next/link';

export function CartContent() {
  const { cartItems, totalPrice, totalItems } = useCart();

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
        <h3 className="mt-4 text-xl font-semibold">Your cart is empty</h3>
        <p className="mt-2 text-muted-foreground">Add some products to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 pr-4 -mr-4">
        <div className="flex flex-col gap-4">
          {cartItems.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto pt-6">
        <Separator />
        <div className="flex justify-between items-center py-4 text-lg font-semibold">
          <span>Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
