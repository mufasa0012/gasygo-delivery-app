'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Check, X, Truck } from "lucide-react";
import type { Order } from "@/lib/types";
import { format } from 'date-fns';

interface OrdersTableProps {
    orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
    if (orders.length === 0) {
        return <p className="text-muted-foreground text-center">No orders found.</p>
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell className="font-mono">{order.id}</TableCell>
                            <TableCell>
                                <div className="font-medium">{order.customerName}</div>
                                <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                            </TableCell>
                            <TableCell>{format(order.createdAt, 'PPp')}</TableCell>
                            <TableCell>
                                <Badge variant={order.status === 'Pending' ? 'destructive' : order.status === 'Delivered' ? 'default' : 'secondary'}>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{order.driverId || 'N/A'}</TableCell>
                            <TableCell className="text-right">Ksh {order.total.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem><Check className="mr-2 h-4 w-4"/> Accept Order</DropdownMenuItem>
                                        <DropdownMenuItem><X className="mr-2 h-4 w-4"/>Decline Order</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem><Truck className="mr-2 h-4 w-4"/>Assign Driver</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
