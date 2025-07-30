

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

const initialAdviceState = {
  advice: 'Click a button to get your first tip!',
};

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
            <div className="text-2xl font-bold">Ksh 0</div>
            <p className="text-xs text-muted-foreground">From delivered orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries Pending</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Ready for assignment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Drivers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
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
                  <TableHead>Amount</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No recent orders.
                  </TableCell>
                </TableRow>
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
