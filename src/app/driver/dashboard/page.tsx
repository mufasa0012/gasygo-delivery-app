'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, MapPin, CheckCircle, Package, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Image } from '@imagekit/next';

// In a real app, this would be the ID of the currently logged-in driver.
// We'll hardcode one for this prototype.
const CURRENT_DRIVER_ID = "1"; 

export default function DriverDashboardPage() {
    const [assignedOrdersCollection, loading, error] = useCollection(
        query(collection(db, "orders"), where("driverId", "==", CURRENT_DRIVER_ID), where("status", "==", "In Progress"))
    );
    
    const assignedOrders: Order[] = assignedOrdersCollection?.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        } as Order;
    }) || [];

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    if (error) {
        return <p className="text-destructive text-center">Error loading assigned orders: {error.message}</p>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">My Active Deliveries</h1>
                <p className="text-muted-foreground">Here are the orders you need to deliver.</p>
            </div>
            
            {assignedOrders.length === 0 ? (
                <Card className="text-center py-12">
                     <CardHeader>
                        <div className="mx-auto bg-green-100 dark:bg-green-900/50 rounded-full p-4 w-fit">
                            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="mt-4">All Caught Up!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">You have no active deliveries assigned. Check back soon!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {assignedOrders.map(order => (
                        <Card key={order.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>Order #{order.id.substring(0, 6)}</span>
                                     <Badge variant="default">{order.status}</Badge>
                                </CardTitle>
                                <CardDescription>Assigned at: {format(order.createdAt, 'p, PP')}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                <div className="p-3 rounded-md bg-secondary">
                                    <h3 className="font-semibold text-secondary-foreground">Customer Details</h3>
                                    <p className="text-sm text-muted-foreground">{order.customerName}</p>
                                    <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                                </div>
                                <div className="p-3 rounded-md bg-secondary">
                                    <h3 className="font-semibold text-secondary-foreground">Delivery Address</h3>
                                    <p className="text-sm text-muted-foreground">{order.deliveryAddress}</p>
                                </div>
                                
                                <div className="relative w-full h-48 mt-4 rounded-lg overflow-hidden border">
                                    <Image 
                                        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
                                        src="/gasygo/nairobi-map-placeholder.jpg"
                                        alt={`Map showing location for ${order.deliveryAddress}`}
                                        fill
                                        className="object-cover"
                                        data-ai-hint="nairobi map"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute bottom-2 left-2">
                                        <Button size="sm" asChild>
                                            <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.deliveryAddress)}`} target="_blank" rel="noopener noreferrer">
                                                <MapPin className="mr-2 h-4 w-4" /> Open in Maps
                                            </Link>
                                        </Button>
                                    </div>
                                </div>

                            </CardContent>
                            <CardFooter className="flex justify-between items-center bg-secondary/50 p-4">
                               <p className="font-bold text-lg">Ksh {order.total.toLocaleString()}</p>
                               <p className="text-sm">Payment: <Badge variant="outline">{order.paymentMethod}</Badge></p>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
