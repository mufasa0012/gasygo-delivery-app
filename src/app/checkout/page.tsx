
'use client';

import * as React from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/CartContext';
import { Loader2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cartItems, totalPrice, totalItems, clearCart } = useCart();
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const [formData, setFormData] = React.useState({
        customerName: '',
        customerPhone: '',
        deliveryAddress: '',
        notes: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handlePlaceOrder = async () => {
        if (!formData.customerName || !formData.customerPhone || !formData.deliveryAddress) {
            toast({
                title: 'Missing Fields',
                description: 'Please fill in your name, phone, and address.',
                variant: 'destructive',
            });
            return;
        }
        if (totalItems === 0) {
            toast({
                title: 'Empty Cart',
                description: 'Please add items to your cart before placing an order.',
                variant: 'destructive',
            });
            return;
        }

        setLoading(true);

        try {
            await addDoc(collection(db, 'orders'), {
                ...formData,
                items: cartItems.map(item => ({ 
                    productId: item.product.id,
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price,
                })),
                totalPrice,
                status: 'Pending',
                createdAt: new Date(),
            });

            toast({
                title: 'Order Placed!',
                description: 'Thank you for your order. We will process it shortly.',
            });

            clearCart();
            router.push('/');

        } catch (error) {
            console.error('Error placing order: ', error);
            toast({
                title: 'Error',
                description: 'There was a problem placing your order. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }
    
    if (totalItems === 0 && !loading) {
        return (
             <div className="flex min-h-screen w-full flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center text-center p-4">
                    <div>
                        <ShoppingCart className="h-20 w-20 mx-auto text-muted-foreground" />
                        <h1 className="mt-6 text-3xl font-bold font-headline">Your Cart is Empty</h1>
                        <p className="mt-2 text-muted-foreground">You can't proceed to checkout without any items.</p>
                        <Button asChild className="mt-6">
                            <Link href="/products">Shop for Products</Link>
                        </Button>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 bg-muted/20 py-12 md:py-20">
                <div className="container mx-auto max-w-4xl">
                     <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline text-center mb-12">
                        Checkout
                    </h1>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Delivery Information</CardTitle>
                                    <CardDescription>Where should we send your order?</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="customerName">Full Name</Label>
                                        <Input id="customerName" value={formData.customerName} onChange={handleInputChange} />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="customerPhone">Phone Number</Label>
                                        <Input id="customerPhone" type="tel" value={formData.customerPhone} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="deliveryAddress">Delivery Address</Label>
                                        <Textarea id="deliveryAddress" value={formData.deliveryAddress} onChange={handleInputChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Order Notes (Optional)</Label>
                                        <Textarea id="notes" placeholder="Any special instructions..." value={formData.notes} onChange={handleInputChange} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle>Your Order</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        {cartItems.map(item => (
                                            <div key={item.product.id} className="flex justify-between items-center">
                                                <div className="flex items-center gap-3">
                                                    <Image src={item.product.image} alt={item.product.name} width={48} height={48} className="rounded-md" />
                                                    <div>
                                                        <p className="font-medium">{item.product.name}</p>
                                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-medium">Ksh{(item.product.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t border-border my-4"></div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>Ksh{totalPrice.toFixed(2)}</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button size="lg" className="w-full" onClick={handlePlaceOrder} disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin" /> : 'Place Order'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
