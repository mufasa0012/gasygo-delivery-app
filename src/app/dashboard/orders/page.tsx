'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { Loader2 } from 'lucide-react';

export default function OrdersPage() {
    const [ordersCollection, loading, error] = useCollection(collection(db, 'orders'));
    
    const orders: Order[] = ordersCollection?.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to Date
        } as Order;
    }) || [];

    const pendingOrders = orders.filter(o => o.status === 'Pending');
    const inProgressOrders = orders.filter(o => o.status === 'In Progress');
    const deliveredOrders = orders.filter(o => o.status === 'Delivered');
    const declinedOrders = orders.filter(o => o.status === 'Declined');

    if (loading) {
        return <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (error) {
        return <p className="text-destructive text-center">Error loading orders: {error.message}</p>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Orders</h1>
                <p className="text-muted-foreground">Manage and track all customer orders.</p>
            </div>
            
            <Tabs defaultValue="pending">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="delivered">Delivered</TabsTrigger>
                    <TabsTrigger value="declined">Declined</TabsTrigger>
                </TabsList>
                <TabsContent value="pending">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Orders</CardTitle>
                            <CardDescription>These orders need to be accepted or declined.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable orders={pendingOrders} />
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="in-progress">
                    <Card>
                        <CardHeader>
                            <CardTitle>In Progress Orders</CardTitle>
                            <CardDescription>These orders are currently out for delivery.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable orders={inProgressOrders} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="delivered">
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivered Orders</CardTitle>
                            <CardDescription>A history of all completed orders.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable orders={deliveredOrders} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="declined">
                    <Card>
                        <CardHeader>
                            <CardTitle>Declined Orders</CardTitle>
                            <CardDescription>A history of all declined orders.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrdersTable orders={declinedOrders} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
