'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CheckoutForm } from "@/components/order/CheckoutForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product, CartItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
    const [productsCollection, loading] = useCollection(collection(db, 'products'));
    const [cart, setCart] = useState<CartItem[]>([]);
    const { toast } = useToast();
    
    // In a real app, cart state would be global (Context/Zustand).
    // For this prototype, we'll use localStorage to persist the cart across pages.
    useEffect(() => {
        try {
            const storedCart = localStorage.getItem('gasygo-cart');
            if (storedCart) {
                setCart(JSON.parse(storedCart));
            }
        } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
            toast({
                variant: 'destructive',
                title: 'Error loading cart',
                description: 'Could not load your cart from your browser. Please try adding items again.'
            });
        }
    }, [toast]);
        
    const cartTotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    if (loading) {
        return <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
            <div className="text-center mb-12">
                <h1 className="font-headline text-4xl md:text-5xl font-bold">Checkout</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Just a few more steps to get your order delivered.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <CheckoutForm cart={cart} total={cartTotal} />
                </div>
                <div className="lg:col-span-1">
                    <Card className="sticky top-24 shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline">Order Summary</CardTitle>
                            <CardDescription>Review your items before placing the order.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {cart.length > 0 ? cart.map(item => (
                                <div key={item.product.id} className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold">{item.product.name}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm">Ksh {(item.product.price * item.quantity).toLocaleString()}</p>
                                </div>
                            )) : (
                                <p className="text-sm text-muted-foreground text-center py-4">Your cart is empty.</p>
                            )}
                             <div className="border-t pt-4 mt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>Ksh {cartTotal.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
