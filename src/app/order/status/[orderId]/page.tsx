
// src/app/order/status/[orderId]/page.tsx
'use client';

import { doc } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { CheckCircle2, Loader2, Package, Truck, PartyPopper, AlertTriangle, XCircle, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { Order } from '@/lib/types';
import { updateOrderStatus } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const LiveDeliveryMap = dynamic(() => import('@/components/order/LiveDeliveryMap'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full bg-secondary"><Loader2 className="h-6 w-6 animate-spin"/></div>
});

const statusSteps = [
  { status: 'Pending', label: 'Order Placed', icon: <Package className="h-6 w-6" /> },
  { status: 'In Progress', label: 'Out for Delivery', icon: <Truck className="h-6 w-6" /> },
  { status: 'Delivered', label: 'Order Delivered', icon: <CheckCircle2 className="h-6 w-6" /> },
];

function getStatusIndex(status: Order['status']) {
    switch (status) {
        case 'Pending': return 0;
        case 'In Progress': return 1;
        case 'Delivered': return 2;
        case 'Declined': return -1;
        default: return 0;
    }
}

export default function OrderStatusPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderDoc, loading, error] = useDocument(doc(db, 'orders', orderId));
  const order = orderDoc?.data() as Order;

  const handleStatusUpdate = async (newStatus: 'Delivered' | 'Declined') => {
    setIsSubmitting(true);
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      toast({
        title: newStatus === 'Delivered' ? 'Delivery Confirmed!' : 'Order Cancelled',
        description: result.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Action Failed',
        description: result.message,
      });
    }
    setIsSubmitting(false);
  };
  
  if (loading) {
    return <div className="container mx-auto max-w-3xl px-4 py-12 md:py-24 flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  if (error || !order) {
    return (
        <div className="container mx-auto max-w-3xl px-4 py-12 md:py-24 flex items-center justify-center">
            <Card className="w-full text-center shadow-xl">
                 <CardHeader className="items-center">
                    <AlertTriangle className="h-20 w-20 text-destructive mb-4" />
                    <CardTitle className="font-headline text-3xl">Order Not Found</CardTitle>
                    <CardDescription className="max-w-md">{error?.message || "We couldn't find an order with that ID. Please check the link or contact support."}</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button asChild>
                        <Link href="/">Back to Home</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (order.status === 'Delivered') {
      return (
         <div className="container mx-auto max-w-3xl px-4 py-12 md:py-24 flex items-center justify-center">
            <Card className="w-full text-center shadow-xl">
                <CardHeader className="items-center">
                    <PartyPopper className="h-20 w-20 text-green-500 mb-4" />
                    <CardTitle className="font-headline text-3xl">Thank You for Your Order!</CardTitle>
                    <CardDescription className="max-w-md">Your delivery is complete. We appreciate your business and hope to serve you again soon!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button asChild>
                            <Link href="/">Back to Home</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/order">Place Another Order</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      )
  }

   if (order.status === 'Declined') {
      return (
         <div className="container mx-auto max-w-3xl px-4 py-12 md:py-24 flex items-center justify-center">
            <Card className="w-full text-center shadow-xl">
                <CardHeader className="items-center">
                    <XCircle className="h-20 w-20 text-destructive mb-4" />
                    <CardTitle className="font-headline text-3xl">Order Cancelled</CardTitle>
                    <CardDescription className="max-w-md">This order has been cancelled. If this was a mistake, please contact support or place a new order.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button asChild>
                            <Link href="/">Back to Home</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/order">Place New Order</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      )
  }


  const currentStatusIndex = getStatusIndex(order.status);
  
  const isTrackingLive = order.status === 'In Progress' && !!order.location;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
        <Card className="w-full shadow-xl">
            <CardHeader className="text-center">
                 <CardTitle className="font-headline text-3xl">Tracking Your Order</CardTitle>
                 <CardDescription>Order ID: <span className="font-mono bg-secondary px-2 py-1 rounded">{orderId.substring(0, 8)}...</span></CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Progress Bar */}
                <div className="relative w-full pt-8">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary rounded-full transform -translate-y-1/2" />
                    <div 
                        className="absolute top-1/2 left-0 h-1 bg-primary rounded-full transform -translate-y-1/2 transition-all duration-500" 
                        style={{ width: `${currentStatusIndex * 50}%` }}
                    />
                    <div className="relative flex justify-between">
                        {statusSteps.slice(0, 3).map((step, index) => (
                        <div key={step.status} className="flex flex-col items-center z-10">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${index <= currentStatusIndex ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                                {step.icon}
                            </div>
                            <p className={`mt-2 text-xs text-center font-semibold ${index <= currentStatusIndex ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</p>
                        </div>
                        ))}
                    </div>
                </div>

                <Separator />
                
                {/* Map and Driver Info */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="relative w-full h-80 rounded-lg overflow-hidden border">
                         {order.location ? (
                           <LiveDeliveryMap 
                                customerLocation={{ lat: order.location.latitude, lng: order.location.longitude }}
                                customerAddress={order.deliveryAddress}
                                driverId={order.assignedDriverId} // Pass driver ID for tracking
                                isTracking={isTrackingLive} // Only track if order is in progress
                           />
                         ) : (
                             <div className="flex flex-col items-center justify-center h-full bg-secondary">
                                <MapPin className="h-8 w-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mt-2">Location data not available for this order.</p>
                             </div>
                         )}
                    </div>
                     <div>
                        {order.status === 'Pending' && (
                            <div className="text-center p-4 bg-secondary rounded-lg">
                                <p className="font-semibold">Waiting for a driver...</p>
                                <p className="text-sm text-muted-foreground">We're finding the nearest available driver for your order.</p>
                            </div>
                        )}
                        {order.status === 'In Progress' && (
                             <div className="p-4 bg-secondary rounded-lg space-y-2">
                                <h3 className="font-bold">Your Driver is on the way!</h3>
                                <p className="font-semibold">{order.assignedDriver}</p>
                                <p className="text-sm text-muted-foreground">Estimated arrival: 15-25 minutes.</p>
                                <p className="text-sm text-muted-foreground">Please prepare payment: <span className="font-bold">Ksh {order.total.toLocaleString()}</span> via <span className="font-bold">{order.paymentMethod}</span>.</p>
                            </div>
                        )}
                    </div>
                 </div>


            </CardContent>
            {order.status === 'In Progress' && (
                <CardFooter className="flex-col gap-4 border-t pt-6">
                    <p className="text-sm text-muted-foreground">Please click the button below once your order has arrived and you have completed payment.</p>
                    <Button 
                        size="lg" 
                        className="w-full font-bold text-lg bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusUpdate('Delivered')}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
                        Confirm Delivery & Payment
                    </Button>
                </CardFooter>
            )}
             {order.status === 'Pending' && (
                <CardFooter className="flex-col gap-4 border-t pt-6">
                    <p className="text-sm text-muted-foreground">Need to cancel? You can cancel this order before a driver is assigned.</p>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <XCircle className="mr-2 h-4 w-4"/>}
                                Cancel Order
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently cancel your order.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>No, Keep Order</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleStatusUpdate('Declined')}>Yes, Cancel Order</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            )}
        </Card>
    </div>
  );
}
