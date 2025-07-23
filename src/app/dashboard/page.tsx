'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order, Driver } from '@/lib/types';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, Truck, Users, Loader2, UserCheck, Bell, BellOff } from 'lucide-react';
import Link from 'next/link';
import { AssignDriverDropdown } from '@/components/dashboard/AssignDriverDropdown';
import { useNotificationSound } from '@/hooks/use-notification-sound';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    // --- Data Fetching ---
    const [recentOrdersCollection, loadingRecent, errorRecent] = useCollection(
        query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5))
    );
    const [allOrdersCollection, loadingAll, errorAll] = useCollection(collection(db, "orders"));
    const [driversCollection, loadingDrivers, errorDrivers] = useCollection(collection(db, "drivers"));
    const [deliveredOrdersCollection, loadingDelivered, errorDelivered] = useCollection(
        query(collection(db, "orders"), where("status", "==", "Delivered"))
    );

    const loading = loadingRecent || loadingAll || loadingDelivered || loadingDrivers;
    const error = errorRecent || errorAll || errorDelivered || errorDrivers;
    
    // --- Sound Notifications ---
    const { playNewOrderSound, playReminderSound, isMuted, toggleMute, requestInteraction } = useNotificationSound();
    const [prevPendingCount, setPrevPendingCount] = useState<number | null>(null);

    // --- Processed Data ---
    const recentOrders: Order[] = recentOrdersCollection?.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        } as Order;
    }) || [];

    const drivers: Driver[] = driversCollection?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver)) || [];
    
    const inProgressOrders = allOrdersCollection?.docs.filter(doc => doc.data().status === 'In Progress').map(doc => doc.data().assignedDriverId) || [];
    const availableDrivers = drivers.filter(driver => !inProgressOrders.includes(driver.id));
    const onDeliveryDrivers = drivers.filter(driver => inProgressOrders.includes(driver.id));

    const totalOrders = allOrdersCollection?.size ?? 0;
    const pendingOrdersCount = allOrdersCollection?.docs.filter(doc => doc.data().status === 'Pending').length ?? 0;
    const totalRevenue = deliveredOrdersCollection?.docs.reduce((acc, doc) => acc + doc.data().total, 0) ?? 0;

    // --- Sound Effect Logic ---
    useEffect(() => {
        if (!loading && prevPendingCount !== null && pendingOrdersCount > prevPendingCount) {
            playNewOrderSound();
        }
        setPrevPendingCount(pendingOrdersCount);
    }, [pendingOrdersCount, prevPendingCount, loading, playNewOrderSound]);

    useEffect(() => {
        let reminderInterval: NodeJS.Timeout | null = null;
        if (pendingOrdersCount > 0) {
            reminderInterval = setInterval(() => {
                playReminderSound();
            }, 30000); // Remind every 30 seconds
        }
        return () => {
            if (reminderInterval) {
                clearInterval(reminderInterval);
            }
        };
    }, [pendingOrdersCount, playReminderSound]);


  return (
    <div className="space-y-8" onClick={requestInteraction}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's a snapshot of your business today.</p>
            </div>
            <div className="flex items-center gap-2">
                 <Button variant="outline" size="icon" onClick={toggleMute} title={isMuted ? "Unmute Sounds" : "Mute Sounds"}>
                    {isMuted ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                </Button>
                <Button asChild>
                    <Link href="/order">Create New Order</Link>
                </Button>
            </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Revenue" value={loading ? <Loader2 className="h-5 w-5 animate-spin" /> : `Ksh ${totalRevenue.toLocaleString()}`} icon={<DollarSign />} note="From delivered orders" />
            <StatCard title="Total Orders" value={loading ? <Loader2 className="h-5 w-5 animate-spin" /> : totalOrders.toString()} icon={<ShoppingCart />} note="All time" />
            <StatCard title="Deliveries Pending" value={loading ? <Loader2 className="h-5 w-5 animate-spin" /> : pendingOrdersCount.toString()} icon={<Truck />} note="Ready for assignment" />
            <StatCard title="Available Drivers" value={loading ? <Loader2 className="h-5 w-5 animate-spin" /> : availableDrivers.length.toString()} icon={<UserCheck />} note="Ready for deliveries" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>A list of the most recent orders.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading && <div className="flex justify-center items-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                {error && <p className="text-destructive text-center">Error: {error.message}</p>}
                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Address</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Driver</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>
                                    <div className="font-medium">{order.customerName}</div>
                                    <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate">{order.deliveryAddress}</TableCell>
                                    <TableCell>
                                    <Badge 
                                        variant={
                                            order.status === 'Delivered' ? 'default' 
                                            : order.status === 'In Progress' ? 'secondary'
                                            : order.status === 'Pending' ? 'outline'
                                            : 'destructive'
                                        }
                                    >
                                        {order.status}
                                    </Badge>
                                    </TableCell>
                                    <TableCell>{order.assignedDriver || 'N/A'}</TableCell>
                                    <TableCell className="text-right">Ksh {order.total.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        {order.status === 'Pending' && <AssignDriverDropdown order={order} drivers={availableDrivers} />}
                                    </TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Driver Status</CardTitle>
                    <CardDescription>See who is on delivery and who is available.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center"><Truck className="mr-2 h-4 w-4" />On Delivery</h3>
                         {loading && <div className="flex justify-center items-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}
                         <div className="space-y-2">
                            {onDeliveryDrivers.length > 0 ? onDeliveryDrivers.map(driver => (
                                <div key={driver.id} className="flex items-center justify-between p-2 rounded-md bg-orange-100 dark:bg-orange-900/50">
                                    <p className="font-medium">{driver.name}</p>
                                    <p className="text-sm text-muted-foreground">{driver.phone}</p>
                                </div>
                            )) : (
                                <p className="text-xs text-muted-foreground text-center py-2">No drivers are currently on delivery.</p>
                            )}
                        </div>
                    </div>
                     <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center"><UserCheck className="mr-2 h-4 w-4" />Available Drivers</h3>
                         {loading && <div className="flex justify-center items-center py-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}
                         <div className="space-y-2">
                            {availableDrivers.length > 0 ? availableDrivers.map(driver => (
                                <div key={driver.id} className="flex items-center justify-between p-2 rounded-md bg-green-100 dark:bg-green-900/50">
                                    <p className="font-medium">{driver.name}</p>
                                    <p className="text-sm text-muted-foreground">{driver.phone}</p>
                                </div>
                            )) : (
                                <p className="text-xs text-muted-foreground text-center py-2">No drivers currently available.</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
