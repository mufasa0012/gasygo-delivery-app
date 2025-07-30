
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface Order {
    id: string;
    customerName: string;
    createdAt: {
        toDate: () => Date;
    };
    status: 'Pending' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
    totalPrice: number;
}


export default function OrdersPage() {
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
            setOrders(ordersData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const getStatusBadgeClass = (status: Order['status']) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
            case 'Out for Delivery':
                return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
            case 'Delivered':
                return 'bg-green-500/20 text-green-700 border-green-500/30';
            case 'Cancelled':
                 return 'bg-red-500/20 text-red-700 border-red-500/30';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Orders</h1>
          <p className="text-muted-foreground">Manage and view all customer orders.</p>
        </div>
        <Button asChild>
          <Link href="/admin/orders/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Order
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>A list of all orders in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-28 rounded-full" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                    </TableRow>
                 ))
              ) : orders.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                    No orders found.
                    </TableCell>
                </TableRow>
              ) : (
                orders.map(order => (
                    <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.customerName}</TableCell>
                        <TableCell>{order.createdAt ? format(order.createdAt.toDate(), 'PPpp') : 'N/A'}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className={cn("capitalize", getStatusBadgeClass(order.status))}>
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">Ksh{order.totalPrice.toFixed(2)}</TableCell>
                         <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Assign Driver</DropdownMenuItem>
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
  );
}
