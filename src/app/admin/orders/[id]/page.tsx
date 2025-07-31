

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, updateDoc, onSnapshot, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, ArrowLeft, User, Phone, MapPin, Package, Truck } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Order } from '@/lib/orders';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import Link from 'next/link';


interface Driver {
    id: string;
    name: string;
    status: 'Available' | 'On Delivery' | 'Offline';
}

function OrderDetailsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [order, setOrder] = React.useState<Order | null>(null);
  const [drivers, setDrivers] = React.useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('');

  const getLatLng = () => {
    if (!order?.deliveryAddress) return null;
    const match = order.deliveryAddress.match(/Lat: ([-]?\d+[.]?\d*), Lon: ([-]?\d+[.]?\d*)/);
    if (match) {
        return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    return null;
  }
  const latLng = getLatLng();

  const getStaticMapUrl = () => {
    if (!latLng) return null;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return null;
    return `https://maps.googleapis.com/maps/api/staticmap?center=${latLng.lat},${latLng.lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${latLng.lat},${latLng.lng}&key=${apiKey}`;
  }

  const getGoogleMapsLink = () => {
    if (!latLng) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order?.deliveryAddress || '')}`;
    return `https://www.google.com/maps/search/?api=1&query=${latLng.lat},${latLng.lng}`;
  }


  React.useEffect(() => {
    if (!id) return;
    const unsubOrder = onSnapshot(doc(db, 'orders', id as string), (doc) => {
        if (doc.exists()) {
            const orderData = { id: doc.id, ...doc.data() } as Order;
            setOrder(orderData);
            setSelectedDriver(orderData.driverId || 'unassigned');
            setSelectedStatus(orderData.status);
        } else {
            toast({ variant: 'destructive', title: 'Not Found', description: "Could not find the requested order." });
            router.push('/admin/orders');
        }
        setLoading(false);
    });

    const unsubDrivers = onSnapshot(collection(db, 'drivers'), (snapshot) => {
        const driversData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver));
        setDrivers(driversData);
    });

    return () => {
        unsubOrder();
        unsubDrivers();
    }
  }, [id, toast, router]);

  const handleUpdateOrder = async () => {
    if (!order) return;
    setSaving(true);
    try {
        const orderRef = doc(db, "orders", order.id);
        const isDriverAssigned = selectedDriver !== 'unassigned';
        const driver = isDriverAssigned ? drivers.find(d => d.id === selectedDriver) : null;
        
        await updateDoc(orderRef, {
            status: selectedStatus,
            driverId: isDriverAssigned ? selectedDriver : null,
            driverName: driver ? driver.name : null,
        });

        toast({
            title: 'Order Updated!',
            description: 'The order details have been saved.',
        });

    } catch (error) {
        console.error('Error updating order:', error);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to update the order.'});
    } finally {
        setSaving(false);
    }
  }
  
  const getStatusBadgeClass = (status: Order['status']) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
            case 'Out for Delivery': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
            case 'Delivered': return 'bg-green-500/20 text-green-700 border-green-500/30';
            case 'Cancelled': return 'bg-red-500/20 text-red-700 border-red-500/30';
            default: return 'bg-muted text-muted-foreground';
        }
    };

  if (loading) {
    return (
        <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  if (!order) {
    return null; // Or some other not found component
  }

  const staticMapUrl = getStaticMapUrl();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
           <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">Order #{order.id.substring(0, 7)}</h1>
           <p className="text-sm text-muted-foreground">
                Placed on {order.createdAt ? format(order.createdAt.toDate(), 'PPpp') : 'N/A'}
            </p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
             <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <User className="w-6 h-6 text-primary"/>
                    <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="flex items-center gap-4"><Phone className="w-4 h-4 text-muted-foreground"/> <span>{order.customerName} - {order.customerPhone}</span></div>
                    <div className="flex items-start gap-4"><MapPin className="w-4 h-4 text-muted-foreground mt-1"/> <p>{order.deliveryAddress}</p></div>
                    {staticMapUrl ? (
                       <Link href={getGoogleMapsLink()} target="_blank" rel="noopener noreferrer">
                          <Image 
                            src={staticMapUrl} 
                            alt={`Map of ${order.deliveryAddress}`}
                            width={600}
                            height={300}
                            className="rounded-md border object-cover"
                          />
                       </Link>
                    ) : (
                       <p className="text-sm text-muted-foreground">Map preview not available for this address.</p>
                    )}
                 </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                    <Package className="w-6 h-6 text-primary"/>
                    <CardTitle>Order Items</CardTitle>
                </CardHeader>
                 <CardContent>
                    <ul className="divide-y">
                        {order.items.map(item => (
                            <li key={item.productId} className="py-4 flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-medium">Ksh{(item.price * item.quantity).toFixed(2)}</p>
                            </li>
                        ))}
                    </ul>
                 </CardContent>
                 <CardFooter className="bg-muted/50 justify-between font-bold text-lg p-4">
                    <span>Total</span>
                    <span>Ksh{order.totalPrice.toFixed(2)}</span>
                 </CardFooter>
            </Card>
        </div>
        <div className="md:col-span-1">
            <Card className="sticky top-20">
                <CardHeader className="flex flex-row items-center gap-4">
                     <Truck className="w-6 h-6 text-primary"/>
                    <CardTitle>Actions & Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <Label htmlFor="status" className="text-sm font-medium">Order Status</Label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger id="status" className="mt-2">
                                <SelectValue>
                                    <Badge variant="outline" className={cn("capitalize", getStatusBadgeClass(selectedStatus as Order['status']))}>
                                        {selectedStatus}
                                    </Badge>
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                                <SelectItem value="Delivered">Delivered</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="driverId" className="text-sm font-medium">Assign Driver</Label>
                        <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                            <SelectTrigger id="driverId" className="mt-2" autoFocus={searchParams.get('action') === 'assign'}>
                                <SelectValue placeholder="Select a driver" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unassigned">Unassigned</SelectItem>
                                {drivers.map(driver => (
                                    <SelectItem key={driver.id} value={driver.id} disabled={driver.status !== 'Available'}>
                                        {driver.name} ({driver.status})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button className="w-full" size="lg" onClick={handleUpdateOrder} disabled={saving}>
                         {saving ? <Loader2 className="animate-spin" /> : 'Save Changes'}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <OrderDetailsPage />
        </React.Suspense>
    )
}
