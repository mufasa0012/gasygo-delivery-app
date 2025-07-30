

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Users, Package, CircleDollarSign, Truck, Bot, Lightbulb, RefreshCw, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { getAdviceAction } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order } from '@/lib/orders';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';


const initialAdviceState = {
  advice: 'Click a button to get your first tip!',
};

interface Driver {
    id: string;
    name: string;
    phone: string;
    status: 'Available' | 'On Delivery' | 'Offline';
}

function AIBusinessCoach() {
  const [state, formAction, isPending] = React.useActionState(getAdviceAction, initialAdviceState);

  return (
      <Card>
          <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    AI Business Coach
                </CardTitle>
                <CardDescription>Get tips on how to grow your business.</CardDescription>
              </div>
               <form action={formAction}>
                  <input type="hidden" name="topic" value="Business Growth" />
                  <Button type="submit" size="icon" variant="outline" disabled={isPending}>
                      <RefreshCw className={`h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                  </Button>
              </form>
          </CardHeader>
          <CardContent>
              {isPending ? (
                  <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                  </div>
              ) : state.error ? (
                  <div className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      <p>{state.error}</p>
                  </div>
              ) : (
                  <p className="text-sm text-muted-foreground flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0"/> 
                      <span>{state.advice}</span>
                  </p>
              )}
          </CardContent>
           <CardFooter className="gap-2">
                <form action={formAction} className="w-full">
                    <input type="hidden" name="topic" value="Business Growth" />
                    <Button type="submit" size="sm" variant="ghost" disabled={isPending} className="w-full justify-start">
                        Get Business Growth Tip
                    </Button>
                </form>
                <form action={formAction} className="w-full">
                    <input type="hidden" name="topic" value="Customer Retention" />
                    <Button type="submit" size="sm" variant="ghost" disabled={isPending} className="w-full justify-start">
                        Get Retention Tip
                    </Button>
                </form>
            </CardFooter>
      </Card>
  )
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingDeliveries: 0,
    availableDrivers: 0,
  });
  const [recentOrders, setRecentOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const driversQuery = query(collection(db, 'drivers'));

    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      
      const totalRevenue = ordersData
        .filter(order => order.status === 'Delivered')
        .reduce((sum, order) => sum + order.totalPrice, 0);
      
      const totalOrders = ordersData.length;
      
      const pendingDeliveries = ordersData.filter(order => order.status === 'Pending').length;
      
      setStats(prev => ({ ...prev, totalRevenue, totalOrders, pendingDeliveries }));
      setRecentOrders(ordersData.slice(0, 5));
      setLoading(false); // Set loading to false after first data fetch
    });

    const unsubDrivers = onSnapshot(driversQuery, (snapshot) => {
      const driversData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver));
      const availableDrivers = driversData.filter(driver => driver.status === 'Available').length;
      setStats(prev => ({ ...prev, availableDrivers }));
    });

    return () => {
      unsubOrders();
      unsubDrivers();
    };
  }, []);

  const getStatusBadgeClass = (status: Order['status']) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
            case 'Out for Delivery': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
            case 'Delivered': return 'bg-green-500/20 text-green-700 border-green-500/30';
            case 'Cancelled': return 'bg-red-500/20 text-red-700 border-red-500/30';
            default: return 'bg-muted text-muted-foreground';
        }
    };


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's a snapshot of your business today.</p>
        </div>
        <Button asChild>
          <Link href="/admin/orders/new">Create New Order</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">Ksh {stats.totalRevenue.toFixed(2)}</div> }
            <p className="text-xs text-muted-foreground">From delivered orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{stats.totalOrders}</div>}
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries Pending</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{stats.pendingDeliveries}</div>}
            <p className="text-xs text-muted-foreground">Ready for assignment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Drivers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-12" /> : <div className="text-2xl font-bold">{stats.availableDrivers}</div>}
            <p className="text-xs text-muted-foreground">Ready for deliveries</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>A list of the most recent orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    Array.from({length: 5}).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full"/></TableCell>
                            <TableCell><Skeleton className="h-5 w-20"/></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-5 w-16"/></TableCell>
                            <TableCell><Skeleton className="h-8 w-8"/></TableCell>
                        </TableRow>
                    ))
                ) : recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No recent orders.
                    </TableCell>
                  </TableRow>
                ) : (
                    recentOrders.map(order => (
                         <TableRow key={order.id} className="cursor-pointer" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                            <TableCell className="font-medium">{order.customerName}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={cn("capitalize", getStatusBadgeClass(order.status))}>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{order.driverName || 'Unassigned'}</TableCell>
                            <TableCell className="text-right">Ksh{order.totalPrice.toFixed(2)}</TableCell>
                            <TableCell>
                               <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
       <div className="grid gap-4 md:gap-8">
            <AIBusinessCoach />
       </div>
    </div>
  );
}
