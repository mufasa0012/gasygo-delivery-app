// src/components/order/MobileCartDrawer.tsx
'use client';

import { useState, useEffect } from 'react';
import type { CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MinusCircle, PlusCircle, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const CART_STORAGE_KEY = 'gasygo-cart';

export function MobileCartDrawer() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const loadCart = () => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      setCart(storedCart ? JSON.parse(storedCart) : []);
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();

    const handleStorageChange = () => {
        loadCart();
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event listener
    document.addEventListener('addToCart', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        document.removeEventListener('addToCart', handleStorageChange);
    };
  }, []);

  const updateCartState = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      window.dispatchEvent(new Event('storage')); // Notify other components
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  };

  const updateQuantity = (productId: string, amount: number) => {
    let newCart = [...cart];
    const itemIndex = newCart.findIndex(item => item.product.id === productId);

    if (itemIndex > -1) {
      newCart[itemIndex].quantity += amount;
      if (newCart[itemIndex].quantity <= 0) {
        newCart.splice(itemIndex, 1);
      }
    }
    updateCartState(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    updateCartState(newCart);
  };

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (cart.length === 0) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-14 text-lg shadow-lg z-50">
          <ShoppingCart className="mr-2 h-6 w-6" />
          View Cart ({totalItems}) - Ksh {cartTotal.toLocaleString()}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-4/5 flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" /> Your Cart
          </SheetTitle>
        </SheetHeader>
        <div className="flex-grow overflow-hidden">
             {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Your cart is empty.</p>
                ) : (
                <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                    {cart.map(item => (
                        <div key={item.product.id} className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">Ksh {item.product.price.toLocaleString()}</p>
                            <div className="flex items-center gap-2 mt-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, -1)}><MinusCircle className="h-4 w-4" /></Button>
                            <span>{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, 1)}><PlusCircle className="h-4 w-4" /></Button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold">Ksh {(item.product.price * item.quantity).toLocaleString()}</p>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeFromCart(item.product.id)}><X className="h-4 w-4"/></Button>
                        </div>
                        </div>
                    ))}
                    </div>
                </ScrollArea>
                )}
        </div>
        {cart.length > 0 && (
            <SheetFooter className="pt-4 border-t">
                <div className="w-full flex flex-col gap-4">
                    <div className="w-full flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>Ksh {cartTotal.toLocaleString()}</span>
                    </div>
                <Button asChild className="w-full" size="lg" onClick={() => setOpen(false)}>
                    <Link href="/order/checkout">Place Order</Link>
                </Button>
                </div>
            </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
