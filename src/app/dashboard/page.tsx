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
import { DollarSign, ShoppingCart, Truck, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { AssignDriverDropdown } from '@/components/dashboard/AssignDriverDropdown';
import { format } from 'date-fns';

export default function DashboardPage() {
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

    const recentOrders: Order[] = recentOrdersCollection?.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        } as Order;
    }) || [];

    const drivers: Driver[] = driversCollection?.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver)) || [];
    
    const totalOrders = allOrdersCollection?.size ?? 0;
    const pendingOrders = allOrdersCollection?.docs.filter(doc => doc.data().status === 'Pending').length ?? 0;
    const newCustomers = allOrdersCollection?.docs.map(doc => doc.data().customerPhone).filter((value, index, self) => self.indexOf(value) === index).length ?? 0;
    const totalRevenue = deliveredOrdersCollection?.docs.reduce((acc, doc) => acc + doc.data().total, 0) ?? 0;

  return (
    <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's a snapshot of your business today.</p>
            </div>
             <Button asChild>
                <Link href="/order">Create New Order</Link>
            </Button>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Revenue" value={loading ? <Loader2 className="h-5 w-5 animate-spin" /> : `Ksh ${totalRevenue.toLocaleString()}`} icon={<DollarSign />} note="From delivered orders" />
            <StatCard title="Total Orders" value={loading ? <Loader2 className="h-5 w-5 animate-spin" /> : totalOrders.toString()} icon={<ShoppingCart />} note="All time" />
            <StatCard title="Deliveries Pending" value={loading ? <Loader2 className="h-5 w-5 animate-spin" /> : pendingOrders.toString()} icon={<Truck />} note="Ready for assignment" />
            <StatCard title="New Customers" value={loading ? <Loader2 className="h-5 w-5 animate-spin" /> : newCustomers.toString()} icon={<Users />} note="All time unique customers" />
        </div>

        <Card>
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
                                    {order.status === 'Pending' && <AssignDriverDropdown order={order} drivers={drivers} />}
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
