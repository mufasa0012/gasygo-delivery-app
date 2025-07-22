'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order, Driver } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export default function OrdersPage() {
    const [ordersCollection, loadingOrders, errorOrders] = useCollection(collection(db, 'orders'));
    const [driversCollection, loadingDrivers, errorDrivers] = useCollection(collection(db, 'drivers'));
    const { toast } = useToast();
    
    const orders: Order[] = ordersCollection?.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(), // Convert Firestore Timestamp to Date
        } as Order;
    }) || [];

    const drivers: Driver[] = driversCollection?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver)) || [];

    const handleDelete = async (order: Order) => {
        try {
            await deleteDoc(doc(db, "orders", order.id));
            toast({
                title: "Order Deleted",
                description: `Order #${order.id.substring(0,6)} has been successfully deleted.`
            });
        } catch (error) {
            console.error("Error deleting order:", error);
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: "There was a problem deleting the order."
            });
        }
    }

    const pendingOrders = orders.filter(o => o.status === 'Pending');
    const inProgressOrders = orders.filter(o => o.status === 'In Progress');
    const deliveredOrders = orders.filter(o => o.status === 'Delivered');
    const declinedOrders = orders.filter(o => o.status === 'Declined');

    const loading = loadingOrders || loadingDrivers;
    const error = errorOrders || errorDrivers;

    if (loading) {
        return <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (error) {
        return <p className="text-destructive text-center">Error loading data: {error.message}</p>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Orders</h1>
                    <p className="text-muted-foreground">Manage and track all customer orders.</p>
                </div>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button variant="destructive" disabled={orders.length === 0}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete All Orders
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete ALL orders from the database.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => orders.forEach(handleDelete)}>Delete All</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
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
                            <OrdersTable orders={pendingOrders} drivers={drivers} onDelete={handleDelete} />
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
                            <OrdersTable orders={inProgressOrders} drivers={drivers} onDelete={handleDelete} />
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
                            <OrdersTable orders={deliveredOrders} drivers={drivers} onDelete={handleDelete} />
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
                            <OrdersTable orders={declinedOrders} drivers={drivers} onDelete={handleDelete} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
