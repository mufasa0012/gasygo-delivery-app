'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Check, X, Truck, UserCheck } from "lucide-react";
import type { Order, Driver } from "@/lib/types";
import { format } from 'date-fns';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface OrdersTableProps {
    orders: Order[];
    drivers: Driver[];
}

export function OrdersTable({ orders, drivers }: OrdersTableProps) {
    const { toast } = useToast();

    if (orders.length === 0) {
        return <p className="text-muted-foreground text-center py-8">No orders in this category.</p>
    }

    const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
        const orderRef = doc(db, "orders", orderId);
        try {
            await updateDoc(orderRef, { status });
            toast({
                title: "Order Updated",
                description: `Order #${orderId.substring(0, 6)} has been marked as ${status}.`
            });
        } catch (error) {
            console.error("Error updating order status:", error);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "There was a problem updating the order status."
            });
        }
    };
    
    const handleAssignDriver = async (orderId: string, driverId: string, driverName: string) => {
        const orderRef = doc(db, "orders", orderId);
        try {
            await updateDoc(orderRef, { driverId, status: 'In Progress' });
            toast({
                title: "Driver Assigned!",
                description: `${driverName} has been assigned to order #${orderId.substring(0, 6)}. The order is now In Progress.`
            });
        } catch (error) {
            console.error("Error assigning driver:", error);
            toast({
                variant: "destructive",
                title: "Assignment Failed",
                description: "There was a problem assigning the driver."
            });
        }
    };

    const getBadgeVariant = (status: Order['status']) => {
        switch (status) {
            case 'Pending': return 'secondary';
            case 'In Progress': return 'default';
            case 'Delivered': return 'outline';
            case 'Declined': return 'destructive';
            default: return 'secondary';
        }
    };

    const getDriverName = (driverId?: string) => {
        if (!driverId) return 'N/A';
        return drivers.find(d => d.id === driverId)?.name || 'Unknown';
    };


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
                            <TableCell className="font-mono text-xs">{order.id.substring(0,6)}...</TableCell>
                            <TableCell>
                                <div className="font-medium">{order.customerName}</div>
                                <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                            </TableCell>
                            <TableCell>{order.createdAt ? format(order.createdAt, 'PPp') : 'N/A'}</TableCell>
                            <TableCell>
                                <Badge variant={getBadgeVariant(order.status)}>
                                    {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{getDriverName(order.driverId)}</TableCell>
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
                                        <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'In Progress')} disabled={order.status !== 'Pending'}>
                                            <Check className="mr-2 h-4 w-4"/> Accept Order
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => handleUpdateStatus(order.id, 'Declined')} disabled={order.status === 'Declined' || order.status === 'Delivered'}>
                                            <X className="mr-2 h-4 w-4"/>Decline Order
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger disabled={order.status === 'Delivered' || order.status === 'Declined'}>
                                                <Truck className="mr-2 h-4 w-4"/>Assign Driver
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    <DropdownMenuLabel>Available Drivers</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {drivers.map(driver => (
                                                        <DropdownMenuItem key={driver.id} onClick={() => handleAssignDriver(order.id, driver.id, driver.name)}>
                                                            <UserCheck className="mr-2 h-4 w-4" />
                                                            {driver.name}
                                                        </DropdownMenuItem>
                                                    ))}
                                                    {drivers.length === 0 && <DropdownMenuItem disabled>No drivers available</DropdownMenuItem>}
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                        <DropdownMenuSeparator />
                                         <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'Delivered')} disabled={order.status !== 'In Progress'}>
                                            <Check className="mr-2 h-4 w-4"/> Mark as Delivered
                                        </DropdownMenuItem>
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
