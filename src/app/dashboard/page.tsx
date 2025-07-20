import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, Truck, Users, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import { orders } from '@/lib/data';
import Link from 'next/link';

export default function DashboardPage() {
    const recentOrders = orders.slice(0, 5);
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
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Revenue" value="Ksh 125,340" icon={<DollarSign />} note="+20.1% from last month" />
            <StatCard title="Today's Orders" value="23" icon={<ShoppingCart />} note="+15 from yesterday" />
            <StatCard title="Deliveries Pending" value="8" icon={<Truck />} note="2 assigned" />
            <StatCard title="New Customers" value="12" icon={<Users />} note="+5 since last week" />
        </div>

        <Card>
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
                    <TableCell>
                      <Badge variant={order.status === 'Pending' ? 'destructive' : order.status === 'Delivered' ? 'default' : 'secondary'}>
                          {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">Ksh {order.total.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" asChild>
                           <Link href="/dashboard/orders">
                               <MoreHorizontal className="h-4 w-4" />
                           </Link>
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  );
}
