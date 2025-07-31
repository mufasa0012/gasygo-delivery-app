
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, ArrowRight, Loader2, CircleCheck, Navigation, Check } from 'lucide-react';
import { collection, onSnapshot, query, where, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/lib/orders';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function DriverDeliveriesPage() {
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [driverId, setDriverId] = React.useState<string | null>(null);
    const router = useRouter();
    const { toast } = useToast();
    const locationIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
    const [updatingOrderId, setUpdatingOrderId] = React.useState<string | null>(null);


    React.useEffect(() => {
        const id = localStorage.getItem('driverId');
        if (!id) {
            toast({
                title: 'Not Logged In',
                description: 'You must be logged in to view deliveries.',
                variant: 'destructive'
            });
            router.push('/driver/login');
        } else {
            setDriverId(id);
        }
    }, [router, toast]);

    const stopLocationUpdates = React.useCallback(() => {
        if (locationIntervalRef.current) {
            clearInterval(locationIntervalRef.current);
            locationIntervalRef.current = null;
        }
    },[]);

    React.useEffect(() => {
        if (!driverId) return;

        setLoading(true);
        const q = query(collection(db, "orders"), where("driverId", "==", driverId), where("status", "in", ["Out for Delivery", "Pending"]));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            const activeDelivery = ordersData.find(o => o.status === 'Out for Delivery');

            setOrders(ordersData.sort((a,b) => (a.status === 'Out for Delivery' ? -1 : 1)));
            setLoading(false);

            stopLocationUpdates();
            if (activeDelivery) {
                startLocationUpdates(activeDelivery.id);
            }

        }, (error) => {
            console.error("Error fetching orders:", error);
            toast({
                title: 'Error',
                description: 'Could not fetch assigned deliveries.',
                variant: 'destructive'
            });
            setLoading(false);
        });

        return () => {
            unsubscribe();
            stopLocationUpdates();
        }

    }, [driverId, toast, stopLocationUpdates]);

    const startLocationUpdates = (orderId: string) => {
        const update = () => {
             navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const orderRef = doc(db, 'orders', orderId);
                    await updateDoc(orderRef, {
                        driverLocation: {
                            lat: latitude,
                            lng: longitude
                        }
                    });
                },
                (error) => {
                    console.error("Geolocation error for tracking:", error);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
        update(); // Call it immediately
        locationIntervalRef.current = setInterval(update, 15000); // Update every 15 seconds
    };

    const handleStartDelivery = async (orderId: string) => {
        setUpdatingOrderId(orderId);
        try {
            const batch = writeBatch(db);
            const activeOrders = orders.filter(o => o.status === 'Out for Delivery' && o.id !== orderId);
            
            // Ensure no other deliveries are active for this driver
            for(const activeOrder of activeOrders) {
                batch.update(doc(db, 'orders', activeOrder.id), { status: 'Pending', driverLocation: null });
            }

            batch.update(doc(db, 'orders', orderId), { status: 'Out for Delivery' });
            await batch.commit();

            toast({
                title: 'Delivery Started',
                description: 'You are now on your way. Your location is being shared with the customer.'
            });
        } catch (error) {
             console.error("Error starting delivery: ", error);
             toast({ title: 'Error', description: 'Could not start delivery.', variant: 'destructive' });
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const handleFinishDelivery = async (orderId: string) => {
        setUpdatingOrderId(orderId);
        stopLocationUpdates();
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, { 
                status: 'Delivered',
                driverLocation: null,
            });
            toast({
                title: 'Delivery Complete!',
                description: `Order has been marked as delivered.`
            });
        } catch (error) {
            console.error("Error updating status: ", error);
             toast({ title: 'Error', description: 'Could not update order status.', variant: 'destructive' });
        } finally {
            setUpdatingOrderId(null);
        }
    }
    
    const getGoogleMapsLink = (address: string, location: Order['deliveryLocation']) => {
        if (location) {
            return `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight font-headline">My Deliveries</h2>
        </div>

        {loading ? (
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Table>
                         <TableHeader>
                            <TableRow>
                                {Array.from({length: 5}).map((_, i) => (
                                     <TableHead key={i}><Skeleton className="h-4 w-full" /></TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({length: 2}).map((_, i) => (
                                 <TableRow key={i}>
                                    {Array.from({length: 5}).map((_, j) => (
                                         <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        ) : orders.length === 0 ? (
             <div className="flex flex-col items-center justify-center text-center p-12 border rounded-lg bg-card">
                <CircleCheck className="h-20 w-20 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold font-headline">All Clear!</h3>
                <p className="text-muted-foreground mt-2">You have no pending deliveries assigned to you. Enjoy the break!</p>
            </div>
        ) : (
            <div className="grid gap-6">
            {orders.map(order => (
                <Card key={order.id} className={order.status === 'Out for Delivery' ? 'border-primary shadow-lg' : ''}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                             <CardTitle>Order #{order.id.substring(0, 7)}</CardTitle>
                             <CardDescription>
                                Placed on {order.createdAt ? format(order.createdAt.toDate(), 'PP') : 'N/A'}
                            </CardDescription>
                        </div>
                        <Badge variant={order.status === 'Out for Delivery' ? 'default' : 'outline'}>
                            {order.status}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-semibold">{order.customerName}</p>
                            <a href={`tel:${order.customerPhone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                                <Phone className="h-4 w-4"/> {order.customerPhone}
                            </a>
                        </div>
                        <div>
                            <p className="font-semibold">Address</p>
                            <p className="text-muted-foreground">{order.deliveryAddress}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Items</p>
                            <ul className="text-muted-foreground list-disc pl-5">
                                {order.items.map(item => (
                                    <li key={item.productId}>{item.quantity}x {item.name}</li>
                                ))}
                            </ul>
                        </div>
                         <p className="text-lg font-bold">Total: Ksh{order.totalPrice.toFixed(2)}</p>
                    </CardContent>
                    <CardFooter className="gap-4 flex-col sm:flex-row">
                        <Button asChild className="w-full" size="lg">
                            <Link href={getGoogleMapsLink(order.deliveryAddress, order.deliveryLocation)} target="_blank" rel="noopener noreferrer">
                                <MapPin className="mr-2 h-4 w-4"/> Open in Maps
                            </Link>
                        </Button>
                        {order.status === 'Pending' && (
                             <Button 
                                onClick={() => handleStartDelivery(order.id)} 
                                className="w-full" size="lg" variant="outline"
                                disabled={updatingOrderId === order.id || orders.some(o => o.status === 'Out for Delivery')}>
                                {updatingOrderId === order.id ? <Loader2 className="animate-spin" /> : <Navigation className="mr-2 h-4 w-4"/>}
                                Start Delivery
                            </Button>
                        )}
                         {order.status === 'Out for Delivery' && (
                             <Button 
                                onClick={() => handleFinishDelivery(order.id)} 
                                className="w-full" size="lg" variant="secondary"
                                disabled={updatingOrderId === order.id}>
                                {updatingOrderId === order.id ? <Loader2 className="animate-spin" /> : <Check className="mr-2 h-4 w-4"/>}
                                Confirm Payment & Mark Delivered
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            ))}
            </div>
        )}
    </div>
  );

    
