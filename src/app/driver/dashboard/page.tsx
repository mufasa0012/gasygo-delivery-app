
'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, MapPin, CheckCircle, Ship, CircleCheck, CircleX, Route } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/StatCard';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { updateOrderStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

const LiveDeliveryMap = dynamic(() => import('@/components/order/LiveDeliveryMap'), { 
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full bg-secondary"><Loader2 className="h-6 w-6 animate-spin"/></div>
});

export default function DriverDashboardPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, loadingAuth, errorAuth] = useAuthState(auth);

    const [activeOrdersCollection, loadingActive, errorActive] = useCollection(
        user ? query(
            collection(db, "orders"), 
            where("assignedDriverId", "==", user.uid), 
            where("status", "==", "In Progress")
        ) : undefined
    );

    const [deliveredOrdersCollection, loadingDelivered, errorDelivered] = useCollection(
        user ? query(
            collection(db, "orders"),
            where("assignedDriverId", "==", user.uid),
            where("status", "==", "Delivered")
        ) : undefined
    );
    
    const activeOrders: Order[] = useMemo(() => activeOrdersCollection?.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate() : new Date(),
        } as Order;
    }) || [], [activeOrdersCollection]);

    const todaysDeliveries = useMemo(() => deliveredOrdersCollection?.docs.filter(doc => {
        const data = doc.data();
        const createdAt = (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate() : new Date();
        return format(createdAt, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    }).length || 0, [deliveredOrdersCollection]);


    const handleStatusUpdate = async (orderId: string, newStatus: 'Delivered' | 'Declined') => {
        setIsSubmitting(true);
        const result = await updateOrderStatus(orderId, newStatus);
        if (result.success) {
            toast({
                title: 'Status Updated!',
                description: result.message,
            });
        } else {
             toast({
                variant: 'destructive',
                title: 'Update Failed',
                description: result.message,
            });
        }
        setIsSubmitting(false);
    }

    const loading = loadingAuth || loadingActive || loadingDelivered;
    const error = errorAuth || errorActive || errorDelivered;

    if (loading) {
        return <div className="flex justify-center items-center h-full"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    if (error) {
        return <p className="text-destructive text-center">Error loading assigned orders: {error.message}</p>;
    }
    
    if (!user) {
        return (
            <Card className="text-center py-12">
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">You must be logged in as a driver to view this page.</p>
                    <Button asChild><Link href="/driver/login">Login</Link></Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">My Dashboard</h1>
                <p className="text-muted-foreground">Manage your deliveries and track your progress.</p>
            </div>

             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Active Deliveries" value={activeOrders.length.toString()} icon={<Ship />} note="Orders currently in your vehicle" />
                <StatCard title="Today's Deliveries" value={todaysDeliveries.toString()} icon={<CircleCheck />} note="Completed today" />
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight font-headline">Active Deliveries</h2>

            {activeOrders.length === 0 ? (
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
                    {activeOrders.map(order => (
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
                                
                                {order.location && user.uid ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full">
                                                <Route className="mr-2 h-4 w-4" />
                                                View My Route
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                                            <DialogHeader>
                                                <DialogTitle>Live Delivery Route</DialogTitle>
                                                <DialogDescription>
                                                    Follow the map to navigate to the customer's address.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex-grow rounded-lg overflow-hidden border">
                                                <LiveDeliveryMap 
                                                    customerLocation={{ lat: order.location.latitude, lng: order.location.longitude }}
                                                    customerAddress={order.deliveryAddress}
                                                    driverId={user.uid}
                                                    isTracking={true}
                                                />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full bg-secondary p-4 rounded-lg">
                                        <MapPin className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground mt-2">Location data not available.</p>
                                    </div>
                                )}

                                 <div className="pt-2">
                                    <p className="font-bold text-lg text-center">Total to Collect: Ksh {order.total.toLocaleString()}</p>
                                    <p className="text-sm text-center">Payment Method: <Badge variant="outline">{order.paymentMethod}</Badge></p>
                                </div>

                            </CardContent>
                            <CardFooter className="grid grid-cols-2 gap-2 bg-secondary/50 p-2">
                               <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" className="w-full">
                                            <CircleX className="mr-2 h-4 w-4"/> Failed
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Delivery Failed?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will mark the order as 'Declined'. This action should only be taken if you are unable to complete the delivery.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction 
                                                onClick={() => handleStatusUpdate(order.id, 'Declined')} 
                                                disabled={isSubmitting}
                                                className="bg-destructive hover:bg-destructive/90"
                                            >
                                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                                Confirm Failure
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                               <Button 
                                    className="w-full bg-green-600 hover:bg-green-700 text-white" 
                                    onClick={() => handleStatusUpdate(order.id, 'Delivered')}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4" />}
                                    Mark as Delivered
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

    