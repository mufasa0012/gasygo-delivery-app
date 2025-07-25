'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product, CartItem } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MinusCircle, PlusCircle, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';

// In a real app, this would use a global state manager like Context or Zustand
// For this prototype, we'll use localStorage to persist the cart across pages.
const CART_STORAGE_KEY = 'gasygo-cart';

export function CartSidebar() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const loadCart = useCallback(() => {
    try {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        setCart(storedCart ? JSON.parse(storedCart) : []);
    } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        setCart([]);
    }
  }, []);

  useEffect(() => {
    loadCart();

    const handleStorageChange = () => {
        loadCart();
    };

    const handleAddToCartEvent = (event: Event) => {
      loadCart();
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('addToCart', handleAddToCartEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('addToCart', handleAddToCartEvent);
    };
  }, [loadCart]);

  const updateCartState = (newCart: CartItem[]) => {
      setCart(newCart);
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
        window.dispatchEvent(new Event('storage')); // Notify other components of cart changes
      } catch (error) {
        console.error("Failed to save cart to localStorage", error);
      }
  }

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

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" /> Your Cart
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cart.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Your cart is empty.</p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
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
      </CardContent>
      {cart.length > 0 && (
        <CardFooter className="flex flex-col gap-4">
            <Separator />
            <div className="w-full flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Ksh {cartTotal.toLocaleString()}</span>
            </div>
          <Button asChild className="w-full" size="lg">
            <Link href="/order/checkout">Place Order</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
