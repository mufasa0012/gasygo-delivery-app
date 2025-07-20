'use client';

import { useState } from 'react';
import { products } from '@/lib/data';
import type { Product, CartItem } from '@/lib/types';
import { ProductCard } from '@/components/shared/ProductCard';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { MinusCircle, PlusCircle, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';

export function ProductGrid() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    toast({
      title: 'Added to cart!',
      description: `${product.name} is now in your cart.`,
    });
  };
  
  const updateQuantity = (productId: string, amount: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          const newQuantity = item.quantity + amount;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };
  
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>

      <div className="lg:col-span-1 sticky top-24">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" /> Your Cart
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-muted-foreground text-center">Your cart is empty.</p>
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
                <Link href="/order/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
