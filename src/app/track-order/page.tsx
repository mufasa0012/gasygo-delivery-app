
'use client';

import * as React from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Search, Package, Truck, CircleCheck } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/orders';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

export default function TrackOrderPage() {
    const [phone, setPhone] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [order, setOrder] = React.useState<Order | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [searched, setSearched] = React.useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone) {
            setError('Please enter a phone number.');
            return;
        }
        setLoading(true);
        setSearched(true);
        setError(null);
        setOrder(null);

        const q = query(
            collection(db, "orders"),
            where("customerPhone", "==", phone),
            orderBy("createdAt", "desc"),
            limit(1)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                setError('No recent order found for this phone number.');
                setOrder(null);
            } else {
                const orderData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Order;
                setOrder(orderData);
            }
            setLoading(false);
        }, (err) => {
            console.error(err);
            setError('An error occurred while fetching your order.');
            setLoading(false);
        });

        // It's good practice to unsubscribe when the component unmounts or a new search is made,
        // but for this single-search component, we'll rely on page navigation to clean up.
    };
    
    const getStatusInfo = () => {
        if (!order) return { text: 'Unknown', value: 0 };
        switch(order.status) {
            case 'Pending':
                return { text: 'Your order is pending confirmation.', value: 25 };
            case 'Out for Delivery':
                return { text: 'Your order is out for delivery!', value: 75 };
            case 'Delivered':
                return { text: 'Your order has been delivered.', value: 100 };
            case 'Cancelled':
                 return { text: 'Your order has been cancelled.', value: 0, isError: true };
            default:
                return { text: 'Processing your order.', value: 50 };
        }
    }

    const statusInfo = getStatusInfo();

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 bg-muted/20 py-12 md:py-20">
                <div className="container mx-auto max-w-2xl px-4">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold font-headline">Track Your Order</CardTitle>
                            <CardDescription>Enter the phone number you used to place the order.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <Input 
                                    type="tel" 
                                    placeholder="e.g., +254712345678"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                <Button type="submit" disabled={loading}>
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Search className="h-4 w-4"/>}
                                    <span className="sr-only">Search</span>
                                </Button>
                            </form>
                            
                            {loading && (
                                <div className="text-center p-8">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary"/>
                                    <p className="mt-4 text-muted-foreground">Searching for your order...</p>
                                </div>
                            )}

                            {error && (
                                <p className="text-destructive text-center mt-4">{error}</p>
                            )}
                            
                            {!loading && order && (
                                <div className="mt-8 border-t pt-8">
                                    <h3 className="text-xl font-semibold">Order #{order.id.substring(0, 7)}</h3>
                                    <p className="text-muted-foreground">Placed on {order.createdAt ? format(order.createdAt.toDate(), 'PPpp') : 'N/A'}</p>
                                    
                                    <div className="mt-6 space-y-4">
                                        <p className="font-medium">{statusInfo.text}</p>
                                        <Progress value={statusInfo.value} className={statusInfo.isError ? "bg-destructive/50" : ""} />
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span className={order.status === 'Pending' ? 'text-primary font-bold' : ''}>Pending</span>
                                            <span className={order.status === 'Out for Delivery' ? 'text-primary font-bold' : ''}>On its way</span>
                                            <span className={order.status === 'Delivered' ? 'text-primary font-bold' : ''}>Delivered</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 space-y-4">
                                        {order.driverName && (
                                            <div className="flex items-center gap-3 p-3 rounded-md bg-muted">
                                                <Truck className="h-6 w-6 text-primary"/>
                                                <div>
                                                    <p className="font-semibold">Your Driver</p>
                                                    <p className="text-muted-foreground">{order.driverName}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 p-3 rounded-md bg-muted">
                                            <Package className="h-6 w-6 text-primary"/>
                                             <div>
                                                <p className="font-semibold">Items</p>
                                                <p className="text-muted-foreground">{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                             {!loading && !order && searched && !error && (
                                 <div className="text-center p-8">
                                    <p className="text-muted-foreground">No order found. Please check the phone number and try again.</p>
                                </div>
                             )}

                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
